"use client";
import { useEffect, useState, useCallback } from "react";

interface TickerItem {
  symbol: string;
  value: string;
  change: string;
  positive: boolean;
}

// Veri gelene kadar placeholder
const PLACEHOLDER: TickerItem[] = [
  { symbol: "BIST 100", value: "…", change: "…", positive: true },
  { symbol: "BIST 30",  value: "…", change: "…", positive: true },
  { symbol: "USD/TRY",  value: "…", change: "…", positive: true },
  { symbol: "EUR/TRY",  value: "…", change: "…", positive: true },
  { symbol: "GBP/TRY",  value: "…", change: "…", positive: true },
  { symbol: "ALTIN/gr", value: "…", change: "…", positive: true },
];

export default function TickerBar() {
  const [ticker, setTicker]       = useState<TickerItem[]>(PLACEHOLDER);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading]     = useState(true);

  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker");
      const data = await res.json();
      if (data.ticker && data.ticker.length > 0) {
        setTicker(data.ticker);
        if (data.updatedAt) {
          setUpdatedAt(new Date(data.updatedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch {
      // sessizce geç, placeholder kalsın
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicker();
    // 60 saniyede bir yenile
    const interval = setInterval(fetchTicker, 60_000);
    return () => clearInterval(interval);
  }, [fetchTicker]);

  // Ticker verisini iki kez tekrarlıyoruz — kesintisiz kayan şerit
  const doubled = [...ticker, ...ticker];

  return (
    <div className="bg-slate-800/60 border-b border-slate-700/50 overflow-hidden relative">
      <div
        className="ticker-animate flex"
        style={{ width: `${doubled.length * 180}px` }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-5 py-2 whitespace-nowrap"
            style={{ minWidth: "180px" }}
          >
            <span className="text-xs font-semibold text-slate-400">{item.symbol}</span>
            <span className={`text-xs font-medium ${loading ? "text-slate-600" : "text-white"}`}>
              {item.value}
            </span>
            {item.change !== "…" && (
              <span className={`text-xs font-semibold ${item.positive ? "text-emerald-400" : "text-red-400"}`}>
                {item.change}
              </span>
            )}
            <span className="text-slate-700 ml-1">|</span>
          </div>
        ))}
      </div>

      {/* Güncelleme saati — sağda */}
      {updatedAt && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 pointer-events-none">
          {updatedAt}
        </div>
      )}
    </div>
  );
}
