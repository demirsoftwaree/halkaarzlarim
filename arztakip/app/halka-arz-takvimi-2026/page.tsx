import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { adminDb } from "@/lib/firebase-admin";
import { ArrowRight, Calendar, ChevronRight, HelpCircle, TrendingUp } from "lucide-react";
import type { Arz } from "@/lib/types";

export const revalidate = 3600;

const BASE_URL = "https://www.halkaarzlarim.com";
const PAGE_URL = `${BASE_URL}/halka-arz-takvimi-2026`;

export const metadata: Metadata = {
  title: "2026 Halka Arz Takvimi — Yaklaşan ve Aktif Halka Arzlar",
  description:
    "2026 yılı Türkiye halka arz takvimi. Yaklaşan IPO'lar, talep tarihleri, arz fiyatları ve şirket bilgileri. BIST'e kote olacak şirketleri kaçırma.",
  keywords: [
    "2026 halka arz takvimi",
    "halka arz takvimi 2026",
    "yaklaşan halka arzlar 2026",
    "2026 ipo türkiye",
    "bist halka arz takvimi",
    "halka arz ne zaman",
    "yeni halka arzlar",
    "2026 ipo takvimi",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "2026 Halka Arz Takvimi — Yaklaşan ve Aktif Halka Arzlar",
    description: "2026 Türkiye halka arz takvimi. Tüm IPO'lar, tarihler ve fiyatlar.",
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
      headline: "2026 Halka Arz Takvimi — Türkiye'deki Yaklaşan IPO'lar",
      description: "2026 yılı Türkiye halka arz takvimine göre yaklaşan ve aktif arzlar, talep tarihleri ve arz fiyatları.",
      url: PAGE_URL,
      datePublished: "2026-01-01",
      dateModified: "2026-04-20",
      author: { "@type": "Organization", name: "HalkaArzlarım", url: BASE_URL },
      publisher: { "@type": "Organization", name: "HalkaArzlarım", url: BASE_URL },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "2026 yılında kaç şirket halka arz oldu?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SPK verilerine göre 2026 yılında Borsa İstanbul'a kote olan şirket sayısı önceki yıllara kıyasla artış göstermiştir. Güncel sayıyı ve tüm şirket listesini HalkaArzlarım takip sayfasında bulabilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arz takvimini nereden takip edebilirim?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HalkaArzlarım platformu üzerinden tüm aktif ve yaklaşan halka arzları, talep başlangıç ve bitiş tarihlerini, arz fiyatlarını ve aracı kurum bilgilerini anlık takip edebilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Halka arz tarihleri nasıl öğrenilir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Talep toplama tarihleri SPK duyuruları ve izahnamelerinde açıklanır. HalkaArzlarım bu verileri otomatik olarak günceller ve size bildirim gönderir.",
          },
        },
      ],
    },
  ],
};

async function getYaklasanArzlar(): Promise<Arz[]> {
  try {
    const snap = await adminDb
      .collection("yaklasan-arzlar")
      .where("durum", "in", ["yaklasan", "aktif", "basvuru-surecinde"])
      .limit(8)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Arz));
  } catch {
    return [];
  }
}

const SSS = [
  {
    soru: "2026 yılında kaç şirket halka arz oldu?",
    cevap: "SPK verilerine göre 2025'te 44 şirket halka arz olmuştur. 2026 için güncel rakamlar artmaktadır. Tüm listeye HalkaArzlarım üzerinden ulaşabilirsiniz.",
  },
  {
    soru: "Halka arz takvimini nereden takip edebilirim?",
    cevap: "HalkaArzlarım platformu üzerinden tüm aktif ve yaklaşan arzları, talep tarihlerini, arz fiyatlarını ve aracı kurum bilgilerini anlık takip edebilirsiniz. Ücretsiz üye olarak bildirim de alabilirsiniz.",
  },
  {
    soru: "Halka arz tarihleri nasıl öğrenilir?",
    cevap: "Talep toplama tarihleri SPK duyuruları ve şirketin izahnamesiyle açıklanır. HalkaArzlarım bu verileri otomatik günceller ve opsiyonel bildirim gönderir.",
  },
  {
    soru: "Halka arz ne zaman açıklanır?",
    cevap: "SPK izahname onayından sonra şirket kamuoyunu bildirir. Onay ile talep başlangıcı arasında genellikle 1–3 hafta olur. Açıklamalar KAP (Kamuyu Aydınlatma Platformu) üzerinden yayınlanır.",
  },
  {
    soru: "2026'nın en beklenen halka arzları hangileri?",
    cevap: "Teknoloji, enerji ve gayrimenkul sektörlerindeki şirketler 2026'da öne çıkıyor. Güncel ve yaklaşan arzların tam listesi için HalkaArzlarım takip sayfasını kullanabilirsiniz.",
  },
];

export default async function HalkaArzTakvimi2026Page() {
  const arzlar = await getYaklasanArzlar();

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
            <Link href="/halka-arzlar" className="hover:text-slate-300 transition-colors">Halka Arzlar</Link>
            <ChevronRight size={12} />
            <span className="text-slate-400">2026 Takvimi</span>
          </nav>

          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Calendar size={14} />
              <span>Halka Arz Takvimi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              2026 Halka Arz Takvimi
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Türkiye'de 2026 yılında Borsa İstanbul'a kote olmayı planlayan veya halihazırda
              kote olan şirketlerin tam listesi. Talep tarihleri, arz fiyatları ve güncel
              bilgiler anlık olarak güncellenmektedir.
            </p>
          </div>

          {/* İstatistik kutuları */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "2025 IPO Sayısı", deger: "44", alt: "Borsaya giren şirket" },
              { label: "2024 IPO Sayısı", deger: "53", alt: "Rekor yıl" },
              { label: "2023 IPO Sayısı", deger: "44", alt: "Güçlü yıl" },
            ].map((k, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{k.deger}</div>
                <div className="text-white text-xs font-medium mb-0.5">{k.label}</div>
                <div className="text-slate-500 text-xs">{k.alt}</div>
              </div>
            ))}
          </div>

          {/* Canlı Liste */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Yaklaşan ve Aktif Arzlar</h2>
              <Link
                href="/halka-arzlar"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Tümünü Gör <ArrowRight size={14} />
              </Link>
            </div>

            {arzlar.length > 0 ? (
              <div className="space-y-3">
                {arzlar.map((arz) => (
                  <Link
                    key={arz.id}
                    href={`/halka-arz/${arz.slug}`}
                    className="group flex items-center justify-between bg-slate-800/40 border border-slate-700/40 hover:border-emerald-500/30 rounded-xl px-5 py-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{arz.sirketAdi}</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {arz.ticker && <span className="text-emerald-400 mr-2">{arz.ticker}</span>}
                          {arz.sektor}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {arz.arsFiyatiAlt > 0 && (
                        <div className="text-right hidden sm:block">
                          <div className="text-white text-sm font-medium">
                            {arz.arsFiyatiAlt.toLocaleString("tr-TR")} ₺
                          </div>
                          <div className="text-slate-500 text-xs">Arz Fiyatı</div>
                        </div>
                      )}
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        arz.durum === "aktif" ? "bg-emerald-500/20 text-emerald-400" :
                        arz.durum === "yaklasan" ? "bg-amber-500/20 text-amber-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {arz.durum === "aktif" ? "Aktif" : arz.durum === "yaklasan" ? "Yaklaşan" : "Başvuru"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-8 text-center">
                <Calendar size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Aktif talep dönemi bulunmuyor</p>
                <p className="text-slate-600 text-sm mt-1">Yeni arzlar açıklandığında burada görünecek</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <Link
                href="/halka-arzlar"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Tüm Takvimi Görüntüle <ArrowRight size={15} />
              </Link>
            </div>
          </section>

          {/* Bilgi bölümü */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">2026'da Halka Arz Piyasası</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Türkiye sermaye piyasaları 2024 yılında rekor kırdı: 53 şirket Borsa İstanbul'a
                kote oldu. 2025'te 44 şirketle devam eden ivme, 2026'da da güçlü seyretmektedir.
                Özellikle <strong className="text-white">teknoloji, enerji, gayrimenkul ve sağlık</strong>
                sektörlerindeki şirketler halka arz için hazırlık yapmaktadır.
              </p>
              <p>
                SPK (Sermaye Piyasası Kurulu) verilerine göre halka arz başvuruları
                yılın ilk çeyreğinden itibaren yoğunlaşmakta, genellikle Mart–Haziran
                ve Eylül–Kasım dönemleri en yoğun talep süreçlerini barındırmaktadır.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    baslik: "Takip Bildirimleri",
                    icerik: "Ücretsiz üye olarak yeni arz açıklandığında e-posta bildirimi al. Talep tarihini kaçırma.",
                    href: "/giris",
                    link: "Üye Ol",
                    renk: "border-emerald-500/20 bg-emerald-500/5",
                  },
                  {
                    baslik: "SPK İstatistikleri",
                    icerik: "2022–2026 yıllık halka arz sayıları, piyasa değerleri ve yatırımcı istatistikleri.",
                    href: "/istatistikler",
                    link: "İstatistiklere Git",
                    renk: "border-blue-500/20 bg-blue-500/5",
                  },
                ].map((k, i) => (
                  <div key={i} className={`border rounded-2xl p-5 ${k.renk}`}>
                    <h3 className="text-white font-semibold text-sm mb-2">{k.baslik}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{k.icerik}</p>
                    <Link href={k.href} className="flex items-center gap-1 text-emerald-400 text-sm font-medium hover:gap-2 transition-all">
                      {k.link} <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SSS */}
          <section className="mb-10">
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
        </main>

        <Footer />
      </div>
    </>
  );
}
