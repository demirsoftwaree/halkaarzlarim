/**
 * Yaklaşan & Aktif Halka Arzlar — Manuel Veri Girişi
 * ─────────────────────────────────────────────────
 * SPK API yalnızca tamamlanan arzları veriyor.
 * Yeni bir arz KAP/SPK'da duyurulduğunda buraya ekleyin.
 *
 * durum değerleri:
 *   "aktif"              → Şu an talep toplama süreci devam ediyor
 *   "yaklasan"           → Tarihleri belli ama henüz başlamadı
 *   "basvuru-surecinde"  → SPK başvurusu yapıldı, onay bekleniyor
 *   "ertelendi"          → Ertelendi / iptal edildi
 */

import type { Arz } from "./types";

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ─── BURAYA YENİ ARZ EKLEYİN ───────────────────────────────────────────────
//
// Örnek:
{
  //   ticker:          "XXXXXX",           // Borsa kodu (henüz belli değilse "")
  //   sirketAdi:       "Şirket A.Ş.",
  //   durum:           "yaklasan",
  //   sektor:          "Teknoloji",
  //   talepBaslangic:  "2026-04-07",       // YYYY-MM-DD formatı
  //   talepBitis:      "2026-04-09",
  //   arsFiyatiAlt:    12.50,              // Henüz belli değilse 0
  //   arsFiyatiUst:    15.00,
  //   lotBuyuklugu:    100,
  //   araciKurum:      "Garanti Yatırım",
  //   toplamArzLot:    0,
  //   bireyselPayYuzde: 25,
  //   aciklama:        "KAP bildirimi veya basın açıklaması özeti.",
  //   kapLinki:        "https://www.kap.org.tr/...",
  //   piyasaDegeri:    undefined,
}


const girisler: Omit<Arz, "id" | "slug">[] = [
  // Şu an listelenecek yaklaşan arz yok.
  // Yeni arz geldiğinde yukarıdaki örnek formatı kullanarak buraya ekleyin.
];

// ────────────────────────────────────────────────────────────────────────────

export const yaklasanArzlar: Arz[] = girisler.map(g => ({
  ...g,
  id: slugify(g.ticker || g.sirketAdi),
  slug: slugify(g.ticker || g.sirketAdi),
}));
