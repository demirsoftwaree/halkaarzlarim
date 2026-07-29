import type { Arz } from "./types";

const SPK_COL = "arzlar-spk";

// Instance içi kısıtlama — aynı sunucu örneği 10 dakikada bir kereden fazla senkron yapmasın
let sonSenkron = 0;
const SENKRON_ARALIGI = 10 * 60 * 1000;

export async function readSpkCache(): Promise<Arz[]> {
  try {
    const { adminDb } = await import("./firebase-admin");
    const snap = await adminDb.collection(SPK_COL).get();
    return snap.docs.map(d => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _cachedAt: _, ...arz } = d.data() as Record<string, unknown>;
      return { ...arz, id: d.id, slug: d.id } as Arz;
    });
  } catch {
    return [];
  }
}

// Alan bazlı kararlı karşılaştırma — anahtar sırasından bağımsız
function ayniMi(eski: Record<string, unknown>, yeni: Record<string, unknown>): boolean {
  const anahtarlar = new Set([...Object.keys(eski), ...Object.keys(yeni)]);
  for (const k of anahtarlar) {
    if (k.startsWith("_")) continue; // _cachedAt, _yil gibi meta alanları yok say
    const a = eski[k];
    const b = yeni[k];
    if (a === b) continue;
    if (a == null && b == null) continue;
    if (JSON.stringify(a) !== JSON.stringify(b)) return false;
  }
  return true;
}

/**
 * SPK arzlarını Firestore'a yazar — kota dostu sürüm:
 * - Tüm koleksiyon yerine yalnızca gelen slug'ların dokümanlarını okur (getAll)
 * - Yalnızca yeni veya değişen dokümanları yazar (değişiklik yoksa 0 yazma)
 * - Instance başına 10 dakikada bir çalışır
 * Daha önce hiç görülmemiş (yeni) arzları döndürür — bildirim göndermek için kullanılır.
 */
export async function writeSpkCache(arzlar: Arz[]): Promise<Arz[]> {
  try {
    if (arzlar.length === 0) return [];
    if (Date.now() - sonSenkron < SENKRON_ARALIGI) return [];

    const { adminDb } = await import("./firebase-admin");

    // Sadece ilgili dokümanları oku — koleksiyonun tamamını değil
    const refs = arzlar.map(a => adminDb.collection(SPK_COL).doc(a.slug));
    const snaps = await adminDb.getAll(...refs);
    const mevcut = new Map<string, Record<string, unknown>>();
    for (const s of snaps) {
      if (s.exists) mevcut.set(s.id, s.data() as Record<string, unknown>);
    }

    const yeniArzlar = arzlar.filter(a => !mevcut.has(a.slug));

    const batch = adminDb.batch();
    const now = new Date().toISOString();
    let yazilacak = 0;
    for (const arz of arzlar) {
      const eski = mevcut.get(arz.slug);
      if (eski && ayniMi(eski, { ...arz })) continue;
      batch.set(
        adminDb.collection(SPK_COL).doc(arz.slug),
        { ...arz, _cachedAt: now },
        { merge: true }
      );
      yazilacak++;
    }
    if (yazilacak > 0) await batch.commit();

    sonSenkron = Date.now();
    return yeniArzlar;
  } catch (e) {
    console.warn("[spk-cache] Yazma hatası:", e);
    return [];
  }
}
