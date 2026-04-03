import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, PenLine } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60;

interface BlogYazisi {
  id: string;
  baslik: string;
  icerik: string;
  sirket?: string;
  gorsel?: string;
  tarih: string;
  kategori: string;
  yayinda: boolean;
}

function formatTarih(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function ozet(icerik: string, maks = 160) {
  const temiz = icerik.replace(/\n+/g, " ").trim();
  return temiz.length > maks ? temiz.slice(0, maks) + "…" : temiz;
}

export default async function BlogPage() {
  let yazilar: BlogYazisi[] = [];

  try {
    const snap = await adminDb
      .collection("haberler")
      .where("kategori", "==", "blog")
      .get();
    yazilar = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as BlogYazisi))
      .filter((y) => y.yayinda === true)
      .sort((a, b) => b.tarih.localeCompare(a.tarih));
  } catch (err) {
    console.error("Blog fetch error:", err);
    yazilar = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Başlık */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
            <BookOpen size={16} />
            <span>Halka Arz Rehberi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Blog</h1>
          <p className="text-slate-400 text-lg">
            Halka arz yatırımcıları için rehber yazılar, stratejiler ve güncel analizler.
          </p>
        </div>

        {/* Yazı listesi */}
        {yazilar.length === 0 ? (
          <div className="text-center py-24">
            <PenLine size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Henüz blog yazısı yok</p>
            <p className="text-slate-600 text-sm">Yakında içerikler eklenecek.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {yazilar.map((yazi) => (
              <Link
                key={yazi.id}
                href={`/blog/${yazi.id}`}
                className="group block bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all"
              >
                {yazi.gorsel && (
                  <div className="mb-4 rounded-xl overflow-hidden h-48 bg-slate-700">
                    <img
                      src={yazi.gorsel}
                      alt={yazi.baslik}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <Calendar size={13} />
                  <span>{formatTarih(yazi.tarih)}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-snug">
                  {yazi.baslik}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {ozet(yazi.icerik)}
                </p>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                  Devamını oku <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
