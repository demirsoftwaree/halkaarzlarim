import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60;

export async function GET() {
  try {
    const snap = await adminDb
      .collection("haberler")
      .orderBy("tarih", "desc")
      .get();

    const bloglar = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => (d as { kategori?: string; yayinda?: boolean }).kategori === "blog" && (d as { yayinda?: boolean }).yayinda === true);
    return NextResponse.json(bloglar);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
