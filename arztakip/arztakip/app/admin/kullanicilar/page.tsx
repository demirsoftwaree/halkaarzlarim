"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Star, StarOff, Trash2, RefreshCw, Crown } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Kullanici {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  lastSignIn: string;
  premium: boolean;
  premiumBitis: string | null;
}

function formatDate(d: string | null) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminKullanicilarPage() {
  const router = useRouter();
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [islem, setIslem] = useState<string | null>(null);
  const [premiumModal, setPremiumModal] = useState<Kullanici | null>(null);
  const [premiumBitis, setPremiumBitis] = useState("");
  const [silOnay, setSilOnay] = useState<Kullanici | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/kullanicilar");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setKullanicilar(data.users || []);
    } catch {
      setError("Kullanıcılar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function togglePremium(k: Kullanici, bitis?: string) {
    setIslem(k.uid);
    const yeniPremium = !k.premium;
    await fetch(`/api/admin/kullanicilar/${k.uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premium: yeniPremium, premiumBitis: yeniPremium ? (bitis || null) : null }),
    });
    setKullanicilar(prev =>
      prev.map(u => u.uid === k.uid ? { ...u, premium: yeniPremium, premiumBitis: yeniPremium ? (bitis || null) : null } : u)
    );
    setIslem(null);
    setPremiumModal(null);
  }

  async function silKullanici(k: Kullanici) {
    setIslem(k.uid);
    await fetch(`/api/admin/kullanicilar/${k.uid}`, { method: "DELETE" });
    setKullanicilar(prev => prev.filter(u => u.uid !== k.uid));
    setIslem(null);
    setSilOnay(null);
  }

  const topbarActions = (
    <button onClick={load} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors border border-slate-700 px-3 py-1.5 rounded-lg">
      <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Yenile
    </button>
  );

  return (
    <AdminLayout
      title="Üye Yönetimi"
      subtitle={`${kullanicilar.length} kayıtlı üye`}
      actions={topbarActions}
    >
      <>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-white">{kullanicilar.length}</div>
            <div className="text-sm text-slate-400 mt-1">Toplam Üye</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-amber-400">{kullanicilar.filter(k => k.premium).length}</div>
            <div className="text-sm text-slate-400 mt-1">Premium Üye</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-emerald-400">{kullanicilar.filter(k => !k.premium).length}</div>
            <div className="text-sm text-slate-400 mt-1">Ücretsiz Üye</div>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 text-sm">{error}</div>}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : kullanicilar.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Henüz kayıtlı üye yok.</div>
        ) : (
          <div className="space-y-2">
            {kullanicilar.map((k) => (
              <div key={k.uid} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-5 py-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {k.photoURL
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={k.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    : <span className="text-slate-300 font-bold text-sm">{(k.displayName || k.email || "?")[0].toUpperCase()}</span>
                  }
                </div>

                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white text-sm truncate">{k.displayName || "–"}</span>
                    {k.premium && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        <Crown size={10} /> Premium
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{k.email}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>Kayıt: {formatDate(k.createdAt)}</span>
                    {k.premium && k.premiumBitis && <span>Bitiş: {formatDate(k.premiumBitis)}</span>}
                  </div>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 shrink-0">
                  {k.premium ? (
                    <button
                      onClick={() => togglePremium(k)}
                      disabled={islem === k.uid}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                    >
                      <StarOff size={13} /> Premium Al
                    </button>
                  ) : (
                    <button
                      onClick={() => { setPremiumModal(k); setPremiumBitis(""); }}
                      disabled={islem === k.uid}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      <Star size={13} /> Premium Ver
                    </button>
                  )}
                  <button
                    onClick={() => setSilOnay(k)}
                    disabled={islem === k.uid}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Premium Ver Modal */}
      {premiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPremiumModal(null)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-semibold mb-1">Premium Ver</h3>
            <p className="text-slate-400 text-sm mb-5">{premiumModal.displayName || premiumModal.email}</p>
            <label className="block text-xs text-slate-400 mb-1.5">Bitiş Tarihi (opsiyonel)</label>
            <input
              type="date"
              value={premiumBitis}
              onChange={e => setPremiumBitis(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white mb-5 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-3">
              <button onClick={() => setPremiumModal(null)} className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-xl text-sm hover:bg-slate-700 transition-colors">İptal</button>
              <button
                onClick={() => togglePremium(premiumModal, premiumBitis || undefined)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Premium Ver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sil Onay Modal */}
      {silOnay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSilOnay(null)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-semibold mb-1">Üyeyi Sil</h3>
            <p className="text-slate-400 text-sm mb-5">{silOnay.displayName || silOnay.email} hesabı kalıcı olarak silinecek.</p>
            <div className="flex gap-3">
              <button onClick={() => setSilOnay(null)} className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-xl text-sm hover:bg-slate-700 transition-colors">İptal</button>
              <button
                onClick={() => silKullanici(silOnay)}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    </AdminLayout>
  );
}
