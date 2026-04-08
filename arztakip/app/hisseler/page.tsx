"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { Search, ArrowUpRight, TrendingUp } from "lucide-react";
import type { Arz } from "@/lib/types";

const DURUM_ETİKET: Record<string, string> = {
  "aktif":             "Aktif",
  "yaklasan":          "Yaklaşan",
  "tamamlandi":        "Tamamlandı",
  "ertelendi":         "Ertelendi",
  "basvuru-surecinde": "Başvuruda",
};

const DURUM_RENK: Record<string, string> = {
  "aktif":             "text-emerald-400 bg-emerald-500/10",
  "yaklasan":          "text-blue-400 bg-blue-500/10",
  "tamamlandi":        "text-slate-400 bg-slate-500/10",
  "ertelendi":         "text-red-400 bg-red-500/10",
  "basvuru-surecinde": "text-amber-400 bg-amber-500/10",
};

const FİLTRELER = [
  { label: "Tümü",      value: "" },
  { label: "Aktif",     value: "aktif" },
  { label: "Yaklaşan",  value: "yaklasan" },
  { label: "Tamamlandı", value: "tamamlandi" },
];

const SAYFA_BOYUTU = 50;

export default function HisselerPage() {
  const [arzlar, setArzlar]         = useState<Arz[]>([]);
  const [loading, setLoading]       = useState(true);
  const [arama, setArama]           = useState("");
  const [durumFiltre, setDurumFiltre] = useState("");
  const [sayfa, setSayfa]           = useState(1);

  useEffect(() => {
    fetch("/api/arzlar")
      .then(r => r.json())
      .then(d => setArzlar(d.arzlar || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtrelenmis = useMemo(() => {
    const q = arama.toLowerCase().trim();
    return arzlar.filter(a => {
      const durumEsles = !durumFiltre || a.durum === durumFiltre;
      const aramaEsles = !q
        || (a.ticker ?? "").toLowerCase().includes(q)
        || (a.sirketAdi ?? "").toLowerCase().includes(q)
        || (a.sektor ?? "").toLowerCase().includes(q);
      return durumEsles && aramaEsles;
    });
  }, [arzlar, arama, durumFiltre]);

  const sayfaBasla  = (sayfa - 1) * SAYFA_BOYUTU;
  const gosterilenler = filtrelenmis.slice(sayfaBasla, sayfaBasla + SAYFA_BOYUTU);
  const toplamSayfa   = Math.ceil(filtrelenmis.length / SAYFA_BOYUTU);

  function handleArama(v: string) { setArama(v); setSayfa(1); }
  function handleDurum(v: string) { setDurumFiltre(v); setSayfa(1); }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Halka Arz Şirketleri</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {loading
              ? "Yükleniyor…"
              : `${arzlar.length} şirket — SPK kayıtlı halka arz verileri`}
          </p>
        </div>

        {/* Arama + Filtre */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Ticker, şirket adı veya sektör ara…"
              value={arama}
              onChange={e => handleArama(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FİLTRELER.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => handleDurum(f.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  durumFiltre === f.value
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sonuç sayısı */}
        {!loading && (
          <p className="text-xs text-slate-500 mb-3">
            {filtrelenmis.length} şirket
            {arama && ` · "${arama}" araması`}
            {toplamSayfa > 1 && ` · Sayfa ${sayfa}/${toplamSayfa}`}
          </p>
        )}

        {/* Tablo */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl h-12 animate-pulse" />
            ))}
          </div>
        ) : gosterilenler.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">Sonuç bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_110px_100px_44px] gap-2 px-4 py-2 border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Ticker</span>
                <span>Şirket Adı</span>
                <span>Sektör</span>
                <span>Durum</span>
                <span />
              </div>
              {gosterilenler.map((a, i) => (
                <div
                  key={a.slug}
                  className={`grid grid-cols-[80px_1fr_110px_100px_44px] gap-2 items-center px-4 py-3 hover:bg-slate-700/30 transition-colors ${
                    i > 0 ? "border-t border-slate-700/30" : ""
                  }`}
                >
                  <span className="font-mono text-sm font-semibold text-white truncate">
                    {a.ticker || "—"}
                  </span>
                  <span className="text-sm text-slate-300 truncate" title={a.sirketAdi}>
                    {a.sirketAdi}
                  </span>
                  <span className="text-xs text-slate-400 truncate">{a.sektor || "—"}</span>
                  <span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DURUM_RENK[a.durum] ?? "text-slate-400 bg-slate-500/10"}`}>
                      {DURUM_ETİKET[a.durum] ?? a.durum}
                    </span>
                  </span>
                  <Link
                    href={`/halka-arz/${a.slug}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/40 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-transparent transition-colors group"
                    title="Detayları gör"
                  >
                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </Link>
                </div>
              ))}
            </div>

            {toplamSayfa > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setSayfa(p => Math.max(1, p - 1))}
                  disabled={sayfa === 1}
                  className="px-4 py-2 rounded-xl text-sm bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Önceki
                </button>
                <span className="text-sm text-slate-400">{sayfa} / {toplamSayfa}</span>
                <button
                  type="button"
                  onClick={() => setSayfa(p => Math.min(toplamSayfa, p + 1))}
                  disabled={sayfa === toplamSayfa}
                  className="px-4 py-2 rounded-xl text-sm bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        )}

      </main>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
