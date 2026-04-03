"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { RefreshCw, Megaphone } from "lucide-react";
import type { Haber } from "@/app/api/haberler/route";

const KATEGORİ_RENK: Record<string, string> = {
  "halka-arz":     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "sermaye":       "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "genel-kurul":   "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "borsa":         "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "temettu":       "text-pink-400 bg-pink-500/10 border-pink-500/20",
  "sirket-haberi": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "duyuru":        "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

const KATEGORİ_ETİKET: Record<string, string> = {
  "halka-arz":     "Halka Arz",
  "sermaye":       "Sermaye",
  "genel-kurul":   "Genel Kurul",
  "borsa":         "Borsa",
  "temettu":       "Temettü",
  "sirket-haberi": "Şirket",
  "duyuru":        "Duyuru",
};

const FİLTRELER = [
  { label: "Tümü",        value: "hepsi" },
  { label: "Halka Arz",   value: "halka-arz" },
  { label: "Borsa",       value: "borsa" },
  { label: "Sermaye",     value: "sermaye" },
  { label: "Genel Kurul", value: "genel-kurul" },
];

function formatTarihSaat(tarih: string, saat?: string) {
  if (!tarih) return "";
  const [yil, ay, gun] = tarih.split("-");
  const d = `${gun}.${ay}.${yil}`;
  return saat ? `${d} ${saat}` : d;
}

function SirketAvatar({ sirket, gorsel }: { sirket: string; gorsel?: string }) {
  if (gorsel) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={gorsel} alt={sirket} className="w-10 h-10 rounded-full object-contain bg-white/5 flex-shrink-0" />
    );
  }
  const harf = (sirket || "?")[0].toUpperCase();
  const renkler = ["bg-emerald-500/20 text-emerald-400", "bg-blue-500/20 text-blue-400", "bg-amber-500/20 text-amber-400", "bg-purple-500/20 text-purple-400"];
  const renk = renkler[harf.charCodeAt(0) % renkler.length];
  return (
    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${renk}`}>
      {harf}
    </div>
  );
}

export default function HaberlerPage() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filtre, setFiltre]     = useState("hepsi");
  const [guncelleme, setGuncelleme] = useState("");

  useEffect(() => {
    fetch("/api/haberler")
      .then(r => r.json())
      .then(d => {
        if (d.haberler?.length) setHaberler(d.haberler);
        setGuncelleme(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtrelenmis = filtre === "hepsi"
    ? haberler
    : haberler.filter(h => h.kategori === filtre);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Megaphone size={18} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Haberler & Duyurular</h1>
              <p className="text-xs text-slate-500">
                {loading
                  ? <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> Yükleniyor…</span>
                  : guncelleme ? `Son güncelleme: ${guncelleme}` : ""
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FİLTRELER.map(f => {
            const count = f.value === "hepsi" ? haberler.length : haberler.filter(h => h.kategori === f.value).length;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFiltre(f.value)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  filtre === f.value
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* İçerik */}
        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-slate-800/40 rounded-xl p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : filtrelenmis.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Bu kategoride haber bulunmuyor.</div>
        ) : (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden divide-y divide-slate-700/40">
            {filtrelenmis.map(haber => {
              const renkClass = KATEGORİ_RENK[haber.kategori] ?? KATEGORİ_RENK["duyuru"];
              const etiket    = KATEGORİ_ETİKET[haber.kategori] ?? "Duyuru";
              return (
                <Link
                  key={haber.id}
                  href={haber.link}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-700/30 transition-colors group"
                >
                  {/* Şirket avatarı */}
                  <SirketAvatar sirket={haber.sirket} gorsel={haber.gorsel} />

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {haber.baslik}
                    </p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{haber.sirket}</p>
                  </div>

                  {/* Sağ: kategori + tarih */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${renkClass}`}>
                      {etiket}
                    </span>
                    <span className="text-slate-500 text-[11px] tabular-nums">
                      {formatTarihSaat(haber.tarih, haber.saat)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </main>
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
