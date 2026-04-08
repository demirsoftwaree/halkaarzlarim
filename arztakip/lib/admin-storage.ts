/**
 * Arz depolama — Firestore tabanlı
 * Koleksiyon: "arzlar-manuel"
 * Vercel read-only filesystem nedeniyle JSON dosyası yerine Firestore kullanılır.
 */

import type { Arz } from "./types";

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
  return newArz;
}

export async function updateArzEntry(slug: string, updates: Partial<Omit<Arz, "id" | "slug">>): Promise<Arz | null> {
  const { adminDb } = await import("./firebase-admin");
  const ref = adminDb.collection(COL).doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const updated = { ...snap.data(), ...updates, id: slug, slug } as Arz;
  await ref.set(updated);
  return updated;
}

export async function deleteArzEntry(slug: string): Promise<boolean> {
  const { adminDb } = await import("./firebase-admin");
  const ref = adminDb.collection(COL).doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
