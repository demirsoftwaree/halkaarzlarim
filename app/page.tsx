export const revalidate = 0;
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, TrendingUp, BarChart3, DollarSign, Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import TickerBar from "@/components/TickerBar";
import Footer from "@/components/Footer";
import ArzCard from "@/components/ArzCard";
import WatchlistButton from "@/components/WatchlistButton";
import AdBanner from "@/components/AdBanner";
import HeroChart from "@/components/HeroChart";
import Reveal from "@/components/Reveal";
import { getArzlar } from "@/lib/arz-utils";
import { Agent, fetch as undiciFetch } from "undici";

const araclar = [
  { icon: TrendingUp,  baslik: "Tavan Simülatörü",          aciklama: "Kaç tavan giderse kaç ₺ kazanırsın?",          href: "/araclar/tavan-simulatoru",   renk: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: BarChart3,   baslik: "Lot Dağıtım Hesaplayıcı",   aciklama: "Kaç kişi başvurursa kaç lot düşer?",           href: "/araclar/lot-hesaplama",      renk: "text-blue-400",   bg: "bg-blue-500/10"    },
  { icon: DollarSign,  baslik: "Net Kâr Hesaplayıcı",       aciklama: "Komisyon dahil gerçek net kazancını hesapla.", href: "/araclar/kar-hesaplama",      renk: "text-amber-400",  bg: "bg-amber-500/10"   },
  { icon: Crown,       baslik: "Tavan Getiri Raporu",       aciklama: "10 günlük tavan senaryosu — PDF olarak indir.", href: "/araclar/tavan-raporu",       renk: "text-yellow-400", bg: "bg-yellow-500/10" },
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
      <section className="border-b border-slate-800/60 py-16 lg:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 25% 0%, rgba(16,185,129,0.09), transparent 60%), radial-gradient(ellipse 40% 45% at 90% 90%, rgba(56,189,248,0.05), transparent 60%)" }} />
        <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Sol: metin */}
          <div>
            <div className="anim-fade-up anim-d-1 inline-flex items-center gap-2.5 text-emerald-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-emerald-500/25" style={{ background: "rgba(16,185,129,0.08)" }}>
              <span className="pulse-dot" />
              Şu an {aktifArzlar.length} aktif halka arz — talep toplanıyor
            </div>
            <h1 className="anim-fade-up anim-d-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-[1.12] tracking-tight">
              Halka Arzın Yapay Zekâ Destekli Merkezi<br />
              <span className="text-grad">Takip Et. Analiz Et. Kazancını Hesapla.</span>
            </h1>
            <p className="anim-fade-up anim-d-3 text-slate-400 text-lg leading-relaxed max-w-xl mb-8">
              Türkiye&apos;nin en kapsamlı halka arz platformu. Canlı halka arz takvimi, AI yatırım asistanı, lot hesaplama, tavan simülasyonu, geçmiş arz arşivi ve anlık bildirimler tek platformda.
            </p>
            <div className="anim-fade-up anim-d-4 flex flex-col sm:flex-row gap-4">
              <Link href="/halka-arzlar" className="btn-glow text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 justify-center">
                Takvimi Gör <ArrowRight size={18} />
              </Link>
              <Link href="#hesaplama-araclari" className="bg-slate-500/10 hover:bg-slate-500/20 border border-slate-700/60 hover:border-slate-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-center" data-build="v2">
                Araçları Dene
              </Link>
            </div>
          </div>

          {/* Sağ: canlı grafik kartı */}
          <div className="anim-fade-up anim-d-4 hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/40 shadow-2xl shadow-black/50" style={{ background: "linear-gradient(160deg, rgba(16,185,129,0.06), rgba(15,23,38,0.7) 40%)" }}>
              <div className="flex justify-between items-center px-5 pt-4 pb-1">
                <div className="font-mono text-sm font-bold text-white">▲ BIST <span className="text-slate-500 font-normal text-xs ml-1">Halka Arz Endeksi</span></div>
                <div className="text-right">
                  <div className="text-emerald-400 text-xs font-mono font-semibold">CANLI TAKİP</div>
                </div>
              </div>
              <HeroChart />
              <div className="grid grid-cols-3 border-t border-slate-700/40 text-[11.5px]">
                <div className="px-4 py-3 border-r border-slate-700/40">
                  <div className="text-slate-500 mb-0.5">Aktif Arz</div>
                  <div className="text-white font-bold tabular-nums">{aktifArzlar.length}</div>
                </div>
                <div className="px-4 py-3 border-r border-slate-700/40">
                  <div className="text-slate-500 mb-0.5">Yaklaşan</div>
                  <div className="text-sky-400 font-bold tabular-nums">{yaklasanArzlar.length}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-slate-500 mb-0.5">Arşiv</div>
                  <div className="text-emerald-400 font-bold tabular-nums">205+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-16">

        {/* Aktif Arzlar */}
        <Reveal>
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-500 block mb-1.5">Canlı</span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Aktif Halka Arzlar</h2>
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
        </Reveal>

        {/* Yaklaşan Arzlar */}
        {yaklasanArzlar.length > 0 && (
          <Reveal>
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-sky-500 block mb-1.5">Takvim</span>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Yaklaşan Halka Arzlar</h2>
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
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center ${arz.logo ? "bg-white p-1" : ""}`} style={!arz.logo ? { background: "rgba(59,130,246,0.1)" } : {}}>
                        {arz.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={arz.logo} alt={arz.ticker} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-blue-400 font-bold text-xs">{(arz.ticker || "??").slice(0, 2)}</span>
                        )}
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
          </Reveal>
        )}

        {/* Reklam — yaklaşan ile tamamlanan arasına */}
        <AdBanner slot="horizontal" className="my-2" />

        {/* Son Tamamlanan Arzlar */}
        {sonTamamlanan.length > 0 && (
          <Reveal>
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-500 block mb-1.5">Arşiv</span>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Son Halka Arzlar</h2>
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
                    <div className={`w-10 h-10 rounded-xl shrink-0 overflow-hidden flex items-center justify-center ${arz.logo ? "bg-white p-1" : "bg-slate-700/60"}`}>
                      {arz.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={arz.logo} alt={arz.ticker} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-slate-300 font-bold text-xs">{arz.ticker.slice(0, 2)}</span>
                      )}
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
          </Reveal>
        )}

        {/* Araçlar */}
        <Reveal>
        <section id="hesaplama-araclari">
          <div className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-amber-500 block mb-1.5">Araçlar</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Hesaplama Araçları</h2>
            <p className="text-slate-400 text-sm mt-1">Halka arz kararlarını veriye dayalı al — tamamen ücretsiz</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {araclar.map(({ icon: Icon, baslik, aciklama, href, renk, bg }) => (
              <Link key={href} href={href}>
                <div className="card-lift bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 h-full hover:border-slate-600 group cursor-pointer">
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
        </Reveal>

      </main>

      <Footer />
    </div>
  );
}
