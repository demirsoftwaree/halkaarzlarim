import Link from "next/link";
import { Calendar, Building2, ArrowRight, TrendingUp } from "lucide-react";
import { Arz } from "@/lib/types";
import { durumRenk, durumEtiket } from "@/lib/mock-data";
import WatchlistButton from "./WatchlistButton";

interface Props {
  arz: Arz;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ArzCard({ arz }: Props) {
  const days = daysLeft(arz.talepBitis);
  const isActive = arz.durum === "aktif" || arz.durum === "basvuru-surecinde";
  const isDone = arz.durum === "tamamlandi";

  return (
    <Link href={`/halka-arz/${arz.slug}`}>
      <div className={`bg-slate-800/60 border rounded-2xl p-5 transition-all cursor-pointer group ${
        isDone
          ? "border-slate-700/30 hover:border-slate-600/50 opacity-80 hover:opacity-100"
          : "border-slate-700/50 hover:border-emerald-500/30"
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
              isDone
                ? "bg-slate-700/50 text-slate-400"
                : "bg-gradient-to-br from-slate-700 to-slate-600 text-emerald-400"
            }`}>
              {arz.ticker.slice(0, 2)}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{arz.ticker}</div>
              <div className="text-slate-400 text-xs">{arz.sektor}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${durumRenk[arz.durum]}`}>
              {durumEtiket[arz.durum]}
            </span>
            <WatchlistButton slug={arz.slug} sirketAdi={arz.sirketAdi} ticker={arz.ticker} />
          </div>
        </div>

        {/* Company Name */}
        <h3 className="text-sm font-semibold text-slate-200 mb-4 leading-snug line-clamp-2">
          {arz.sirketAdi}
        </h3>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          {isDone && arz.borsadaIslemGormeTarihi ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp size={13} className="text-slate-500" />
              <span>Borsaya giriş: <span className="text-slate-300">{formatDate(arz.borsadaIslemGormeTarihi)}</span></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={13} className="text-emerald-400" />
              <span>{formatDate(arz.talepBaslangic)} – {formatDate(arz.talepBitis)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 size={13} className={isDone ? "text-slate-500" : "text-emerald-400"} />
            <span className="line-clamp-1">{arz.araciKurum || "–"}</span>
          </div>
          {arz.dagitimYontemi && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-[13px] text-center">⇌</span>
              <span>{arz.dagitimYontemi}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="bg-slate-900/50 rounded-xl p-3 mb-4">
          <div className="text-xs text-slate-500 mb-1">
            {isDone ? "Halka Arz Fiyatı" : "Fiyat Bandı"}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-bold text-lg ${isDone ? "text-slate-300" : "text-emerald-400"}`}>
              {arz.arsFiyatiAlt.toFixed(2)}
            </span>
            {arz.arsFiyatiAlt !== arz.arsFiyatiUst && (
              <>
                <span className="text-slate-500 text-sm">–</span>
                <span className="text-emerald-300 font-bold text-lg">{arz.arsFiyatiUst.toFixed(2)}</span>
              </>
            )}
            <span className="text-slate-500 text-xs ml-1">₺</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {isActive && days > 0 ? (
            <span className="text-xs text-amber-400 font-medium">⏱ {days} gün kaldı</span>
          ) : isDone ? (
            <span className="text-xs text-slate-500">
              %{(arz.bireyselPayYuzde ?? 0).toFixed(2)} halka arz oranı
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Bireysel pay: %{arz.bireyselPayYuzde}
            </span>
          )}
          <span className={`group-hover:translate-x-1 transition-transform ${isDone ? "text-slate-500" : "text-emerald-400"}`}>
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
