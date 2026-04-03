import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface WatchlistItem {
  slug: string;
  sirketAdi: string;
  ticker: string;
  addedAt?: unknown;
}

export async function addToWatchlist(uid: string, item: Omit<WatchlistItem, "addedAt">) {
  const ref = doc(db, "users", uid, "watchlist", item.slug);
  await setDoc(ref, { ...item, addedAt: serverTimestamp() });
}

export async function removeFromWatchlist(uid: string, slug: string) {
  const ref = doc(db, "users", uid, "watchlist", slug);
  await deleteDoc(ref);
}

export async function getWatchlist(uid: string): Promise<WatchlistItem[]> {
  const col = collection(db, "users", uid, "watchlist");
  const snap = await getDocs(col);
  return snap.docs.map((d) => d.data() as WatchlistItem);
}
