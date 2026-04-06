"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { FileDown, Lock, TrendingUp, Crown } from "lucide-react";
import type { Arz } from "@/lib/types";

function fmt(n: number, decimals = 2) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
function fmtInt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

export default function TavanRaporuPage() {
  const { user, isPremium, loading: authLoading } = useAuth();
  const [arzlar, setArzlar] = useState<Arz[]>([]);
  const [seciliSlug, setSeciliSlug] = useState("");
  const [lotSayisi, setLotSayisi] = useState("100");
  const [loaded, setLoaded] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/arzlar")
      .then(r => r.json())
      .then(d => {
        const liste = (d.arzlar || []).filter(
          (a: Arz) => a.durum !== "ertelendi"
        );
        setArzlar(liste);
        if (liste.length > 0) setSeciliSlug(liste[0].slug);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const secili = arzlar.find(a => a.slug === seciliSlug);
  const arsFiyati = secili ? (secili.arsFiyatiUst || secili.arsFiyatiAlt) : 0;
  const lot = parseInt(lotSayisi) || 0;
  const maliyet = arsFiyati * lot;

  // 10 günlük tavan tablosu
  const gunler = Array.from({ length: 10 }, (_, i) => {
    const gun = i + 1;
    const fiyat = arsFiyati * Math.pow(1.1, gun);
    const deger = fiyat * lot;
    const kar = deger - maliyet;
    const karYuzde = maliyet > 0 ? (kar / maliyet) * 100 : 0;
    return { gun, fiyat, deger, kar, karYuzde };
  });

  function handlePrint() {
    if (!secili) return;
    const tarih = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    const satirlar = [
      `<tr style="background:#f9f9f9"><td style="padding:10px 8px;color:#555">Arz Günü</td><td style="padding:10px 8px;text-align:right">${fmt(arsFiyati)} ₺</td><td style="padding:10px 8px;text-align:right">${fmt(maliyet)} ₺</td><td style="padding:10px 8px;text-align:right;color:#999">–</td><td style="padding:10px 8px;text-align:right;color:#999">–</td></tr>`,
      ...gunler.map((g, i) => `<tr style="background:${i % 2 === 0 ? "#fff" : "#f9f9f9"}"><td style="padding:10px 8px">${g.gun}. Tavan</td><td style="padding:10px 8px;text-align:right;font-weight:600">${fmt(g.fiyat)} ₺</td><td style="padding:10px 8px;text-align:right">${fmt(g.deger)} ₺</td><td style="padding:10px 8px;text-align:right;color:#16a34a;font-weight:600">+${fmt(g.kar)} ₺</td><td style="padding:10px 8px;text-align:right;color:#16a34a;font-weight:700">%${fmt(g.karYuzde, 1)}</td></tr>`),
    ].join("");

    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${secili.ticker} Tavan Raporu</title>
    <style>
      body { font-family: Arial, sans-serif; color: #222; margin: 0; padding: 32px; }
      h1 { font-size: 18px; margin: 0 0 4px; }
      .meta { font-size: 12px; color: #666; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #ddd; color: #555; font-weight: 600; }
      th:not(:first-child) { text-align: right; }
      td { border-bottom: 1px solid #eee; }
      .note { font-size: 11px; color: #999; margin-top: 20px; }
      .brand { font-size: 11px; color: #bbb; margin-top: 4px; }
    </style></head><body>
    <h1>${secili.ticker} — ${secili.sirketAdi}</h1>
    <div class="meta">10 Günlük Tavan Senaryosu &nbsp;|&nbsp; Arz Fiyatı: ${fmt(arsFiyati)} ₺ &nbsp;|&nbsp; ${lot} Lot &nbsp;|&nbsp; Maliyet: ${fmt(maliyet)} ₺ &nbsp;|&nbsp; ${tarih}</div>
    <table>
      <thead><tr><th>Gün</th><th style="text-align:right">Hisse Fiyatı</th><th style="text-align:right">Toplam Değer</th><th style="text-align:right">Kâr (₺)</th><th style="text-align:right">Kâr (%)</th></tr></thead>
      <tbody>${satirlar}</tbody>
    </table>
    <div class="note">* Bu hesaplama her gün üst üste %10 tavan yapıldığı varsayımına dayanır. Bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.</div>
    <div class="brand">halkaarzlarim.com</div>
    <script>window.onload = function(){ window.print(); }<\/script>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  }

  const isLocked = authLoading ? false : !isPremium;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="flex items-center gap-3 mb-8 print:hidden">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Crown size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Tavan Getiri Raporu</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium">Premium</span>
            </div>
            <p className="text-slate-400 text-sm">Seçtiğin arzın 10 günlük tavan senaryosunu hesapla ve PDF olarak indir.</p>
          </div>
        </div>

        {/* Premium Kilit */}
        {isLocked && (
          <div className="relative">
            {/* Bulanık önizleme */}
            <div className="filter blur-sm pointer-events-none select-none opacity-40">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 h-10 bg-slate-700 rounded-xl" />
                  <div className="h-10 bg-slate-700 rounded-xl" />
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-slate-700 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
            {/* Kilit overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <Lock size={24} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Premium Özellik</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Bu aracı kullanmak için{" "}
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

        {/* İçerik — sadece premium kullanıcıya göster */}
        {!isLocked && (
          <>
            {/* Girişler */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6 print:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Arz seçici */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-2">Halka Arz Seç</label>
                  <select
                    value={seciliSlug}
                    onChange={e => setSeciliSlug(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    {!loaded && <option value="">Yükleniyor...</option>}
                    {loaded && arzlar.length === 0 && <option value="">Aktif arz bulunamadı</option>}
                    {arzlar.map(a => (
                      <option key={a.slug} value={a.slug}>
                        {a.ticker} — {a.sirketAdi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lot sayısı */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Lot Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    value={lotSayisi}
                    onChange={e => setLotSayisi(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Seçili arz bilgisi */}
              {secili && (
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400 pt-4 border-t border-slate-700/50">
                  <span>Halka Arz Fiyatı: <span className="text-white font-medium">{fmt(arsFiyati)} ₺</span></span>
                  <span>Toplam Maliyet: <span className="text-white font-medium">{fmt(maliyet)} ₺</span></span>
                  <span>Aracı Kurum: <span className="text-slate-300">{secili.araciKurum || "–"}</span></span>
                </div>
              )}
            </div>

            {/* PDF Raporu — yazdırılabilir alan */}
            <div ref={printRef} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 print:bg-white print:border-0 print:p-0 print:rounded-none">

              {/* Rapor başlığı */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-emerald-400 print:hidden" />
                    <h2 className="font-bold text-white text-base print:text-black">
                      {secili ? `${secili.ticker} — ${secili.sirketAdi}` : "–"}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 print:text-gray-500">
                    10 Günlük Tavan Senaryosu • Arz Fiyatı: {fmt(arsFiyati)} ₺ • {lot} Lot • Toplam Maliyet: {fmt(maliyet)} ₺
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 print:text-gray-400">
                    Rapor Tarihi: {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-xl text-sm font-medium transition-colors print:hidden"
                >
                  <FileDown size={15} /> PDF İndir
                </button>
              </div>

              {/* Tablo */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm print:text-black">
                  <thead>
                    <tr className="border-b border-slate-700/50 print:border-gray-300">
                      <th className="text-left text-slate-400 font-medium pb-3 print:text-gray-600">Gün</th>
                      <th className="text-right text-slate-400 font-medium pb-3 print:text-gray-600">Hisse Fiyatı</th>
                      <th className="text-right text-slate-400 font-medium pb-3 print:text-gray-600">Toplam Değer</th>
                      <th className="text-right text-slate-400 font-medium pb-3 print:text-gray-600">Kâr (₺)</th>
                      <th className="text-right text-slate-400 font-medium pb-3 print:text-gray-600">Kâr (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Başlangıç satırı */}
                    <tr className="border-b border-slate-700/30 print:border-gray-200">
                      <td className="py-3 text-slate-300 print:text-gray-700">Arz Günü</td>
                      <td className="py-3 text-right text-white print:text-black font-medium">{fmt(arsFiyati)} ₺</td>
                      <td className="py-3 text-right text-white print:text-black">{fmt(maliyet)} ₺</td>
                      <td className="py-3 text-right text-slate-400">–</td>
                      <td className="py-3 text-right text-slate-400">–</td>
                    </tr>
                    {gunler.map(g => (
                      <tr key={g.gun} className={`border-b border-slate-700/30 print:border-gray-200 last:border-0 ${g.gun === 10 ? "bg-amber-500/5" : ""}`}>
                        <td className="py-3 text-slate-300 print:text-gray-700">{g.gun}. Tavan</td>
                        <td className="py-3 text-right text-white print:text-black font-medium">{fmt(g.fiyat)} ₺</td>
                        <td className="py-3 text-right text-white print:text-black">{fmt(g.deger)} ₺</td>
                        <td className="py-3 text-right text-emerald-400 print:text-green-700 font-medium">+{fmt(g.kar)} ₺</td>
                        <td className="py-3 text-right text-emerald-400 print:text-green-700 font-bold">%{fmt(g.karYuzde, 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Alt not */}
              <div className="mt-6 pt-4 border-t border-slate-700/50 print:border-gray-200">
                <p className="text-xs text-slate-500 print:text-gray-400">
                  * Bu hesaplama her gün üst üste %10 tavan yapıldığı varsayımına dayanır. Gerçek piyasa koşulları farklılık gösterebilir.
                  Bu rapor bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.
                </p>
                <p className="text-xs text-slate-600 mt-1 print:text-gray-400">halkaarzlarim.com</p>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Print CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          [ref] { visibility: visible; }
          nav, footer { display: none !important; }
          main { padding: 0 !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
