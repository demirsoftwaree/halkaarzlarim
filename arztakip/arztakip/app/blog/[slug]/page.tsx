import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { adminDb } from "@/lib/firebase-admin";
import type { Metadata } from "next";

export const revalidate = 60;
export const dynamicParams = true;

interface BlogYazisi {
  id: string;
  baslik: string;
  icerik: string;
  sirket?: string;
  gorsel?: string;
  tarih: string;
}

async function getYazi(slug: string): Promise<BlogYazisi | null> {
  try {
    const doc = await adminDb.collection("haberler").doc(slug).get();
    if (!doc.exists) return null;
    const data = doc.data() as Omit<BlogYazisi, "id"> & { kategori: string; yayinda: boolean };
    if (data.kategori !== "blog" || !data.yayinda) return null;
    return { ...data, id: doc.id };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yazi = await getYazi(slug);
  if (!yazi) return { title: "Blog Yazısı Bulunamadı" };

  // Markdown başlıklarını ve kısa satırları atla, ilk anlamlı paragrafı al
  const ozet = yazi.icerik
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 60 && !p.startsWith("#") && !p.startsWith("-"))
    .map(p => p.replace(/\n/g, " "))
    .at(0)
    ?.slice(0, 160) ?? yazi.baslik;
  const url = `https://www.halkaarzlarim.com/blog/${slug}`;

  return {
    title: yazi.baslik,
    description: ozet,
    openGraph: {
      title: yazi.baslik,
      description: ozet,
      url,
      type: "article",
      ...(yazi.gorsel && { images: [{ url: yazi.gorsel }] }),
    },
    alternates: { canonical: url },
  };
}

export default async function BlogDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yazi = await getYazi(slug);
  if (!yazi) notFound();

  const paragraflar = yazi.icerik.split(/\n\n+/).filter(Boolean);
  const tarih = new Date(yazi.tarih).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Geri */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Blog
        </Link>

        {/* Başlık alanı */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-4">
            <BookOpen size={13} />
            <span>Halka Arz Rehberi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">
            {yazi.baslik}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar size={13} />
            <span>{tarih}</span>
          </div>
        </div>

        {/* Kapak görseli */}
        {yazi.gorsel && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={yazi.gorsel}
              alt={yazi.baslik}
              className="w-full object-cover max-h-80"
            />
          </div>
        )}

        {/* İçerik */}
        <article className="prose-custom">
          {paragraflar.map((paragraf, i) => {
            // ## ile başlıyorsa başlık
            if (paragraf.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-bold text-white mt-8 mb-4">
                  {paragraf.replace("## ", "")}
                </h2>
              );
            }
            // # ile başlıyorsa büyük başlık
            if (paragraf.startsWith("# ")) {
              return (
                <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">
                  {paragraf.replace("# ", "")}
                </h2>
              );
            }
            // - ile başlıyorsa liste
            if (paragraf.trim().startsWith("- ")) {
              const maddeler = paragraf.split("\n").filter(s => s.trim().startsWith("- "));
              return (
                <ul key={i} className="list-disc list-inside space-y-2 my-4 text-slate-300">
                  {maddeler.map((m, j) => (
                    <li key={j} className="leading-relaxed">{m.replace(/^-\s*/, "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-slate-300 leading-relaxed text-base my-4">
                {paragraf}
              </p>
            );
          })}
        </article>

        {/* Alt CTA */}
        <div className="mt-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <p className="text-white font-semibold mb-2">Halka arzları takip etmeye başla</p>
          <p className="text-slate-400 text-sm mb-4">
            Tavan simülatörü, lot hesaplama ve AI asistan ile yatırım kararlarını kolaylaştır.
          </p>
          <Link
            href="/halka-arzlar"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Aktif Arzları Gör
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
