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
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Yasal</h4>
            <ul className="space-y-2.5">
              {[
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

        {/* Mobil Uygulama */}
        <div className="border-t border-slate-800 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Mobil Uygulamayı İndir</h4>
              <p className="text-slate-500 text-xs">iPhone ve Android için ücretsiz</p>
            </div>
            <div className="flex items-center gap-3">
              {/* App Store — yakında */}
              <div
                title="Yakında kullanıma girecek"
                className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 opacity-50 cursor-not-allowed select-none"
              >
                <svg className="w-6 h-6 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-slate-400 text-xs leading-none mb-0.5">Yakında</div>
                  <div className="text-white font-semibold text-sm leading-none">App Store</div>
                </div>
              </div>

              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.halkaarzlarim_app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-slate-700/80 rounded-xl px-4 py-2.5 transition-all group"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M3.18 23.76c.28.15.59.24.93.24.37 0 .74-.1 1.07-.3L17.6 16.8l-4.1-4.1-10.32 11.06z" fill="#EA4335"/>
                  <path d="M20.9 10.27L18.15 8.7l-4.41 4 4.41 4 2.75-1.57c.79-.45 1.1-1.26 1.1-2.43 0-1.18-.31-1.98-1.1-2.43z" fill="#FBBC05"/>
                  <path d="M3.18.24L13.5 11.7l4.11-4.1L5.18.54C4.85.34 4.48.24 4.11.24c-.34 0-.65.09-.93.24z" fill="#4285F4"/>
                  <path d="M3.18.24C2.47.64 2 1.52 2 2.68v18.64c0 1.16.47 2.04 1.18 2.44L13.5 13.1 3.18.24z" fill="#34A853"/>
                </svg>
                <div className="text-left">
                  <div className="text-slate-400 text-xs leading-none mb-0.5 group-hover:text-slate-300 transition-colors">Google Play&apos;den İndir</div>
                  <div className="text-white font-semibold text-sm leading-none">Google Play</div>
                </div>
              </a>
            </div>
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
