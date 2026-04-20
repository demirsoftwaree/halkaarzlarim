"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Halka arz kaç gün tavan yapar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Halka arzlarda tavan gün sayısı şirketten şirkete değişir. Tarihsel verilere göre BIST'te halka arz olan hisseler ortalama 3–7 gün tavan yapabilir. Bazı arzlar yalnızca 1–2 tavan yaparken, talep fazlası yüksek arzlarda 10 güne kadar tavan görülebilir.",
      },
    },
    {
      "@type": "Question",
      name: "Halka arz en fazla kaç tavan yapabilir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BIST'te teorik tavan sınırı yoktur. Pratikte en yüksek tavan sayısı 10 gün civarında gerçekleşmiştir. Geçmiş arzların tavan performansı piyasa koşullarına ve şirketin sektörüne bağlıdır.",
      },
    },
    {
      "@type": "Question",
      name: "Halka arz tavan getirisi nasıl hesaplanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Her tavan günü önceki kapanış fiyatının %10 üstünde oluşur. Arz fiyatı 100 ₺ ise: 1. tavan 110 ₺, 2. tavan 121 ₺, 3. tavan 133,1 ₺ şeklinde bileşik artar.",
      },
    },
    {
      "@type": "Question",
      name: "5 tavan yapan hisse ne kadar kazandırır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "5 tavan yapan bir hisse, arz fiyatının %61,1 üstünde kapanır. Örneğin 100 TL'den alınan hisse 5 tavanda 161,05 TL değerine ulaşır. Brüt kâr 61,05 TL / lot'tur.",
      },
    },
    {
      "@type": "Question",
      name: "10 tavan yapan hisse kaç kat kazandırır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "10 tavan yapan bir hisse arz fiyatının 2,59 katına çıkar, yani %159,4 brüt getiri sağlar. 100 TL'den alınan hisse 10 tavanda 259,37 TL değerine ulaşır.",
      },
    },
    {
      "@type": "Question",
      name: "Tavan simülatörü komisyon hesaplıyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tavan simülatörü brüt kâr göstermektedir. Komisyon ve stopaj hesaplamak için HalkaArzlarım'ın Net Kâr Hesaplayıcı aracını kullanabilirsiniz.",
      },
    },
  ],
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function TavanSimulatoruPage() {
  const [arsFiyati, setArsFiyati] = useState("80.00");
  const [adet, setAdet] = useState("10");
  const [tavanSayisi, setTavanSayisi] = useState(5);

  const fiyat = parseFloat(arsFiyati) || 0;
  const hisseSayisi = parseInt(adet) || 0;
  const alimMaliyeti = fiyat * hisseSayisi;

  const tavanlar = Array.from({ length: tavanSayisi }, (_, i) => {
    const gun = i + 1;
    const tavanFiyat = fiyat * Math.pow(1.1, gun);
    const toplamDeger = tavanFiyat * hisseSayisi;
    const brutKar = toplamDeger - alimMaliyeti;
    const roi = alimMaliyeti > 0 ? (brutKar / alimMaliyeti) * 100 : 0;
    return { gun, tavanFiyat, toplamDeger, brutKar, roi };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tavan Simülatörü</h1>
            <p className="text-slate-400 text-sm">BIST %10 günlük tavan limiti üzerinden hesaplama</p>
          </div>
        </div>

        {/* Açıklama */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 mb-6 text-xs text-slate-400 leading-relaxed">
          <span className="text-blue-400 font-medium">Nasıl çalışır?</span> — Halka arzda aldığın her lot 1 hissedir.
          Hisse borsaya girdiğinde arka arkaya <span className="text-white">%10 tavan</span> yapabilir.
          Arz fiyatını ve aldığın lot sayısını gir; her tavan günündeki kârını gör.
        </div>

        {/* Input Card */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-5">Parametreler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-2">Halka Arz Fiyatı (₺)</label>
              <input
                type="number"
                value={arsFiyati}
                onChange={e => setArsFiyati(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="80.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-slate-600 mt-1.5">Hisse başına arz fiyatı</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Aldığın Hisse Adedi</label>
              <input
                type="number"
                value={adet}
                onChange={e => setAdet(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="10"
                min="1"
              />
              <p className="text-xs text-slate-600 mt-1.5">
                Toplam maliyet: {fiyat > 0 && hisseSayisi > 0 ? <span className="text-slate-400">{formatMoney(alimMaliyeti)} ₺</span> : "–"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400">Kaç tavana kadar hesaplayalım?</label>
              <span className="text-emerald-400 font-bold text-sm">{tavanSayisi} tavan</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={tavanSayisi}
              onChange={e => setTavanSayisi(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>1 tavan</span><span>10 tavan</span>
            </div>
          </div>
        </div>

        {/* Özet */}
        {alimMaliyeti > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-xs text-slate-500 mb-1">Toplam Maliyetin</div>
              <div className="font-bold text-white text-sm">{formatMoney(alimMaliyeti)} ₺</div>
              <div className="text-xs text-slate-600 mt-0.5">{hisseSayisi} hisse × {formatMoney(fiyat)} ₺</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <div className="text-xs text-slate-500 mb-1">{tavanSayisi}. Tavanda Kâr</div>
              <div className="font-bold text-emerald-400 text-sm">+{formatMoney(tavanlar[tavanSayisi - 1]?.brutKar ?? 0)} ₺</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-xs text-slate-500 mb-1">{tavanSayisi}. Tavan ROI</div>
              <div className="font-bold text-blue-400 text-sm">%{(tavanlar[tavanSayisi - 1]?.roi ?? 0).toFixed(1)}</div>
            </div>
          </div>
        )}

        {/* Tablo */}
        {alimMaliyeti > 0 && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="font-semibold text-white">Tavan Tavan Kâr Tablosu</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Her satır: o gün tavan fiyatından satarsan ne kazanırsın?
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500 bg-slate-900/30">
                    <th className="text-left px-6 py-3">Tavan</th>
                    <th className="text-right px-6 py-3">Hisse Fiyatı</th>
                    <th className="text-right px-6 py-3">Portföy Değeri</th>
                    <th className="text-right px-6 py-3">Brüt Kâr</th>
                    <th className="text-right px-6 py-3">Getiri %</th>
                  </tr>
                </thead>
                <tbody>
                  {tavanlar.map(t => (
                    <tr key={t.gun} className="border-t border-slate-800/50 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-3.5 text-slate-400 text-sm">
                        {t.gun}. tavan
                        <span className="text-slate-600 text-xs ml-1.5">(+{(Math.pow(1.1, t.gun) * 100 - 100).toFixed(1)}%)</span>
                      </td>
                      <td className="px-6 py-3.5 text-right text-white text-sm font-medium">{formatMoney(t.tavanFiyat)} ₺</td>
                      <td className="px-6 py-3.5 text-right text-white text-sm">{formatMoney(t.toplamDeger)} ₺</td>
                      <td className="px-6 py-3.5 text-right text-emerald-400 text-sm font-semibold">+{formatMoney(t.brutKar)} ₺</td>
                      <td className="px-6 py-3.5 text-right text-emerald-300 text-sm font-bold">%{t.roi.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-600 mt-3 text-center">
          ⚠️ Brüt kâr gösterilmektedir. Komisyon ve stopaj dahil değildir. Yatırım tavsiyesi değildir.
        </p>

        {/* SEO / SSS Bloğu */}
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-bold text-white">Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {[
              {
                soru: "Halka arz kaç gün tavan yapar?",
                cevap: "Halka arzlarda tavan gün sayısı şirketten şirkete değişir. Tarihsel verilere göre BIST'te halka arz olan hisseler ortalama 3–7 gün tavan yapabilir. Bazı arzlar yalnızca 1–2 tavan yaparken, talep fazlası yüksek arzlarda 10 güne kadar tavan görülebilir. Kesin bir sayı yoktur; piyasa koşulları, şirketin sektörü ve halka arz fiyatı belirleyicidir.",
              },
              {
                soru: "Halka arz en fazla kaç tavan yapabilir?",
                cevap: "BIST'te teorik sınır yoktur. Pratikte en yüksek tavan sayısı 10 gün civarında gerçekleşmiştir. Geçmiş arzların tavan performansını görmek için Geçmiş Tavan Performansı sayfamızı inceleyebilirsiniz.",
              },
              {
                soru: "Halka arz tavan getirisi nasıl hesaplanır?",
                cevap: "Her tavan günü önceki kapanış fiyatının %10 üstünde oluşur. Örneğin arz fiyatı 100 ₺ ise: 1. tavan 110 ₺, 2. tavan 121 ₺, 3. tavan 133,1 ₺ şeklinde bileşik olarak artar. Yukarıdaki simülatör bu hesabı otomatik yapar.",
              },
              {
                soru: "5 tavan yapan hisse ne kadar kazandırır?",
                cevap: "5 tavan yapan bir hisse arz fiyatının %61,1 üstünde kapanır. 100 TL'den alınan 10 hisse için brüt kâr = 610,51 TL'dir. Simülatöre 100 TL ve 10 hisse girip kaydırıcıyı 5 tavan konumuna getirerek görebilirsin.",
              },
              {
                soru: "10 tavan yapan hisse kaç kat kazandırır?",
                cevap: "10 tavan yapan bir hisse arz fiyatının 2,59 katına çıkar — yani %159,4 brüt getiri. 100 TL'den alınan hisse 10 tavanda 259,37 TL değerine ulaşır.",
              },
              {
                soru: "Tavan simülatörü komisyon hesaplıyor mu?",
                cevap: "Simülatör yalnızca brüt kâr göstermektedir. Komisyon ve %10 stopaj dahil net kazancınızı hesaplamak için Net Kâr Hesaplayıcı aracımızı kullanabilirsiniz.",
              },
            ].map(({ soru, cevap }) => (
              <div key={soru} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-2">{soru}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cevap}</p>
              </div>
            ))}
          </div>

          {/* İlgili sayfalar */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mb-3">İlgili Rehberler</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/tavan-nedir", label: "Tavan Nedir?" },
                { href: "/ipo-nedir", label: "IPO Nedir?" },
                { href: "/araclar/kar-hesaplama", label: "Net Kâr Hesaplayıcı" },
                { href: "/araclar/tavan-performansi", label: "Geçmiş Tavan Performansı" },
                { href: "/halka-arz-nasil-yapilir", label: "Halka Arza Nasıl Katılınır?" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs text-slate-400 hover:text-emerald-400 border border-slate-700/50 hover:border-emerald-500/30 px-3 py-1.5 rounded-full transition-all"
                >
                  {label}
                </a>
              ))}
            </div>
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
