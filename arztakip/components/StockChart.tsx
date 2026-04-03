"use client";

import { useEffect, useState, useCallback } from "react";

interface ChartData {
  timestamps: number[];
  closes: number[];
  regularMarketPrice: number;
  previousClose: number;
}

const RANGES = [
  { key: "1g", label: "1 Gün" },
  { key: "1h", label: "1 Hafta" },
  { key: "1a", label: "1 Ay" },
  { key: "3a", label: "3 Ay" },
  { key: "6a", label: "6 Ay" },
  { key: "1y", label: "1 Yıl" },
  { key: "tumu", label: "Tümü" },
];

function SparkLine({ closes, positive }: { closes: number[]; positive: boolean }) {
  if (closes.length < 2) return null;
  const W = 600;
  const H = 140;
  const pad = 4;
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;

  const pts = closes.map((c, i) => {
    const x = pad + (i / (closes.length - 1)) * (W - pad * 2);
    const y = H - pad - ((c - min) / span) * (H - pad * 2);
    return `${x},${y}`;
  });

  const polyline = pts.join(" ");
  const fillPath = `M${pts[0]} L${pts.join(" L")} L${W - pad},${H} L${pad},${H} Z`;
  const color = positive ? "#10b981" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#chartGrad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function StockChart({
  ticker,
  arzFiyati,
  defaultRange = "3a",
}: {
  ticker: string;
  arzFiyati: number;
  defaultRange?: string;
}) {
  const [range, setRange] = useState(defaultRange);
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (r: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/chart?ticker=${ticker}&range=${r}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setData(d);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => { load(range); }, [range, load]);

  const price = data?.regularMarketPrice ?? 0;
  const prev = data?.previousClose ?? price;
  const change = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;
  const positive = change >= 0;

  const arzReturn = arzFiyati > 0 ? ((price - arzFiyati) / arzFiyati) * 100 : null;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      {/* Fiyat başlığı */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">{ticker} — Güncel Fiyat</div>
          {loading && !data ? (
            <div className="h-9 w-32 bg-slate-700 animate-pulse rounded" />
          ) : error ? (
            <div className="text-slate-500 text-sm">Fiyat alınamadı</div>
          ) : (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-white">
                {price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </span>
              <span className={`text-sm font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
                {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({positive ? "+" : ""}{changePct.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>

        {/* Halka arz getirisi */}
        {arzReturn !== null && !loading && !error && (
          <div className={`px-3 py-2 rounded-xl text-sm font-bold border ${
            arzReturn >= 0
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            <div className="text-xs font-normal text-slate-400 mb-0.5">Halka Arz Getirisi</div>
            {arzReturn >= 0 ? "+" : ""}{arzReturn.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Grafik */}
      <div className="relative">
        {loading && (
          <div className="h-36 bg-slate-700/40 animate-pulse rounded-xl" />
        )}
        {!loading && !error && data && (
          <SparkLine closes={data.closes} positive={positive} />
        )}
        {!loading && error && (
          <div className="h-36 flex items-center justify-center text-slate-600 text-sm">
            Grafik yüklenemedi
          </div>
        )}
      </div>

      {/* Zaman aralığı seçici */}
      <div className="flex gap-1 mt-3 flex-wrap">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              range === r.key
                ? "bg-emerald-500 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {arzFiyati > 0 && (
        <div className="mt-3 text-xs text-slate-600">
          Halka arz fiyatı: {arzFiyati.toFixed(2)} ₺
        </div>
      )}
    </div>
  );
}
