/**
 * Haberler & Duyurular API
 * Kaynak: Firestore manuel haberler (admin panelden girilir)
 */

import { NextResponse } from "next/server";

export const revalidate = 0;

export interface Haber {
  id: string;
  baslik: string;
  sirket: string;
  tarih: string;
  saat?: string;
  kategori: string;
  kaynak: "manuel";
  link: string;
  icerik?: string;
  gorsel?: string;
  ticker?: string;
}

async function fetchManuelHaberler(): Promise<Haber[]> {
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    const snap = await adminDb
      .collection("haberler")
      .orderBy("tarih", "desc")
      .get();

    return snap.docs
      .filter(d => d.data().yayinda === true && d.data().kategori !== "blog")
      .map(d => {
        const data = d.data();
        return {
          id: `manuel-${d.id}`,
          baslik: data.baslik ?? "",
          sirket: data.sirket ?? "",
          tarih: data.tarih ?? "",
          saat: "",
          kategori: data.kategori ?? "duyuru",
          kaynak: "manuel" as const,
          link: `/haberler/${d.id}`,
          icerik: data.icerik ?? "",
          gorsel: data.gorsel ?? "",
          ticker: data.ticker ?? "",
        };
      });
  } catch (err) {
    console.error("Manuel haberler Firestore hatası:", err);
    return [];
  }
}

export async function GET() {
  const haberler = await fetchManuelHaberler();

  return NextResponse.json({
    haberler,
    source: "manuel",
    count: haberler.length,
    updatedAt: new Date().toISOString(),
  });
}
