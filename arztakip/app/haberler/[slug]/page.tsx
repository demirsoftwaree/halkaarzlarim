"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import type { Haber } from "@/app/api/haberler/route";
import { ArrowLeft, FileText, Calendar, Building2, ExternalLink, Tag } from "lucide-react";

const KATEGORİ_RENK: Record<string, string> = {
  "halka-arz":     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "sermaye":       "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "genel-kurul":   "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "borsa":         "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "temettu":       "text-pink-400 bg-pink-500/10 border-pink-500/20",
  "sirket-haberi": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "duyuru":        "text-slate-400 bg-slate-700/50 border-slate-600/20",
};

const KATEGORİ_ETİKET: Record<string, string> = {
  "halka-arz":     "Halka Arz",
  "sermaye":       "Sermaye",
  "genel-kurul":   "Genel Kurul",
  "borsa":         "Borsa",
  "temettu":       "Temettü",
  "sirket-haberi": "Şirket Haberi",
  "duyuru":        "Duyuru",
};

function formatTarih(tarih: string, saat?: string) {
  if (!tarih) return "";
  return new Date(tarih + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  }) + (saat ? ` · ${saat}` : "");
}

export default function HaberDetayPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [haber, setHaber] = useState<Haber | null>(null);
  const [diger, setDiger] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/haberler")
      .then(r => r.json())
      .then(d => {
        const liste: Haber[] = d.haberler || [];
        // Slug eşleştirme: link sonundaki kısım veya id
        const bulunan = liste.find(h =>
          h.link === `/haberler/${slug}` ||
          h.id === slug ||
          h.id === `spk-${slug.replace("spk-", "")}` ||
          h.id === `kap-${slug.replace("kap-", "")}`
        );
        setHaber(bulunan ?? null);
        setDiger(liste.filter(h => h.id !== bulunan?.id).slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const renkClass = haber ? (KATEGORİ_RENK[haber.kategori] ?? KATEGORİ_RENK["duyuru"]) : "";
  const etiket    = haber ? (KATEGORİ_ETİKET[haber.kategori] ?? "Duyuru") : "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Geri */}
        <Link
          href="/haberler"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Tüm Haberler
        </Link>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-800 rounded-xl w-32" />
            <div className="h-10 bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-800 rounded-xl w-48" />
            <div className="h-32 bg-slate-800 rounded-xl" />
          </div>
        ) : !haber ? (
          <div className="text-center py-20 text-slate-500">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>Haber bulunamadı.</p>
            <Link href="/haberler" className="text-emerald-400 text-sm hover:underline mt-2 inline-block">
              Haberlere dön
            </Link>
          </div>
        ) : (
          <>
            {/* Kategori + tarih */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${renkClass}`}>
                <Tag size={10} /> {etiket}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar size={11} />
                {formatTarih(haber.tarih, haber.saat)}
              </span>
            </div>

            {/* Başlık */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
              {haber.baslik}
            </h1>

            {/* Şirket */}
            <div className="flex items-center gap-2.5 mb-8 pb-6 border-b border-slate-700/50">
              {haber.gorsel ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={haber.gorsel} alt="" className="w-9 h-9 rounded-full object-contain bg-white/5" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
                  <Building2 size={15} className="text-slate-400" />
                </div>
              )}
              <div>
                <div className="text-white text-sm font-medium">{haber.sirket}</div>
                {haber.ticker && (
                  <div className="text-xs text-slate-500">{haber.ticker}</div>
                )}
              </div>
              {/* Kaynak badge */}
              <div className="ml-auto">
                <span className="text-xs text-slate-600 border border-slate-700/50 px-2 py-0.5 rounded-full">
                  {haber.kaynak === "manuel" ? "Editöryal" : haber.kaynak === "kap" ? "KAP" : "SPK"}
                </span>
              </div>
            </div>

            {/* İçerik */}
            {haber.icerik ? (
              // Manuel haber — tam içerik
              <div className="text-slate-300 leading-7 space-y-4 text-[15px]">
                {haber.icerik.split("\n").filter(p => p.trim()).map((paragraf, i) => (
                  <p key={i}>{paragraf}</p>
                ))}
              </div>
            ) : (
              // Otomatik haber — özet + belge linki
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400 text-sm leading-7 mb-5">
                  Bu duyuru <strong className="text-white">{haber.sirket}</strong> tarafından{" "}
                  {haber.kaynak === "kap" ? "KAP" : "SPK"} aracılığıyla yayımlanmıştır.
                  Tam belge içeriğini görüntülemek için aşağıdaki butonu kullanabilirsiniz.
                </p>
                {haber.originalLinki && (
                  <a
                    href={haber.originalLinki}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <ExternalLink size={15} />
                    {haber.kaynak === "kap" ? "KAP'ta Görüntüle" : "Belgeyi İndir (PDF)"}
                  </a>
                )}
              </div>
            )}

            {/* Diğer haberler */}
            {diger.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-700/50">
                <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Diğer Haberler</h2>
                <div className="space-y-2">
                  {diger.map(h => (
                    <Link
                      key={h.id}
                      href={h.link}
                      className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 hover:border-slate-600 hover:bg-slate-800/70 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-1">
                          {h.baslik}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{h.sirket}</p>
                      </div>
                      <span className="text-xs text-slate-600 flex-shrink-0 tabular-nums">
                        {h.tarih?.split("-").reverse().join(".")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
