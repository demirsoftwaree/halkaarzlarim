"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Users, Building2, BarChart2 } from "lucide-react";
import type { IstatistiklerResponse } from "@/app/api/istatistikler/route";

const AYLAR = ["", "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

function StatKart({ icon: Icon, renk, baslik, deger, alt }: {
  icon: React.ElementType; renk: string; baslik: string; deger: string; alt?: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${renk}`}>
          <Icon size={17} />
        </div>
        <span className="text-slate-400 text-sm">{baslik}</span>
      </div>
      <div className="text-2xl font-bold text-white">{deger}</div>
      {alt && <div className="text-slate-500 text-xs mt-1">{alt}</div>}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "10px",
  color: "#f1f5f9",
  fontSize: 13,
};

export default function IstatistiklerPage() {
  const [veri, setVeri] = useState<IstatistiklerResponse | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("/api/istatistikler")
      .then(r => r.json())
      .then(d => { setVeri(d); setYukleniyor(false); })
      .catch(() => setYukleniyor(false));
  }, []);

  const buYil = new Date().getFullYear();
  const buYilIpo = veri?.yillikIpo.find(y => y.yil === buYil);
  const sonYatirimci = veri?.aylikYatirimci.at(-1);
  const sonPiyasa = veri?.aylikPiyasa.at(-1);

  const aylikGrafik = veri?.aylikPiyasa.map(a => ({
    donem: `${AYLAR[a.ay]} ${String(a.yil).slice(2)}`,
    "Toplam (Mlr ₺)": a.toplamPiyasaMilyarTl,
    "Halka Açık (Mlr ₺)": a.halkaAcikPiyasaMilyarTl,
  })) ?? [];

  const yatirimciGrafik = veri?.aylikYatirimci.map(a => ({
    donem: `${AYLAR[a.ay]} ${String(a.yil).slice(2)}`,
    "Toplam Yatırımcı": a.toplamYatirimci,
    "Yerli %": a.yerliOran,
    "Yabancı %": a.yabanciOran,
  })) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <TickerBar />
      <Navbar />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Başlık */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <BarChart2 size={17} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Piyasa İstatistikleri</h1>
            </div>
            <p className="text-slate-400 text-sm ml-12">
              Türkiye sermaye piyasalarına ait resmi SPK verileri — 2020–{buYil}
            </p>
          </div>

          {/* Stat Kartları */}
          {yukleniyor ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatKart
                icon={TrendingUp}
                renk="bg-emerald-500/15 text-emerald-400"
                baslik={`${buYil} IPO Sayısı`}
                deger={String(buYilIpo?.toplamIpo ?? "–")}
                alt="Borsaya giren şirket"
              />
              <StatKart
                icon={TrendingUp}
                renk="bg-blue-500/15 text-blue-400"
                baslik={`${buYil} IPO Tutarı`}
                deger={buYilIpo ? `${buYilIpo.toplamTutarMilyarTl} Mlr ₺` : "–"}
                alt="Halka açılma ihraç tutarı"
              />
              <StatKart
                icon={Users}
                renk="bg-violet-500/15 text-violet-400"
                baslik="Yatırımcı Sayısı"
                deger={sonYatirimci ? `${(sonYatirimci.toplamYatirimci / 1_000_000).toFixed(1)} Mn` : "–"}
                alt={sonYatirimci ? `Yerli %${sonYatirimci.yerliOran} · Yabancı %${sonYatirimci.yabanciOran}` : ""}
              />
              <StatKart
                icon={Building2}
                renk="bg-amber-500/15 text-amber-400"
                baslik="Borsa Şirketi"
                deger={String(sonPiyasa?.sirketSayisi ?? "–")}
                alt={sonPiyasa ? `${sonPiyasa.toplamPiyasaMilyarTl.toLocaleString("tr-TR")} Mlr ₺ piyasa değeri` : ""}
              />
            </div>
          )}

          {/* Grafik 1: Yıllık IPO Sayısı */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-1">Yıllık Halka Arz Sayısı</h2>
            <p className="text-slate-500 text-xs mb-5">Borsaya yeni giren şirket sayısı (2020–{buYil})</p>
            {yukleniyor ? (
              <div className="h-52 bg-slate-700/30 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={veri?.yillikIpo} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="yil" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b" }} />
                  <Bar dataKey="toplamIpo" name="IPO Sayısı" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Grafik 2: Yıllık IPO Tutarı */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-1">Yıllık Halka Arz Tutarı</h2>
            <p className="text-slate-500 text-xs mb-5">Toplam ihraç tutarı — Milyar TL (2020–{buYil})</p>
            {yukleniyor ? (
              <div className="h-52 bg-slate-700/30 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={veri?.yillikIpo} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="yil" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b" }} formatter={(v) => [`${v} Mlr ₺`, "İhraç Tutarı"]} />
                  <Bar dataKey="toplamTutarMilyarTl" name="Tutar (Mlr ₺)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Grafik 3: Borsa Piyasa Değeri */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-1">Borsa Piyasa Değeri Trendi</h2>
            <p className="text-slate-500 text-xs mb-5">Toplam ve halka açık kısım piyasa değeri — Milyar ₺ (son 3 yıl)</p>
            {yukleniyor ? (
              <div className="h-64 bg-slate-700/30 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={aylikGrafik}>
                  <defs>
                    <linearGradient id="gToplam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gAcik" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="donem" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}T`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString("tr-TR")} Mlr ₺`]} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  <Area type="monotone" dataKey="Toplam (Mlr ₺)" stroke="#10b981" strokeWidth={2} fill="url(#gToplam)" dot={false} />
                  <Area type="monotone" dataKey="Halka Açık (Mlr ₺)" stroke="#3b82f6" strokeWidth={2} fill="url(#gAcik)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Grafik 4: Yatırımcı Sayısı */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-1">Yatırımcı Sayısı Trendi</h2>
            <p className="text-slate-500 text-xs mb-5">Bakiyeli pay senedi sahibi yatırımcı sayısı (son 3 yıl)</p>
            {yukleniyor ? (
              <div className="h-64 bg-slate-700/30 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={yatirimciGrafik}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="donem" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1_000_000).toFixed(1)}Mn`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString("tr-TR")} kişi`, "Toplam Yatırımcı"]} />
                  <Line type="monotone" dataKey="Toplam Yatırımcı" stroke="#a78bfa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Tablo: Yıllık Özet */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-5">Yıllık Özet Tablo</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Yıl</th>
                    <th className="text-right py-2 px-3 text-slate-400 font-medium">IPO Sayısı</th>
                    <th className="text-right py-2 px-3 text-slate-400 font-medium">İhraç Tutarı</th>
                    <th className="text-right py-2 px-3 text-slate-400 font-medium">Borsa Şirketi</th>
                  </tr>
                </thead>
                <tbody>
                  {veri?.yillikIpo.slice().reverse().map(y => (
                    <tr key={y.yil} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-3 text-white font-semibold">{y.yil}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-emerald-400 font-medium">{y.toplamIpo}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {y.toplamTutarMilyarTl > 0 ? `${y.toplamTutarMilyarTl.toLocaleString("tr-TR")} Mlr ₺` : "–"}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {y.sonBorsaSirketSayisi > 0 ? y.sonBorsaSirketSayisi : "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-slate-600 text-xs text-center pb-4">
            Kaynak: Sermaye Piyasası Kurulu (SPK) resmi web servisleri · ws.spk.gov.tr · Her saat güncellenir
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
