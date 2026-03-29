"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ArrowRight, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/use-watchlist";

export default function TakipListemPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, toggle } = useWatchlist();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/giris");
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Star size={22} className="text-amber-400" fill="currentColor" />
          <h1 className="text-2xl font-bold text-white">Takip Listem</h1>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm">Yükleniyor...</div>
        ) : items.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-10 text-center">
            <Star size={40} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Henüz takip ettiğin bir arz yok.</p>
            <Link href="/halka-arzlar" className="text-emerald-400 text-sm hover:underline">
              Halka arzlara göz at →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.slug}
                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {item.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{item.ticker}</div>
                    <div className="text-slate-400 text-xs line-clamp-1">{item.sirketAdi}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(item)}
                    className="p-2 rounded-xl text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition-all"
                    title="Takipten çıkar"
                  >
                    <Star size={15} fill="currentColor" />
                  </button>
                  <Link
                    href={`/halka-arz/${item.slug}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-all"
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
