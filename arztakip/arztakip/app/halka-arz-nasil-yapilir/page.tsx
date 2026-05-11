import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import {
  CheckCircle2, ChevronRight, HelpCircle, ArrowRight,
  Building2, CreditCard, Smartphone, FileText, Clock, TrendingUp,
} from "lucide-react";

const BASE_URL = "https://www.halkaarzlarim.com";
const PAGE_URL = `${BASE_URL}/halka-arz-nasil-yapilir`;

export const metadata: Metadata = {
  title: "Halka Arza Nasıl Katılınır? Adım Adım Başvuru Rehberi | 2026",
  description:
    "Türkiye'de halka arza nasıl başvurulur? Hangi banka veya aracı kurumdan işlem yapılır, ne kadar para yatırılır, lot nasıl alınır? Adım adım 2026 rehberi.",
  keywords: [
    "halka arza nasıl katılınır",
    "halka arz başvurusu nasıl yapılır",
    "halka arz nasıl yapılır",
    "halka arz hangi bankadan",
    "halka arz başvuru",
    "halka arz aracı kurum",
    "halka arz lot alma",
    "halka arz 2026",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Halka Arza Nasıl Katılınır? Adım Adım Başvuru Rehberi | 2026",
    description:
      "Türkiye'de halka arza başvurmak için ihtiyacın olan her şey. Hangi banka, ne kadar para, nasıl başvurulur?",
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
      "@type": "HowTo",
      "@id": `${PAGE_URL}#howto`,
      name: "Türkiye'de Halka Arza Nasıl Katılınır?",
      description: "Bireysel yatırımcı olarak Türkiye'deki bir halka arza adım adım nasıl başvurursunuz.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Yatırım Hesabı Açın",
          text: "Bir banka veya aracı kurumda yatırım hesabı açın. Türkiye'deki büyük bankalar (Garanti, İş Bankası, Yapı Kredi vb.) ve aracı kurumlar halka arz başvurusu almanızı sağlar.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Talep Dönemini Takip Edin",
          text: "HalkaArzlarım takviminden aktif halka arzları ve talep toplama başlangıç/bitiş tarihlerini takip edin.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Hesabınıza Para Yatırın",
          text: "Başvurmak istediğiniz lot sayısı × arz fiyatı kadar nakit tutarı hesabınızda bulundurun. Bu tutar talep süresince bloke edilir.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Başvuru Yapın",
          text: "Bankanızın internet/mobil bankacılık uygulamasından 'Halka Arz Başvurusu' bölümüne gidin, hisse adedini girin ve onaylayın.",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Dağıtım Sonucunu Bekleyin",
          text: "Talep toplama sona erdikten sonra dağıtım sonuçları açıklanır. Aldığınız lotlar kotasyon günü hesabınıza aktarılır.",
        },
      ],
      url: PAGE_URL,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Halka arza hangi bankadan başvurulur?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Türkiye'deki tüm büyük bankalar ve aracı kurumlar halka arz başvurusu almanızı sağlar. Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, Halkbank, Ziraat Bankası ve online aracı kurumlar (Midas, Işık Menkul vb.) yaygın seçeneklerdir. Aynı anda birden fazla kurumdan başvuru yapılabilir.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arza başvurmak için minimum ne kadar para gerekli?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Minimum başvuru tutarı arz fiyatı × minimum lot adedidir. Örneğin fiyatı 50 TL olan bir arzda 1 lot için 50 TL yeterlidir. Talep toplama süresince bu tutar hesabınızda bloke tutulur.",
          },
        },
        {
          "@type": "Question",
          name: "Birden fazla bankadan başvuru yapılabilir mi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Evet, birden fazla aracı kurumdan başvuru yapabilirsiniz. Her başvuru ayrı ayrı değerlendirilir ve dağıtım toplamda yapılır. Bu strateji bazı yatırımcılar tarafından kullanılır ancak birden fazla hesapta nakit bloke olacağını göz önünde bulundurun.",
          },
        },
        {
          "@type": "Question",
          name: "Talep toplama kaç gün sürer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Türkiye'deki halka arz talep toplama süreleri genellikle 3 ila 7 iş günü arasındadır. Kesin tarihler izahname ve SPK duyurularında belirtilir.",
          },
        },
        {
          "@type": "Question",
          name: "Başvurudan sonra param ne zaman iade edilir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dağıtım sonuçları açıklandıktan sonra, talep ettiğinizden az lot aldıysanız veya hiç almadıysanız, bloke edilen tutar 1–2 iş günü içinde hesabınıza iade edilir.",
          },
        },
      ],
    },
  ],
};

const SSS = [
  {
    soru: "Halka arza hangi bankadan başvurulur?",
    cevap: "Türkiye'deki tüm büyük bankalar ve aracı kurumlar halka arz başvurusu almanızı sağlar. Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, Halkbank, Ziraat Bankası ve online aracı kurumlar (Midas, Işık Menkul vb.) yaygın seçeneklerdir. Aynı anda birden fazla kurumdan başvuru yapılabilir.",
  },
  {
    soru: "Halka arza başvurmak için minimum ne kadar para gerekli?",
    cevap: "Minimum başvuru tutarı arz fiyatı × minimum lot adedidir. Örneğin fiyatı 50 TL olan bir arzda 1 lot için 50 TL yeterlidir. Talep toplama süresince bu tutar hesabınızda bloke tutulur.",
  },
  {
    soru: "Birden fazla bankadan başvuru yapılabilir mi?",
    cevap: "Evet, birden fazla aracı kurumdan başvuru yapabilirsiniz. Her başvuru ayrı ayrı değerlendirilir. Ancak birden fazla hesapta nakit bloke olacağını göz önünde bulundurun.",
  },
  {
    soru: "Talep toplama kaç gün sürer?",
    cevap: "Türkiye'deki halka arz talep toplama süreleri genellikle 3 ila 7 iş günü arasındadır. Kesin tarihler izahname ve SPK duyurularında belirtilir.",
  },
  {
    soru: "Başvurudan sonra param ne zaman iade edilir?",
    cevap: "Dağıtım sonuçları açıklandıktan sonra bloke edilen tutar 1–2 iş günü içinde hesabınıza iade edilir.",
  },
  {
    soru: "Halka arzda kaç lot alacağımı önceden bilebilir miyim?",
    cevap: "Hayır, dağıtım tamamlanana kadar tam olarak bilinmez. Ancak başvuran kişi sayısı ve toplam havuz büyüklüğü belli olduğunda tahmini hesaplama yapılabilir. HalkaArzlarım'ın lot hesaplayıcı aracıyla simülasyon yapabilirsiniz.",
  },
];

export default function HalkaArzNasilYapilirPage() {
  const buYil = new Date().getFullYear();

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
            <span className="text-slate-400">Halka Arza Nasıl Katılınır?</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <FileText size={14} />
              <span>Başvuru Rehberi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Halka Arza Nasıl Katılınır?
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Türkiye'de bir halka arza bireysel yatırımcı olarak katılmak için ihtiyacın olan
              her şeyi bu rehberde bulabilirsin. Hesap açmaktan dağıtım sonucuna kadar adım adım.
            </p>
          </div>

          {/* Ön Koşullar */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Başlamadan Önce Neye İhtiyacın Var?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Building2,
                  renk: "bg-emerald-500/15 text-emerald-400",
                  baslik: "Yatırım Hesabı",
                  icerik: "Herhangi bir banka veya aracı kurumda açılmış yatırım hesabı. Çoğu bankada online başvuru birkaç dakika sürer.",
                },
                {
                  icon: CreditCard,
                  renk: "bg-blue-500/15 text-blue-400",
                  baslik: "Nakit Bakiye",
                  icerik: "Talep ettiğin lot sayısı × arz fiyatı kadar nakit. Talep süresince bu tutar bloke edilir.",
                },
                {
                  icon: Smartphone,
                  renk: "bg-violet-500/15 text-violet-400",
                  baslik: "Mobil/İnternet Bankacılık",
                  icerik: "Büyük çoğunluk bankaların uygulaması ya da internet bankacılığı üzerinden başvurur.",
                },
              ].map((k, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.renk}`}>
                    <k.icon size={17} />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{k.baslik}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{k.icerik}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Adım Adım */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Adım Adım Halka Arz Başvurusu</h2>
            <div className="space-y-4">
              {[
                {
                  adim: "1",
                  baslik: "Yatırım Hesabı Aç",
                  sure: "1 gün",
                  icerik: "Halka arza katılmak için bir banka ya da aracı kurumda yatırım/menkul kıymet hesabı açman gerekiyor. Türkiye'deki büyük bankalar (Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, Ziraat Bankası, Halkbank) ve online platformlar (Midas, Işık Menkul, İnfo Yatırım vb.) bu hizmeti sunar. Çoğunun mobil uygulamasından 5–10 dakikada hesap açabilirsin.",
                  detaylar: ["TC Kimlik numarası", "IBAN bilgisi", "Vergi numarası (isteğe bağlı)"],
                },
                {
                  adim: "2",
                  baslik: "Takvimi Takip Et",
                  sure: "Süregelen",
                  icerik: "HalkaArzlarım üzerinden yaklaşan arzları, talep başlangıç ve bitiş tarihlerini anlık takip edebilirsin. Talep süresi genellikle 3–7 iş günüdür. Süre dolmadan başvuru yapmak zorundasın.",
                  detaylar: ["Talep başlangıç tarihi", "Talep bitiş tarihi", "Arz fiyatı"],
                },
                {
                  adim: "3",
                  baslik: "Hesabına Para Yatır",
                  sure: "Anlık",
                  icerik: "Başvurmak istediğin lot sayısı × arz fiyatı kadar nakit hesabında olmalı. Örneğin 100 TL'lik bir arzda 50 lot almak istiyorsan 5.000 TL yeterlidir. Bu tutar talep süresince bloke edilir, başka işlemler için kullanılamaz.",
                  detaylar: ["Bloke tutar: lot × arz fiyatı", "Fazla para yatırılabilir", "Bloke gün sayısı: 5–10 gün"],
                },
                {
                  adim: "4",
                  baslik: "Başvur",
                  sure: "5 dakika",
                  icerik: "Bankanın internet/mobil bankacılık uygulamasına gir. 'Halka Arz Başvurusu', 'Yatırım' veya 'Menkul Kıymet' bölümünü bul. Aktif arzı seç, talep etmek istediğin lot miktarını gir ve onayla. Onay sonrası hesabında bloke işlemi görünür.",
                  detaylar: ["Birden fazla bankadan başvuru mümkün", "Her başvuru ayrı değerlendirilir", "Başvuruyu iptal edebilirsin"],
                },
                {
                  adim: "5",
                  baslik: "Dağıtım Sonucunu Bekle",
                  sure: "1–3 gün",
                  icerik: "Talep sona erdiğinde dağıtım hesaplaması yapılır. Türkiye'de bireysel yatırımcı havuzunda genellikle eşit dağıtım uygulanır — başvuran kişi sayısına bölünür. Talep fazlasıysa daha az lot alabilirsin. Sonuç banka uygulamasında veya Borsa İstanbul açıklamalarında duyurulur.",
                  detaylar: ["Eşit dağıtım = herkes eşit lot", "İade: 1–2 iş günü içinde", "Lotlar kotasyon günü hesaba gelir"],
                },
                {
                  adim: "6",
                  baslik: "Borsada İşlem",
                  sure: "Kotasyon günü",
                  icerik: "Lotların hesabına geçtikten sonra BIST'te ilk işlem günü gelir. Hisseyi satmak ya da tutmak senin kararın. Çoğu yatırımcı birkaç tavan yapmasını bekler. Tavan simülatörüyle ne zaman satarsan ne kazandığını hesaplayabilirsin.",
                  detaylar: ["Borsada ilk seans", "Tavan mekanizması devreye girer", "İstediğin zaman satış yapabilirsin"],
                },
              ].map((adim, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 text-sm font-bold">
                      {adim.adim}
                    </div>
                    {i < 5 && <div className="w-px flex-1 bg-slate-700/50 my-1" />}
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 flex-1 mb-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{adim.baslik}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <Clock size={11} />
                        {adim.sure}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{adim.icerik}</p>
                    <div className="flex flex-wrap gap-2">
                      {adim.detaylar.map((d, j) => (
                        <span key={j} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-700/40 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hangi Bankalar */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-2">Hangi Bankadan Başvurulur?</h2>
            <p className="text-slate-400 text-sm mb-6">
              Türkiye'deki büyük banka ve aracı kurumların tamamına yakını halka arz başvurusu alır.
              Aynı anda birden fazlasından başvuru yapılabilir.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { ad: "Garanti BBVA", tip: "Banka" },
                { ad: "İş Bankası", tip: "Banka" },
                { ad: "Yapı Kredi", tip: "Banka" },
                { ad: "Akbank", tip: "Banka" },
                { ad: "Ziraat Bankası", tip: "Kamu Bankası" },
                { ad: "Halkbank", tip: "Kamu Bankası" },
                { ad: "Denizbank", tip: "Banka" },
                { ad: "TEB", tip: "Banka" },
                { ad: "Midas", tip: "Online Platform" },
              ].map((b, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{b.ad}</span>
                  <span className="text-slate-500 text-xs">{b.tip}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 text-xs mt-3">
              * Liste temsili amaçlıdır. Her arzda aracılık eden kurumlar farklılaşabilir. İzahnameden kontrol edin.
            </p>
          </section>

          {/* İpuçları */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Pratik İpuçları</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  baslik: "Birden fazla kurum kullan",
                  icerik: "Aynı arzda birden fazla aracı kurumdan başvuru yapabilirsin. Bu strateji eşit dağıtım sisteminde daha fazla lot almana yardımcı olabilir.",
                  renk: "border-emerald-500/20 bg-emerald-500/5",
                },
                {
                  baslik: "Talep bitiş saatine dikkat",
                  icerik: "Bazı bankalar son gün saat 14:00 veya 16:00'da başvuruları kapatır. Son saate bırakmak yerine erken başvur.",
                  renk: "border-amber-500/20 bg-amber-500/5",
                },
                {
                  baslik: "Hesabında fazladan nakit tut",
                  icerik: "Bloke tutarın biraz üstünde nakit bulundurmak, olası ek işlemler veya hesap kesintileri için güvence sağlar.",
                  renk: "border-blue-500/20 bg-blue-500/5",
                },
                {
                  baslik: "İzahname'yi oku",
                  icerik: "Şirket ve arz hakkında detaylı bilgi için SPK'da yayınlanan izahnameyi incele. Mali tablolar ve risk faktörleri burada yer alır.",
                  renk: "border-violet-500/20 bg-violet-500/5",
                },
              ].map((ipucu, i) => (
                <div key={i} className={`border rounded-xl p-5 ${ipucu.renk}`}>
                  <h3 className="text-white font-semibold text-sm mb-2">{ipucu.baslik}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{ipucu.icerik}</p>
                </div>
              ))}
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

          {/* Araçlar */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Hesaplama Araçları</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: "/halka-arzlar", ikon: "📅", baslik: "Halka Arz Takvimi", alt: "Aktif ve yaklaşan arzları gör" },
                { href: "/araclar/tavan-simulatoru", ikon: "📈", baslik: "Tavan Simülatörü", alt: "Kaç tavan = ne kadar kâr?" },
                { href: "/araclar/lot-hesaplama", ikon: "🎯", baslik: "Lot Dağıtım Hesaplayıcı", alt: "Kaç lot düşer?" },
              ].map((a, i) => (
                <Link
                  key={i}
                  href={a.href}
                  className="group bg-slate-800/50 border border-slate-700/40 hover:border-emerald-500/40 rounded-2xl p-5 transition-all"
                >
                  <span className="text-2xl mb-3 block">{a.ikon}</span>
                  <h3 className="text-white font-semibold text-sm mb-1">{a.baslik}</h3>
                  <p className="text-slate-400 text-xs mb-3">{a.alt}</p>
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium group-hover:gap-2 transition-all">
                    Git <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <TrendingUp size={22} className="text-emerald-400 mx-auto mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">
              {buYil} Halka Arzlarını Takip Et
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Talep tarihlerini kaçırmamak için HalkaArzlarım takvimini kullan.
              Ücretsiz üyelikle bildirimler de alabilirsin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/halka-arzlar" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
                Aktif Arzlara Bak <ArrowRight size={15} />
              </Link>
              <Link href="/giris" className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
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
