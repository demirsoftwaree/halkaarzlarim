import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white">Halka <span className="text-emerald-400">Arzlarım</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Halka arzlarını takip et, kazancını hesapla.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                ["Halka Arz Takvimi", "/halka-arzlar"],
                ["Hisseler", "/hisseler"],
                ["Haberler", "/haberler"],
                ["Premium", "/premium"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Hesaplama Araçları</h4>
            <ul className="space-y-2.5">
              {[
                ["Tavan Simülatörü", "/araclar/tavan-simulatoru"],
                ["Lot Dağıtım", "/araclar/lot-hesaplama"],
                ["Net Kâr Hesaplayıcı", "/araclar/kar-hesaplama"],
                ["Tavan Getiri Raporu", "/araclar/tavan-raporu"],
                ["Geçmiş Tavan Performansı", "/araclar/tavan-performansi"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rehber */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Rehber & Yasal</h4>
            <ul className="space-y-2.5">
              {[
                ["IPO Nedir?", "/ipo-nedir"],
                ["Blog", "/blog"],
                ["İstatistikler", "/istatistikler"],
                ["İletişim", "/iletisim"],
                ["Gizlilik Politikası", "/gizlilik-politikasi"],
                ["Kullanım Koşulları", "/kullanim-kosullari"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 Halkaarzlarım.com — Tüm hakları saklıdır.
          </p>
          <p className="text-slate-600 text-xs">
            ⚠️ Bu site yatırım tavsiyesi vermez. Bilgiler yalnızca eğitim amaçlıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
