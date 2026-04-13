import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { readYaklasanArzlar, addArzEntry } from "@/lib/admin-storage";
import { adminAuth } from "@/lib/firebase-admin";
import { sendBatchEmail } from "@/lib/email";
import { yeniArzDuyuruEmail } from "@/lib/email-templates";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

async function tumKullanicilariDuyur(arz: {
  slug: string; sirketAdi: string; ticker: string;
  arsFiyatiAlt: number; arsFiyatiUst: number;
  talepBaslangic?: string; talepBitis?: string; durum: string;
}) {
  try {
    const fiyat = arz.arsFiyatiAlt > 0
      ? arz.arsFiyatiAlt === arz.arsFiyatiUst
        ? `${arz.arsFiyatiUst.toFixed(2)} ₺`
        : `${arz.arsFiyatiAlt.toFixed(2)}–${arz.arsFiyatiUst.toFixed(2)} ₺`
      : "Fiyat bekleniyor";

    // Tüm kullanıcı e-postalarını topla
    const emails: string[] = [];
    let nextPageToken: string | undefined;
    do {
      const result = await adminAuth.listUsers(1000, nextPageToken);
      for (const user of result.users) {
        if (user.email) emails.push(user.email);
      }
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    // Batch gönderim — tek API isteği (100'er gruplarda)
    const html = yeniArzDuyuruEmail(
      arz.sirketAdi, arz.ticker, fiyat,
      arz.talepBaslangic ?? "–", arz.talepBitis ?? "–",
      arz.slug, arz.durum,
    );
    const { count } = await sendBatchEmail(
      emails,
      `📣 ${arz.ticker} Halka Arzı Sisteme Eklendi!`,
      html,
    );

    console.log(`[duyuru] ${arz.ticker} için ${count ?? emails.length} kullanıcıya bildirim gönderildi`);
  } catch (e) {
    console.error("[duyuru] Genel hata:", e);
  }
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const arzlar = await readYaklasanArzlar();
  return NextResponse.json(arzlar);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const body = await req.json();
  const created = await addArzEntry(body);
  revalidatePath("/api/arzlar");
  revalidatePath("/");

  // Aktif veya yaklaşan arz eklendiğinde tüm kullanıcılara bildirim gönder
  if (created.durum === "aktif" || created.durum === "yaklasan") {
    tumKullanicilariDuyur(created); // fire-and-forget
  }

  return NextResponse.json(created, { status: 201 });
}
