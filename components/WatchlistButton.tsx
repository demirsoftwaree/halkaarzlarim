"use client";

import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/use-watchlist";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  sirketAdi: string;
  ticker: string;
  className?: string;
}

export default function WatchlistButton({ slug, sirketAdi, ticker, className = "" }: Props) {
  const { user } = useAuth();
  const { isFollowing, toggle } = useWatchlist();
  const router = useRouter();
  const following = isFollowing(slug);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/giris");
      return;
    }
    await toggle({ slug, sirketAdi, ticker });
  }

  return (
    <button
      onClick={handleClick}
      title={following ? "Takipten çıkar" : "Takip et"}
      className={`p-2 rounded-xl transition-all ${
        following
          ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
          : "text-slate-500 hover:text-amber-400 hover:bg-slate-700"
      } ${className}`}
    >
      <Star size={16} fill={following ? "currentColor" : "none"} />
    </button>
  );
}
