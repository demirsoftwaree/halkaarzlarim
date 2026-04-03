"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArzCard from "@/components/ArzCard";
import AdBanner from "@/components/AdBanner";
import ArzTakvim from "@/components/ArzTakvim";
import { mockArzlar } from "@/lib/mock-data";
import { Arz, ArzDurum } from "@/lib/types";
import { RefreshCw, List, CalendarDays } from "lucide-react";

const filtreler: { label: string; value: ArzDurum | "hepsi" }[] = [
  { label: "Tümü",       value: "hepsi"             },
  { label: "Aktif",      value: "aktif"             },
  { label: "Başvuru",    value: "basvuru-surecinde" },
  { label: "Yaklaşan",   value: "yaklasan"          },
  { label: "Tamamlandı", value: "tamamlandi"        },
  { label: "Ertelendi",  value: "ertelendi"         },
];

// Sıralama: aktif > başvuru > yaklaşan > ertelendi > tamamlandi (tamamlananlar kendi içinde yeniden eskiye)
const durumOncelik: Record<string, number> = {
  aktif: 0,
  "basvuru-surecinde": 1,
  yaklasan: 2,
  ertelendi: 3,
  tamamlandi: 4,
};

function sortArzlar(list: Arz[]): Arz[] {
  return [...list].sort((a, b) => {
    const pa = durumOncelik[a.durum] ?? 5;
    const pb = durumOncelik[b.durum] ?? 5;
    if (pa !== pb) return pa - pb;

    // Aynı durum içinde tarihe göre sırala
    const dateA = a.borsadaIslemGormeTarihi || a.talepBitis || "";
    const dateB = b.borsadaIslemGormeTarihi || b.talepBitis || "";

    // Tamamlananlar: en yeni üstte (azalan)
    if (a.durum === "tamamlandi") return dateB.localeCompare(dateA);
    // Diğerleri: en yakın üstte (artan)
    return dateA.localeCompare(dateB);
  });
}

type Goruntule = "liste" | "takvim";

export default function HalkaArzlarPage() {
  const [aktifFiltre, setAktifFiltre] = useState<ArzDurum | "hepsi">("hepsi");
  const [arzlar, setArzlar] = useState<Arz[]>(mockArzlar);
  const [loading, setLoading] = useState(true);
  const [goruntule, setGoruntule] = useState<Goruntule>("liste");
  const [takvimAy, setTakvimAy] = useState(new Date());
  const [guncelleme, setGuncelleme] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/arzlar");
        const data = await res.json();
        if (data.arzlar && data.arzlar.length > 0) {
          setArzlar(data.arzlar);
          setGuncelleme(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
        }
      } catch {
        // mock kalır
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtrelenmis = sortArzlar(
    aktifFiltre === "hepsi"
      ? arzlar
      : arzlar.filter(a => a.durum === aktifFiltre)
  );

  // Tamamlananları tarihe göre grupla (Ay/Yıl)
  const showGroups = aktifFiltre === "hepsi" || aktifFiltre === "tamamlandi";

  // Aktif/yaklaşan ve tamamlananları ayır
  const aktifler = filtrelenmis.filter(a => a.durum !== "tamamlandi");
  const tamamlananlar = filtrelenmis.filter(a => a.durum === "tamamlandi");

  // Tamamlananları ay-yıl gruplarına ayır
  const gruplar: Record<string, Arz[]> = {};
  for (const arz of tamamlananlar) {
    const tarih = arz.borsadaIslemGormeTarihi || arz.talepBitis || "";
    const key = tarih
      ? new Date(tarih).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })
      : "Bilinmeyen Tarih";
    if (!gruplar[key]) gruplar[key] = [];
    gruplar[key].push(arz);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Başlık */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Halka Arz Takvimi</h1>
            <p className="text-slate-400 text-sm">
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={11} className="animate-spin" /> Veriler yükleniyor…
                </span>
              ) : guncelleme ? (
                <span className="text-slate-500">Son güncelleme: {guncelleme}</span>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{arzlar.length} arz</span>
            {/* Liste / Takvim toggle */}
            <div className="flex rounded-xl overflow-hidden border border-slate-700">
              <button
                type="button"
                onClick={() => setGoruntule("liste")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                  goruntule === "liste"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
                title="Liste görünümü"
              >
                <List size={14} /> Liste
              </button>
              <button
                type="button"
                onClick={() => setGoruntule("takvim")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors border-l border-slate-700 ${
                  goruntule === "takvim"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
                title="Takvim görünümü"
              >
                <CalendarDays size={14} /> Takvim
              </button>
            </div>
          </div>
        </div>

        {/* Takvim görünümü */}
        {goruntule === "takvim" ? (
          <ArzTakvim arzlar={arzlar} ay={takvimAy} onAyDegistir={setTakvimAy} />
        ) : null}

        {/* Liste görünümü */}
        {goruntule === "liste" && (
          <>
            {/* Filtreler */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filtreler.map(f => {
                const count = f.value === "hepsi"
                  ? arzlar.length
                  : arzlar.filter(a => a.durum === f.value).length;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setAktifFiltre(f.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      aktifFiltre === f.value
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {f.label}
                    <span className="ml-2 text-xs opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* İçerik */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 animate-pulse h-56" />
                ))}
              </div>
            ) : filtrelenmis.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400">Bu kategoride halka arz bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {aktifler.length > 0 && (
                  <div>
                    {showGroups && (
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                        Aktif & Yaklaşan
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aktifler.map(arz => <ArzCard key={arz.id} arz={arz} />)}
                    </div>
                  </div>
                )}
                {tamamlananlar.length > 0 && (
                  <div>
                    {showGroups && aktifler.length > 0 && (
                      <div className="border-t border-slate-700/50 pt-10">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
                          Tamamlanan Arzlar
                        </h2>
                      </div>
                    )}
                    {showGroups ? (
                      <div className="space-y-8">
                        {Object.entries(gruplar).map(([ay, liste]) => (
                          <div key={ay}>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{ay}</span>
                              <div className="flex-1 border-t border-slate-700/50" />
                              <span className="text-xs text-slate-600">{liste.length} arz</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {liste.map(arz => <ArzCard key={arz.id} arz={arz} />)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tamamlananlar.map(arz => <ArzCard key={arz.id} arz={arz} />)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6">
        <AdBanner slot="horizontal" />
      </div>
      <Footer />
    </div>
  );
}
