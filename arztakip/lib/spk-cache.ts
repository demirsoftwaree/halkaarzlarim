import type { Arz } from "./types";

const SPK_COL = "arzlar-spk";

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

export async function writeSpkCache(arzlar: Arz[]): Promise<void> {
  try {
    const { adminDb } = await import("./firebase-admin");
    const batch = adminDb.batch();
    const now = new Date().toISOString();
    for (const arz of arzlar) {
      batch.set(adminDb.collection(SPK_COL).doc(arz.slug), { ...arz, _cachedAt: now });
    }
    await batch.commit();
  } catch (e) {
    console.warn("[spk-cache] Yazma hatası:", e);
  }
}
