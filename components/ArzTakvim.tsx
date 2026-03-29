"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Arz } from "@/lib/types";

const GUNLER = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const DURUM_RENK: Record<string, string> = {
  aktif:               "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  yaklasan:            "bg-blue-500/20 border-blue-500/40 text-blue-300",
  "basvuru-surecinde": "bg-amber-500/20 border-amber-500/40 text-amber-300",
  tamamlandi:          "bg-slate-700/60 border-slate-600/40 text-slate-400",
  ertelendi:           "bg-red-500/20 border-red-500/40 text-red-300",
};

interface Props {
  arzlar: Arz[];
  ay: Date;
  onAyDegistir: (d: Date) => void;
}

function ilkGunHaftaIci(year: number, month: number): number {
  // 0=Pazar, 1=Pzt … Pazartesi'yi ilk gün yapalım
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7; // 0=Pzt … 6=Paz
}

function ayinGunSayisi(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function ArzTakvim({ arzlar, ay, onAyDegistir }: Props) {
  const year  = ay.getFullYear();
  const month = ay.getMonth();

  const baslangicOffset = ilkGunHaftaIci(year, month);
  const toplamGun       = ayinGunSayisi(year, month);

  // Arzları tarihe göre indexle
  const arzByDate: Record<string, Arz[]> = {};
  for (const arz of arzlar) {
    const tarih = arz.borsadaIslemGormeTarihi || arz.talepBitis || arz.talepBaslangic;
    if (!tarih) continue;
    const d = new Date(tarih + "T12:00:00Z");
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate().toString();
      if (!arzByDate[key]) arzByDate[key] = [];
      arzByDate[key].push(arz);
    }
  }

  const ayAdi = ay.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  const bugun = new Date();
  const bugunKey = bugun.getFullYear() === year && bugun.getMonth() === month
    ? bugun.getDate().toString()
    : null;

  // Grid hücreleri: başlangıç boşlukları + günler
  const toplam = baslangicOffset + toplamGun;
  const satirSayisi = Math.ceil(toplam / 7);
  const hucreler = Array.from({ length: satirSayisi * 7 }, (_, i) => {
    const gunNo = i - baslangicOffset + 1;
    return gunNo >= 1 && gunNo <= toplamGun ? gunNo : null;
  });

  return (
    <div>
      {/* Ay navigasyonu */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => onAyDegistir(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-base font-semibold text-white capitalize">{ayAdi}</h2>
        <button
          type="button"
          onClick={() => onAyDegistir(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Gün başlıkları */}
      <div className="grid grid-cols-7 mb-1">
        {GUNLER.map(g => (
          <div key={g} className="text-center text-xs font-medium text-slate-500 py-2">
            {g}
          </div>
        ))}
      </div>

      {/* Takvim grid */}
      <div className="grid grid-cols-7 gap-1">
        {hucreler.map((gun, i) => {
          if (gun === null) {
            return <div key={i} className="h-20 sm:h-24 rounded-lg" />;
          }
          const key = gun.toString();
          const gunArzlari = arzByDate[key] ?? [];
          const bugunMu = key === bugunKey;

          return (
            <div
              key={i}
              className={`h-20 sm:h-24 rounded-lg p-1 border transition-colors ${
                bugunMu
                  ? "bg-slate-700/50 border-emerald-500/30"
                  : "bg-slate-800/30 border-slate-700/30"
              }`}
            >
              <span className={`text-xs font-medium block mb-1 text-right pr-1 ${
                bugunMu ? "text-emerald-400" : "text-slate-500"
              }`}>
                {gun}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {gunArzlari.slice(0, 2).map(arz => (
                  <Link
                    key={arz.id}
                    href={`/halka-arz/${arz.slug}`}
                    className={`text-[10px] leading-tight px-1 py-0.5 rounded border truncate block hover:opacity-80 transition-opacity ${
                      DURUM_RENK[arz.durum] ?? DURUM_RENK["tamamlandi"]
                    }`}
                    title={arz.sirketAdi}
                  >
                    {arz.ticker || arz.sirketAdi.split(" ")[0]}
                  </Link>
                ))}
                {gunArzlari.length > 2 && (
                  <span className="text-[9px] text-slate-500 text-center">
                    +{gunArzlari.length - 2} daha
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Renk açıklaması */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-slate-500">
        {[
          { durum: "aktif",    etiket: "Aktif" },
          { durum: "yaklasan", etiket: "Yaklaşan" },
          { durum: "tamamlandi", etiket: "Tamamlandı" },
        ].map(({ durum, etiket }) => (
          <span key={durum} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded border ${DURUM_RENK[durum]}`} />
            {etiket}
          </span>
        ))}
      </div>
    </div>
  );
}
