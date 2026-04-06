import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import StockChart from "@/components/StockChart";
import { durumRenk, durumEtiket } from "@/lib/mock-data";
import { getArzlar } from "@/lib/arz-utils";
import type { Metadata } from "next";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { arzlar } = await getArzlar();
  const arz = arzlar.find((a) => a.slug === slug);

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
  const { arzlar } = await getArzlar();
  const arz = arzlar.find((a) => a.slug === slug);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Link href="/halka-arzlar" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Halka Arzlar
        </Link>

        {/* ── HEADER ── */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-base shrink-0">
              {(arz.ticker || arz.sirketAdi).slice(0, 2).toUpperCase()}
            </div>
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
                {/* Dağıtılan Pay Özeti — Bireysel grubu varsa hesapla */}
                {(() => {
                  const bireysel = arz.tahsisatSonuclari!.find(t => t.grup.toLowerCase().includes("bireysel"));
                  if (!bireysel || bireysel.kisi === 0) return null;
                  const lotBasina = Math.floor(bireysel.lot / bireysel.kisi);
                  const maliyet = lotBasina * arsFiyati;
                  return (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4 text-sm">
                      <span className="text-slate-400">Dağıtılan Pay Miktarı: </span>
                      <span className="text-white font-medium">
                        {new Intl.NumberFormat("tr-TR").format(bireysel.kisi)} katılım
                        {" – "}{new Intl.NumberFormat("tr-TR").format(lotBasina)} Lot
                        {maliyet > 0 && <span className="text-emerald-400"> ({new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(maliyet)} TL)</span>}
                      </span>
                      <span className="text-slate-500 text-xs ml-1">* Bireysel Yatırımcı Grubu</span>
                    </div>
                  );
                })()}
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

            {/* Premium */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <div className="text-amber-400 text-xs font-semibold mb-3">⭐ Premium Özellikler</div>
              <div className="space-y-2">
                {["Takip Listeme Ekle", "Başvurdum Olarak İşaretle", "Not Ekle"].map((f) => (
                  <button key={f} className="w-full text-left text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2">
                    <span className="text-amber-400">🔒</span> {f}
                  </button>
                ))}
              </div>
              <Link href="/premium" className="mt-3 block text-center bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs py-2.5 rounded-lg transition-colors">
                Premium&apos;a Geç
              </Link>
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
