import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase-admin";

async function checkAdmin() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { uid } = await params;
  const { adminAuth } = await import("@/lib/firebase-admin");
  await adminAuth.deleteUser(uid);
  await adminDb.doc(`users/${uid}`).delete();

  return NextResponse.json({ ok: true });
}
