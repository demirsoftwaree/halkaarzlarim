export const revalidate = 0;

import Link from "next/link";
import { ArrowRight, Star, TrendingUp, BarChart3, DollarSign, Crown, Medal } from "lucide-react";
import Navbar from "@/components/Navbar";
import TickerBar from "@/components/TickerBar";
import Footer from "@/components/Footer";
import ArzCard from "@/components/ArzCard";
import WatchlistButton from "@/components/WatchlistButton";
import AdBanner from "@/components/AdBanner";
import { getArzlar } from "@/lib/arz-utils";
import { Agent, fetch as undiciFetch } from "undici";

const araclar = [
  { icon: TrendingUp,  baslik: "Tavan Simülatörü",          aciklama: "Kaç tavan giderse kaç ₺ kazanırsın?",          href: "/araclar/tavan-simulatoru",   renk: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: BarChart3,   baslik: "Lot Dağıtım Hesaplayıcı",   aciklama: "Kaç kişi başvurursa kaç lot düşer?",           href: "/araclar/lot-hesaplama",      renk: "text-blue-400",   bg: "bg-blue-500/10"    },
  { icon: DollarSign,  baslik: "Net Kâr Hesaplayıcı",       aciklama: "Komisyon dahil gerçek net kazancını hesapla.", href: "/araclar/kar-hesaplama",      renk: "text-amber-400",  bg: "bg-amber-500/10"   },
  { icon: Crown,       baslik: "Tavan Getiri Raporu",       aciklama: "10 günlük tavan senaryosu — PDF olarak indir.", href: "/araclar/tavan-raporu",       renk: "text-yellow-400", bg: "bg-yellow-500/10",  premium: true },
  { icon: Medal,       baslik: "Geçmiş Tavan Performansı",  aciklama: "Tamamlanan arzlarda kaç tavan yapıldı?",       href: "/araclar/tavan-performansi",  renk: "text-amber-400",  bg: "bg-amber-500/10",   premium: true },
];

const spkAgent = new Agent({ connect: { rejectUnauthorized: true } });


function formatDate(dateStr: string) {
  if (!dateStr) return "–";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

function daysLeft(dateStr: string) {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HalkaArzlarım",
  url: "https://www.halkaarzlarim.com",
  description: "Türkiye'nin halka arz takip platformu. Aktif arzlar, tavan simülatörü, lot hesaplama ve AI destekli yatırım asistanı.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.halkaarzlarim.com/halka-arzlar?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "HalkaArzlarım",
    url: "https://www.halkaarzlarim.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.halkaarzlarim.com/logo/halkaarzlarim-logo-full.svg",
    },
  },
};

export default async function AnaSayfa() {
  const { arzlar } = await getArzlar();

  const aktifArzlar    = arzlar.filter(a => a.durum === "aktif" || a.durum === "basvuru-surecinde");
  const yaklasanArzlar = arzlar.filter(a => a.durum === "yaklasan").slice(0, 5);
  const sonTamamlanan  = arzlar
    .filter(a => a.durum === "tamamlandi")
    .sort((a, b) => (b.borsadaIslemGormeTarihi || b.talepBitis || "").localeCompare(a.borsadaIslemGormeTarihi || a.talepBitis || ""))
    .slice(0, 5);
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <TickerBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top right, rgba(16,185,129,0.08), transparent 60%)" }} />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20" style={{ background: "rgba(16,185,129,0.1)" }}>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Şu an {aktifArzlar.length} aktif halka arz var
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Halka Arzı Takip Et,<br />
            <span className="text-emerald-400">Kazancını Hesapla.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Türkiye&apos;nin halka arz takvimi, tavan simülatörü ve lot hesaplama araçları — hepsi bir arada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/halka-arzlar" className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors flex items-center gap-2 justify-center">
              Takvimi Gör <ArrowRight size={18} />
            </Link>
            <Link href="#hesaplama-araclari" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Araçları Dene
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-16">

        {/* Aktif Arzlar */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Aktif Halka Arzlar</h2>
              <p className="text-slate-400 text-sm mt-1">Şu an talep toplayan arzlar</p>
            </div>
            <Link href="/halka-arzlar" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors">
              Tümünü gör <ArrowRight size={14} />
            </Link>
          </div>
          {aktifArzlar.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aktifArzlar.map(arz => <ArzCard key={arz.id} arz={arz} />)}
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-10 text-center">
              <p className="text-slate-400">Şu an aktif halka arz bulunmuyor.</p>
            </div>
          )}
        </section>

        {/* Yaklaşan Arzlar */}
        {yaklasanArzlar.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Yaklaşan Halka Arzlar</h2>
                <p className="text-slate-400 text-sm mt-1">Yakında başlayacak arzlar</p>
              </div>
            </div>
            <div className="space-y-3">
              {yaklasanArzlar.map(arz => {
                const days = daysLeft(arz.talepBaslangic);
                const ilkKurum = (arz.araciKurum || "").split(/[,·\-–]/)[0].trim();
                const fiyat = arz.arsFiyatiAlt > 0
                  ? arz.arsFiyatiAlt === arz.arsFiyatiUst
                    ? `${arz.arsFiyatiUst.toFixed(2)} ₺`
                    : `${arz.arsFiyatiAlt.toFixed(2)}–${arz.arsFiyatiUst.toFixed(2)} ₺`
                  : "Fiyat bekleniyor";
                return (
                  <Link key={arz.id} href={`/halka-arz/${arz.slug}`}>
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-blue-500/30 transition-all group">
                      {/* İkon */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0" style={{ background: "rgba(59,130,246,0.1)" }}>
                        {(arz.ticker || "??").slice(0, 2)}
                      </div>

                      {/* Orta: ticker + şirket adı + tarih */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-blue-400 text-sm shrink-0">{arz.ticker}</span>
                          <span className="text-white text-sm font-medium truncate">{arz.sirketAdi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="shrink-0">{formatDate(arz.talepBaslangic)} – {formatDate(arz.talepBitis)}</span>
                          {ilkKurum && (
                            <>
                              <span className="text-slate-700">·</span>
                              <span className="truncate">{ilkKurum}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Sağ: fiyat + gün */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-blue-400 font-bold text-sm">{days > 0 ? `${days} gün` : "Başladı"}</div>
                        <div className="text-slate-500 text-xs">{fiyat}</div>
                      </div>

                      <WatchlistButton slug={arz.slug} sirketAdi={arz.sirketAdi} ticker={arz.ticker} />
                      <ArrowRight size={15} className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Reklam — yaklaşan ile tamamlanan arasına */}
        <AdBanner slot="horizontal" className="my-2" />

        {/* Son Tamamlanan Arzlar */}
        {sonTamamlanan.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Son Halka Arzlar</h2>
                <p className="text-slate-400 text-sm mt-1">Son tamamlanan halka arzlar</p>
              </div>
              <Link href="/halka-arzlar" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors">
                Tümünü gör <ArrowRight size={14} />
              </Link>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
              {sonTamamlanan.map((arz, i) => (
                <Link key={arz.id} href={`/halka-arz/${arz.slug}`}>
                  <div className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-700/30 transition-all group ${i !== 0 ? "border-t border-slate-700/50" : ""}`}>
                    {/* Logo / Ticker */}
                    <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0">
                      {arz.ticker.slice(0, 2)}
                    </div>
                    {/* Bilgi */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{arz.ticker}</span>
                        <span className="text-slate-500 text-xs hidden sm:inline">—</span>
                        <span className="text-slate-300 text-xs truncate hidden sm:inline">{arz.sirketAdi}</span>
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5 sm:hidden truncate">{arz.sirketAdi}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {arz.borsadaIslemGormeTarihi ? `Borsa girişi: ${formatDate(arz.borsadaIslemGormeTarihi)}` : formatDate(arz.talepBitis)}
                        {arz.araciKurum && <span className="hidden sm:inline"> • {arz.araciKurum}</span>}
                      </div>
                    </div>
                    {/* Fiyat */}
                    <div className="text-right shrink-0">
                      <div className="text-white font-semibold text-sm">{arz.arsFiyatiAlt.toFixed(2)} ₺</div>
                      <div className="text-slate-500 text-xs">{arz.sektor}</div>
                    </div>
                    <ArrowRight size={15} className="text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Araçlar */}
        <section id="hesaplama-araclari">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Hesaplama Araçları</h2>
            <p className="text-slate-400 text-sm mt-1">Halka arz kararlarını veriye dayalı al</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {araclar.map(({ icon: Icon, baslik, aciklama, href, renk, bg, ...rest }) => (
              <Link key={href} href={href}>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 h-full hover:border-slate-600 transition-all group cursor-pointer relative">
                  {"premium" in rest && (
                    <span className="absolute top-3 right-3 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">PRO</span>
                  )}
                  <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={22} className={renk} />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">{baslik}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{aciklama}</p>
                  <span className={`text-xs font-medium ${renk} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    Hesapla <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Premium CTA */}
        <section className="border border-amber-500/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6" style={{ background: "linear-gradient(to right, rgba(245,158,11,0.1), rgba(245,158,11,0.05), transparent)" }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-amber-400" fill="currentColor" />
              <span className="text-amber-400 font-semibold text-sm">Premium</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-1">Halka Arzlarım özelliğini deneyin</h3>
            <p className="text-slate-400 text-sm">Başvurularını takip et, portföyünü yönet, bildirimler al.</p>
          </div>
          <Link href="/premium" className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors">
            Premium&apos;u Keşfet
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
