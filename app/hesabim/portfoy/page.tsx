"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import {
  getPortfoy,
  addPortfoyKayit,
  updatePortfoyKayit,
  deletePortfoyKayit,
  type PortfoyKayit,
} from "@/lib/portfolyo-service";
import type { Arz } from "@/lib/types";
import { PlusCircle, Trash2, Pencil, TrendingUp, TrendingDown, Crown, X, Check } from "lucide-react";
import AdBanner from "@/components/AdBanner";

function fmt(n: number, dec = 2) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}

function hesapla(k: PortfoyKayit) {
  const maliyet = k.alisFiyati * k.lotSayisi;
  const satisGeliri = k.satisFiyati ? k.satisFiyati * k.lotSayisi : null;
  const karZarar = satisGeliri !== null ? satisGeliri - maliyet : null;
  const karZararYuzde = karZarar !== null && maliyet > 0 ? (karZarar / maliyet) * 100 : null;
  return { maliyet, satisGeliri, karZarar, karZararYuzde };
}

interface FormState {
  slug: string;
  ticker: string;
  sirketAdi: string;
  lotSayisi: string;
  alisFiyati: string;
  satisFiyati: string;
  satisTarihi: string;
}

const BOSH_FORM: FormState = {
  slug: "",
  ticker: "",
  sirketAdi: "",
  lotSayisi: "",
  alisFiyati: "",
  satisFiyati: "",
  satisTarihi: "",
};

export default function PortfoyPage() {
  const { user, isPremium, loading: authLoading } = useAuth();
  const router = useRouter();
  const [kayitlar, setKayitlar] = useState<PortfoyKayit[]>([]);
  const [arzlar, setArzlar] = useState<Arz[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAcik, setModalAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<PortfoyKayit | null>(null);
  const [form, setForm] = useState<FormState>(BOSH_FORM);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [silinenId, setSilinenId] = useState<string | null>(null);

  const yukle = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getPortfoy(user.uid);
    data.sort((a, b) => a.ticker.localeCompare(b.ticker));
    setKayitlar(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/giris");
      return;
    }
    if (user && isPremium) yukle();
  }, [user, isPremium, authLoading, router, yukle]);

  useEffect(() => {
    fetch("/api/arzlar")
      .then((r) => r.json())
      .then((d) => setArzlar(d.arzlar || []))
      .catch(() => {});
  }, []);

  function arzSecildi(slug: string) {
    const arz = arzlar.find((a) => a.slug === slug);
    if (!arz) { setForm(f => ({ ...f, slug, ticker: "", sirketAdi: "", alisFiyati: "" })); return; }
    setForm(f => ({
      ...f,
      slug: arz.slug,
      ticker: arz.ticker,
      sirketAdi: arz.sirketAdi,
      alisFiyati: String(arz.arsFiyatiUst || arz.arsFiyatiAlt || ""),
    }));
  }

  function modalAc(kayit?: PortfoyKayit) {
    if (kayit) {
      setDuzenlenen(kayit);
      setForm({
        slug: kayit.slug,
        ticker: kayit.ticker,
        sirketAdi: kayit.sirketAdi,
        lotSayisi: String(kayit.lotSayisi),
        alisFiyati: String(kayit.alisFiyati),
        satisFiyati: kayit.satisFiyati ? String(kayit.satisFiyati) : "",
        satisTarihi: kayit.satisTarihi || "",
      });
    } else {
      setDuzenlenen(null);
      setForm(BOSH_FORM);
    }
    setModalAcik(true);
  }

  function modalKapat() {
    setModalAcik(false);
    setDuzenlenen(null);
    setForm(BOSH_FORM);
  }

  async function kaydet() {
    if (!user || !form.ticker || !form.lotSayisi || !form.alisFiyati) return;
    setKaydediliyor(true);
    try {
      const veri = {
        slug: form.slug || form.ticker.toLowerCase(),
        ticker: form.ticker.toUpperCase(),
        sirketAdi: form.sirketAdi || form.ticker.toUpperCase(),
        lotSayisi: parseInt(form.lotSayisi) || 0,
        alisFiyati: parseFloat(form.alisFiyati.replace(",", ".")) || 0,
        ...(form.satisFiyati ? { satisFiyati: parseFloat(form.satisFiyati.replace(",", ".")) } : {}),
        ...(form.satisTarihi ? { satisTarihi: form.satisTarihi } : {}),
      };

      if (duzenlenen) {
        await updatePortfoyKayit(user.uid, duzenlenen.id, {
          lotSayisi: veri.lotSayisi,
          alisFiyati: veri.alisFiyati,
          ...(veri.satisFiyati !== undefined ? { satisFiyati: veri.satisFiyati } : {}),
          ...(veri.satisTarihi ? { satisTarihi: veri.satisTarihi } : {}),
        });
      } else {
        await addPortfoyKayit(user.uid, veri);
      }
      await yukle();
      modalKapat();
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(id: string) {
    if (!user) return;
    setSilinenId(id);
    await deletePortfoyKayit(user.uid, id);
    await yukle();
    setSilinenId(null);
  }

  // Özet hesapla
  const ozet = kayitlar.reduce(
    (acc, k) => {
      const { maliyet, karZarar } = hesapla(k);
      acc.toplamMaliyet += maliyet;
      if (karZarar !== null) acc.toplamKarZarar += karZarar;
      if (k.satisFiyati) acc.kapaliPozisyon++;
      else acc.acikPozisyon++;
      return acc;
    },
    { toplamMaliyet: 0, toplamKarZarar: 0, acikPozisyon: 0, kapaliPozisyon: 0 }
  );

  if (authLoading) return null;

  // Premium gate
  if (user && !isPremium) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Crown size={24} className="text-amber-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Premium Özellik</h3>
            <p className="text-slate-400 text-sm mb-6">Portföy Takibi premium üyelere özel bir özelliktir.</p>
            <Link href="/premium" className="block w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-medium py-2.5 rounded-xl text-sm transition-colors text-center">
              Premium&apos;a Geç
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Portföy Takibi</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium flex items-center gap-1">
                  <Crown size={10} /> Premium
                </span>
              </div>
              <p className="text-slate-400 text-sm">Halka arz yatırımlarını takip et, kâr/zarar hesapla.</p>
            </div>
          </div>
          <button
            onClick={() => modalAc()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <PlusCircle size={16} /> Ekle
          </button>
        </div>

        {/* Özet kartlar */}
        {kayitlar.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Toplam Maliyet</div>
              <div className="font-bold text-white text-lg">{fmt(ozet.toplamMaliyet)} ₺</div>
            </div>
            <div className={`bg-slate-800/60 border rounded-2xl p-4 ${ozet.toplamKarZarar >= 0 ? "border-emerald-500/20" : "border-red-500/20"}`}>
              <div className="text-xs text-slate-500 mb-1">Net Kâr / Zarar</div>
              <div className={`font-bold text-lg ${ozet.toplamKarZarar >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {ozet.toplamKarZarar >= 0 ? "+" : ""}{fmt(ozet.toplamKarZarar)} ₺
              </div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Açık Pozisyon</div>
              <div className="font-bold text-white text-lg">{ozet.acikPozisyon}</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Kapalı Pozisyon</div>
              <div className="font-bold text-white text-lg">{ozet.kapaliPozisyon}</div>
            </div>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />)}
          </div>
        ) : kayitlar.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Henüz kayıt yok.</p>
            <p className="text-xs mt-1">İlk halka arz yatırımını ekle.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {kayitlar.map(k => {
              const { maliyet, satisGeliri, karZarar, karZararYuzde } = hesapla(k);
              const pozitif = karZarar !== null ? karZarar >= 0 : null;
              return (
                <div key={k.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{k.ticker}</span>
                        <span className="text-slate-400 text-sm">{k.sirketAdi}</span>
                        {k.satisFiyati ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">Satıldı</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Elde</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400 mt-2">
                        <span>{k.lotSayisi} lot</span>
                        <span>Alış: <span className="text-white">{fmt(k.alisFiyati)} ₺</span></span>
                        <span>Maliyet: <span className="text-white">{fmt(maliyet)} ₺</span></span>
                        {k.satisFiyati && (
                          <>
                            <span>Satış: <span className="text-white">{fmt(k.satisFiyati)} ₺</span></span>
                            {satisGeliri && <span>Gelir: <span className="text-white">{fmt(satisGeliri)} ₺</span></span>}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {karZarar !== null && (
                        <div className={`text-right ${pozitif ? "text-emerald-400" : "text-red-400"}`}>
                          <div className="font-bold text-base flex items-center gap-1 justify-end">
                            {pozitif ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {pozitif ? "+" : ""}{fmt(karZarar)} ₺
                          </div>
                          <div className="text-xs font-medium">
                            {pozitif ? "+" : ""}{fmt(karZararYuzde ?? 0, 1)}%
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => modalAc(k)}
                          className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => sil(k.id)}
                          disabled={silinenId === k.id}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={modalKapat} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">{duzenlenen ? "Kaydı Düzenle" : "Yeni Kayıt Ekle"}</h3>
              <button onClick={modalKapat} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              {/* Arz seç (sadece yeni kayıtta) */}
              {!duzenlenen && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Halka Arz Seç (Opsiyonel)</label>
                  <select
                    value={form.slug}
                    onChange={e => arzSecildi(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Manuel gir...</option>
                    {arzlar.map(a => (
                      <option key={a.slug} value={a.slug}>{a.ticker} — {a.sirketAdi}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Ticker *</label>
                  <input
                    type="text"
                    value={form.ticker}
                    onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))}
                    placeholder="ÖRNEK"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Lot Sayısı *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.lotSayisi}
                    onChange={e => setForm(f => ({ ...f, lotSayisi: e.target.value }))}
                    placeholder="100"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Şirket Adı</label>
                <input
                  type="text"
                  value={form.sirketAdi}
                  onChange={e => setForm(f => ({ ...f, sirketAdi: e.target.value }))}
                  placeholder="Şirket A.Ş."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Alış Fiyatı (₺) *</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.alisFiyati}
                  onChange={e => setForm(f => ({ ...f, alisFiyati: e.target.value }))}
                  placeholder="10,00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 mb-3">Satış bilgisi (opsiyonel)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Satış Fiyatı (₺)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.satisFiyati}
                      onChange={e => setForm(f => ({ ...f, satisFiyati: e.target.value }))}
                      placeholder="15,00"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Satış Tarihi</label>
                    <input
                      type="date"
                      value={form.satisTarihi}
                      onChange={e => setForm(f => ({ ...f, satisTarihi: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={modalKapat}
                className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors"
              >
                İptal
              </button>
              <button
                onClick={kaydet}
                disabled={kaydediliyor || !form.ticker || !form.lotSayisi || !form.alisFiyati}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Check size={15} /> {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
