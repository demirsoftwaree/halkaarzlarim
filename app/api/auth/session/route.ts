import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

// POST /api/auth/session — ID token → session cookie
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    // 5 günlük session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Giriş başarısız" }, { status: 401 });
  }
}

// DELETE /api/auth/session — çıkış
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("__session", "", { maxAge: 0, path: "/" });
  return res;
}
