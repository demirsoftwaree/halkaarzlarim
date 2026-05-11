import { useEffect, useState, useCallback } from "react";
import { doc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth-context";

export const FREE_WATCHLIST_LIMIT = 5;
export type ToggleResult = "ok" | "limit_reached" | "not_logged_in";

interface WatchlistItem { slug: string; sirketAdi: string; ticker: string; }

export function useWatchlist() {
  const { user, isPremium } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);

  const load = useCallback(async () => {
    if (!user) { setItems([]); return; }
    const snap = await getDocs(collection(db, "users", user.uid, "watchlist"));
    setItems(snap.docs.map(d => d.data() as WatchlistItem));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const isFollowing = (slug: string) => items.some(i => i.slug === slug);

  const toggle = async (item: WatchlistItem): Promise<ToggleResult> => {
    if (!user) return "not_logged_in";
    const ref = doc(db, "users", user.uid, "watchlist", item.slug);
    if (isFollowing(item.slug)) {
      await deleteDoc(ref);
      setItems(prev => prev.filter(i => i.slug !== item.slug));
      return "ok";
    }
    if (!isPremium && items.length >= FREE_WATCHLIST_LIMIT) return "limit_reached";
    await setDoc(ref, { ...item, addedAt: serverTimestamp() });
    setItems(prev => [...prev, item]);
    return "ok";
  };

  return { items, isFollowing, toggle, reload: load };
}
