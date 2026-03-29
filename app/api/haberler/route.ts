/**
 * Haberler & Duyurular API
 * Kaynak 1: KAP / SPK (otomatik)
 * Kaynak 2: Firestore manuel haberler (admin)
 */

import { NextResponse } from "next/server";
import { Agent, fetch as undiciFetch } from "undici";

export const revalidate = 0; // her zaman güncel

export interface Haber {
  id: string;
  baslik: string;
  sirket: string;
  tarih: string;       // YYYY-MM-DD
  saat?: string;       // HH:MM
  kategori: string;
  kaynak: "kap" | "spk" | "manuel";
  // Detay sayfası linki (iç route)
  link: string;
  // Orijinal PDF/KAP linki (detay sayfasında "Belgeyi gör" butonu için)
  originalLinki?: string;
  // Sadece manuel haberler için
  icerik?: string;
  gorsel?: string;
  ticker?: string;
}

// ── Kategori sınıflandırması ──────────────────────────────────────────────
const KATEGORILER: { anahtar: string[]; etiket: string }[] = [
  { anahtar: ["halka arz", "izahname", "talep toplama", "halkaarz", "ipo"], etiket: "halka-arz" },
  { anahtar: ["sermaye artırım", "sermaye azaltım", "kayıtlı sermaye", "bedelli", "bedelsiz"], etiket: "sermaye" },
  { anahtar: ["genel kurul", "olağan genel", "olağanüstü genel"], etiket: "genel-kurul" },
  { anahtar: ["borsaya kabul", "borsada işlem", "kotasyon", "paya kabul"], etiket: "borsa" },
  { anahtar: ["temettü", "kâr dağıtım", "kar dağıtım", "temetu"], etiket: "temettu" },
  { anahtar: ["birleşme", "devralma", "satın alma", "hisse devri"], etiket: "sirket-haberi" },
];

function detectKategori(text: string): string {
  const s = text.toLowerCase();
  for (const { anahtar, etiket } of KATEGORILER) {
    if (anahtar.some(k => s.includes(k))) return etiket;
  }
  return "duyuru";
}

// ── SPK ──────────────────────────────────────────────────────────────────
const spkAgent = new Agent({ connect: { rejectUnauthorized: false } });

interface SpkDuyuru {
  id: number;
  companyTitle: string;
  subject: string;
  date: string;         // "2026-03-27T19:55:00"
}

async function fetchSpkHaberler(): Promise<Haber[]> {
  const now = new Date();
  const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const dateBegin = past.toISOString().split("T")[0] + "T00:00:00";
  const dateEnd   = now.toISOString().split("T")[0]  + "T23:59:59";

  const url = `https://ws.spk.gov.tr/CompanyData/api/OzelDurumAciklamalari?dateBegin=${dateBegin}&dateEnd=${dateEnd}`;
  const res = await undiciFetch(url, {
    dispatcher: spkAgent,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`SPK ${res.status}`);

  const data = await res.json() as SpkDuyuru[];
  return data.slice(0, 60).map(d => {
    const dt = d.date?.split("T") ?? [];
    const tarih = dt[0] ?? new Date().toISOString().split("T")[0];
    const saat  = dt[1]?.slice(0, 5) ?? "";
    return {
      id: `spk-${d.id}`,
      baslik: d.subject,
      sirket: d.companyTitle,
      tarih,
      saat,
      kategori: detectKategori(d.subject),
      kaynak: "spk" as const,
      link: `/haberler/spk-${d.id}`,
      originalLinki: `/api/duyuru/${d.id}`,
    };
  });
}

// ── KAP ──────────────────────────────────────────────────────────────────
async function fetchKapHaberler(): Promise<Haber[]> {
  const { getRecentDisclosuresWithDetail } = await import("@/lib/kap-service");
  const details = await getRecentDisclosuresWithDetail(30);

  const thisYear = new Date().getFullYear().toString();
  const currentYearData = details.filter(d => d.time && d.time.includes(thisYear.slice(2)));
  if (currentYearData.length < 3) throw new Error("KAP sandbox verisi — güncel değil");

  return details.map(d => {
    const baslik = d.subject?.tr ?? "(Başlık yok)";
    const text = `${baslik} ${d.disclosureType ?? ""} ${d.disclosureClass ?? ""}`;
    const parts = d.time?.split(" ")[0]?.split(".") ?? [];
    const tarih = parts.length === 3
      ? `${parts[2]}-${parts[1]}-${parts[0]}`
      : new Date().toISOString().split("T")[0];
    const saat = d.time?.split(" ")[1]?.slice(0, 5) ?? "";

    return {
      id: `kap-${d.disclosureIndex}`,
      baslik,
      sirket: d.senderTitle ?? "",
      tarih,
      saat,
      kategori: detectKategori(text),
      kaynak: "kap" as const,
      link: `/haberler/kap-${d.disclosureIndex}`,
      originalLinki: d.link ?? `https://www.kap.org.tr/tr/Bildirim/${d.disclosureIndex}`,
    };
  });
}

// ── Firestore manuel haberler ─────────────────────────────────────────────
async function fetchManuelHaberler(): Promise<Haber[]> {
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    // Composite index gerektirmemek için sadece orderBy kullan, yayinda filtresi JS'de yap
    const snap = await adminDb
      .collection("haberler")
      .orderBy("tarih", "desc")
      .get();

    return snap.docs
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
  } catch (err) {
    console.error("Manuel haberler Firestore hatası:", err);
    return [];
  }
}

// ── Handler ───────────────────────────────────────────────────────────────
export async function GET() {
  let autoHaberler: Haber[] = [];
  let source = "spk";

  try {
    autoHaberler = await fetchKapHaberler();
    source = "kap";
  } catch {
    try {
      autoHaberler = await fetchSpkHaberler();
      source = "spk";
    } catch (err) {
      console.error("Haberler hatası:", err);
    }
  }

  const manuelHaberler = await fetchManuelHaberler();

  // Manuel haberler önce gelsin, ardından otomatikler (tarihe göre sıralı)
  const haberler = [...manuelHaberler, ...autoHaberler];

  return NextResponse.json({
    haberler,
    source,
    count: haberler.length,
    updatedAt: new Date().toISOString(),
  });
}
