"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, Newspaper, ListOrdered,
  UserPlus, Star, ArrowRight, RefreshCw, Clock,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Stats {
  toplamKullanici: number;
  premiumKullanici: number;
  toplamHaber: number;
  yayindaHaber: number;
  aktifArzlar: number;
  sonKayitlar: { uid: string; email: string; createdAt: string }[];
  sonArzlar: {
    slug: string;
    sirketAdi: string;
    durum: string;
    talepBaslangic: string | null;
    talepBitis: string | null;
    arsFiyatiUst: number;
  }[];
}

function durumRenk(durum: string) {
  if (durum === "yaklasan") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (durum === "aktif") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (durum === "tamamlandi") return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

function durumEtiket(durum: string) {
  if (durum === "yaklasan") return "Yaklaşan";
  if (durum === "aktif") return "Aktif";
  if (durum === "tamamlandi") return "Tamamlandı";
  return durum;
}

function zamanOnce(dateStr: string) {
  if (!dateStr) return "–";
  const diff = Date.now() - new Date(dateStr).getTime();
  const dk = Math.floor(diff / 60000);
  if (dk < 60) return `${dk} dk önce`;
  const sa = Math.floor(dk / 60);
  if (sa < 24) return `${sa} saat önce`;
  const gun = Math.floor(sa / 24);
  return `${gun} gün önce`;
}

function fmt(dateStr: string | null) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchStats(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch {
      // hata durumunda mevcut veriyi koru
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchStats(); }, []);

  const statKartlar = [
    {
      label: "Toplam Üye",
      value: stats?.toplamKullanici ?? "–",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      href: "/admin/kullanicilar",
    },
    {
      label: "Premium Üye",
      value: stats?.premiumKullanici ?? "–",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      href: "/admin/kullanicilar",
    },
    {
      label: "Aktif Arz",
      value: stats?.aktifArzlar ?? "–",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      href: "/admin/arzlar",
    },
    {
      label: "Yayındaki Haber",
      value: stats?.yayindaHaber ?? "–",
      icon: Newspaper,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      href: "/admin/haberler",
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Genel bakış ve hızlı erişim"
      actions={
        <button
          onClick={() => fetchStats(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Yenile
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <RefreshCw size={20} className="animate-spin mr-3" /> Yükleniyor…
        </div>
      ) : (
        <div className="space-y-6">

          {/* ── Stat Kartları ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statKartlar.map(({ label, value, icon: Icon, color, bg, href }) => (
              <Link
                key={label}
                href={href}
                className={`border rounded-xl p-5 flex flex-col gap-3 hover:brightness-110 transition-all ${bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{label}</span>
                  <Icon size={16} className={color} />
                </div>
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
              </Link>
            ))}
          </div>

          {/* ── Alt İki Kolon ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Sol: Son Kayıtlar */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserPlus size={15} className="text-slate-400" />
                  <h2 className="text-sm font-semibold text-white">Son Kayıtlar</h2>
                </div>
                <Link href="/admin/kullanicilar" className="text-xs text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  Tümünü Gör <ArrowRight size={12} />
                </Link>
              </div>

              {stats?.sonKayitlar && stats.sonKayitlar.length > 0 ? (
                <div className="space-y-1">
                  {stats.sonKayitlar.map((u) => (
                    <div key={u.uid} className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold shrink-0">
                          {u.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-300 truncate">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0 ml-2">
                        <Clock size={11} />
                        {zamanOnce(u.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 py-4 text-center">Henüz kullanıcı yok</p>
              )}
            </div>

            {/* Sağ: Hızlı İşlemler + Son Arzlar */}
            <div className="space-y-4">

              {/* Hızlı İşlemler */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3">Hızlı İşlemler</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { href: "/admin/arzlar",       label: "Arz Ekle",    icon: TrendingUp, color: "text-emerald-400" },
                    { href: "/admin/haberler",      label: "Haber Ekle",  icon: Newspaper,  color: "text-purple-400"  },
                    { href: "/admin/kullanicilar",  label: "Üyeler",      icon: Users,      color: "text-blue-400"    },
                  ].map(({ href, label, icon: Icon, color }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex flex-col items-center gap-2 py-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 border border-slate-700/40 transition-all"
                    >
                      <Icon size={18} className={color} />
                      <span className="text-xs text-slate-400">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Son Arzlar */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ListOrdered size={15} className="text-slate-400" />
                    <h2 className="text-sm font-semibold text-white">Yaklaşan Arzlar</h2>
                  </div>
                  <Link href="/admin/arzlar" className="text-xs text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
                    Yönet <ArrowRight size={12} />
                  </Link>
                </div>

                {stats?.sonArzlar && stats.sonArzlar.length > 0 ? (
                  <div className="space-y-1">
                    {stats.sonArzlar.map((a) => (
                      <div key={a.slug} className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
                        <div className="min-w-0">
                          <div className="text-sm text-white font-medium truncate">{a.sirketAdi}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {a.talepBaslangic ? `${fmt(a.talepBaslangic)} – ${fmt(a.talepBitis)}` : "–"}
                            {" · "}
                            <span className="text-slate-400">{a.arsFiyatiUst?.toFixed(2)} ₺</span>
                          </div>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium shrink-0 ml-2 ${durumRenk(a.durum)}`}>
                          {durumEtiket(a.durum)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 py-4 text-center">Arz bulunamadı</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
