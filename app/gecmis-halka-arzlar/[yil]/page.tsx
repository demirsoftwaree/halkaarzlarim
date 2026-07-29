import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { adminDb } from "@/lib/firebase-admin";
import { ArrowLeft, Calendar, Building2 } from "lucide-react";
import type { Metadata } from "next";

const YILLAR = [2025, 2024, 2023, 2022, 2021, 2020];

export const revalidate = 3600; // 1 saat — kota kaynaklı geçici boş veriden hızlı toparlanma

export async function generateStaticParams() {
  return YILLAR.map((yil) => ({ yil: yil.toString() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ yil: string }>;
}): Promise<Metadata> {
  const { yil } = await params;
  const BASE_URL = "https://www.halkaarzlarim.com";
  return {
    title: `${yil} Halka Arz Listesi — Türkiye ${yil} Yılı IPO'ları`,
    description: `${yil} yılında Türkiye'de gerçekleşen tüm halka arzların listesi. BIST'e kote olan şirketler, arz fiyatları, sektörler ve aracı kurumlar.`,
    keywords: [
      `${yil} halka arz`,
      `${yil} ipo türkiye`,
      `${yil} bist halka arz`,
      `${yil} halka arz listesi`,
      `${yil} yılı halka arzlar`,
      "geçmiş halka arzlar",
      "halka arz arşivi",
      "spk halka arz",
    ],
    openGraph: {
      title: `${yil} Halka Arz Listesi | HalkaArzlarım`,
      description: `${yil} yılında Türkiye'de gerçekleşen tüm halka arzlar.`,
      url: `${BASE_URL}/gecmis-halka-arzlar/${yil}`,
    },
    alternates: { canonical: `${BASE_URL}/gecmis-halka-arzlar/${yil}` },
  };
}

function fmt(dateStr: string) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function GecmisYilPage({
  params,
}: {
  params: Promise<{ yil: string }>;
}) {
  const { yil } = await params;
  const yilNum = parseInt(yil, 10);

  if (!YILLAR.includes(yilNum)) notFound();

  let arzlar: Record<string, string & number>[] = [];
  try {
    const snap = await adminDb
      .collection("arzlar-spk")
      .where("_yil", "==", yilNum)
      .get();

    arzlar = snap.docs
      .map((d) => d.data() as Record<string, string & number>)
      .sort((a, b) => {
        const da = (a.borsadaIslemGormeTarihi as string) || "";
        const db2 = (b.borsadaIslemGormeTarihi as string) || "";
        return da < db2 ? -1 : da > db2 ? 1 : 0;
      });
  } catch {
    arzlar = [];
  }

  const BASE_URL = "https://www.halkaarzlarim.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Geçmiş Halka Arzlar", item: `${BASE_URL}/gecmis-halka-arzlar/${YILLAR[0]}` },
          { "@type": "ListItem", position: 3, name: `${yil} Halka Arzları`, item: `${BASE_URL}/gecmis-halka-arzlar/${yil}` },
        ],
      },
      {
        "@type": "ItemList",
        name: `${yil} Halka Arz Listesi`,
        description: `${yil} yılında Türkiye'de gerçekleşen ${arzlar.length} halka arz`,
        url: `${BASE_URL}/gecmis-halka-arzlar/${yil}`,
        numberOfItems: arzlar.length,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <Link
          href="/halka-arzlar"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Halka Arzlar
        </Link>

        {/* Başlık */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Calendar size={18} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{yil} Halka Arz Listesi</h1>
              <p className="text-slate-400 text-sm">
                {yil} yılında Türkiye&apos;de halka arz eden{" "}
                <span className="text-emerald-400 font-semibold">{arzlar.length} şirket</span>
              </p>
            </div>
          </div>
        </div>

        {/* Yıl Navigasyon */}
        <div className="flex flex-wrap gap-2 mb-6">
          {YILLAR.map((y) => (
            <Link
              key={y}
              href={`/gecmis-halka-arzlar/${y}`}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                y === yilNum
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>

        {/* Tablo */}
        {arzlar.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Bu yıl için veri bulunamadı.
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Mobil: kart listesi */}
            <div className="sm:hidden divide-y divide-slate-700/40">
              {arzlar.map((arz, i) => (
                <Link
                  key={arz.slug || i}
                  href={`/halka-arz/${arz.slug}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                    <Building2 size={14} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{arz.sirketAdi}</div>
                    <div className="text-slate-500 text-xs">
                      {arz.ticker && <span className="text-emerald-400 font-mono mr-2">{arz.ticker}</span>}
                      {arz.sektor}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white text-sm font-medium">
                      {arz.arsFiyatiUst ? `${Number(arz.arsFiyatiUst).toFixed(2)} ₺` : "–"}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {fmt(arz.borsadaIslemGormeTarihi)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop: tablo */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 font-medium px-5 py-3 text-xs">#</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Şirket</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Ticker</th>
                    <th className="text-right text-slate-400 font-medium px-4 py-3 text-xs">Fiyat</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Sektör</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Borsa Tarihi</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Aracı Kurum</th>
                  </tr>
                </thead>
                <tbody>
                  {arzlar.map((arz, i) => (
                    <tr
                      key={arz.slug || i}
                      className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-600 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/halka-arz/${arz.slug}`}
                          className="text-white hover:text-emerald-400 font-medium transition-colors"
                        >
                          {arz.sirketAdi}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {arz.ticker ? (
                          <span className="font-mono text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded">
                            {arz.ticker}
                          </span>
                        ) : (
                          <span className="text-slate-600">–</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        {arz.arsFiyatiUst ? `${Number(arz.arsFiyatiUst).toFixed(2)} ₺` : "–"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{arz.sektor || "–"}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs tabular-nums">
                        {fmt(arz.borsadaIslemGormeTarihi)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                        {arz.araciKurum || "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alt bilgi */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Kaynak: SPK (Sermaye Piyasası Kurulu) resmi verileri
        </p>
      </main>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
