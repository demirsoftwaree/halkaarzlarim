import { Arz } from "./types";
import { mockArzlar } from "./mock-data";
import { fetchSpkIpoData } from "./spk-service";
import { yaklasanArzlar } from "./yaklasan-arzlar";
import { readYaklasanArzlar } from "./admin-storage";

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
    // SPK yoksa sadece manuel + mock
    tumu = [...manuelMap.values(), ...mockArzlar.filter(a => !manuelMap.has(a.slug))];
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

  return { arzlar: normalize, source: ekstraCount > 0 ? source + "+manuel" : source };
}
