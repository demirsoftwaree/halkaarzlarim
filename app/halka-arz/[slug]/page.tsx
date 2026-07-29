import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import StockChart from "@/components/StockChart";
import { durumRenk, durumEtiket } from "@/lib/mock-data";
import { getArzlar } from "@/lib/arz-utils";
import ArzLogo from "@/components/ArzLogo";
import WatchlistButton from "@/components/WatchlistButton";
import type { Metadata } from "next";

export const dynamicParams = true;
export const revalidate = 300; // 5 dakikada bir yenile

async function getArzBySlug(slug: string) {
  const { arzlar } = await getArzlar();
  let arz = arzlar.find((a) => a.slug === slug);
  if (!arz) {
    try {
      const { adminDb } = await import("@/lib/firebase-admin");
      const snap = await adminDb.collection("arzlar-spk").doc(slug).get();
      if (snap.exists) {
        const data = snap.data() as Record<string, unknown>;
        arz = { ...data, id: slug, slug } as (typeof arzlar)[0];
      }
    } catch {}
  }
  return arz;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const arz = await getArzBySlug(slug);

  if (!arz) return { title: "Halka Arz Bulunamadı" };

  const sirketAdi = arz.sirketAdi;
  const ticker = arz.ticker ? ` (${arz.ticker})` : "";
  const fiyat = arz.arsFiyatiAlt ? `${arz.arsFiyatiAlt}₺` : arz.arsFiyatiUst ? `${arz.arsFiyatiUst}₺` : "";
  const sektor = arz.sektor || "";

  const title = `${sirketAdi}${ticker} Halka Arz`;
  const description = [
    `${sirketAdi} halka arz detayları, tavan simülatörü ve lot hesaplama.`,
    fiyat && `Halka arz fiyatı: ${fiyat}.`,
    sektor && `Sektör: ${sektor}.`,
    "HalkaArzlarım ile yatırım kararını ver.",
  ]
    .filter(Boolean)
    .join(" ");

  const url = `https://www.halkaarzlarim.com/halka-arz/${slug}`;

  return {
    title,
    description,
    keywords: [sirketAdi, ticker.replace(/[()]/g, "").trim(), "halka arz", sektor, "tavan simülatörü", "BIST"].filter(Boolean),
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    alternates: { canonical: url },
  };
}

export async function generateStaticParams() {
  const { arzlar } = await getArzlar();
  return arzlar.map((a) => ({ slug: a.slug }));
}

function fmt(dateStr: string) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtLot(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-slate-700/50 last:border-0 gap-4">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-white font-medium text-right">{value}</span>
    </div>
  );
}

function OzetBolum({ baslik, icerik }: { baslik: string; icerik: string }) {
  return (
    <div className="border-b border-slate-700/50 last:border-0 py-4">
      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">{baslik}</div>
      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{icerik}</div>
    </div>
  );
}

export default async function ArzDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const arz = await getArzBySlug(slug);
  if (!arz) notFound();

  const tamamlandi = arz.durum === "tamamlandi";
  const arsFiyati = arz.arsFiyatiUst || arz.arsFiyatiAlt;

  // Tavan tablosu
  const ornekAdet = 10;
  const tavanlar = Array.from({ length: 7 }, (_, i) => {
    const gun = i + 1;
    const fiyat = arsFiyati * Math.pow(1.1, gun);
    const deger = fiyat * ornekAdet;
    const brut = deger - arsFiyati * ornekAdet;
    const roi = (brut / (arsFiyati * ornekAdet)) * 100;
    return { gun, fiyat, deger, brut, roi };
  });

  const BASE_URL = "https://www.halkaarzlarim.com";
  const pageUrl = `${BASE_URL}/halka-arz/${arz.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Halka Arzlar", item: `${BASE_URL}/halka-arzlar` },
          { "@type": "ListItem", position: 3, name: `${arz.sirketAdi} Halka Arz`, item: pageUrl },
        ],
      },
      {
        "@type": "FinancialProduct",
        name: `${arz.sirketAdi}${arz.ticker ? ` (${arz.ticker})` : ""} Halka Arz`,
        description: arz.sirketHakkinda || arz.aciklama || `${arz.sirketAdi} halka arz detayları, fiyat bilgisi ve tavan simülatörü.`,
        url: pageUrl,
        provider: { "@type": "Organization", name: "HalkaArzlarım", url: BASE_URL },
        ...(arz.arsFiyatiUst > 0 && {
          offers: {
            "@type": "Offer",
            price: arz.arsFiyatiUst.toFixed(2),
            priceCurrency: "TRY",
          },
        }),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Link href="/halka-arzlar" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Halka Arzlar
        </Link>

        {/* ── HEADER ── */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <ArzLogo logo={arz.logo} ticker={arz.ticker || arz.sirketAdi} isDone={tamamlandi} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {arz.ticker && (
                  <span className="font-mono font-bold text-emerald-400 text-base">({arz.ticker})</span>
                )}
                <h1 className="text-lg font-bold text-white leading-snug">{arz.sirketAdi}</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${durumRenk[arz.durum]}`}>
                  {durumEtiket[arz.durum]}
                </span>
                <span className="text-xs text-slate-500">{arz.sektor}</span>
                {arz.pazar && (
                  <>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500">{arz.pazar}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── SOL / ANA KOLON ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Halka Arz Bilgileri */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="font-bold text-white text-base mb-2">Halka Arz Bilgileri</h2>
              <div>
                {/* Tarihler */}
                {arz.talepBaslangic ? (
                  <InfoRow label="Halka Arz Tarihi" value={`${fmt(arz.talepBaslangic)} – ${fmt(arz.talepBitis)}`} />
                ) : arz.borsadaIslemGormeTarihi ? (
                  <InfoRow label="BIST İlk İşlem Tarihi" value={fmt(arz.borsadaIslemGormeTarihi)} />
                ) : null}

                <InfoRow
                  label="Halka Arz Fiyatı / Aralığı"
                  value={
                    arz.arsFiyatiAlt === arz.arsFiyatiUst
                      ? `${arz.arsFiyatiUst.toFixed(2)} TL`
                      : `${arz.arsFiyatiAlt.toFixed(2)} – ${arz.arsFiyatiUst.toFixed(2)} TL`
                  }
                />

                {arz.dagitimYontemi && (
                  <InfoRow label="Dağıtım Yöntemi" value={arz.dagitimYontemi} />
                )}

                {arz.toplamArzLot > 0 && (
                  <InfoRow label="Pay" value={`${fmtLot(arz.toplamArzLot)} Lot`} />
                )}

                <InfoRow label="Aracı Kurum" value={arz.araciKurum || "–"} />

                {arz.fiiliDolasimdakiPay != null && arz.fiiliDolasimdakiPay > 0 && (
                  <InfoRow label="Fiili Dolaşımdaki Pay" value={`${fmtLot(arz.fiiliDolasimdakiPay)} Lot`} />
                )}

                {arz.fiiliDolasimdakiPayOrani != null && arz.fiiliDolasimdakiPayOrani > 0 && (
                  <InfoRow label="Fiili Dolaşımdaki Pay Oranı" value={`%${arz.fiiliDolasimdakiPayOrani.toFixed(2)}`} />
                )}

                {arz.ticker && (
                  <InfoRow label="BIST Kodu" value={<span className="font-mono text-emerald-400">{arz.ticker}</span>} />
                )}

                {arz.pazar && (
                  <InfoRow label="Pazar" value={arz.pazar} />
                )}

                {arz.borsadaIslemGormeTarihi && arz.talepBaslangic && (
                  <InfoRow label="BIST İlk İşlem Tarihi" value={fmt(arz.borsadaIslemGormeTarihi)} />
                )}
              </div>
            </div>

            {/* Halka Arz Sonuçları (tahsisat tablosu) */}
            {tamamlandi && arz.tahsisatSonuclari && arz.tahsisatSonuclari.length > 0 && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="font-bold text-white text-base mb-4">{arz.ticker} Halka Arz Sonuçları</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left text-slate-400 font-medium pb-3">Yatırımcı Grubu</th>
                        <th className="text-right text-slate-400 font-medium pb-3">Kişi</th>
                        <th className="text-right text-slate-400 font-medium pb-3">Lot</th>
                        <th className="text-right text-slate-400 font-medium pb-3">Oran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arz.tahsisatSonuclari.map((t, i) => (
                        <tr key={i} className="border-b border-slate-700/30 last:border-0">
                          <td className="py-3 text-slate-300">{t.grup}</td>
                          <td className="py-3 text-right text-white">{new Intl.NumberFormat("tr-TR").format(t.kisi)}</td>
                          <td className="py-3 text-right text-white">{new Intl.NumberFormat("tr-TR").format(t.lot)}</td>
                          <td className="py-3 text-right text-emerald-400 font-medium">%{t.oran}</td>
                        </tr>
                      ))}
                      {/* Toplam satırı */}
                      <tr className="border-t border-slate-600/50 bg-slate-700/20">
                        <td className="py-3 text-white font-semibold">Toplam</td>
                        <td className="py-3 text-right text-white font-semibold">
                          {new Intl.NumberFormat("tr-TR").format(arz.tahsisatSonuclari.reduce((s, t) => s + t.kisi, 0))}
                        </td>
                        <td className="py-3 text-right text-white font-semibold">
                          {new Intl.NumberFormat("tr-TR").format(arz.tahsisatSonuclari.reduce((s, t) => s + t.lot, 0))}
                        </td>
                        <td className="py-3 text-right text-white font-semibold">%100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Canlı Fiyat + Grafik (sadece tamamlananlar ve ticker varsa) */}
            {tamamlandi && arz.ticker && (
              <StockChart ticker={arz.ticker} arzFiyati={arsFiyati} />
            )}

            {/* Özet Bilgiler */}
            {arz.ozetBolumler && arz.ozetBolumler.length > 0 && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="font-bold text-white text-base mb-1">Özet Bilgiler</h2>
                <div>
                  {arz.ozetBolumler.map((b, i) => (
                    <OzetBolum key={i} baslik={b.baslik} icerik={b.icerik} />
                  ))}
                </div>

                {/* Alt satır istatistikler */}
                {(arz.halkaAciklik || arz.halkaArzIskontosu || arz.halkaArzBuyklugu) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 mt-2 border-t border-slate-700/50">
                    {arz.halkaAciklik != null && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Halka Açıklık</div>
                        <div className="text-sm font-semibold text-white">%{arz.halkaAciklik.toFixed(2)}</div>
                      </div>
                    )}
                    {arz.halkaArzIskontosu != null && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Halka Arz İskontosu</div>
                        <div className="text-sm font-semibold text-white">%{arz.halkaArzIskontosu}</div>
                      </div>
                    )}
                    {arz.halkaArzBuyklugu && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Halka Arz Büyüklüğü</div>
                        <div className="text-sm font-semibold text-white">{arz.halkaArzBuyklugu}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Şirket Hakkında */}
            {(arz.sirketHakkinda || arz.aciklama) && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="font-bold text-white text-base mb-3">Şirket Hakkında</h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {arz.sirketHakkinda || arz.aciklama}
                </p>
                {arz.kapLinki && (
                  <a
                    href={arz.kapLinki}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                  >
                    KAP Bildirim Sorgula <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}

            {/* Tavan Simülatörü */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={17} className="text-emerald-400" />
                <h2 className="font-bold text-white text-base">Tavan Simülatörü <span className="text-slate-500 text-sm font-normal">(10 hisse)</span></h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-700">
                      <th className="text-left pb-3 font-medium">Gün</th>
                      <th className="text-right pb-3 font-medium">Fiyat</th>
                      <th className="text-right pb-3 font-medium">Değer</th>
                      <th className="text-right pb-3 font-medium">Brüt Kâr</th>
                      <th className="text-right pb-3 font-medium">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tavanlar.map((t) => (
                      <tr key={t.gun} className="border-b border-slate-800/50">
                        <td className="py-2.5 text-slate-400">{t.gun}. tavan</td>
                        <td className="py-2.5 text-right text-white">{t.fiyat.toFixed(2)} ₺</td>
                        <td className="py-2.5 text-right text-white">{fmtLot(Math.round(t.deger))} ₺</td>
                        <td className="py-2.5 text-right text-emerald-400 font-medium">+{fmtLot(Math.round(t.brut))} ₺</td>
                        <td className="py-2.5 text-right text-emerald-300 font-bold">%{t.roi.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-600 mt-3">⚠️ Tahminidir, yatırım tavsiyesi değildir.</p>
            </div>
          </div>

          {/* ── SAĞ KOLON ── */}
          <div className="space-y-4">
            {/* Tavan Hesapla */}
            <Link href={`/araclar/tavan-simulatoru?fiyat=${arsFiyati}`}>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <TrendingUp size={15} />
                  Tavan Hesapla
                </div>
                <div className="text-xs text-slate-400 mt-1">Detaylı tavan simülatörü</div>
              </div>
            </Link>

            {/* Takip */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <div className="text-slate-300 text-xs font-semibold mb-3">Bu Arzı Takip Et</div>
              <div className="flex items-center gap-3">
                <WatchlistButton slug={arz.slug} sirketAdi={arz.sirketAdi} ticker={arz.ticker || ""} className="flex-1 justify-center py-2 rounded-lg text-sm" />
                <span className="text-slate-500 text-xs">Takip listene ekle</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
