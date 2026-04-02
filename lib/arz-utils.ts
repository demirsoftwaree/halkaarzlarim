import { Arz } from "./types";
import { mockArzlar } from "./mock-data";
import { fetchSpkIpoData } from "./spk-service";
import { yaklasanArzlar } from "./yaklasan-arzlar";
import { readYaklasanArzlar } from "./admin-storage";

/**
 * Tüm halka arz verisini döndürür:
 *  - SPK API: tamamlanan 2026 arzları
 *  - yaklasan-arzlar.ts: manuel girilen aktif/yaklaşan arzlar
 */
export async function getArzlar(): Promise<{ arzlar: Arz[]; source: string }> {
  let spkArzlar: Arz[] = [];
  let source = "mock";

  try {
    const data = await fetchSpkIpoData(2026);
    if (data && data.length > 0) {
      spkArzlar = data;
      source = "spk.gov.tr";
    }
  } catch {
    // SPK erişilemezse mock ile devam et
  }

  const spkSluglar = new Set(spkArzlar.map(a => a.slug));

  // JSON dosyasından + .ts hardcode'dan yaklaşan arzları al (mükerrer önleme)
  const jsonArzlar = readYaklasanArzlar();
  const tsArzlar = yaklasanArzlar;
  const tumYaklasan = [...jsonArzlar, ...tsArzlar];
  const gorulenSluglar = new Set<string>();
  const ekstra = tumYaklasan.filter(a => {
    if (spkSluglar.has(a.slug) || gorulenSluglar.has(a.slug)) return false;
    gorulenSluglar.add(a.slug);
    return true;
  });

  const tumu = [...ekstra, ...(spkArzlar.length > 0 ? spkArzlar : mockArzlar)];

  // Tarihe göre otomatik durum düzeltme
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const normalize = tumu.map(a => {
    if (!a.talepBaslangic || !a.talepBitis) return a;
    const baslangic = new Date(a.talepBaslangic);
    const bitis = new Date(a.talepBitis);
    bitis.setHours(23, 59, 59, 999);
    // Süresi geçmiş aktif/yaklaşan arzları tamamlandı yap
    if (bugun > bitis && (a.durum === "aktif" || a.durum === "yaklasan" || a.durum === "basvuru-surecinde")) {
      return { ...a, durum: "tamamlandi" as const };
    }
    // Başlangıç tarihi gelmiş yaklaşanları aktif yap
    if (bugun >= baslangic && bugun <= bitis && a.durum === "yaklasan") {
      return { ...a, durum: "aktif" as const };
    }
    return a;
  });

  return { arzlar: normalize, source: ekstra.length > 0 ? source + "+manuel" : source };
}
