"use client";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import type { KapMember } from "@/lib/kap-service";

const TIP_ETİKET: Record<string, string> = {
  IGS:  "Pay",
  GZAL: "Pay (GİP)",
  FK:   "Fon",
  PYS:  "Portföy",
  AB:   "Aracı",
  YF:   "Yabancı Fon",
};

const TIP_RENK: Record<string, string> = {
  IGS:  "text-emerald-400 bg-emerald-500/10",
  GZAL: "text-blue-400 bg-blue-500/10",
  FK:   "text-amber-400 bg-amber-500/10",
  PYS:  "text-purple-400 bg-purple-500/10",
  AB:   "text-slate-400 bg-slate-500/10",
};

const FİLTRELER = [
  { label: "Tümü",    value: "" },
  { label: "Pay",     value: "IGS" },
  { label: "GİP",     value: "GZAL" },
  { label: "Fon",     value: "FK" },
  { label: "Portföy", value: "PYS" },
];

const SAYFA_BOYUTU = 50;

export default function HisselerPage() {
  const [members, setMembers]   = useState<KapMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [hata, setHata]         = useState(false);
  const [arama, setArama]       = useState("");
  const [tipFiltre, setTipFiltre] = useState("");
  const [sayfa, setSayfa]       = useState(1);
  const [guncelleme, setGuncelleme] = useState("");

  function yukle() {
    setLoading(true);
    setHata(false);
    fetch("/api/kap/members")
      .then(r => r.json())
      .then(d => {
        if (d.members?.length) {
          setMembers(d.members);
          setGuncelleme(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
        } else {
          setHata(true);
        }
      })
      .catch(() => setHata(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { yukle(); }, []);

  const filtrelenmis = useMemo(() => {
    const q = arama.toLowerCase().trim();
    return members.filter(m => {
      const tipEsles = !tipFiltre || (m.memberType ?? "").includes(tipFiltre);
      const aramaEsles = !q
        || (m.stockCode ?? "").toLowerCase().includes(q)
        || (m.title ?? "").toLowerCase().includes(q);
      return tipEsles && aramaEsles;
    });
  }, [members, arama, tipFiltre]);

  // Sayfa değişince başa dön
  const sayfaBasla = (sayfa - 1) * SAYFA_BOYUTU;
  const gosterilenler = filtrelenmis.slice(sayfaBasla, sayfaBasla + SAYFA_BOYUTU);
  const toplamSayfa   = Math.ceil(filtrelenmis.length / SAYFA_BOYUTU);

  function handleArama(v: string) {
    setArama(v);
    setSayfa(1);
  }
  function handleTip(v: string) {
    setTipFiltre(v);
    setSayfa(1);
  }

  function getTipEtiket(memberType: string): string {
    for (const [key, label] of Object.entries(TIP_ETİKET)) {
      if (memberType.includes(key)) return label;
    }
    return memberType.split(",")[0].trim();
  }

  function getTipRenk(memberType: string): string {
    for (const [key, renk] of Object.entries(TIP_RENK)) {
      if (memberType.includes(key)) return renk;
    }
    return "text-slate-400 bg-slate-500/10";
  }

  function kapUrl(m: KapMember): string {
    if (m.kfifUrl) return m.kfifUrl;
    if (m.stockCode) return `https://www.kap.org.tr/tr/Hisse/${m.stockCode}`;
    return `https://www.kap.org.tr/tr/sirket-bilgileri/${m.id}`;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">BIST Hisseler</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw size={11} className="animate-spin" /> Yükleniyor…
              </span>
            ) : members.length > 0 ? (
              <span className="text-slate-500">
                {members.length} şirket · Son güncelleme: {guncelleme}
              </span>
            ) : hata ? (
              <span className="text-red-400">Bağlantı hatası</span>
            ) : null}
          </p>
        </div>

        {/* Arama + Filtre */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Ticker veya şirket adı ara…"
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
                onClick={() => handleTip(f.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  tipFiltre === f.value
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
            {` · Sayfa ${sayfa}/${toplamSayfa || 1}`}
          </p>
        )}

        {/* Tablo */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl h-12 animate-pulse" />
            ))}
          </div>
        ) : hata ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-slate-400">Veri yüklenemedi, API bağlantısı kurulamadı.</p>
            <button
              type="button"
              onClick={yukle}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Yeniden Dene
            </button>
          </div>
        ) : gosterilenler.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">Sonuç bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
              {/* Tablo başlığı */}
              <div className="grid grid-cols-[80px_1fr_100px_48px] gap-2 px-4 py-2 border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Ticker</span>
                <span>Şirket Adı</span>
                <span>Tip</span>
                <span />
              </div>
              {/* Satırlar */}
              {gosterilenler.map((m, i) => (
                <div
                  key={`${m.id}-${i}`}
                  className={`grid grid-cols-[80px_1fr_100px_48px] gap-2 items-center px-4 py-3 hover:bg-slate-700/30 transition-colors ${
                    i > 0 ? "border-t border-slate-700/30" : ""
                  }`}
                >
                  <span className="font-mono text-sm font-semibold text-white truncate">
                    {m.stockCode || "—"}
                  </span>
                  <span className="text-sm text-slate-300 truncate" title={m.title}>
                    {m.title}
                  </span>
                  <span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTipRenk(m.memberType ?? "")}`}>
                      {getTipEtiket(m.memberType ?? "")}
                    </span>
                  </span>
                  <a
                    href={kapUrl(m)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/40 hover:bg-slate-600/60 transition-colors group"
                    title="KAP'ta görüntüle"
                  >
                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-white transition-colors" />
                  </a>
                </div>
              ))}
            </div>

            {/* Sayfalama */}
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
                <span className="text-sm text-slate-400">
                  {sayfa} / {toplamSayfa}
                </span>
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
