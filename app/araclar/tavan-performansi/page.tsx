"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import type { Arz } from "@/lib/types";
import { Crown, Lock, TrendingUp, Medal } from "lucide-react";

function getiriHesapla(tavanSayisi: number) {
  return (Math.pow(1.1, tavanSayisi) - 1) * 100;
}

const MADALYA: Record<number, { renk: string; bg: string; border: string; label: string }> = {
  0: { renk: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "🥇" },
  1: { renk: "text-slate-300", bg: "bg-slate-700/30", border: "border-slate-600/30", label: "🥈" },
  2: { renk: "text-amber-600", bg: "bg-amber-900/10", border: "border-amber-800/20", label: "🥉" },
};

export default function TavanPerformansiPage() {
  const { user, isPremium, loading: authLoading } = useAuth();
  const [arzlar, setArzlar] = useState<Arz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/arzlar")
      .then(r => r.json())
      .then(d => {
        const tamamlandi = (d.arzlar || [])
          .filter((a: Arz) => a.durum === "tamamlandi" && typeof a.tavanSayisi === "number")
          .sort((a: Arz, b: Arz) => (b.tavanSayisi ?? 0) - (a.tavanSayisi ?? 0));
        setArzlar(tamamlandi);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isLocked = authLoading ? false : !isPremium;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Medal size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Geçmiş Tavan Performansı</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium flex items-center gap-1">
                <Crown size={10} /> Premium
              </span>
            </div>
            <p className="text-slate-400 text-sm">Tamamlanan arzlarda kaç tavan yapıldı, yatırımcıya ne kazandırdı?</p>
          </div>
        </div>

        {/* Premium kilit */}
        {isLocked && (
          <div className="relative">
            <div className="filter blur-sm pointer-events-none select-none opacity-40">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 h-20" />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <Lock size={24} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Premium Özellik</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Bu sayfayı görüntülemek için{" "}
                  {!user ? "giriş yapman ve " : ""}
                  premium üye olman gerekiyor.
                </p>
                <div className="flex flex-col gap-3">
                  {!user && (
                    <Link href="/giris" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-2.5 rounded-xl text-sm transition-colors text-center">
                      Giriş Yap
                    </Link>
                  )}
                  <Link href="/premium" className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-medium py-2.5 rounded-xl text-sm transition-colors text-center">
                    Premium&apos;a Geç
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* İçerik */}
        {!isLocked && (
          <>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />)}
              </div>
            ) : arzlar.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Henüz tavan verisi girilmemiş.</p>
                <p className="text-xs mt-1">Tamamlanan arzlar için admin panelinden veri girilebilir.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {arzlar.map((arz, i) => {
                  const getiri = getiriHesapla(arz.tavanSayisi!);
                  const stil = MADALYA[i] ?? { renk: "text-slate-400", bg: "bg-slate-800/40", border: "border-slate-700/50", label: `${i + 1}.` };
                  return (
                    <Link
                      key={arz.slug}
                      href={`/halka-arz/${arz.slug}`}
                      className={`flex items-center gap-4 ${stil.bg} border ${stil.border} rounded-2xl p-5 hover:border-slate-500/50 transition-colors`}
                    >
                      <div className="w-10 text-center">
                        <span className="text-xl">{stil.label}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{arz.ticker}</span>
                          <span className="text-slate-400 text-sm">{arz.sirketAdi}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Arz fiyatı: {arz.arsFiyatiUst || arz.arsFiyatiAlt} ₺
                          {arz.borsadaIslemGormeTarihi && ` · ${arz.borsadaIslemGormeTarihi}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-xl ${stil.renk}`}>
                          {arz.tavanSayisi} tavan
                        </div>
                        <div className="text-emerald-400 text-sm font-medium">
                          +%{getiri.toFixed(1)} getiri
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Alt not */}
            {arzlar.length > 0 && (
              <p className="text-xs text-slate-600 mt-6 text-center">
                * Tavan sayısı halka arz tarihinden itibaren arka arkaya %10 üst fiyat sınırına ulaşılan gün sayısını gösterir.
                Gerçek getiri satış fiyatına göre değişir.
              </p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
