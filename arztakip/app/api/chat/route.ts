import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { getArzlar } from "@/lib/arz-utils";

// Rate limiter: IP başına 10 istek / dakika
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

async function buildContext(): Promise<string> {
  try {
    const { arzlar } = await getArzlar();
    const aktif = arzlar.filter(a => a.durum === "aktif" || a.durum === "basvuru-surecinde");
    const yaklasan = arzlar.filter(a => a.durum === "yaklasan").slice(0, 5);
    const formatArz = (a: (typeof arzlar)[0]) =>
      `- ${a.ticker || "?"} | ${a.sirketAdi} | Fiyat: ${a.arsFiyatiAlt}${a.arsFiyatiUst !== a.arsFiyatiAlt ? `–${a.arsFiyatiUst}` : ""} TL | Talep: ${a.talepBaslangic} – ${a.talepBitis} | Aracı: ${a.araciKurum}`;
    const lines: string[] = ["=== GÜNCEL HALKA ARZ VERİSİ ==="];
    if (aktif.length > 0) {
      lines.push("\nŞu an aktif (talep toplayan) arzlar:");
      aktif.forEach(a => lines.push(formatArz(a)));
    }
    if (yaklasan.length > 0) {
      lines.push("\nYaklaşan arzlar:");
      yaklasan.forEach(a => lines.push(formatArz(a)));
    }
    if (aktif.length === 0 && yaklasan.length === 0) {
      lines.push("\nŞu an aktif veya yaklaşan halka arz bulunmuyor.");
    }
    lines.push("=== VERİ SONU ===");
    return lines.join("\n");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Çok fazla istek. 1 dakika bekleyin." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API anahtarı eksik" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Geçersiz istek" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const context = await buildContext();

    const systemPrompt = `Sen "Halkaarzlarım.com" platformunun yapay zeka asistanısın. Adın "ARZ AI".

Uzmanlık alanların:
- Türkiye halka arz (IPO) süreçleri
- SPK mevzuatı, BIST işlemleri
- Lot dağıtımı, eşit/oransal dağıtım
- Tavan/taban fiyat limitleri (%10 bant)
- Halka arz takvimi ve başvuru süreçleri
- Aracı kurum seçimi, komisyon hesaplama
- T1/T2 bakiye kullanımı, katılım endeksi

Kurallar:
- Her zaman Türkçe yanıt ver
- Kısa ve öz ol
- Yatırım tavsiyesi vermiyorsun, bilgi sağlıyorsun
- Kullanıcıya "siz" diye hitap et

${context}`;

    const groq = new Groq({ apiKey });

    // Asistan karşılama mesajını atla, sadece user/assistant geçmişini al
    const prevMessages = messages.slice(0, -1);
    const firstUserIdx = prevMessages.findIndex((m: { role: string }) => m.role === "user");
    const historyMessages = firstUserIdx >= 0 ? prevMessages.slice(firstUserIdx) : [];
    const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages.map((m: { role: string; content: string }) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: messages[messages.length - 1].content },
    ];

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      stream: true,
      max_tokens: 1024,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Chat API hatası:", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
