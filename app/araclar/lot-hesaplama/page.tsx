"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BarChart3 } from "lucide-react";
import AdBanner from "@/components/AdBanner";

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

function parseNum(s: string) {
  return parseInt(s.replace(/\D/g, "")) || 0;
}

export default function LotHesaplamaPage() {
  const [dagitilacakLot, setDagitilacakLot] = useState("1000000");
  const [kisiSayisi, setKisiSayisi] = useState("300000");

  const lot = parseNum(dagitilacakLot);
  const kisi = parseNum(kisiSayisi);

  const kisiBasiLot = kisi > 0 ? Math.floor(lot / kisi) : 0;
  const kacKisideBir = kisiBasiLot === 0 && kisi > 0 && lot > 0
    ? Math.ceil(kisi / lot)
    : null;

  const senaryolar = [
    { ad: "İyimser",  carpan: 0.5, renk: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { ad: "Baz",      carpan: 1,   renk: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
    { ad: "Kötümser", carpan: 2,   renk: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
  ].map(s => {
    const sKisi = Math.round(kisi * s.carpan);
    const dusen = sKisi > 0 ? Math.floor(lot / sKisi) : 0;
    const kacBir = dusen === 0 && sKisi > 0 && lot > 0 ? Math.ceil(sKisi / lot) : null;
    return { ...s, sKisi, dusen, kacBir };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
            <BarChart3 size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Lot Dağıtım Hesaplayıcı</h1>
            <p className="text-slate-400 text-sm">Kaç kişi başvurursa kaç lot düşer?</p>
          </div>
        </div>

        {/* Girişler */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2">Dağıtılacak Lot Miktarı</label>
              <input
                type="text"
                value={dagitilacakLot}
                onChange={e => setDagitilacakLot(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="1.000.000"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Tahmini Başvuran Kişi Sayısı</label>
              <input
                type="text"
                value={kisiSayisi}
                onChange={e => setKisiSayisi(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="300.000"
              />
            </div>
          </div>
        </div>

        {/* Sonuç */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-5">Sonuç</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Dağıtılacak Lot</div>
              <div className="font-bold text-white text-lg">{fmt(lot)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Başvuran Kişi</div>
              <div className="font-bold text-white text-lg">{fmt(kisi)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-slate-500 mb-1">Kişi Başı Düşen Lot</div>
              {kisiBasiLot > 0 ? (
                <div className="font-bold text-blue-400 text-2xl">{kisiBasiLot} lot</div>
              ) : kacKisideBir ? (
                <div className="font-bold text-amber-400 text-2xl">Her {fmt(kacKisideBir)} kişiden 1 lot</div>
              ) : (
                <div className="text-slate-500 text-lg">–</div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Senaryo */}
        <div>
          <h2 className="font-semibold text-white mb-4">Senaryo Tablosu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {senaryolar.map(s => (
              <div key={s.ad} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                <div className={`font-bold ${s.renk} mb-3`}>{s.ad}</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Başvuran</span>
                    <span className="text-white text-xs">{fmt(s.sKisi)} kişi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Kişi başı</span>
                    <span className={`${s.renk} text-xs font-bold`}>
                      {s.dusen > 0
                        ? `${s.dusen} lot`
                        : s.kacBir ? `Her ${fmt(s.kacBir)} kişiden 1`
                        : "–"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
