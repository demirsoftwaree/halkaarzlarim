import fs from "fs";
import path from "path";
import type { Arz } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "yaklasan-arzlar.json");

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function readYaklasanArzlar(): Arz[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Arz[];
  } catch {
    return [];
  }
}

export function writeYaklasanArzlar(data: Arz[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function addArzEntry(entry: Omit<Arz, "id" | "slug">): Arz {
  const existing = readYaklasanArzlar();
  const slug = slugify(entry.ticker || entry.sirketAdi);
  const newArz: Arz = { ...entry, id: slug, slug };
  const filtered = existing.filter((a) => a.slug !== slug);
  writeYaklasanArzlar([newArz, ...filtered]);
  return newArz;
}

export function updateArzEntry(slug: string, updates: Partial<Omit<Arz, "id" | "slug">>): Arz | null {
  const existing = readYaklasanArzlar();
  const idx = existing.findIndex((a) => a.slug === slug);
  if (idx === -1) return null;
  const updated = { ...existing[idx], ...updates };
  existing[idx] = updated;
  writeYaklasanArzlar(existing);
  return updated;
}

export function deleteArzEntry(slug: string): boolean {
  const existing = readYaklasanArzlar();
  const next = existing.filter((a) => a.slug !== slug);
  if (next.length === existing.length) return false;
  writeYaklasanArzlar(next);
  return true;
}
