import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { TrendingUp, ChevronRight, HelpCircle, ArrowRight, Calculator } from "lucide-react";

const BASE_URL = "https://www.halkaarzlarim.com";
const PAGE_URL = `${BASE_URL}/tavan-nedir`;

export const metadata: Metadata = {
  title: "Tavan Nedir? Borsada Tavan Fiyat Nasıl Hesaplanır? | 2026 Rehber",
  description:
    "Borsada tavan nedir, tavan fiyatı nasıl hesaplanır? Halka arzda tavan kaç gün sürer, tavan gitme ne anlama gelir? BIST tavan mekanizması tam rehberi.",
  keywords: [
    "tavan nedir",
    "borsada tavan nedir",
    "tavan fiyat nedir",
    "hisse tavan nedir",
    "halka arz tavan nedir",
    "tavan gitme ne demek",
    "bist tavan limiti",
    "halka arz tavan hesaplama",
    "tavan gün sayısı",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Tavan Nedir? Borsada Tavan Fiyat Nasıl Hesaplanır?",
    description:
      "BIST'te tavan mekanizması nasıl çalışır? Halka arzlarda tavan neden önemlidir? Adım adım hesaplama ve örnekler.",
    url: PAGE_URL,
    type: "article",
    locale: "tr_TR",
    siteName: "HalkaArzlarım",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Tavan Nedir? Borsada Tavan Fiyat Nasıl Hesaplanır?",
      description: "Borsa İstanbul'daki tavan mekanizması, halka arzlarda tavan önemi ve hesaplama yöntemi.",
      url: PAGE_URL,
      datePublished: "2026-01-15",
      dateModified: "2026-04-20",
      author: { "@type": "Organization", name: "HalkaArzlarım", url: BASE_URL },
      publisher: { "@type": "Organization", name: "HalkaArzlarım", url: BASE_URL },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Borsada tavan nedir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tavan, Borsa İstanbul'da bir hissenin gün içinde ulaşabileceği maksimum fiyat artış sınırıdır. BIST'te normal hisseler için bu limit genellikle bir önceki kapanış fiyatının %10 üstüdür. Hisse bu sınıra ulaştığında ve satıcı bulunmadığında 'tavan yapıyor' ya da 'tavanda kaldı' denir.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arzda tavan neden önemlidir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Halka arz olan hisseler borsaya ilk girişte gerçek değerini arayan fiyat keşfi sürecine girer. Bu süreçte talep yüksekse hisse her gün %10 tavan yaparak yükselmeye devam eder. Yatırımcılar bu tavan hareketlerinden kâr sağlamayı hedefler.",
          },
        },
        {
          "@type": "Question",
          name: "Tavan fiyatı nasıl hesaplanır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tavan fiyatı = Önceki gün kapanış fiyatı × 1,10 formülüyle hesaplanır. İlk tavan için halka arz fiyatı baz alınır. Örneğin 50 TL arz fiyatı için: 1. tavan 55 TL, 2. tavan 60,50 TL, 3. tavan 66,55 TL olur.",
          },
        },
        {
          "@type": "Question",
          name: "Tavan gitme ne demek?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tavan gitmek, hissenin gün içinde maksimum artış sınırına (%10) ulaşması ve o fiyattan alıcı bulunmasına rağmen satıcının çıkmaması anlamına gelir. Bu yatırımcı açısından olumludur — elinizde hisse varsa değeri artmaya devam eder ve bir sonraki gün yeni tavan hesaplanır.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arz kaç gün tavan yapar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kesin bir sayı yoktur; piyasa koşullarına, talep miktarına ve şirketin sektörüne bağlıdır. Tarihsel olarak BIST'te halka arz olan hisseler ortalama 3-7 gün tavan yapmıştır. En uzun tavan serileri 10 günü aşmıştır.",
          },
        },
      ],
    },
  ],
};

const TAVAN_ORNEGI = [
  { adim: 1, fiyat: 55.00, artis: 10.0, toplam: 10.0 },
  { adim: 2, fiyat: 60.50, artis: 10.0, toplam: 21.0 },
  { adim: 3, fiyat: 66.55, artis: 10.0, toplam: 33.1 },
  { adim: 5, fiyat: 80.53, artis: 10.0, toplam: 61.1 },
  { adim: 7, fiyat: 97.44, artis: 10.0, toplam: 94.9 },
  { adim: 10, fiyat: 129.69, artis: 10.0, toplam: 159.4 },
];

const SSS = [
  {
    soru: "Borsada tavan nedir?",
    cevap: "Tavan, Borsa İstanbul'da bir hissenin gün içinde ulaşabileceği maksimum fiyat artış sınırıdır. BIST'te bu limit genellikle önceki kapanışın %10 üstüdür. Hisse bu sınıra ulaştığında satıcı çıkmıyorsa 'tavan yapıyor' denir.",
  },
  {
    soru: "Tavan ile taban arasındaki fark nedir?",
    cevap: "Tavan, günlük maksimum artış limitidir (+%10). Taban ise günlük maksimum düşüş limitidir (-%10). Her iki durum da hissenin aşırı oynaklığını önlemek için uygulanır.",
  },
  {
    soru: "Tavan fiyatı nasıl hesaplanır?",
    cevap: "Tavan fiyatı = Önceki gün kapanış fiyatı × 1,10 formülüyle hesaplanır. Halka arz edilen hisseler için ilk tavan hesabında baz alınan fiyat arz fiyatıdır.",
  },
  {
    soru: "Tavan gitme ne demek?",
    cevap: "Hissenin günlük maksimum artış sınırına ulaşması ve o fiyattan satıcı çıkmaması durumudur. Elinde hisse varsa değerin artmaya devam etmesi anlamına gelir — bu yatırımcı açısından olumludur.",
  },
  {
    soru: "Halka arz kaç gün tavan yapar?",
    cevap: "Kesin bir kural yoktur. Talep fazlası, şirketin sektörü ve piyasa koşullarına göre değişir. Geçmiş BIST verilerine göre ortalama 3–7 gün, bazı hisselerde 10+ gün tavan görülmüştür.",
  },
  {
    soru: "Halka arz tavan süreci ne zaman biter?",
    cevap: "Hisse fiyat keşfini tamamladığında tavan hareketleri durur. Bu genellikle arz fiyatının yansıttığı 'gerçek değer'e ulaşıldığında ya da piyasada satıcı çıkıp alıcı-satıcı dengesi kurulduğunda olur.",
  },
];

export default function TavanNedirPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
        <TickerBar />
        <Navbar />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Ana Sayfa</Link>
            <ChevronRight size={12} />
            <span className="text-slate-400">Tavan Nedir?</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <TrendingUp size={14} />
              <span>Borsa Rehberi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Tavan Nedir? Borsada Tavan Fiyat Nasıl Hesaplanır?
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Borsa İstanbul'daki günlük fiyat artış sınırı olan "tavan" mekanizmasını,
              halka arzlarda nasıl işlediğini ve nasıl hesaplandığını bu rehberde öğrenebilirsin.
            </p>
          </div>

          {/* Tanım */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Tavan Nedir?</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Tavan</strong>, Borsa İstanbul'da (BIST) bir hissenin
                gün içinde ulaşabileceği <strong className="text-white">maksimum fiyat artış sınırıdır</strong>.
                Bu sınır, önceki işlem gününün kapanış fiyatının <strong className="text-emerald-400">%10 üstüdür</strong>.
              </p>
              <p>
                Bir hisse bu sınıra ulaştığında ve piyasada satıcı çıkmadığında
                <strong className="text-white"> "tavan yapıyor"</strong> veya <strong className="text-white">"tavanda kaldı"</strong>
                denir. Bu durum, alıcıların var ancak satıcıların yok olduğu anlamına gelir — dolayısıyla
                hisse fiyatı artmaya devam edemez ama düşmez de.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">+%10</div>
                  <div className="text-white font-semibold text-sm mb-1">Tavan (Günlük Limit)</div>
                  <div className="text-slate-400 text-xs">Önceki kapanış × 1,10</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                  <div className="text-3xl font-bold text-red-400 mb-1">-%10</div>
                  <div className="text-white font-semibold text-sm mb-1">Taban (Günlük Limit)</div>
                  <div className="text-slate-400 text-xs">Önceki kapanış × 0,90</div>
                </div>
              </div>
              <p>
                Bu mekanizma, piyasada aşırı oynaklığı önlemek amacıyla BIST tarafından uygulanır.
                Normal hisselerde çok nadir görülse de <strong className="text-white">yeni halka açılan (IPO) hisseler</strong>
                sıklıkla birden fazla gün tavan yapar çünkü piyasa fiyat keşfi sürecindedir.
              </p>
            </div>
          </section>

          {/* Hesaplama */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Tavan Fiyatı Nasıl Hesaplanır?</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Her tavan, önceki günün kapanış fiyatının %10 fazlasıdır. Bileşik büyüme gibi
                çalışır — her gün bir öncekinin üzerine eklenir.
              </p>
              <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-5 font-mono text-sm">
                <p className="text-emerald-400 mb-2">// Formül</p>
                <p className="text-white">Tavan Fiyatı = Önceki Kapanış × 1,10</p>
                <p className="text-slate-500 mt-3">// n. Tavan İçin</p>
                <p className="text-white">n. Tavan = Arz Fiyatı × (1,10)ⁿ</p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-3">
                  <strong className="text-white">Örnek:</strong> Arz fiyatı 50 TL olan bir hisse için:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Tavan</th>
                        <th className="text-right py-2 px-3 text-slate-400 font-medium">Hisse Fiyatı</th>
                        <th className="text-right py-2 px-3 text-slate-400 font-medium">Toplam Getiri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TAVAN_ORNEGI.map((t) => (
                        <tr key={t.adim} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                          <td className="py-3 px-3 text-white font-semibold">{t.adim}. Tavan</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-medium">
                            {t.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                          </td>
                          <td className="py-3 px-3 text-right text-emerald-300 font-bold">+%{t.toplam.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Halka Arzda Tavan */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Halka Arzda Tavan Neden Önemli?</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Halka arz edilen bir hisse BIST'e kote olduğunda, piyasa bu hisse için
                bir <strong className="text-white">fiyat keşif süreci</strong> başlatır. Özellikle
                yoğun talep gören arzlarda arz fiyatı gerçek değerin altında kalmış olabilir.
                Piyasa bu farkı kapatırken hisse birden fazla gün tavan yapabilir.
              </p>
              <div className="space-y-3">
                {[
                  {
                    baslik: "Yatırımcı İçin Anlamı",
                    icerik: "Elinde hisse varsa değerin artmaya devam ettiği anlamına gelir. Tavan yapan hisse satılamaz çünkü satıcı çok az ya da hiç yoktur — bu aslında olumlu bir durumdur.",
                    renk: "border-emerald-500/20 bg-emerald-500/5",
                  },
                  {
                    baslik: "Kaç Gün Sürer?",
                    icerik: "Kesin bir kural yoktur. Piyasa koşulları, talep fazlası ve şirkete olan ilgiye bağlıdır. Geçmişte bazı arzlar 1–2 tavan yaparken bazıları 10+ tavan yapmıştır. Geçmiş performans için Geçmiş Tavan Performansı sayfamızı inceleyebilirsiniz.",
                    renk: "border-blue-500/20 bg-blue-500/5",
                  },
                  {
                    baslik: "Ne Zaman Satmalı?",
                    icerik: "Bu tamamen kişisel bir yatırım kararıdır. Bazı yatırımcılar tavan serisi bitmeden satarken, bazıları birkaç tavan sonra çıkar. Tavan simülatörü ile farklı senaryoların kârını hesaplayabilirsiniz.",
                    renk: "border-amber-500/20 bg-amber-500/5",
                  },
                ].map((b, i) => (
                  <div key={i} className={`border rounded-xl p-5 ${b.renk}`}>
                    <h3 className="text-white font-semibold text-sm mb-2">{b.baslik}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{b.icerik}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SSS */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Sık Sorulan Sorular</h2>
            <div className="space-y-3">
              {SSS.map((item, i) => (
                <details key={i} className="group bg-slate-800/40 border border-slate-700/40 rounded-xl">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-white font-medium text-sm select-none list-none">
                    <span className="flex items-center gap-2">
                      <HelpCircle size={15} className="text-emerald-400 flex-shrink-0" />
                      {item.soru}
                    </span>
                    <ChevronRight size={15} className="text-slate-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/40 pt-4">
                    {item.cevap}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Araçlar */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Link
              href="/araclar/tavan-simulatoru"
              className="group bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-6 transition-all"
            >
              <Calculator size={20} className="text-emerald-400 mb-3" />
              <h3 className="text-white font-bold text-base mb-2">Tavan Simülatörü</h3>
              <p className="text-slate-400 text-sm mb-4">
                Arz fiyatı ve lot sayısına göre her tavan günündeki kârını hesapla.
              </p>
              <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                Hesapla <ArrowRight size={14} />
              </span>
            </Link>
            <Link
              href="/araclar/tavan-performansi"
              className="group bg-slate-800/50 border border-slate-700/40 hover:border-slate-600 rounded-2xl p-6 transition-all"
            >
              <TrendingUp size={20} className="text-amber-400 mb-3" />
              <h3 className="text-white font-bold text-base mb-2">Geçmiş Tavan Performansı</h3>
              <p className="text-slate-400 text-sm mb-4">
                Daha önce halka arz olan hisselerin tavan gün sayısını gör.
              </p>
              <span className="flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                İncele <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
