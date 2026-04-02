import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Arz } from "@/lib/types";
import { durumRenk, durumEtiket } from "@/lib/mock-data";
import WatchlistButton from "./WatchlistButton";

interface Props { arz: Arz }

function fmtTarih(dateStr: string) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function daysLeft(dateStr: string) {
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);
  return Math.floor((end.getTime() - Date.now()) / 86400000);
}

// İlk aracı kurumu kısalt
function ilkAraciKurum(araciKurum: string): string {
  if (!araciKurum) return "–";
  const ilk = araciKurum.split(/[,·\-–]/)[0].trim();
  return ilk.length > 28 ? ilk.slice(0, 26) + "…" : ilk;
}

export default function ArzCard({ arz }: Props) {
  const days      = daysLeft(arz.talepBitis);
  const isDone    = arz.durum === "tamamlandi";
  const isActive  = arz.durum === "aktif" || arz.durum === "basvuru-surecinde";
  const fiyatText = arz.arsFiyatiAlt === arz.arsFiyatiUst
    ? `${arz.arsFiyatiUst.toFixed(2)} ₺`
    : `${arz.arsFiyatiAlt.toFixed(2)}–${arz.arsFiyatiUst.toFixed(2)} ₺`;

  return (
    <Link href={`/halka-arz/${arz.slug}`}>
      <div className={`bg-slate-800/60 border rounded-2xl p-4 transition-all cursor-pointer group hover:shadow-lg ${
        isDone
          ? "border-slate-700/30 hover:border-slate-600/50 opacity-80 hover:opacity-100"
          : "border-slate-700/50 hover:border-emerald-500/30 hover:shadow-emerald-500/5"
      }`}>

        {/* ── Üst satır: ikon + şirket + durum + watchlist ── */}
        <div className="flex items-center gap-3 mb-3">
          {/* Ticker ikonu */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
            isDone
              ? "bg-slate-700/50 text-slate-400"
              : "bg-gradient-to-br from-emerald-500/20 to-slate-700 text-emerald-400"
          }`}>
            {(arz.ticker || arz.sirketAdi).slice(0, 2).toUpperCase()}
          </div>

          {/* Şirket bilgisi */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {arz.ticker && (
                <span className={`font-bold text-sm ${isDone ? "text-slate-400" : "text-emerald-400"}`}>
                  {arz.ticker}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${durumRenk[arz.durum]}`}>
                {durumEtiket[arz.durum]}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{arz.sektor}</p>
          </div>

          <WatchlistButton slug={arz.slug} sirketAdi={arz.sirketAdi} ticker={arz.ticker} />
        </div>

        {/* ── Şirket adı ── */}
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1 mb-3">
          {arz.sirketAdi}
        </h3>

        {/* ── Fiyat + Tarih/Gün ── */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] text-slate-500 mb-0.5">
              {isDone ? "Halka Arz Fiyatı" : "Fiyat Bandı"}
            </div>
            <div className={`font-bold text-base ${isDone ? "text-slate-300" : "text-emerald-400"}`}>
              {fiyatText}
            </div>
          </div>

          {/* Sağ: tarih veya gün sayacı */}
          {isDone ? (
            arz.borsadaIslemGormeTarihi ? (
              <div className="text-right">
                <div className="text-[11px] text-slate-500 mb-0.5">BIST Girişi</div>
                <div className="text-xs text-slate-300 font-medium">
                  {fmtTarih(arz.borsadaIslemGormeTarihi)}
                </div>
              </div>
            ) : null
          ) : (
            <div className="text-right">
              <div className="text-[11px] text-slate-500 mb-0.5">Talep Dönemi</div>
              <div className="text-xs text-slate-300 font-medium">
                {fmtTarih(arz.talepBaslangic)} – {fmtTarih(arz.talepBitis)}
              </div>
            </div>
          )}
        </div>

        {/* ── Alt satır: aracı kurum + kalan gün / oran ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
          <span className="text-xs text-slate-500 truncate max-w-[60%]">
            {ilkAraciKurum(arz.araciKurum || "")}
          </span>

          {isActive && days >= 0 ? (
            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full shrink-0">
              {days === 0 ? "Son gün!" : `${days} gün kaldı`}
            </span>
          ) : isDone ? (
            <span className="text-xs text-slate-500 shrink-0 flex items-center gap-1">
              <TrendingUp size={11} />
              %{(arz.bireyselPayYuzde ?? 0).toFixed(0)} arz
            </span>
          ) : (
            <span className="text-xs text-slate-500 shrink-0">
              %{arz.bireyselPayYuzde} bireysel
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
