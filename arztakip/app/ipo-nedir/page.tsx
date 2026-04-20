import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import {
  BookOpen, TrendingUp, Users, Building2, CheckCircle2, HelpCircle,
  ArrowRight, ChevronRight, BarChart2, Calculator,
} from "lucide-react";

const BASE_URL = "https://www.halkaarzlarim.com";
const PAGE_URL = `${BASE_URL}/ipo-nedir`;

export const metadata: Metadata = {
  title: "IPO Nedir? Halka Arz Ne Demek? | 2026 Tam Rehber",
  description:
    "IPO (Initial Public Offering) nedir, halka arz nasıl yapılır, yatırımcılar nasıl katılır? Türkiye'de halka arz süreci, tavan potansiyeli ve lot dağıtımı hakkında tam rehber.",
  keywords: [
    "ipo nedir",
    "halka arz nedir",
    "halka arz ne demek",
    "ipo türkiye",
    "halka arz nasıl yapılır",
    "halka arz yatırımı",
    "ipo başvurusu",
    "borsa halka arz",
    "halka arz lot",
    "halka arz tavan",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "IPO Nedir? Halka Arz Ne Demek? | 2026 Tam Rehber",
    description:
      "IPO nedir, nasıl çalışır ve Türkiye'deki halka arz sürecine nasıl katılırsınız? Yatırımcılar için kapsamlı rehber.",
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
      "@id": `${PAGE_URL}#article`,
      headline: "IPO Nedir? Halka Arz Ne Demek? 2026 Tam Rehber",
      description:
        "IPO (İlk Halka Arz) nedir, Türkiye'de halka arz nasıl işler ve yatırımcılar bu süreçten nasıl faydalanır?",
      url: PAGE_URL,
      datePublished: "2026-01-10",
      dateModified: "2026-04-20",
      author: { "@type": "Organization", name: "HalkaArzlarım", url: BASE_URL },
      publisher: {
        "@type": "Organization",
        name: "HalkaArzlarım",
        url: BASE_URL,
        logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.svg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "IPO Nedir?", item: PAGE_URL },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "IPO nedir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "IPO (Initial Public Offering), Türkçesi İlk Halka Arz, bir şirketin hisselerini ilk kez halka açık borsada satışa sunmasıdır. Şirket bu yolla sermaye toplar, yatırımcılar ise şirketin ortağı olur.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arz ile IPO arasındaki fark nedir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Aynı anlama gelir. 'IPO' İngilizce teknik terim (Initial Public Offering), 'halka arz' ise Türkçe karşılığıdır. İkisi de bir şirketin hisselerini ilk kez borsada satışa sunmasını ifade eder.",
          },
        },
        {
          "@type": "Question",
          name: "Türkiye'de halka arza nasıl katılabilirim?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Türkiye'de halka arza katılmak için yetkili bir aracı kurumda (banka veya aracı kurum) hesabınızın olması gerekir. Talep toplama döneminde online bankacılık ya da aracı kurum uygulamaları üzerinden başvurabilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arzda tavan ne demek?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Türk borsasında yeni halka açılan hisseler, borsa kotuna girdiği ilk seanslarda günlük fiyat artış sınırı (tavan) olan %10 hareketle kademeli olarak fiyat keşfeder. Yatırımcılar bu tavan hareketinden kâr sağlamayı hedefler.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arzda lot nedir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lot, borsada işlem gören en küçük pay birimidir. Türkiye'de 1 lot = 1 adet hisse anlamına gelir ve nominal değeri 1 TL'dir. Halka arz başvurularında talep edilen lot miktarı ve dağıtım eşit paylaştırma yöntemiyle yapılır.",
          },
        },
        {
          "@type": "Question",
          name: "SPK halka arz sürecinde ne rol oynar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SPK (Sermaye Piyasası Kurulu), Türkiye'de sermaye piyasalarını düzenleyen ve denetleyen resmi kurumdur. Bir şirketin halka arz yapabilmesi için SPK'dan onay alması zorunludur. SPK izahname inceleme, şeffaflık ve yatırımcı korumasını sağlar.",
          },
        },
      ],
    },
  ],
};

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
      <Link href="/" className="hover:text-slate-300 transition-colors">Ana Sayfa</Link>
      <ChevronRight size={12} />
      <span className="text-slate-400">IPO Nedir?</span>
    </nav>
  );
}

function BolumBaslik({ no, baslik, alt }: { no: string; baslik: string; alt?: string }) {
  return (
    <div className="mb-6">
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">{no}</p>
      <h2 className="text-2xl font-bold text-white mb-1">{baslik}</h2>
      {alt && <p className="text-slate-400 text-sm">{alt}</p>}
    </div>
  );
}

function BilgiBoks({ icon: Icon, renk, baslik, icerik }: {
  icon: React.ElementType; renk: string; baslik: string; icerik: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${renk}`}>
        <Icon size={17} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{baslik}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{icerik}</p>
    </div>
  );
}

const SSS = [
  {
    soru: "IPO nedir?",
    cevap:
      "IPO (Initial Public Offering), Türkçe adıyla İlk Halka Arz, özel bir şirketin hisselerini ilk kez halka açık borsada satışa sunma işlemidir. Şirket bu süreçte yeni sermaye toplarken yatırımcılar da şirketin ortağı olma fırsatı bulur.",
  },
  {
    soru: "Halka arz ile IPO aynı şey midir?",
    cevap:
      "Evet, aynı anlama gelir. 'IPO' İngilizce teknik bir kısaltmadır (Initial Public Offering). 'Halka arz' ise Türk finans literatüründe kullanılan Türkçe karşılığıdır. Her ikisi de bir şirketin hisselerini ilk kez borsada satışa sunmasını ifade eder.",
  },
  {
    soru: "Türkiye'de halka arza nasıl katılabilirim?",
    cevap:
      "Herhangi bir yetkili aracı kurumda (banka ya da aracı kurum) yatırım hesabı açmanız yeterlidir. Talep toplama dönemi boyunca online bankacılık veya aracı kurum uygulaması üzerinden başvurabilirsiniz. Başvurunuz için yeterli bakiyenin hesabınızda bulunması gerekir.",
  },
  {
    soru: "Halka arzda lot garantisi var mı?",
    cevap:
      "Yüksek talep durumunda tüm başvuranlara eşit dağıtım yapılır; bu nedenle talep ettiğinizden daha az lot alabilirsiniz. Talep sayısı sınırlıysa talep ettiğiniz lotun tamamını alabilirsiniz. Dağıtım sonuçları talep döneminin bitiminden sonra açıklanır.",
  },
  {
    soru: "Tavan neden önemli?",
    cevap:
      "BIST'te yeni kotasyon sonrası hisseler, piyasa tarafından gerçek değeri keşfedilene kadar günlük yüzde %10 tavan hareketi yapabilir. Talep gören arzlarda bu tavan hareketi arka arkaya birkaç seans sürerek yüksek getiri sağlayabilir.",
  },
  {
    soru: "SPK halka arzda ne işe yarar?",
    cevap:
      "Sermaye Piyasası Kurulu (SPK), halka arzları onaylayan ve denetleyen resmi devlet kurumudur. Şirket, halka arz öncesinde detaylı bir izahname hazırlar ve SPK onayı alır. Bu süreç yatırımcı korumasını sağlar, şeffaflık ve doğruluk zorunlu tutulur.",
  },
];

export default function IpoNedirPage() {
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
          <Breadcrumb />

          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <BookOpen size={14} />
              <span>Halka Arz Rehberi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              IPO Nedir? Halka Arz Ne Demek?
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              IPO (Initial Public Offering), bir şirketin hisselerini ilk kez halka açık borsada
              satışa sunma işlemidir. Türkiye'deki halka arz sürecini, yatırımcı olarak nasıl
              katılabileceğinizi ve dikkat etmeniz gerekenleri bu rehberde bulabilirsiniz.
            </p>

            {/* İçindekiler */}
            <div className="mt-8 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
              <p className="text-slate-300 text-sm font-semibold mb-3">İçindekiler</p>
              <ol className="space-y-2 text-sm text-slate-400">
                {[
                  "IPO ve Halka Arz Kavramı",
                  "Neden Şirketler Halka Açılır?",
                  "Türkiye'de Halka Arz Süreci",
                  "Yatırımcı Olarak Nasıl Katılırsınız?",
                  "Lot, Tavan ve Dağıtım Hesaplamaları",
                  "Riskler ve Dikkat Edilmesi Gerekenler",
                  "Sık Sorulan Sorular",
                ].map((b, i) => (
                  <li key={i} className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="text-emerald-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    {b}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Bölüm 1: IPO Kavramı */}
          <section className="mb-14">
            <BolumBaslik no="Bölüm 01" baslik="IPO ve Halka Arz Kavramı" />
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">IPO</strong> (Initial Public Offering), Türkçe'de
                <strong className="text-white"> İlk Halka Arz</strong> olarak adlandırılır. Bir
                şirket, özel ortaklık yapısından çıkarak hisselerini borsaya kote ettiğinde ve
                bu hisseleri ilk kez kamuya satışa sunduğunda bu işleme IPO ya da halka arz
                denir.
              </p>
              <p>
                Türkiye'de halka arzlar Borsa İstanbul (BIST) bünyesinde gerçekleşir ve
                Sermaye Piyasası Kurulu (SPK) tarafından denetlenir. Şirket, SPK'ya izahname
                sunarak onay almak zorundadır.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 my-6">
                <BilgiBoks
                  icon={Building2}
                  renk="bg-emerald-500/15 text-emerald-400"
                  baslik="Şirket Tarafı"
                  icerik="Şirket halka arz yoluyla yeni sermaye toplar. Bu sermaye büyüme, borç ödemesi veya yatırım için kullanılır."
                />
                <BilgiBoks
                  icon={Users}
                  renk="bg-blue-500/15 text-blue-400"
                  baslik="Yatırımcı Tarafı"
                  icerik="Yatırımcılar, şirketin büyümesine ortak olmak için hisse satın alır. Kâr payı ve fiyat artışından faydalanabilirler."
                />
                <BilgiBoks
                  icon={BarChart2}
                  renk="bg-violet-500/15 text-violet-400"
                  baslik="Borsa Tarafı"
                  icerik="BIST ve SPK, işlemlerin şeffaf, adil ve mevzuata uygun gerçekleşmesini denetler."
                />
              </div>
            </div>
          </section>

          {/* Bölüm 2: Neden Halka Açılır */}
          <section className="mb-14">
            <BolumBaslik
              no="Bölüm 02"
              baslik="Neden Şirketler Halka Açılır?"
              alt="Bir şirketin borsa yolculuğuna başlamasının ardındaki temel sebepler"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  baslik: "Sermaye Artırımı",
                  icerik: "Halka arz, şirketin yeni hisseler satarak büyük çaplı sermaye toplamasını sağlar. Bu sermaye fabrika, teknoloji veya pazar genişlemesi için kullanılır.",
                },
                {
                  baslik: "Ortakların Nakit Çıkışı",
                  icerik: "Mevcut ortaklar, sahip oldukları hisseleri borsada satarak yatırımlarından çıkış yapabilir. Bu sayede şirketi terk etmeden likidite sağlanır.",
                },
                {
                  baslik: "Kurumsal İtibar",
                  icerik: "Halka açık olmak şirkete güvenilirlik ve görünürlük kazandırır. Banka kredisi, tedarikçi ilişkileri ve müşteri güveni artar.",
                },
                {
                  baslik: "Çalışan Teşvikleri",
                  icerik: "Hisse senedi opsiyonu (ESOP) sunmak, nitelikli çalışanları şirkete bağlamak ve motive etmek için güçlü bir araçtır.",
                },
              ].map((kart, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <h3 className="text-white font-semibold text-sm">{kart.baslik}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{kart.icerik}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bölüm 3: Türkiye'de Süreç */}
          <section className="mb-14">
            <BolumBaslik
              no="Bölüm 03"
              baslik="Türkiye'de Halka Arz Süreci"
              alt="Bir şirketin BIST'e kotasyon için izlediği aşamalar"
            />
            <div className="space-y-3">
              {[
                {
                  adim: "1",
                  baslik: "İzahname Hazırlığı",
                  icerik: "Şirket, mali tabloları, risk faktörleri ve iş modeli hakkında detaylı bir izahname hazırlar. Bağımsız denetim zorunludur.",
                },
                {
                  adim: "2",
                  baslik: "SPK Başvurusu ve Onayı",
                  icerik: "İzahname SPK'ya sunulur. Kurul inceleme yaparak onay verir ya da ek bilgi/düzeltme talep eder. Bu süreç genellikle birkaç ay sürer.",
                },
                {
                  adim: "3",
                  baslik: "Fiyat Belirleme (Book Building)",
                  icerik: "Aracı kurum koordinasyonuyla kurumsal yatırımcılardan talep toplanır ve hisse fiyat aralığı belirlenir.",
                },
                {
                  adim: "4",
                  baslik: "Bireysel Talep Toplama",
                  icerik: "Bireysel yatırımcılar, aracı kurumları üzerinden belirlenen süre içinde hisse talep eder. Talep toplama genellikle 3–5 iş günü sürer.",
                },
                {
                  adim: "5",
                  baslik: "Dağıtım ve Kotasyon",
                  icerik: "Talepler orantılı şekilde karşılanır. Hisseler yatırımcı hesaplarına aktarılır ve belirlenen tarihte BIST'te işlem görmeye başlar.",
                },
              ].map((adim, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {adim.adim}
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">{adim.baslik}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{adim.icerik}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bölüm 4: Yatırımcı Katılımı */}
          <section className="mb-14">
            <BolumBaslik
              no="Bölüm 04"
              baslik="Yatırımcı Olarak Nasıl Katılırsınız?"
              alt="Halka arza başvurmak için gereken adımlar"
            />
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Türkiye'de bir bireysel yatırımcı olarak halka arza katılmak oldukça
                kolaydır. Tek ihtiyacınız <strong className="text-white">yetkili bir aracı
                kurumda yatırım hesabı</strong> açmaktır.
              </p>
              <div className="bg-slate-800/40 border border-emerald-500/20 rounded-2xl p-5">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
                  Adım Adım Başvuru
                </p>
                <ol className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold flex-shrink-0">1.</span>
                    Banka veya aracı kurumda yatırım hesabı açın (online/şubeden)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold flex-shrink-0">2.</span>
                    Talep toplama dönemini HalkaArzlarım takviminden takip edin
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold flex-shrink-0">3.</span>
                    Hesabınıza talep tutarı kadar nakit yatırın
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold flex-shrink-0">4.</span>
                    Uygulama veya internet bankacılığından hisse talebinde bulunun
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold flex-shrink-0">5.</span>
                    Dağıtım sonucunu bekleyin — lotlar kotasyon günü öncesi hesabınıza gelir
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Lot, Tavan, Hesaplamalar */}
          <section className="mb-14">
            <BolumBaslik
              no="Bölüm 05"
              baslik="Lot, Tavan ve Dağıtım Hesaplamaları"
              alt="Getiri potansiyelini anlamak için bilmeniz gerekenler"
            />
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Lot:</strong> Türkiye'de 1 lot = 1 adet hisse =
                1 TL nominal değer. Halka arz başvurularında minimum lot 1, yüksek talep
                olan arzlarda dağıtım eşit paylaştırma yöntemiyle yapılır.
              </p>
              <p>
                <strong className="text-white">Tavan:</strong> BIST'te yeni kotasyon sonrası
                hisseler, birinci seanstan itibaren günlük maksimum %10 artış bandıyla işlem
                görür. Yüksek talep gören arzlarda arka arkaya birden fazla tavan yapılabilir.
                Örneğin 5 tavan yapan bir hisse halka arz fiyatının ~%61'i üzerinde kapanır.
              </p>
              <p>
                <strong className="text-white">Eşit Dağıtım:</strong> Talep, arzlanan lottan
                fazla olursa tüm başvuranlara eşit sayıda lot dağıtılır. Bu nedenle binlerce
                kişi başvursa bile herkes eşit lot alır.
              </p>
            </div>

            {/* Araç linkleri */}
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <Link
                href="/araclar/tavan-simulatoru"
                className="group bg-slate-800/50 border border-slate-700/40 hover:border-emerald-500/40 rounded-2xl p-5 transition-all"
              >
                <TrendingUp size={18} className="text-emerald-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">Tavan Simülatörü</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  Kaç tavan yapıldığında ne kadar kâr edersiniz?
                </p>
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium group-hover:gap-2 transition-all">
                  Hesapla <ArrowRight size={12} />
                </span>
              </Link>
              <Link
                href="/araclar/lot-hesaplama"
                className="group bg-slate-800/50 border border-slate-700/40 hover:border-blue-500/40 rounded-2xl p-5 transition-all"
              >
                <Calculator size={18} className="text-blue-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">Lot Dağıtım Hesaplayıcı</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  Kaç kişi başvursa kaç lot düşer?
                </p>
                <span className="flex items-center gap-1 text-blue-400 text-xs font-medium group-hover:gap-2 transition-all">
                  Hesapla <ArrowRight size={12} />
                </span>
              </Link>
              <Link
                href="/araclar/kar-hesaplama"
                className="group bg-slate-800/50 border border-slate-700/40 hover:border-violet-500/40 rounded-2xl p-5 transition-all"
              >
                <BarChart2 size={18} className="text-violet-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">Net Kâr Hesaplayıcı</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  Komisyon sonrası net kazancınızı hesaplayın.
                </p>
                <span className="flex items-center gap-1 text-violet-400 text-xs font-medium group-hover:gap-2 transition-all">
                  Hesapla <ArrowRight size={12} />
                </span>
              </Link>
            </div>
          </section>

          {/* Bölüm 6: Riskler */}
          <section className="mb-14">
            <BolumBaslik
              no="Bölüm 06"
              baslik="Riskler ve Dikkat Edilmesi Gerekenler"
              alt="Her yatırım gibi halka arzların da riskleri vardır"
            />
            <div className="space-y-3">
              {[
                {
                  baslik: "Fiyat Düşme Riski",
                  icerik:
                    "Tüm halka arzlar tavan yapmaz. Şirkete olan talebin düşük olması veya piyasa koşullarının bozulması halinde hisse, arz fiyatının altına gelebilir.",
                },
                {
                  baslik: "Lot Alamama Durumu",
                  icerik:
                    "Yüksek talep görülen arzlarda başvurunuz reddedilebilir ya da talep ettiğinizden çok daha az lot alabilirsiniz. Paranız bloke kaldıktan sonra geri iade edilir.",
                },
                {
                  baslik: "Kilitli Likidite",
                  icerik:
                    "Talep döneminde hesabınızdaki para bloke edilir. Dağıtım tamamlanana kadar bu parayı başka yatırımlar için kullanamazsınız.",
                },
                {
                  baslik: "Şirket Bilgisi Asimetrisi",
                  icerik:
                    "Şirket içeriden daha fazla bilgiye sahiptir. İzahname dikkatle okunmalı; yüksek borç, düşük kârlılık veya belirsiz büyüme planı olan şirketlere dikkat edilmelidir.",
                },
              ].map((risk, i) => (
                <div
                  key={i}
                  className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                  </div>
                  <div>
                    <h3 className="text-amber-300 font-semibold text-sm mb-1">{risk.baslik}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{risk.icerik}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bölüm 7: SSS */}
          <section className="mb-14">
            <BolumBaslik
              no="Bölüm 07"
              baslik="Sık Sorulan Sorular"
              alt="IPO ve halka arz hakkında en çok merak edilenler"
            />
            <div className="space-y-3">
              {SSS.map((item, i) => (
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
                      className="text-slate-500 group-open:rotate-90 transition-transform flex-shrink-0"
                    />
                  </summary>
                  <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/40 pt-4">
                    {item.cevap}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={22} className="text-emerald-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">
              Güncel Halka Arzları Takip Et
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Aktif ve yaklaşan halka arzları, talep tarihlerini ve tavan simülatörünü
              ücretsiz kullanmak için hemen başla.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/halka-arzlar"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Aktif Halka Arzları Gör <ArrowRight size={15} />
              </Link>
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Ücretsiz Üye Ol
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
