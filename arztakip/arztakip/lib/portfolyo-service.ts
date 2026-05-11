import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface PortfoyKayit {
  id: string;
  ticker: string;
  sirketAdi: string;
  slug: string;
  lotSayisi: number;
  alisFiyati: number;
  satisFiyati?: number;
  satisTarihi?: string;
  createdAt?: unknown;
}

export async function addPortfoyKayit(
  uid: string,
  kayit: Omit<PortfoyKayit, "id" | "createdAt">
): Promise<string> {
  const id = `${kayit.slug}-${Date.now()}`;
  const ref = doc(db, "users", uid, "portfolyo", id);
  await setDoc(ref, { ...kayit, id, createdAt: serverTimestamp() });
  return id;
}

export async function updatePortfoyKayit(
  uid: string,
  id: string,
  data: Partial<Pick<PortfoyKayit, "satisFiyati" | "satisTarihi" | "lotSayisi" | "alisFiyati">>
) {
  const ref = doc(db, "users", uid, "portfolyo", id);
  await updateDoc(ref, data);
}

export async function deletePortfoyKayit(uid: string, id: string) {
  const ref = doc(db, "users", uid, "portfolyo", id);
  await deleteDoc(ref);
}

export async function getPortfoy(uid: string): Promise<PortfoyKayit[]> {
  const col = collection(db, "users", uid, "portfolyo");
  const snap = await getDocs(col);
  return snap.docs.map((d) => d.data() as PortfoyKayit);
}
