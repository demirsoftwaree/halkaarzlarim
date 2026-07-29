"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./auth-context";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  WatchlistItem,
} from "./watchlist-service";

export type ToggleResult = "ok" | "not_logged_in";

export function useWatchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await getWatchlist(user.uid);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const isFollowing = (slug: string) => items.some((i) => i.slug === slug);

  const toggle = async (item: Omit<WatchlistItem, "addedAt">): Promise<ToggleResult> => {
    if (!user) return "not_logged_in";

    if (isFollowing(item.slug)) {
      await removeFromWatchlist(user.uid, item.slug);
      setItems((prev) => prev.filter((i) => i.slug !== item.slug));
      return "ok";
    }

    await addToWatchlist(user.uid, item);
    setItems((prev) => [...prev, item]);
    return "ok";
  };

  return { items, loading, isFollowing, toggle, reload: load };
}
