"use client";

import { useState } from "react";
import { Star, Crown, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist, FREE_WATCHLIST_LIMIT } from "@/lib/use-watchlist";
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
  const [limitModal, setLimitModal] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/giris");
      return;
    }
    const result = await toggle({ slug, sirketAdi, ticker });
    if (result === "limit_reached") {
      setLimitModal(true);
    }
  }

  return (
    <>
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

      {/* Limit modal */}
      {limitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setLimitModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLimitModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Crown size={22} className="text-amber-400" />
            </div>
            <h3 className="text-white font-semibold text-center mb-2">Takip Listesi Doldu</h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              Ücretsiz hesaplarda en fazla <span className="text-white font-medium">{FREE_WATCHLIST_LIMIT} arz</span> takip edebilirsin.
              Sınırsız takip için Premium&apos;a geç.
            </p>
            <Link
              href="/premium"
              className="block w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-medium py-2.5 rounded-xl text-sm transition-colors text-center"
            >
              Premium&apos;a Geç
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
