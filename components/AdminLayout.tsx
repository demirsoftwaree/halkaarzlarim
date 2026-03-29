"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, ListOrdered, Users, LogOut, ExternalLink, ChevronRight, Newspaper } from "lucide-react";

const navItems = [
  { href: "/admin/arzlar",      label: "Arz Yönetimi",   icon: ListOrdered, desc: "Arz ekle, düzenle" },
  { href: "/admin/kullanicilar", label: "Üye Yönetimi",  icon: Users,       desc: "Üyeler & premium" },
  { href: "/admin/haberler",    label: "Haber Yönetimi", icon: Newspaper,   desc: "Manuel haberler" },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#070c15] text-white flex">

      {/* Sidebar */}
      <aside className="w-60 bg-[#0d1420] border-r border-white/[0.06] flex flex-col fixed h-screen z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-white leading-tight">
                Arz<span className="text-emerald-400">Takip</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">Admin Paneli</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">Yönetim</p>
          {navItems.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  active
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={17} className={active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium leading-tight ${active ? "text-white" : ""}`}>{label}</div>
                  <div className="text-[11px] text-slate-600 leading-tight mt-0.5">{desc}</div>
                </div>
                {active && <ChevronRight size={14} className="text-emerald-400/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <ExternalLink size={15} />
            Siteyi Görüntüle
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm"
          >
            <LogOut size={15} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#0d1420]/80 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
