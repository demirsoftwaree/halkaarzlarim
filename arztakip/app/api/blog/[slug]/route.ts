import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const doc = await adminDb.collection("haberler").doc(slug).get();
    if (!doc.exists) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    const data = { id: doc.id, ...doc.data() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
