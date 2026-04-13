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

  // Firestore + .ts hardcode'dan yaklaşan arzları al (mükerrer önleme)
  const jsonArzlar = await readYaklasanArzlar();
  const tsArzlar = yaklasanArzlar;
  const tumYaklasan = [...jsonArzlar, ...tsArzlar];
  const gorulenSluglar = new Set<string>();

  // SPK'da olmayan arzlar → ekstra olarak eklenir
  const ekstra = tumYaklasan.filter(a => {
    if (spkSluglar.has(a.slug) || gorulenSluglar.has(a.slug)) return false;
    gorulenSluglar.add(a.slug);
    return true;
  });

  // SPK arzlarına JSON'dan ek alanları (tahsisat, özet, tavan vb.) merge et
  const manuelMap = new Map(tumYaklasan.map(a => [a.slug, a]));
  const spkMerged = spkArzlar.map(a => {
    const manuel = manuelMap.get(a.slug);
    if (!manuel) return a;
    return {
      ...a,
      // Admin'den durum override varsa onu kullan
      durum: manuel.durum || a.durum,
      tahsisatSonuclari: manuel.tahsisatSonuclari?.length ? manuel.tahsisatSonuclari : a.tahsisatSonuclari,
      ozetBolumler:       manuel.ozetBolumler?.length       ? manuel.ozetBolumler       : a.ozetBolumler,
      tavanSayisi:        manuel.tavanSayisi                ?? a.tavanSayisi,
      borsadaIslemGormeTarihi: manuel.borsadaIslemGormeTarihi || a.borsadaIslemGormeTarihi,
      sirketHakkinda:     manuel.sirketHakkinda              || a.sirketHakkinda,
      logo:               manuel.logo                        || a.logo,
    };
  });

  const tumu = [...ekstra, ...(spkMerged.length > 0 ? spkMerged : mockArzlar)];

  // Tarihe göre otomatik durum düzeltme
  // Manuel override olan arzlar (Firestore'dan gelenler) tarihe göre ezilmez
  const manuelSluglar = new Set(jsonArzlar.map(a => a.slug));
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const normalize = tumu.map(a => {
    // Admin panelinden manuel durum girilmişse tarihe göre ezme
    if (manuelSluglar.has(a.slug)) return a;
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
