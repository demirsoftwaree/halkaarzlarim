"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { Star, Check, X, Crown, BarChart3, Bell, Shield, FileText, Trophy, Zap, List } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

const premiumOzellikler = [
  {
    ikon: BarChart3,
    renk: "text-emerald-400",
    bg: "bg-emerald-500/10",
    baslik: "Portföy Takibi",
    aciklama: "Kaç lot aldın, ne kadara sattın, net kâr/zarar ne? Tüm halka arz yatırımlarını tek ekranda görüntüle.",
  },
  {
    ikon: Trophy,
    renk: "text-amber-400",
    bg: "bg-amber-500/10",
    baslik: "Geçmiş Tavan Performansı",
    aciklama: "Tamamlanan arzların gerçek tavan istatistikleri. Hangi arz kaç gün tavan yaptı, gerçek getiri ne oldu?",
  },
  {
    ikon: FileText,
    renk: "text-blue-400",
    bg: "bg-blue-500/10",
    baslik: "Tavan Getiri Raporu",
    aciklama: "10 güne kadar tavan senaryolarını PDF olarak indir, yatırım kararlarını belgele.",
  },
  {
    ikon: List,
    renk: "text-purple-400",
    bg: "bg-purple-500/10",
    baslik: "Sınırsız Takip Listesi",
    aciklama: "Ücretsiz hesaplarda maksimum 5 arz takibi. Premium ile istediğin kadar arz ekle, hiçbirini kaçırma.",
  },
  {
    ikon: Shield,
    renk: "text-rose-400",
    bg: "bg-rose-500/10",
    baslik: "Reklamsız Deneyim",
    aciklama: "Tüm sayfalarda sıfır reklam. Dikkat dağıtıcı banner'lar olmadan odaklanarak analiz yap.",
  },
  {
    ikon: Bell,
    renk: "text-cyan-400",
    bg: "bg-cyan-500/10",
    baslik: "Öncelikli Destek",
    aciklama: "Sorularına öncelikli yanıt al. Premium üyeler için ayrılmış destek kanalı.",
  },
];

const karsilastirma = [
  { ozellik: "Halka arz takvimi", ucretsiz: true, premium: true },
  { ozellik: "Arz detay sayfaları", ucretsiz: true, premium: true },
  { ozellik: "Hesaplama araçları", ucretsiz: true, premium: true },
  { ozellik: "Haberler & duyurular", ucretsiz: true, premium: true },
  { ozellik: "Takip listesi", ucretsiz: "Max 5 arz", premium: "Sınırsız" },
  { ozellik: "Portföy takibi", ucretsiz: false, premium: true },
  { ozellik: "Geçmiş tavan performansı", ucretsiz: false, premium: true },
  { ozellik: "Tavan getiri raporu (PDF)", ucretsiz: false, premium: true },
  { ozellik: "Reklamsız deneyim", ucretsiz: false, premium: true },
  { ozellik: "Öncelikli destek", ucretsiz: false, premium: true },
];


function KarsilastirmaCell({ deger }: { deger: boolean | string }) {
  if (deger === true) return <Check size={18} className="text-emerald-400 mx-auto" />;
  if (deger === false) return <X size={18} className="text-slate-600 mx-auto" />;
  return <span className="text-slate-300 text-sm">{deger}</span>;
}

export default function PremiumPage() {
  const { isPremium, loading } = useAuth();
  const [yillik, setYillik] = useState(false);

  if (!loading && isPremium) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <TickerBar />
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-slate-800 border border-emerald-500/30 rounded-2xl p-10 text-center max-w-sm w-full">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <Crown size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Zaten Premium Üyesin!</h3>
            <p className="text-slate-400 text-sm mb-7">Tüm premium özelliklerden yararlanabilirsin.</p>
            <div className="space-y-2">
              <Link href="/hesabim/portfoy" className="block w-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-3 rounded-xl text-sm transition-colors text-center">
                Portföyüme Git
              </Link>
              <Link href="/" className="block w-full text-slate-400 hover:text-white py-3 rounded-xl text-sm transition-colors text-center">
                Anasayfaya Dön
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <TickerBar />
      <Navbar />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden py-24 px-4">
          {/* Arka plan efekti */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-8 bg-amber-500/10 border border-amber-500/20">
              <Star size={14} fill="currentColor" />
              Premium Üyelik
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Halka Arz Yatırımcısının<br />
              <span className="text-emerald-400">Süper Gücü</span>
            </h1>

            <p className="text-slate-400 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Portföyünü yönet, tavan istatistiklerini analiz et, reklamsız deneyimin tadını çıkar. Hepsini tek platformda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#planlar"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-base shadow-lg shadow-emerald-500/20"
              >
                <Zap size={18} />
                Hemen Başla
              </a>
              <a
                href="#karsilastir"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Planları karşılaştır ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── ÖZELLİK SHOWCASE ── */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-white mb-3">Premium ile neler kazanırsın?</h2>
              <p className="text-slate-400">Halka arz yatırımını bir üst seviyeye taşıyacak araçlar</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {premiumOzellikler.map((o) => (
                <div key={o.baslik} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                  <div className={`w-11 h-11 ${o.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <o.ikon size={20} className={o.renk} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{o.baslik}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{o.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KARŞILAŞTIRMA TABLOSU ── */}
        <section id="karsilastir" className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Ücretsiz vs Premium</h2>
              <p className="text-slate-400">Hangi planda ne var?</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
              {/* Tablo başlığı */}
              <div className="grid grid-cols-3 bg-slate-800/80 px-6 py-4 border-b border-slate-700/50">
                <div className="text-slate-400 text-sm font-medium">Özellik</div>
                <div className="text-center text-slate-400 text-sm font-medium">Ücretsiz</div>
                <div className="text-center text-emerald-400 text-sm font-semibold flex items-center justify-center gap-1.5">
                  <Crown size={13} /> Premium
                </div>
              </div>

              {/* Satırlar */}
              {karsilastirma.map((row, i) => (
                <div
                  key={row.ozellik}
                  className={`grid grid-cols-3 px-6 py-4 items-center ${i !== karsilastirma.length - 1 ? "border-b border-slate-700/30" : ""}`}
                >
                  <span className="text-slate-300 text-sm">{row.ozellik}</span>
                  <div className="text-center">
                    <KarsilastirmaCell deger={row.ucretsiz} />
                  </div>
                  <div className="text-center">
                    <KarsilastirmaCell deger={row.premium} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLAN KARTLARI ── */}
        <section id="planlar" className="py-20 px-4 bg-slate-900/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Planını seç</h2>
              <p className="text-slate-400 mb-8">İstediğin zaman iptal edebilirsin. Gizli ücret yok.</p>

              {/* Toggle */}
              <div className="inline-flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-5 py-3">
                <span className={`text-sm font-medium transition-colors ${!yillik ? "text-white" : "text-slate-500"}`}>Aylık</span>
                <button
                  onClick={() => setYillik(v => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${yillik ? "bg-emerald-500" : "bg-slate-600"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${yillik ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className={`text-sm font-medium transition-colors ${yillik ? "text-white" : "text-slate-500"}`}>Yıllık</span>
                {yillik && (
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                    %20 Tasarruf
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* Aylık Kart */}
              <div className="relative rounded-2xl p-px bg-gradient-to-b from-slate-600 to-slate-700/50">
                <div className="bg-[#111827] rounded-2xl p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 text-amber-400 text-sm font-semibold mb-4">
                      <Star size={14} fill="currentColor" /> Premium
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-extrabold text-white">49₺</span>
                      <span className="text-slate-400 text-base">/ ay</span>
                    </div>
                    {yillik && (
                      <p className="text-slate-500 text-sm mt-1">Yıllık seçenek: <span className="text-emerald-400 font-medium">39₺/ay</span> ile daha avantajlı</p>
                    )}
                    <p className="text-slate-400 text-sm mt-3">Tüm premium özellikler + reklamsız deneyim</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {["Portföy takibi", "Tavan performans analizi", "Tavan getiri raporu (PDF)", "Sınırsız takip listesi", "Reklamsız deneyim", "Öncelikli destek"].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <Check size={11} className="text-emerald-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/iletisim"
                    className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    Aylık Başla — 49₺/ay
                  </Link>
                </div>
              </div>

              {/* Yıllık Kart */}
              <div className="relative rounded-2xl p-px bg-gradient-to-b from-emerald-500 to-emerald-600/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                    ⭐ En Çok Tercih Edilen
                  </span>
                </div>
                <div className="bg-[#0d1f17] rounded-2xl p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold mb-4">
                      <Crown size={14} /> Premium Yıllık
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-extrabold text-white">39₺</span>
                      <span className="text-slate-400 text-base">/ ay</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                      Yıllık seçenek: <span className="text-white font-semibold">468₺</span>
                      <span className="text-emerald-400 ml-1">(96₺ tasarruf)</span>
                    </p>
                    <p className="text-slate-400 text-sm mt-3">Tüm premium özellikler + 2 ay bedava</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {["Portföy takibi", "Tavan performans analizi", "Tavan getiri raporu (PDF)", "Sınırsız takip listesi", "Reklamsız deneyim", "Öncelikli destek"].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <Check size={11} className="text-emerald-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/iletisim"
                    className="block w-full text-center bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/25"
                  >
                    Yıllık Başla — 39₺/ay
                  </Link>
                </div>
              </div>

            </div>

            {/* Güven ikonları */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { ikon: "🔒", baslik: "Güvenli Ödeme", aciklama: "SSL korumalı işlemler" },
                { ikon: "⚡", baslik: "Anında Erişim", aciklama: "Ödeme sonrası hemen aktif" },
                { ikon: "↩️", baslik: "İptal Garantisi", aciklama: "İstediğin zaman iptal et" },
              ].map(({ ikon, baslik, aciklama }) => (
                <div key={baslik} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{ikon}</div>
                  <div className="text-white text-xs font-semibold">{baslik}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{aciklama}</div>
                </div>
              ))}
            </div>

            <p className="text-center text-slate-600 text-xs mt-6">
              Ödeme entegrasyonu yakında aktif olacak. Şu an için iletişime geçebilirsiniz.
            </p>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Sık Sorulan Sorular</h2>
            <div className="space-y-4">
              {[
                { s: "İstediğim zaman iptal edebilir miyim?", c: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar premium özelliklerinden yararlanmaya devam edersiniz." },
                { s: "Ödeme güvenli mi?", c: "Tüm ödemeler SSL şifreli bağlantı üzerinden gerçekleştirilmektedir. Kart bilgileriniz sistemimizde saklanmaz." },
                { s: "Ücretsiz hesapta ne kadar süre kalabilirim?", c: "Ücretsiz hesap süre sınırı yoktur. İstediğiniz zaman premium'a geçebilir veya ücretsiz hesabınızla devam edebilirsiniz." },
                { s: "Yıllık plandan aylık plana geçebilir miyim?", c: "Mevcut abonelik döneminiz bittikten sonra istediğiniz plana geçiş yapabilirsiniz." },
              ].map(({ s, c }) => (
                <div key={s} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-2 text-sm">{s}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
