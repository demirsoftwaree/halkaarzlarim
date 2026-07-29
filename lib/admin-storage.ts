/**
 * Arz depolama — Firestore tabanlı
 * Koleksiyon: "arzlar-manuel"
 * Vercel read-only filesystem nedeniyle JSON dosyası yerine Firestore kullanılır.
 */

import type { Arz } from "./types";
import { sendPushToAll } from "./push-notifications";
import { notificationTemplates } from "./notification-templates";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const COL = "arzlar-manuel";

export async function readYaklasanArzlar(): Promise<Arz[]> {
  try {
    const { adminDb } = await import("./firebase-admin");
    const snap = await adminDb.collection(COL).get();
    return snap.docs.map(d => ({ ...d.data(), id: d.id, slug: d.id } as Arz));
  } catch {
    return [];
  }
}

export async function addArzEntry(entry: Omit<Arz, "id" | "slug">): Promise<Arz> {
  const { adminDb } = await import("./firebase-admin");
  const slug = slugify(entry.ticker || entry.sirketAdi);
  const newArz: Arz = { ...entry, id: slug, slug };
  await adminDb.collection(COL).doc(slug).set(newArz);

  // Geçmiş/tamamlanmış girişlerde bildirim gönderme (toplu geçmiş veri eklerken spam olmasın)
  if (newArz.durum !== "tamamlandi" && newArz.durum !== "ertelendi") {
    const { title, body, data } = notificationTemplates.yeniArz(newArz);
    sendPushToAll(title, body, data).catch(() => {});
  }

  return newArz;
}

export async function updateArzEntry(slug: string, updates: Partial<Omit<Arz, "id" | "slug">>): Promise<Arz> {
  const { adminDb } = await import("./firebase-admin");
  const ref = adminDb.collection(COL).doc(slug);
  const snap = await ref.get();
  const base = (snap.exists ? snap.data() : {}) as Partial<Arz>;
  const updated = { ...base, ...updates, id: slug, slug } as Arz;
  await ref.set(updated);

  // Yeni bilgi eklendiğinde otomatik bildirim — sadece alan boştan doluya geçtiğinde (tekrar tekrar gönderilmesin)
  const sonuclarYeniEklendi = !base.tahsisatSonuclari?.length && (updated.tahsisatSonuclari?.length ?? 0) > 0;
  const islemTarihiYeniEklendi = !base.borsadaIslemGormeTarihi && !!updated.borsadaIslemGormeTarihi;

  if (sonuclarYeniEklendi) {
    const { title, body, data } = notificationTemplates.arzSonuclariAciklandi(updated);
    sendPushToAll(title, body, data).catch(() => {});
  } else if (islemTarihiYeniEklendi) {
    const { title, body, data } = notificationTemplates.islemGormeTarihiBelirlendi(updated);
    sendPushToAll(title, body, data).catch(() => {});
  }

  return updated;
}

export type ArzSource = "spk" | "manuel" | "spk+manuel";
export type ArzWithSource = Arz & { _source: ArzSource };

export async function readAllArzlarAdmin(): Promise<ArzWithSource[]> {
  try {
    const { adminDb } = await import("./firebase-admin");
    const [spkSnap, manuelSnap] = await Promise.all([
      adminDb.collection("arzlar-spk").get(),
      adminDb.collection(COL).get(),
    ]);

    const spkMap = new Map<string, Arz>();
    for (const doc of spkSnap.docs) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _cachedAt: _, ...arz } = doc.data() as Record<string, unknown>;
      spkMap.set(doc.id, { ...arz, id: doc.id, slug: doc.id } as Arz);
    }

    const manuelMap = new Map<string, Arz>();
    for (const doc of manuelSnap.docs) {
      manuelMap.set(doc.id, { ...doc.data(), id: doc.id, slug: doc.id } as Arz);
    }

    const result: ArzWithSource[] = [];

    for (const [slug, spkArz] of spkMap) {
      const manuel = manuelMap.get(slug);
      result.push(manuel
        ? { ...spkArz, ...manuel, _source: "spk+manuel" }
        : { ...spkArz, _source: "spk" }
      );
    }

    for (const [slug, manuelArz] of manuelMap) {
      if (!spkMap.has(slug)) {
        result.push({ ...manuelArz, _source: "manuel" });
      }
    }

    return result.sort((a, b) => a.sirketAdi.localeCompare(b.sirketAdi, "tr"));
  } catch {
    return readYaklasanArzlar().then(arzlar => arzlar.map(a => ({ ...a, _source: "manuel" as ArzSource })));
  }
}

export async function deleteArzEntry(slug: string): Promise<boolean> {
  const { adminDb } = await import("./firebase-admin");
  const ref = adminDb.collection(COL).doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
