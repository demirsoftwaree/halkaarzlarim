/**
 * SPK API'den 2020-2025 geçmiş halka arz verilerini Firestore'a aktarır.
 * Koleksiyon: arzlar-spk
 * BİLDİRİM GİTMEZ — doğrudan Firestore yazımı, writeSpkCache bypass edilir.
 *
 * Çalıştır (arztakip/ içinden): node --env-file=.env.local scripts/import-historical.mjs
 */

// SPK SSL sertifikası sorunlu — resmi devlet sitesi olduğu için bypass güvenli
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Firebase Admin başlat
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const COL = "arzlar-spk";
const YILLAR = [2020, 2021, 2022, 2023, 2024, 2025];

function slugify(s) {
  return s.toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function detectSektor(name) {
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

function mapToArz(item, yil) {
  const ticker = (item.borsaKodu ?? "").trim();
  const name = (item.sirketUnvani ?? "").trim();
  const price = item.halkaArzFiyatiTl ?? 0;
  const listing = item.borsadaIslemGormeTarihi;
  const slug = slugify(ticker) || slugify(name);
  const toplamLot = item.satisaSunulanToplamTutarBinTl ? item.satisaSunulanToplamTutarBinTl * 1000 : 0;
  const araciKurum = (item.halkaArzaAracilikEdenKurum ?? "").replace(/"/g, "").replace(/\n/g, ", ").trim();

  return {
    id: slug,
    slug,
    ticker,
    sirketAdi: name,
    durum: "tamamlandi",
    sektor: detectSektor(name),
    talepBaslangic: "",
    talepBitis: "",
    arsFiyatiAlt: price,
    arsFiyatiUst: price,
    lotBuyuklugu: 1,
    araciKurum,
    toplamArzLot: toplamLot,
    bireyselPayYuzde: item.halkaArzOrani ?? 0,
    kapLinki: "https://www.kap.org.tr/tr/bildirim-sorgu",
    aciklama: item.halkaArzSekli ?? "",
    pazar: item.ilkIslemGorduguPazar ?? undefined,
    dagitimYontemi: "Eşit Dağıtım",
    fiiliDolasimdakiPayOrani: item.halkaArzOrani ?? undefined,
    borsadaIslemGormeTarihi: listing ? listing.split("T")[0] : undefined,
    _yil: yil,
  };
}

async function fetchSpkYear(yil) {
  const url = `https://ws.spk.gov.tr/BorclanmaAraclari/api/IlkHalkaArzVerileri?yil=${yil}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SPK API ${res.status} (${yil})`);
  const data = await res.json();
  return data.filter(item => item.borsaKodu && item.sirketUnvani).map(item => mapToArz(item, yil));
}

async function run() {
  console.log("🚀 Geçmiş halka arz verisi aktarımı başlıyor...\n");

  const mevcutSnap = await db.collection(COL).get();
  const mevcutSluglar = new Set(mevcutSnap.docs.map(d => d.id));
  console.log(`📊 Mevcut kayıt sayısı: ${mevcutSnap.size}\n`);

  let toplamYeni = 0;
  let toplamGuncellendi = 0;

  for (const yil of YILLAR) {
    process.stdout.write(`📅 ${yil} verisi çekiliyor... `);
    try {
      const arzlar = await fetchSpkYear(yil);
      console.log(`${arzlar.length} arz bulundu`);

      let batch = db.batch();
      let batchCount = 0;
      const now = new Date().toISOString();

      for (const arz of arzlar) {
        const isYeni = !mevcutSluglar.has(arz.slug);
        batch.set(db.collection(COL).doc(arz.slug), { ...arz, _cachedAt: now }, { merge: true });
        batchCount++;
        if (isYeni) toplamYeni++;
        else toplamGuncellendi++;

        if (batchCount === 500) {
          await batch.commit();
          batch = db.batch();
          batchCount = 0;
        }
      }

      if (batchCount > 0) await batch.commit();
      console.log(`   ✅ ${yil} tamamlandı`);

      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`   ❌ ${yil} hatası: ${e.message}`);
    }
  }

  console.log(`\n✅ Aktarım tamamlandı!`);
  console.log(`   Yeni eklenen: ${toplamYeni}`);
  console.log(`   Güncellenen:  ${toplamGuncellendi}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
