import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase-admin";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const snap = await adminDb.collection("haberler").orderBy("tarih", "desc").get();
  const haberler = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json(haberler);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  if (!body.id || !body.baslik) {
    return NextResponse.json({ error: "id ve baslik zorunlu" }, { status: 400 });
  }

  await adminDb.collection("haberler").doc(body.id).set(
    { ...body, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  return NextResponse.json({ ok: true });
}
