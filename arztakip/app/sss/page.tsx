import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { HelpCircle, ChevronRight, ArrowRight, TrendingUp, Calculator, BookOpen } from "lucide-react";

const BASE_URL = "https://www.halkaarzlarim.com";
const PAGE_URL = `${BASE_URL}/sss`;

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular — Halka Arz SSS | 2026",
  description:
    "Halka arz nedir, nasıl katılınır, tavan ne demek, lot dağıtımı nasıl olur? Halka arz yatırımcılarının en çok sorduğu sorular ve cevapları.",
  keywords: [
    "halka arz sık sorulan sorular",
    "halka arz sss",
    "halka arz soru cevap",
    "ipo nedir sss",
    "halka arz nasıl yapılır soru",
    "tavan nedir soru",
    "halka arz lot soru",
    "borsa halka arz sorular",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Sık Sorulan Sorular — Halka Arz SSS | 2026",
    description:
      "Halka arz hakkında en çok sorulan sorular ve detaylı cevapları. IPO, tavan, lot dağıtımı ve daha fazlası.",
    url: PAGE_URL,
    type: "article",
    locale: "tr_TR",
    siteName: "HalkaArzlarım",
  },
};

const KATEGORILER = [
  {
    id: "genel",
    baslik: "Genel — IPO & Halka Arz",
    renk: "text-emerald-400",
    sorular: [
      {
        soru: "Halka arz nedir?",
        cevap: "Halka arz (IPO — Initial Public Offering), özel bir şirketin hisselerini ilk kez kamuya açık borsada satışa sunmasıdır. Şirket bu süreçte yeni sermaye toplar, yatırımcılar ise şirketin ortağı olma fırsatı bulur. Türkiye'de halka arzlar Borsa İstanbul (BIST) bünyesinde, SPK denetiminde gerçekleşir.",
        link: { href: "/ipo-nedir", text: "IPO Nedir? Tam Rehber →" },
      },
      {
        soru: "IPO ile halka arz aynı şey midir?",
        cevap: "Evet, tamamen aynı anlama gelir. 'IPO' İngilizce teknik bir kısaltma (Initial Public Offering), 'halka arz' ise Türkçe karşılığıdır. Her ikisi de bir şirketin hisselerini ilk kez borsada satışa sunmasını ifade eder.",
      },
      {
        soru: "Türkiye'de halka arzları kim denetler?",
        cevap: "Sermaye Piyasası Kurulu (SPK), Türkiye'de tüm halka arzları denetleyen ve onaylayan resmi devlet kurumudur. Bir şirket halka arz yapabilmek için SPK'ya izahname sunmak ve onay almak zorundadır. SPK'nın amacı yatırımcıları korumak ve piyasa şeffaflığını sağlamaktır.",
      },
      {
        soru: "Halka arz edilmiş hisse borsada ne zaman işlem görür?",
        cevap: "Talep toplama ve dağıtım sürecinin ardından hisse, SPK'nın onayladığı kotasyon tarihinde BIST'te işlem görmeye başlar. Bu tarih izahname ve SPK duyurularında belirtilir, genellikle talep bitiş tarihinden 3–7 iş günü sonrasına denk gelir.",
      },
      {
        soru: "Halka arzda şirket ve yatırımcı ne kazanır?",
        cevap: "Şirket tarafı: Büyüme sermayesi, kurumsal itibar ve likidite kazanır. Yatırımcı tarafı: Şirketin büyümesine ortak olma, tavan getirisi ve temettü potansiyeli kazanır. İki taraf için de faydası olan bir süreçtir.",
      },
    ],
  },
  {
    id: "basvuru",
    baslik: "Başvuru & Katılım",
    renk: "text-blue-400",
    sorular: [
      {
        soru: "Halka arza nasıl katılabilirim?",
        cevap: "Herhangi bir yetkili aracı kurumda (banka veya online platform) yatırım hesabı açman yeterlidir. Talep toplama döneminde bankanın internet bankacılığı veya mobil uygulamasından 'Halka Arz Başvurusu' bölümüne girip lot miktarını belirleyerek başvurursun.",
        link: { href: "/halka-arz-nasil-yapilir", text: "Adım adım rehber →" },
      },
      {
        soru: "Hangi bankadan başvurulur?",
        cevap: "Türkiye'deki büyük bankalar (Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, Ziraat Bankası, Halkbank, Denizbank, TEB) ve online aracı kurumlar (Midas, Işık Menkul vb.) halka arz başvurusu alır. Aynı anda birden fazla kurumdan başvuru yapılabilir.",
      },
      {
        soru: "Başvurmak için minimum ne kadar para gerekli?",
        cevap: "Minimum 1 lot × arz fiyatı kadar nakit gereklidir. Örneğin arz fiyatı 50 TL olan bir hisse için 1 lot almak istiyorsan 50 TL yeterlidir. Bu tutar talep süresince hesabında bloke edilir.",
      },
      {
        soru: "Birden fazla bankadan başvuru yapılabilir mi?",
        cevap: "Evet, birden fazla aracı kurumdan başvuru yapabilirsin. Her başvuru ayrı değerlendirilir. Bazı yatırımcılar bu stratejiyle daha fazla lot almayı hedefler. Ancak birden fazla hesapta nakit bloke olacağını göz önünde bulundur.",
      },
      {
        soru: "Talep toplama kaç gün sürer?",
        cevap: "Genellikle 3–7 iş günü arasındadır. Kesin tarihler şirketin izahnamesi ve SPK duyurularında belirtilir. HalkaArzlarım takviminden talep başlangıç ve bitiş tarihlerini anlık takip edebilirsin.",
      },
      {
        soru: "Başvuru iptal edilebilir mi?",
        cevap: "Evet, talep toplama süresi bitmeden önce aracı kurum uygulamasından başvuruyu iptal edebilirsin. İptal edildiğinde bloke tutar serbest bırakılır.",
      },
    ],
  },
  {
    id: "lot",
    baslik: "Lot & Dağıtım",
    renk: "text-violet-400",
    sorular: [
      {
        soru: "Lot nedir?",
        cevap: "Borsa İstanbul'da hisseler 'lot' birimi üzerinden işlem görür. Türkiye'de 1 lot = 1 hisse senedi ve nominal değeri 1 TL'dir. Halka arz başvurularında talep edilen birim lot'tur.",
      },
      {
        soru: "Lot dağıtımı nasıl yapılır?",
        cevap: "Bireysel yatırımcı havuzunda genellikle eşit dağıtım uygulanır: toplam lot / başvuran kişi sayısı formülüyle her başvurucuya eşit lot düşer. Yani ne kadar para yatırdığın değil kaç kişinin başvurduğu önemlidir.",
        link: { href: "/blog/lot-dagitimi-nasil-yapilir-kapsamli-rehber", text: "Kapsamlı rehber →" },
      },
      {
        soru: "Kaç lot alacağımı önceden bilebilir miyim?",
        cevap: "Tam olarak bilemezsin. Ancak talep toplama sona erdiğinde başvuran kişi sayısı açıklanır. Lot Dağıtım Hesaplayıcı aracıyla farklı katılımcı senaryoları için tahmin yapabilirsin.",
        link: { href: "/araclar/lot-hesaplama", text: "Lot Hesaplayıcı →" },
      },
      {
        soru: "Hiç lot alamazsam param ne olur?",
        cevap: "Dağıtım tamamlandıktan sonra almaya hak kazanmadığın kısım veya hiç lot alamadıysan bloke edilen tutarın tamamı 1–2 iş günü içinde hesabına iade edilir.",
      },
      {
        soru: "Bireysel ve kurumsal havuz nedir?",
        cevap: "Halka arz lotları bireysel ve kurumsal yatırımcı havuzlarına ayrılır. Bireysel yatırımcılar bireysel havuzdaki lotlara başvurur. Kurumsal havuz fon, sigorta gibi kurumsal yatırımcılara ayrılmıştır.",
      },
    ],
  },
  {
    id: "tavan",
    baslik: "Tavan & Getiri",
    renk: "text-amber-400",
    sorular: [
      {
        soru: "Tavan nedir?",
        cevap: "Tavan, Borsa İstanbul'da bir hissenin gün içinde ulaşabileceği maksimum fiyat artış sınırıdır. Bu limit önceki kapanışın %10 üstüdür. Hisse bu sınıra ulaştığında ve satıcı çıkmadığında 'tavan yapıyor' denir.",
        link: { href: "/tavan-nedir", text: "Tavan hakkında tam rehber →" },
      },
      {
        soru: "Halka arzda tavan neden önemli?",
        cevap: "Yeni halka açılan hisseler borsaya girdiğinde piyasa gerçek değerini keşfeder. Talep fazlası varsa hisse günlerce %10 tavan yaparak yükselir. Bu süreçten yatırımcılar kâr sağlar.",
      },
      {
        soru: "Halka arz kaç gün tavan yapar?",
        cevap: "Kesin bir sayı yoktur. Tarihsel verilere göre BIST'te ortalama 3–7 gün tavan yapılmaktadır. Düşük talep → 1–2 tavan, yüksek talep → 7–10+ tavan. Geçmiş arzların tavan gün sayısını Geçmiş Tavan Performansı sayfasında görebilirsin.",
        link: { href: "/araclar/tavan-performansi", text: "Geçmiş tavan verileri →" },
      },
      {
        soru: "Tavan getirisi nasıl hesaplanır?",
        cevap: "Her tavan, önceki kapanışın %10 fazlasıdır ve bileşik çalışır. Arz fiyatı 100 TL ise: 1. tavan 110 TL (%10), 3. tavan 133,1 TL (%33,1), 5. tavan 161,05 TL (%61,1), 10. tavan 259,37 TL (%159,4) değerine ulaşır.",
        link: { href: "/araclar/tavan-simulatoru", text: "Tavan Simülatörü →" },
      },
      {
        soru: "Ne zaman satmalıyım?",
        cevap: "Bu tamamen kişisel yatırım kararıdır. Bazıları ilk gün satarken bazıları birkaç tavan bekler. Tavan Simülatörü ile farklı senaryolardaki kârını hesaplayabilirsin. Yatırım tavsiyesi değildir.",
      },
      {
        soru: "5 tavan yapan hisse ne kadar kazandırır?",
        cevap: "5 tavan yapan hisse arz fiyatının %61,1 üstünde kapanır. 100 TL'den alınan 10 hisse 5 tavanda 1.610 TL değerinde olur; brüt kâr 610 TL'dir.",
      },
    ],
  },
  {
    id: "hesap",
    baslik: "Hesap & Teknik",
    renk: "text-rose-400",
    sorular: [
      {
        soru: "Halka arza katılmak için yaş sınırı var mı?",
        cevap: "Türkiye'de yatırım hesabı açmak için 18 yaşını doldurmuş olman gerekir. 18 yaşından küçükler vasi veya ebeveyn aracılığıyla bazı kurumlarda hesap açabilir.",
      },
      {
        soru: "Yabancı uyruklu biri halka arza katılabilir mi?",
        cevap: "Evet, Türkiye'de yatırım hesabı açmak için Türk vatandaşı olmak zorunlu değildir. Geçerli bir pasaport ve vergi numarası ile birçok banka hesap açmaktadır.",
      },
      {
        soru: "Halka arzda ne zaman para alınır/ödeme yapılır?",
        cevap: "Başvuru yaptığında talep tutarı hesabında bloke edilir — hesabından çıkmaz, kullanılamaz hale gelir. Dağıtım sonucunda ya lotlar hesabına aktarılır ya da bloke kaldırılır. Para kesin çıkış kotasyon günü olur.",
      },
      {
        soru: "Hangi vergi ödenir?",
        cevap: "Hisse satışından elde edilen kâr üzerinden %10 stopaj vergisi kesilir. Aracı kurum bu kesinti işlemini otomatik yapar. Net Kâr Hesaplayıcı ile stopaj dahil kazancını hesaplayabilirsin.",
        link: { href: "/araclar/kar-hesaplama", text: "Net Kâr Hesaplayıcı →" },
      },
      {
        soru: "HalkaArzlarım'ın verileri nereden geliyor?",
        cevap: "Arz bilgileri SPK'nın resmi web servislerinden (ws.spk.gov.tr) anlık olarak çekilmektedir. Piyasa istatistikleri de SPK verilerine dayalıdır. Haberler ise kamuya açık kaynaklardan derlenmektedir.",
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: KATEGORILER.flatMap((kat) =>
    kat.sorular.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    }))
  ),
};

export default function SSSPage() {
  const toplamSoru = KATEGORILER.reduce((t, k) => t + k.sorular.length, 0);

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
            <span className="text-slate-400">Sık Sorulan Sorular</span>
          </nav>

          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <HelpCircle size={14} />
              <span>SSS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Sık Sorulan Sorular
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Halka arz yatırımcılarının en çok sorduğu {toplamSoru} soru ve cevabı.
              Başvuru, lot dağıtımı, tavan hesaplama ve daha fazlası.
            </p>
          </div>

          {/* Kategori hızlı erişim */}
          <div className="flex flex-wrap gap-2 mb-10">
            {KATEGORILER.map((kat) => (
              <a
                key={kat.id}
                href={`#${kat.id}`}
                className="text-xs text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 px-3 py-1.5 rounded-full transition-all"
              >
                {kat.baslik.split("—")[0].trim()}
                <span className="text-slate-600 ml-1">({kat.sorular.length})</span>
              </a>
            ))}
          </div>

          {/* Kategoriler */}
          <div className="space-y-12">
            {KATEGORILER.map((kat) => (
              <section key={kat.id} id={kat.id}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`text-xs font-semibold uppercase tracking-widest ${kat.renk}`}>
                    {kat.baslik}
                  </div>
                  <div className="flex-1 h-px bg-slate-700/50" />
                </div>
                <div className="space-y-3">
                  {kat.sorular.map((item, i) => (
                    <details
                      key={i}
                      className="group bg-slate-800/40 border border-slate-700/40 rounded-xl"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-white font-medium text-sm select-none list-none">
                        <span className="flex items-center gap-2">
                          <HelpCircle size={15} className="text-emerald-400 flex-shrink-0" />
                          {item.soru}
                        </span>
                        <ChevronRight
                          size={15}
                          className="text-slate-500 group-open:rotate-90 transition-transform flex-shrink-0 ml-3"
                        />
                      </summary>
                      <div className="px-5 pb-4 border-t border-slate-700/40 pt-4">
                        <p className="text-slate-400 text-sm leading-relaxed">{item.cevap}</p>
                        {item.link && (
                          <Link
                            href={item.link.href}
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-medium mt-3 transition-colors"
                          >
                            {item.link.text}
                          </Link>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Rehber linkleri */}
          <div className="mt-14 border-t border-slate-800 pt-10">
            <h2 className="text-white font-bold text-lg mb-6">Detaylı Rehberler</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: BookOpen,
                  renk: "bg-emerald-500/15 text-emerald-400",
                  baslik: "IPO Nedir?",
                  alt: "Halka arz kavramı tam rehberi",
                  href: "/ipo-nedir",
                },
                {
                  icon: TrendingUp,
                  renk: "bg-blue-500/15 text-blue-400",
                  baslik: "Nasıl Katılınır?",
                  alt: "Adım adım başvuru rehberi",
                  href: "/halka-arz-nasil-yapilir",
                },
                {
                  icon: Calculator,
                  renk: "bg-amber-500/15 text-amber-400",
                  baslik: "Tavan Simülatörü",
                  alt: "Kaç tavan = ne kadar kâr?",
                  href: "/araclar/tavan-simulatoru",
                },
              ].map((k, i) => (
                <Link
                  key={i}
                  href={k.href}
                  className="group bg-slate-800/40 border border-slate-700/40 hover:border-emerald-500/30 rounded-2xl p-5 transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.renk}`}>
                    <k.icon size={17} />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{k.baslik}</h3>
                  <p className="text-slate-400 text-xs mb-3">{k.alt}</p>
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium group-hover:gap-2 transition-all">
                    Oku <ArrowRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sorun bulamadın */}
          <div className="mt-10 bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6 text-center">
            <HelpCircle size={24} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-1">Sorunun cevabını bulamadın mı?</p>
            <p className="text-slate-600 text-xs mb-4">İletişim sayfasından bize ulaşabilirsin.</p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 text-sm font-medium px-5 py-2 rounded-xl transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
