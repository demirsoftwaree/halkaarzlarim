import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 saat

// Basit in-memory rate limiter (IP başına 5 deneme / 15 dakika)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry) {
    if (now < entry.resetAt && entry.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Çok fazla deneme. Lütfen bekleyin." }, { status: 429 });
    }
    if (now >= entry.resetAt) attempts.delete(ip);
  }

  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct || password !== correct) {
    const cur = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, { count: cur.count + 1, resetAt: cur.resetAt });
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }

  attempts.delete(ip); // Başarılı girişte sayacı sıfırla

  const store = await cookies();
  store.set(COOKIE, correct, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
