"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Arz, ArzDurum, TahsisatGrubu } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";

const SEKTORLER = [
  "Teknoloji", "Gayrimenkul", "Enerji", "Sanayi", "Perakende",
  "Finans", "Sağlık", "Gıda", "Turizm", "İnşaat", "Tarım", "Diğer",
];

const DURUMLAR: { value: ArzDurum; label: string }[] = [
  { value: "aktif", label: "Aktif (Talep topluyor)" },
  { value: "yaklasan", label: "Yaklaşan" },
  { value: "basvuru-surecinde", label: "Başvuru Sürecinde" },
  { value: "ertelendi", label: "Ertelendi" },
];

const PAZARLAR = ["Ana Pazar", "Yıldız Pazar", "Gelişen İşletmeler Pazarı", "Yakın İzleme Pazarı"];
const DAGITIM = ["Eşit Dağıtım", "Orantılı Dağıtım", "Karma"];

const EMPTY: Omit<Arz, "id" | "slug"> = {
  ticker: "",
  sirketAdi: "",
  durum: "yaklasan",
  sektor: "Teknoloji",
  talepBaslangic: "",
  talepBitis: "",
  arsFiyatiAlt: 0,
  arsFiyatiUst: 0,
  lotBuyuklugu: 100,
  araciKurum: "",
  toplamArzLot: 0,
  bireyselPayYuzde: 0,
  kapLinki: "",
  aciklama: "",
  borsadaIslemGormeTarihi: undefined,
  // Genişletilmiş alanlar
  pazar: "",
  dagitimYontemi: "",
  fiiliDolasimdakiPay: undefined,
  fiiliDolasimdakiPayOrani: undefined,
  halkaAciklik: undefined,
  halkaArzIskontosu: undefined,
  halkaArzBuyklugu: "",
  sirketHakkinda: "",
  ozetBolumler: [],
  tahsisatSonuclari: [],
  tavanSayisi: undefined,
  logo: "",
};

export default function AdminArzlarPage() {
  const router = useRouter();
  const [arzlar, setArzlar] = useState<Arz[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Arz, "id" | "slug">>(EMPTY);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchArzlar() {
    const res = await fetch("/api/admin/arzlar");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setArzlar(data);
    setLoading(false);
  }

  useEffect(() => { fetchArzlar(); }, []);

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  }

  function startEdit(arz: Arz) {
    const { id: _i, slug: _s, ...rest } = arz;
    setForm(rest);
    setEditSlug(arz.slug);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY);
    setEditSlug(null);
    setShowForm(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      arsFiyatiAlt: Number(form.arsFiyatiAlt),
      arsFiyatiUst: Number(form.arsFiyatiUst),
      lotBuyuklugu: Number(form.lotBuyuklugu),
      toplamArzLot: Number(form.toplamArzLot),
      bireyselPayYuzde: Number(form.bireyselPayYuzde),
      fiiliDolasimdakiPay: form.fiiliDolasimdakiPay ? Number(form.fiiliDolasimdakiPay) : undefined,
      fiiliDolasimdakiPayOrani: form.fiiliDolasimdakiPayOrani ? Number(form.fiiliDolasimdakiPayOrani) : undefined,
      halkaAciklik: form.halkaAciklik ? Number(form.halkaAciklik) : undefined,
      halkaArzIskontosu: form.halkaArzIskontosu ? Number(form.halkaArzIskontosu) : undefined,
    };

    let res: Response;
    if (editSlug) {
      res = await fetch(`/api/admin/arzlar/${editSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/admin/arzlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      flash("ok", editSlug ? "Arz güncellendi." : "Arz eklendi.");
      resetForm();
      fetchArzlar();
    } else {
      flash("err", "Kaydetme başarısız.");
    }
    setSaving(false);
  }

  async function handleDelete(slug: string, ad: string) {
    if (!confirm(`"${ad}" silinsin mi?`)) return;
    const res = await fetch(`/api/admin/arzlar/${slug}`, { method: "DELETE" });
    if (res.ok) { flash("ok", "Silindi."); fetchArzlar(); }
    else flash("err", "Silinemedi.");
  }


  const [tab, setTab] = useState<"temel" | "detay" | "bolumler" | "sonuclar">("temel");

  const set = (k: keyof typeof form, v: string | number | undefined) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Özet bölümleri yönetimi
  function addBolum() {
    setForm(p => ({ ...p, ozetBolumler: [...(p.ozetBolumler || []), { baslik: "", icerik: "" }] }));
  }
  function setBolum(i: number, k: "baslik" | "icerik", v: string) {
    setForm(p => {
      const arr = [...(p.ozetBolumler || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, ozetBolumler: arr };
    });
  }
  function removeBolum(i: number) {
    setForm(p => ({ ...p, ozetBolumler: (p.ozetBolumler || []).filter((_, j) => j !== i) }));
  }

  // Tahsisat sonuçları yönetimi
  const TAHSISAT_GRUPLARI = ["Yurt İçi Bireysel", "Yüksek Başvurulu", "Şirket Çalışanları", "Yurt İçi Kurumsal", "Yurt Dışı Kurumsal"];
  function addTahsisat() {
    setForm(p => ({ ...p, tahsisatSonuclari: [...(p.tahsisatSonuclari || []), { grup: TAHSISAT_GRUPLARI[0], kisi: 0, lot: 0, oran: 0 }] }));
  }
  function setTahsisat(i: number, k: keyof TahsisatGrubu, v: string | number) {
    setForm(p => {
      const arr = [...(p.tahsisatSonuclari || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, tahsisatSonuclari: arr };
    });
  }
  function removeTahsisat(i: number) {
    setForm(p => ({ ...p, tahsisatSonuclari: (p.tahsisatSonuclari || []).filter((_, j) => j !== i) }));
  }

  const durumRenk: Record<ArzDurum, string> = {
    aktif: "bg-emerald-500/20 text-emerald-400",
    yaklasan: "bg-blue-500/20 text-blue-400",
    "basvuru-surecinde": "bg-yellow-500/20 text-yellow-400",
    ertelendi: "bg-red-500/20 text-red-400",
    tamamlandi: "bg-gray-500/20 text-gray-400",
  };

  const topbarActions = !showForm ? (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
    >
      + Yeni Arz Ekle
    </button>
  ) : undefined;

  return (
    <AdminLayout
      title="Arz Yönetimi"
      subtitle={`${arzlar.length} arz kayıtlı`}
      actions={topbarActions}
    >
      <div className="text-white">
        {/* Flash */}
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "ok" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {msg.text}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editSlug ? "Arzı Düzenle" : "Yeni Arz Ekle"}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
            </div>

            {/* Tab seçici */}
            <div className="flex gap-1 mb-6 border-b border-white/10 pb-0">
              {(["temel", "detay", "bolumler", "sonuclar"] as const).map(t => (
                <button key={t} type="button" onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px ${tab === t ? "bg-emerald-500/10 border border-white/10 border-b-transparent text-emerald-400" : "text-gray-500 hover:text-gray-300"}`}>
                  {t === "temel" ? "Temel Bilgiler" : t === "detay" ? "Detay Bilgiler" : t === "bolumler" ? "Özet Bölümler" : "Dağıtım Sonuçları"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave}>
              {/* TEMEL BİLGİLER */}
              {tab === "temel" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Borsa Kodu (ticker)">
                    <input value={form.ticker} onChange={e => set("ticker", e.target.value)} className={input} placeholder="XXXXXX" />
                  </Field>
                  <Field label="Şirket Adı *">
                    <input required value={form.sirketAdi} onChange={e => set("sirketAdi", e.target.value)} className={input} placeholder="Şirket A.Ş." />
                  </Field>
                  <Field label="Durum *">
                    <select required value={form.durum} onChange={e => set("durum", e.target.value as ArzDurum)} className={input}>
                      {DURUMLAR.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Sektör *">
                    <select required value={form.sektor} onChange={e => set("sektor", e.target.value)} className={input}>
                      {SEKTORLER.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Halka Arz Tarihi — Başlangıç">
                    <input type="date" value={form.talepBaslangic} onChange={e => set("talepBaslangic", e.target.value)} className={input} />
                  </Field>
                  <Field label="Halka Arz Tarihi — Bitiş">
                    <input type="date" value={form.talepBitis} onChange={e => set("talepBitis", e.target.value)} className={input} />
                  </Field>
                  <Field label="BIST İlk İşlem Tarihi">
                    <input type="date" value={form.borsadaIslemGormeTarihi || ""} onChange={e => set("borsadaIslemGormeTarihi", e.target.value)} className={input} />
                  </Field>
                  <Field label="Halka Arz Fiyatı / Aralığı — Alt (₺)">
                    <input type="number" min={0} step={0.01} value={form.arsFiyatiAlt || ""} onChange={e => set("arsFiyatiAlt", e.target.value)} className={input} placeholder="0.00" />
                  </Field>
                  <Field label="Halka Arz Fiyatı / Aralığı — Üst (₺)">
                    <input type="number" min={0} step={0.01} value={form.arsFiyatiUst || ""} onChange={e => set("arsFiyatiUst", e.target.value)} className={input} placeholder="0.00" />
                  </Field>
                  <Field label="Aracı Kurum">
                    <input value={form.araciKurum} onChange={e => set("araciKurum", e.target.value)} className={input} placeholder="Garanti Yatırım" />
                  </Field>
                  <Field label="Halka Arz Oranı — Bireysel (%)">
                    <input type="number" min={0} max={100} value={form.bireyselPayYuzde || ""} onChange={e => set("bireyselPayYuzde", e.target.value)} className={input} placeholder="25" />
                  </Field>
                  <Field label="Pay (Lot Adedi)">
                    <input type="number" min={0} value={form.toplamArzLot || ""} onChange={e => set("toplamArzLot", e.target.value)} className={input} placeholder="18900000" />
                  </Field>
                  <Field label="Logo URL" className="md:col-span-2">
                    <input value={form.logo || ""} onChange={e => set("logo", e.target.value)} className={input} placeholder="https://..." />
                  </Field>
                  <Field label="KAP Linki" className="md:col-span-2">
                    <input value={form.kapLinki} onChange={e => set("kapLinki", e.target.value)} className={input} placeholder="https://www.kap.org.tr/..." />
                  </Field>
                  <Field label="Kısa Açıklama" className="md:col-span-2">
                    <textarea rows={3} value={form.aciklama} onChange={e => set("aciklama", e.target.value)} className={input + " resize-none"} placeholder="Halka arz hakkında kısa not..." />
                  </Field>
                </div>
              )}

              {/* DETAY BİLGİLER */}
              {tab === "detay" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Pazar">
                    <select value={form.pazar || ""} onChange={e => set("pazar", e.target.value)} className={input}>
                      <option value="">— Seçin —</option>
                      {PAZARLAR.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Dağıtım Yöntemi">
                    <select value={form.dagitimYontemi || ""} onChange={e => set("dagitimYontemi", e.target.value)} className={input}>
                      <option value="">— Seçin —</option>
                      {DAGITIM.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Fiili Dolaşımdaki Pay (Lot)">
                    <input type="number" min={0} value={form.fiiliDolasimdakiPay || ""} onChange={e => set("fiiliDolasimdakiPay", e.target.value)} className={input} placeholder="18900000" />
                  </Field>
                  <Field label="Fiili Dolaşım Oranı (%)">
                    <input type="number" min={0} max={100} step={0.01} value={form.fiiliDolasimdakiPayOrani || ""} onChange={e => set("fiiliDolasimdakiPayOrani", e.target.value)} className={input} placeholder="20.40" />
                  </Field>
                  <Field label="Halka Açıklık (%)">
                    <input type="number" min={0} max={100} step={0.01} value={form.halkaAciklik || ""} onChange={e => set("halkaAciklik", e.target.value)} className={input} placeholder="25.11" />
                  </Field>
                  <Field label="Halka Arz İskontosu (%)">
                    <input type="number" min={0} max={100} step={0.1} value={form.halkaArzIskontosu || ""} onChange={e => set("halkaArzIskontosu", e.target.value)} className={input} placeholder="20" />
                  </Field>
                  <Field label="Halka Arz Büyüklüğü" className="md:col-span-2">
                    <input value={form.halkaArzBuyklugu || ""} onChange={e => set("halkaArzBuyklugu", e.target.value)} className={input} placeholder="3.7 Milyar TL" />
                  </Field>
                  <Field label="Şirket Hakkında (Uzun Metin)" className="md:col-span-2">
                    <textarea rows={6} value={form.sirketHakkinda || ""} onChange={e => set("sirketHakkinda", e.target.value)} className={input + " resize-y"} placeholder="Şirketin faaliyet alanı, kuruluş tarihi, portföy bilgileri..." />
                  </Field>
                </div>
              )}

              {/* ÖZET BÖLÜMLER */}
              {tab === "bolumler" && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400">Halka Arz Şekli, Fonun Kullanım Yeri, Tahsisat Grupları vb. serbest bölümler ekleyin.</p>
                  {(form.ozetBolumler || []).map((b, i) => (
                    <div key={i} className="bg-[#0a0f1a] border border-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Bölüm {i + 1}</span>
                        <button type="button" onClick={() => removeBolum(i)} className="text-red-400 hover:text-red-300 text-xs">Sil</button>
                      </div>
                      <input
                        value={b.baslik}
                        onChange={e => setBolum(i, "baslik", e.target.value)}
                        className={input}
                        placeholder="Başlık (örn: Halka Arz Şekli)"
                      />
                      <textarea
                        rows={4}
                        value={b.icerik}
                        onChange={e => setBolum(i, "icerik", e.target.value)}
                        className={input + " resize-y"}
                        placeholder={"Sermaye Artırımı: 105.652.000 Lot\nOrtak Satışı: 70.348.000 Lot"}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addBolum} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                    + Yeni Bölüm Ekle
                  </button>
                </div>
              )}

              {/* DAĞITIM SONUÇLARI */}
              {tab === "sonuclar" && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400">İzahnameden gelen tahsisat grubu sonuçlarını girin (tamamlanan arzlar için).</p>
                  {/* Tavan sayısı */}
                  <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-4">
                    <label className="block text-xs text-gray-400 mb-2">Üst Üste Tavan Sayısı</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={form.tavanSayisi ?? ""}
                      onChange={e => setForm(f => ({ ...f, tavanSayisi: e.target.value ? Number(e.target.value) : undefined }))}
                      placeholder="Örn: 8"
                      className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Halka arz sonrası üst üste kaç gün tavan yaptığını girin. Geçmiş Tavan Performansı sayfasında gösterilir.</p>
                  </div>
                  {(form.tahsisatSonuclari || []).map((t, i) => (
                    <div key={i} className="bg-[#0a0f1a] border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-400">Grup {i + 1}</span>
                        <button type="button" onClick={() => removeTahsisat(i)} className="text-red-400 hover:text-red-300 text-xs">Sil</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">Yatırımcı Grubu</label>
                          <select value={t.grup} onChange={e => setTahsisat(i, "grup", e.target.value)} className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                            {TAHSISAT_GRUPLARI.map(g => <option key={g}>{g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Kişi Sayısı</label>
                          <input type="number" value={t.kisi} onChange={e => setTahsisat(i, "kisi", Number(e.target.value))} className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Lot Adedi</label>
                          <input type="number" value={t.lot} onChange={e => setTahsisat(i, "lot", Number(e.target.value))} className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Oran (%)</label>
                          <input type="number" step="0.01" value={t.oran} onChange={e => setTahsisat(i, "oran", Number(e.target.value))} className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addTahsisat} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                    + Grup Ekle
                  </button>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-6 mt-2 border-t border-white/10">
                <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                  {saving ? "Kaydediliyor..." : editSlug ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LİSTE */}
        {loading ? (
          <div className="text-gray-500 text-center py-16">Yükleniyor...</div>
        ) : arzlar.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">📋</p>
            <p>Henüz yaklaşan arz eklenmedi.</p>
            <button onClick={() => setShowForm(true)} className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm underline">
              İlk arzı ekle
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {arzlar.map((arz) => (
              <div key={arz.slug} className="bg-[#111827] border border-white/10 rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {arz.ticker && (
                      <span className="font-mono font-bold text-emerald-400 text-sm">{arz.ticker}</span>
                    )}
                    <span className="font-semibold text-white truncate">{arz.sirketAdi}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${durumRenk[arz.durum] || "bg-gray-500/20 text-gray-400"}`}>
                      {DURUMLAR.find(d => d.value === arz.durum)?.label.split(" ")[0] || arz.durum}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>{arz.sektor}</span>
                    {arz.talepBaslangic && <span>{arz.talepBaslangic} – {arz.talepBitis}</span>}
                    {arz.arsFiyatiAlt > 0 && (
                      <span>
                        {arz.arsFiyatiAlt === arz.arsFiyatiUst
                          ? `${arz.arsFiyatiAlt} ₺`
                          : `${arz.arsFiyatiAlt} – ${arz.arsFiyatiUst} ₺`}
                      </span>
                    )}
                    {arz.araciKurum && <span>{arz.araciKurum}</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(arz)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(arz.slug, arz.sirketAdi)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const input = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors";
