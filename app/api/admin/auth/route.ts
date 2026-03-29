import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 saat

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct || password !== correct) {
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }

  const store = await cookies();
  store.set(COOKIE, correct, {
    httpOnly: true,
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
