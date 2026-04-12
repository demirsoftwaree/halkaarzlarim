"use client";
import Link from "next/link";
import { TrendingUp, BarChart3, DollarSign, Crown, Medal, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const araclar = [
  {
    icon: TrendingUp,
    baslik: "Tavan Simülatörü",
    aciklama: "Halka arzda kaç tavan giderse kaç ₺ kazanırsın? Anında hesapla.",
    href: "/araclar/tavan-simulatoru",
    renk: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/30",
  },
  {
    icon: BarChart3,
    baslik: "Lot Dağıtım Hesaplayıcı",
    aciklama: "Kaç kişi başvurursa kaç lot düşer? Dağıtım oranını öğren.",
    href: "/araclar/lot-hesaplama",
    renk: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/30",
  },
  {
    icon: DollarSign,
    baslik: "Net Kâr Hesaplayıcı",
    aciklama: "Komisyon ve vergiler dahil gerçek net kazancını hesapla.",
    href: "/araclar/kar-hesaplama",
    renk: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/30",
  },
  {
    icon: Crown,
    baslik: "Tavan Getiri Raporu",
    aciklama: "10 günlük tavan senaryosu — PDF olarak indir.",
    href: "/araclar/tavan-raporu",
    renk: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "hover:border-yellow-500/30",
    premium: true,
  },
  {
    icon: Medal,
    baslik: "Geçmiş Tavan Performansı",
    aciklama: "Tamamlanan arzlarda kaç tavan yapıldı, yatırımcıya ne kazandırdı?",
    href: "/araclar/tavan-performansi",
    renk: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/30",
    premium: true,
  },
];

export default function AraclarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Hesaplama Araçları</h1>
          <p className="text-slate-400">Halka arz kararlarını veriye dayalı al</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {araclar.map(({ icon: Icon, baslik, aciklama, href, renk, bg, border, premium }) => (
            <Link key={href} href={href}>
              <div className={`bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 h-full ${border} transition-all group cursor-pointer relative`}>
                {premium && (
                  <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium">
                    PRO
                  </span>
                )}
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={24} className={renk} />
                </div>
                <h2 className="font-bold text-white text-base mb-2">{baslik}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{aciklama}</p>
                <span className={`text-sm font-medium ${renk} flex items-center gap-1.5 group-hover:gap-2.5 transition-all`}>
                  Hesapla <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
