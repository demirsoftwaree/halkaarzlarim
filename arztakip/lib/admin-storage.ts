import { adminDb } from "@/lib/firebase-admin";
import type { Arz } from "./types";

const COL = "arzlar";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function readYaklasanArzlar(): Promise<Arz[]> {
  const snap = await adminDb.collection(COL).orderBy("createdAt", "desc").get();
  return snap.docs.map(d => d.data() as Arz);
}

export async function addArzEntry(entry: Omit<Arz, "id" | "slug">): Promise<Arz> {
  const slug = slugify((entry.ticker || entry.sirketAdi) as string);
  const newArz: Arz = { ...entry, id: slug, slug };
  await adminDb.collection(COL).doc(slug).set({ ...newArz, createdAt: Date.now() });
  return newArz;
}

export async function updateArzEntry(slug: string, updates: Partial<Omit<Arz, "id" | "slug">>): Promise<Arz | null> {
  const ref = adminDb.collection(COL).doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return null;
  await ref.update(updates as Record<string, unknown>);
  const updated = await ref.get();
  return updated.data() as Arz;
}

export async function deleteArzEntry(slug: string): Promise<boolean> {
  const ref = adminDb.collection(COL).doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
