"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { slugOlustur, type ManuelHaber } from "@/lib/haberler-service";
import { Pencil, Trash2, Eye, EyeOff, PlusCircle, X, Check } from "lucide-react";

const KATEGORİLER = [
  { value: "blog",          label: "📝 Blog Yazısı" },
  { value: "halka-arz",     label: "Halka Arz" },
  { value: "borsa",         label: "Borsa" },
  { value: "sermaye",       label: "Sermaye" },
  { value: "genel-kurul",   label: "Genel Kurul" },
  { value: "sirket-haberi", label: "Şirket Haberi" },
  { value: "duyuru",        label: "Duyuru" },
];

const BOSH: Omit<ManuelHaber, "id" | "createdAt"> = {
  baslik: "",
  icerik: "",
  sirket: "",
  ticker: "",
  gorsel: "",
  kategori: "halka-arz",
  tarih: new Date().toISOString().split("T")[0],
  yayinda: true,
};

export default function AdminHaberlerPage() {
  const router = useRouter();
  const [haberler, setHaberler] = useState<ManuelHaber[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAcik, setModalAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<ManuelHaber | null>(null);
  const [form, setForm] = useState<Omit<ManuelHaber, "id" | "createdAt">>(BOSH);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [silinenId, setSilinenId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function yukle() {
    const res = await fetch("/api/admin/haberler");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setHaberler(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { yukle(); }, []);

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  }

  function modalAc(haber?: ManuelHaber) {
    if (haber) {
      setDuzenlenen(haber);
      const { id: _id, createdAt: _c, ...rest } = haber;
      setForm(rest);
    } else {
      setDuzenlenen(null);
      setForm(BOSH);
    }
    setModalAcik(true);
  }

  function modalKapat() {
    setModalAcik(false);
    setDuzenlenen(null);
  }

  async function kaydet() {
    if (!form.baslik.trim() || !form.sirket.trim()) return;
    setKaydediliyor(true);
    try {
      const id = duzenlenen?.id || slugOlustur(form.baslik) || `haber-${Date.now()}`;
      const res = await fetch("/api/admin/haberler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id }),
      });
      if (!res.ok) throw new Error("api");
      await yukle();
      modalKapat();
      flash("ok", duzenlenen ? "Güncellendi." : "Haber eklendi.");
    } catch {
      flash("err", "Kaydedilemedi.");
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(id: string) {
    setSilinenId(id);
    try {
      await fetch(`/api/admin/haberler/${id}`, { method: "DELETE" });
      setHaberler(prev => prev.filter(h => h.id !== id));
      flash("ok", "Silindi.");
    } catch {
      flash("err", "Silinemedi.");
    } finally {
      setSilinenId(null);
    }
  }

  async function toggleYayinda(h: ManuelHaber) {
    await fetch("/api/admin/haberler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...h, yayinda: !h.yayinda }),
    });
    setHaberler(prev => prev.map(x => x.id === h.id ? { ...x, yayinda: !x.yayinda } : x));
  }

  const topbarActions = (
    <button
      onClick={() => modalAc()}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
    >
      <PlusCircle size={16} /> Haber Ekle
    </button>
  );

  return (
    <AdminLayout title="Haber Yönetimi" subtitle={`${haberler.length} manuel haber`} actions={topbarActions}>
      <>
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "ok" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {msg.text}
          </div>
        )}

        <div className="mb-4 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 text-sm text-slate-400">
          Buradaki haberler <strong className="text-white">editöryal (tam içerikli)</strong> haberlerdir. SPK/KAP duyuruları otomatik çekilmekte olup bu sayfada yönetilmez.
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : haberler.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="mb-2">Henüz manuel haber eklenmedi.</p>
            <button onClick={() => modalAc()} className="text-emerald-400 text-sm hover:underline">İlk haberi ekle</button>
          </div>
        ) : (
          <div className="space-y-2">
            {haberler.map(h => (
              <div key={h.id} className={`bg-slate-800/60 border rounded-xl px-5 py-4 flex items-center gap-4 ${h.yayinda ? "border-slate-700/50" : "border-slate-700/20 opacity-60"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white text-sm truncate">{h.baslik}</span>
                    <span className="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
                      {KATEGORİLER.find(k => k.value === h.kategori)?.label ?? h.kategori}
                    </span>
                    {!h.yayinda && (
                      <span className="text-xs text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Taslak</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{h.sirket} · {h.tarih?.split("-").reverse().join(".")}</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleYayinda(h)}
                    className={`p-2 rounded-lg transition-colors ${h.yayinda ? "text-emerald-400 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-700"}`}
                    title={h.yayinda ? "Yayından kaldır" : "Yayınla"}
                  >
                    {h.yayinda ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => modalAc(h)}
                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => sil(h.id)}
                    disabled={silinenId === h.id}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalAcik && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={modalKapat} />
            <div className="relative bg-[#0d1420] border-l border-white/[0.06] w-full max-w-xl h-screen overflow-y-auto shadow-2xl flex flex-col">
              {/* Modal başlık */}
              <div className="sticky top-0 bg-[#0d1420] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="font-semibold text-white">{duzenlenen ? "Haberi Düzenle" : "Yeni Haber Ekle"}</h3>
                <button onClick={modalKapat} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="flex-1 px-6 py-6 space-y-5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Başlık *</label>
                  <input
                    type="text"
                    value={form.baslik}
                    onChange={e => setForm(f => ({ ...f, baslik: e.target.value }))}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Haber başlığı..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Şirket *</label>
                    <input
                      type="text"
                      value={form.sirket}
                      onChange={e => setForm(f => ({ ...f, sirket: e.target.value }))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Şirket A.Ş."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Ticker</label>
                    <input
                      type="text"
                      value={form.ticker ?? ""}
                      onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 uppercase"
                      placeholder="ÖRNEK"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Kategori</label>
                    <select
                      value={form.kategori}
                      onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      {KATEGORİLER.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Tarih</label>
                    <input
                      type="date"
                      value={form.tarih}
                      onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Görsel URL (logo veya kapak görseli)</label>
                  <input
                    type="text"
                    value={form.gorsel ?? ""}
                    onChange={e => setForm(f => ({ ...f, gorsel: e.target.value }))}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">İçerik *</label>
                  <p className="text-xs text-slate-600 mb-1.5">Her boş satır yeni paragraf oluşturur.</p>
                  <textarea
                    value={form.icerik}
                    onChange={e => setForm(f => ({ ...f, icerik: e.target.value }))}
                    rows={12}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 resize-y"
                    placeholder="Haber içeriğini buraya yazın..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="yayinda"
                    checked={form.yayinda}
                    onChange={e => setForm(f => ({ ...f, yayinda: e.target.checked }))}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <label htmlFor="yayinda" className="text-sm text-slate-300">Hemen yayınla</label>
                </div>
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 bg-[#0d1420] border-t border-white/[0.06] px-6 py-4 flex gap-3">
                <button onClick={modalKapat} className="flex-1 border border-slate-600 text-slate-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                  İptal
                </button>
                <button
                  onClick={kaydet}
                  disabled={kaydediliyor || !form.baslik.trim() || !form.sirket.trim()}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={15} /> {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </AdminLayout>
  );
}
