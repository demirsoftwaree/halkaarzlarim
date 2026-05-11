import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ManuelHaber {
  id: string;
  baslik: string;
  icerik: string;       // \n ile paragraf ayrımı
  sirket: string;
  ticker?: string;
  gorsel?: string;      // URL
  kategori: string;
  tarih: string;        // YYYY-MM-DD
  yayinda: boolean;
  createdAt?: unknown;
}

export async function getManuelHaberler(): Promise<ManuelHaber[]> {
  const col = collection(db, "haberler");
  const q = query(col, where("yayinda", "==", true), orderBy("tarih", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ManuelHaber);
}

export async function getAllManuelHaberler(): Promise<ManuelHaber[]> {
  const col = collection(db, "haberler");
  const q = query(col, orderBy("tarih", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ManuelHaber);
}

export async function saveManuelHaber(haber: Omit<ManuelHaber, "createdAt">) {
  const ref = doc(db, "haberler", haber.id);
  await setDoc(ref, { ...haber, createdAt: serverTimestamp() }, { merge: true });
}

export async function deleteManuelHaber(id: string) {
  await deleteDoc(doc(db, "haberler", id));
}

export function slugOlustur(baslik: string): string {
  return baslik
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
