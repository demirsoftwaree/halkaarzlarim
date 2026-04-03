"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign } from "lucide-react";
import AdBanner from "@/components/AdBanner";

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function KarHesaplamaPage() {
  const [arsFiyati, setArsFiyati] = useState("10.00");
  const [satisFiyati, setSatisFiyati] = useState("11.00");
  const [lotSayisi, setLotSayisi] = useState("1");
  const [hisseLot, setHisseLot] = useState("100");
  const [komisyon, setKomisyon] = useState("0.20");

  const arz = parseFloat(arsFiyati) || 0;
  const satis = parseFloat(satisFiyati) || 0;
  const lot = parseInt(lotSayisi) || 0;
  const hisse = parseInt(hisseLot) || 100;
  const kom = parseFloat(komisyon) || 0;

  const alimMaliyeti = arz * lot * hisse;
  const satisGeliri = satis * lot * hisse;
  const komisyonTutar = satisGeliri * (kom / 100);
  const netKar = satisGeliri - alimMaliyeti - komisyonTutar;
  const roi = alimMaliyeti > 0 ? (netKar / alimMaliyeti) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.1)" }}>
            <DollarSign size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Net Kâr Hesaplayıcı</h1>
            <p className="text-slate-400 text-sm">Komisyon dahil gerçek kazancını hesapla</p>
          </div>
        </div>

        {/* Input */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Arz Fiyatı (₺)", val: arsFiyati, set: setArsFiyati, placeholder: "10.00" },
              { label: "Satış Fiyatı (₺)", val: satisFiyati, set: setSatisFiyati, placeholder: "11.00" },
              { label: "Lot Sayısı", val: lotSayisi, set: setLotSayisi, placeholder: "1" },
              { label: "Hisse/Lot", val: hisseLot, set: setHisseLot, placeholder: "100" },
            ].map(({ label, val, set, placeholder }) => (
              <div key={label}>
                <label className="block text-xs text-slate-400 mb-2">{label}</label>
                <input
                  type="number"
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder={placeholder}
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-xs text-slate-400 mb-2">Aracı Kurum Komisyonu (%)</label>
            <input
              type="number"
              value={komisyon}
              onChange={e => setKomisyon(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="0.20"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Özet Kart */}
        {alimMaliyeti > 0 && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-5">Hesaplama Özeti</h2>
            <div className="space-y-3">
              {[
                { label: "Alım Maliyeti", value: fmt(alimMaliyeti) + " ₺", color: "text-white" },
                { label: "Satış Geliri", value: fmt(satisGeliri) + " ₺", color: "text-white" },
                { label: "Aracı Komisyonu", value: `-${fmt(komisyonTutar)} ₺`, color: "text-red-400" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-white">Net Kâr</span>
                <span className={`text-xl font-extrabold ${netKar >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {netKar >= 0 ? "+" : ""}{fmt(netKar)} ₺
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">ROI</span>
                <span className={`text-lg font-bold ${roi >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
