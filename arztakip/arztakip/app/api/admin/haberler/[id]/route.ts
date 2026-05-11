import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase-admin";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  await adminDb.collection("haberler").doc(id).delete();
  return NextResponse.json({ ok: true });
}
