import { Arz } from "./types";
import { fetchSpkIpoData } from "./spk-service";
import { writeSpkCache } from "./spk-cache";
import { sendPushToAll } from "./push-notifications";
import { notificationTemplates } from "./notification-templates";
import { yaklasanArzlar } from "./yaklasan-arzlar";
import { readYaklasanArzlar } from "./admin-storage";

// Bellek içi kısa süreli önbellek — bot taramalarının Firestore kotasını tüketmesini önler
let arzOnbellek: { data: { arzlar: Arz[]; source: string }; at: number } | null = null;
const ONBELLEK_TTL = 5 * 60 * 1000;

export async function getArzlar(): Promise<{ arzlar: Arz[]; source: string }> {
  if (arzOnbellek && Date.now() - arzOnbellek.at < ONBELLEK_TTL) {
    return arzOnbellek.data;
  }

  let spkArzlar: Arz[] = [];
  let source = "manuel";

  try {
    const data = await fetchSpkIpoData(2026);
    if (data && data.length > 0) {
      spkArzlar = data;
      source = "spk.gov.tr";
      // SPK verisini Firestore'a yaz; yeni eklenenler döner
      writeSpkCache(data).then(yeniArzlar => {
        // Tamamlanmamış yeni arzlar için push bildirimi gönder
        const bildirimGondekilecek = yeniArzlar.filter(
          a => a.durum !== "tamamlandi" && a.durum !== "ertelendi"
        );
        for (const arz of bildirimGondekilecek) {
          const { title, body, data } = notificationTemplates.yeniArz(arz);
          sendPushToAll(title, body, data).catch(() => {});
        }
      }).catch(() => {});
    }
  } catch {
    // SPK erişilemezse manuel verilerle devam et
  }

  // Manuel arzlar (logo, tarih vb. zengin veri)
  const jsonArzlar = await readYaklasanArzlar();
  const tsArzlar = yaklasanArzlar;
  const tumYaklasan = [...jsonArzlar, ...tsArzlar];

  // Slug → manuel arز map (mükerrer önleme)
  const manuelMap = new Map<string, Arz>();
  for (const a of tumYaklasan) {
    if (!manuelMap.has(a.slug)) manuelMap.set(a.slug, a);
  }

  let tumu: Arz[];
  let ekstraCount = 0;

  if (spkArzlar.length > 0) {
    const spkSluglar = new Set(spkArzlar.map(a => a.slug));
    // SPK arzlarını manuel veriyle zenginleştir (logo, tarih vb. manuel'den öncelikli)
    const spkZengin = spkArzlar.map(a => {
      const manuel = manuelMap.get(a.slug);
      return manuel ? { ...a, ...manuel } : a;
    });
    // Sadece manuel'de olan arzları ekle
    const sadeceManuelde = [...manuelMap.values()].filter(a => !spkSluglar.has(a.slug));
    ekstraCount = sadeceManuelde.length;
    tumu = [...sadeceManuelde, ...spkZengin];
  } else {
    // SPK yoksa sadece manuel veriler
    tumu = [...manuelMap.values()];
    ekstraCount = manuelMap.size;
  }

  // Tarihe göre otomatik durum düzeltme
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const normalize = tumu.map(a => {
    if (!a.talepBaslangic || !a.talepBitis) return a;
    const baslangic = new Date(a.talepBaslangic);
    const bitis = new Date(a.talepBitis);
    bitis.setHours(23, 59, 59, 999);
    if (bugun > bitis && (a.durum === "aktif" || a.durum === "yaklasan" || a.durum === "basvuru-surecinde")) {
      return { ...a, durum: "tamamlandi" as const };
    }
    if (bugun >= baslangic && bugun <= bitis && a.durum === "yaklasan") {
      return { ...a, durum: "aktif" as const };
    }
    return a;
  });

  const sonuc = { arzlar: normalize, source: ekstraCount > 0 ? source + "+manuel" : source };
  arzOnbellek = { data: sonuc, at: Date.now() };
  return sonuc;
}
