"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Menu, X, ChevronDown, Star, BarChart2, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import SideAds from "@/components/SideAds";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    setConfirmSignOut(false);
    await signOut();
    router.push("/");
  }

  return (
    <>
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Halka <span className="text-emerald-400">Arzlarım</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/halka-arzlar" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            Halka Arz Takvimi
          </Link>
          <Link href="/hisseler" className="flex items-center gap-1 text-slate-300 hover:text-white text-sm font-medium transition-colors">
            <BarChart2 size={14} /> Hisseler
          </Link>
<div className="relative group">
            <Link href="/araclar" className="flex items-center gap-1 text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Araçlar <ChevronDown size={14} />
            </Link>
            <div className="absolute top-full left-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link href="/araclar/tavan-simulatoru" className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-t-xl">
                📈 Tavan Simülatörü
              </Link>
              <Link href="/araclar/lot-hesaplama" className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700">
                🎯 Lot Dağıtım Hesaplayıcı
              </Link>
              <Link href="/araclar/kar-hesaplama" className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700">
                💰 Net Kâr Hesaplayıcı
              </Link>
              <Link href="/araclar/tavan-raporu" className="block px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-slate-700 flex items-center gap-1.5">
                👑 Tavan Getiri Raporu
              </Link>
              <Link href="/araclar/tavan-performansi" className="block px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-slate-700 rounded-b-xl flex items-center gap-1.5">
                🏆 Geçmiş Tavan Performansı
              </Link>
            </div>
          </div>
          <Link href="/haberler" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            Haberler
          </Link>
          <Link href="/blog" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            Blog
          </Link>
          <Link href="/premium" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            <Star size={14} fill="currentColor" />
            Premium
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <User size={15} className="text-emerald-400" />
                  </div>
                )}
                <span className="max-w-[120px] truncate">{user.displayName || user.email?.split("@")[0]}</span>
              </div>
              <Link
                href="/hesabim/takip-listem"
                className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 text-sm transition-colors"
              >
                <Star size={15} /> Takip Listem
              </Link>
              <Link
                href="/hesabim/portfoy"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <BarChart2 size={15} /> Portföy
              </Link>
              <button
                onClick={() => setConfirmSignOut(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <LogOut size={15} /> Çıkış
              </button>
            </div>
          ) : (
            <>
              <Link href="/giris" className="text-sm text-slate-300 hover:text-white transition-colors">Giriş Yap</Link>
              <Link href="/giris" className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Üye Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Menüyü aç/kapat"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-1">
          {[
            { href: "/halka-arzlar", label: "📅 Halka Arz Takvimi" },
            { href: "/araclar/tavan-simulatoru", label: "📈 Tavan Simülatörü" },
            { href: "/araclar/lot-hesaplama", label: "🎯 Lot Dağıtım" },
            { href: "/araclar/kar-hesaplama", label: "💰 Net Kâr" },
            { href: "/araclar/tavan-raporu", label: "👑 Tavan Getiri Raporu" },
            { href: "/araclar/tavan-performansi", label: "🏆 Geçmiş Tavan Performansı" },
            { href: "/hisseler", label: "📊 Hisseler" },
            { href: "/haberler", label: "📰 Haberler" },
            { href: "/blog", label: "📝 Blog" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-lg transition-colors text-sm"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/premium"
            onClick={() => setMenuOpen(false)}
            className="block text-amber-400 hover:bg-slate-800 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium"
          >
            ⭐ Premium
          </Link>
          <div className="pt-3 border-t border-slate-800 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <User size={15} className="text-emerald-400" />
                      </div>
                    )}
                    <span className="max-w-[160px] truncate">{user.displayName || user.email?.split("@")[0]}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors px-2 py-1"
                  >
                    <LogOut size={15} /> Çıkış
                  </button>
                </div>
                <Link
                  href="/hesabim/takip-listem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 px-3 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Star size={15} /> Takip Listem
                </Link>
                <Link
                  href="/hesabim/portfoy"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <BarChart2 size={15} /> Portföy
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/giris" onClick={() => setMenuOpen(false)} className="flex-1 text-center border border-slate-600 text-slate-300 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-colors">Giriş Yap</Link>
                <Link href="/giris" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">Üye Ol</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>

    {/* Çıkış onay dialog */}
    {confirmSignOut && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmSignOut(false)} />
        <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 className="text-white font-semibold text-base mb-2">Çıkış yapmak istiyor musun?</h3>
          <p className="text-slate-400 text-sm mb-6">Hesabından çıkış yapılacak.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmSignOut(false)}
              className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    )}
    <SideAds />
    </>
  );
}
