import { NextResponse } from "next/server";

export const revalidate = 60;

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

export async function GET() {
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    const snap = await adminDb
      .collection("haberler")
      .orderBy("tarih", "desc")
      .get();

    const haberler: Haber[] = snap.docs
      .filter(d => d.data().yayinda === true)
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

    return NextResponse.json({ haberler, count: haberler.length });
  } catch (err) {
    console.error("Haberler Firestore hatası:", err);
    return NextResponse.json({ haberler: [], count: 0 });
  }
}
