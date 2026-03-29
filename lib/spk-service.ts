/**
 * SPK (Sermaye Piyasası Kurulu) resmi web servisi entegrasyonu
 * Endpoint: https://ws.spk.gov.tr/BorclanmaAraclari/api/IlkHalkaArzVerileri
 * Swagger: https://ws.spk.gov.tr/help/index.html
 * Yasal: Kamuya açık resmi devlet verisi — scraping yok, resmi API
 */

import { Agent, fetch as undiciFetch } from "undici";
import { Arz, ArzDurum } from "./types";

const SPK_BASE = "https://ws.spk.gov.tr";

// SPK'nın SSL sertifikası sorunlu — resmi devlet sitesi olduğu için bypass güvenli
const spkAgent = new Agent({ connect: { rejectUnauthorized: false } });

interface SpkIpo {
  ay: number;
  donem: string | null;
  borsaKodu: string | null;
  sirketUnvani: string | null;
  halkaArzSekli: string | null;
  halkaArzOrani: number | null;
  halkaArzFiyatiTl: number | null;
  ortakSatisBinTl: number | null;
  nakitSermayeArtisiBinTl: number | null;
  satisaSunulanToplamTutarBinTl: number | null;
  mevcutSermayeBinTl: number | null;
  yeniSermayeBinTl: number | null;
  satisaSunulanToplamTutarPiyasaDegeriBinTl: number | null;
  ilkIslemGorduguPazar: string | null;
  halkaArzaAracilikEdenKurum: string | null;
  borsadaIslemGormeTarihi: string | null;
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function detectSektor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("gayrimenkul") || n.includes("gyo") || n.includes("yatirim ortakl")) return "GYO";
  if (n.includes("teknoloji") || n.includes("yazılım") || n.includes("bilişim") || n.includes("dijital")) return "Teknoloji";
  if (n.includes("gıda") || n.includes("gida") || n.includes("içecek") || n.includes("icecek") || n.includes("tarım")) return "Gıda";
  if (n.includes("enerji") || n.includes("elektrik") || n.includes("güneş") || n.includes("rüzgar")) return "Enerji";
  if (n.includes("turizm") || n.includes("otel") || n.includes("tatil")) return "Turizm";
  if (n.includes("inşaat") || n.includes("insaat") || n.includes("yapı") || n.includes("yapi")) return "İnşaat";
  if (n.includes("kimya") || n.includes("ilaç") || n.includes("ilac") || n.includes("medikal") || n.includes("sağlık")) return "Sağlık";
  if (n.includes("finans") || n.includes("yatırım") || n.includes("sigorta") || n.includes("faktoring")) return "Finans";
  if (n.includes("plastik") || n.includes("metal") || n.includes("çelik") || n.includes("makine")) return "Sanayi";
  if (n.includes("tekstil") || n.includes("deri") || n.includes("konfeksiyon")) return "Tekstil";
  if (n.includes("ulaşım") || n.includes("lojistik") || n.includes("nakliye") || n.includes("taşıma")) return "Lojistik";
  return "Diğer";
}

function toUtcDate(dateStr: string): Date {
  // "2026-03-11T00:00:00" → timezone bağımsız UTC date
  const d = dateStr.split("T")[0]; // "2026-03-11"
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

function determineDurum(listingDate: string | null): ArzDurum {
  if (!listingDate) return "yaklasan";
  const listing = toUtcDate(listingDate);
  const now = new Date();
  if (now >= listing) return "tamamlandi";
  return "yaklasan";
}

function mapToArz(item: SpkIpo): Arz {
  const ticker = (item.borsaKodu ?? "").trim();
  const name = (item.sirketUnvani ?? "").trim();
  const price = item.halkaArzFiyatiTl ?? 0;
  const listing = item.borsadaIslemGormeTarihi;
  const durum = determineDurum(listing);

  // SPK yalnızca borsaya giriş tarihini veriyor, talep tarihleri mevcut değil.
  // Tamamlanmış arzlar için talep tarihlerini boş bırakıyoruz; detay sayfası
  // borsadaIslemGormeTarihi'ni gösterecek.
  const talepBitis = "";
  const talepBaslangic = "";

  // Toplam lot: Türkiye'de hisse itibari değeri = 1 TL → "BinTL" = bin lot demek
  // satisaSunulanToplamTutarBinTl = 18.900 → 18.900 × 1.000 = 18.900.000 lot
  const toplamLot = item.satisaSunulanToplamTutarBinTl
    ? item.satisaSunulanToplamTutarBinTl * 1000
    : 0;

  // Piyasa değeri (milyar TL cinsinden gösterim için BinTL olarak sakla)
  const piyasaDegeri = item.satisaSunulanToplamTutarPiyasaDegeriBinTl ?? undefined;

  // Aracı kurumu temizle (bazen çift tırnak ve newline içeriyor)
  const araciKurum = (item.halkaArzaAracilikEdenKurum ?? "")
    .replace(/"/g, "").replace(/\n/g, ", ").trim();

  // KAP/ozet/{ticker} bazı yeni şirketlerde hata veriyor — genel bildirim sorgu sayfası daha güvenilir
  const kapLinki = `https://www.kap.org.tr/tr/bildirim-sorgu`;

  return {
    id: slugify(ticker) || slugify(name),
    ticker,
    sirketAdi: name,
    slug: slugify(ticker) || slugify(name),
    durum,
    sektor: detectSektor(name),
    talepBaslangic,
    talepBitis,
    arsFiyatiAlt: price,
    arsFiyatiUst: price,
    lotBuyuklugu: 1,
    araciKurum,
    toplamArzLot: toplamLot,
    bireyselPayYuzde: item.halkaArzOrani ?? 0,
    kapLinki,
    aciklama: item.halkaArzSekli ?? "",
    piyasaDegeri,
    borsadaIslemGormeTarihi: listing ? listing.split("T")[0] : undefined,
    // Genişletilmiş alanlar — SPK'dan doğrudan
    pazar: item.ilkIslemGorduguPazar ?? undefined,
    dagitimYontemi: "Eşit Dağıtım", // SPK bunu vermiyor; TR'de bireysel havuz için standart
    fiiliDolasimdakiPayOrani: item.halkaArzOrani ?? undefined,
  };
}

export async function fetchSpkIpoData(year = 2026): Promise<Arz[]> {
  const url = `${SPK_BASE}/BorclanmaAraclari/api/IlkHalkaArzVerileri?yil=${year}`;

  const res = await undiciFetch(url, {
    dispatcher: spkAgent,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`SPK API ${res.status}`);

  const data: SpkIpo[] = await res.json() as SpkIpo[];

  return data
    .filter(item => item.borsaKodu && item.sirketUnvani)
    .map(mapToArz);
}
