import { NextResponse } from "next/server";

const SYMBOLS = [
  { symbol: "XU100.IS",  label: "BIST 100",  type: "endeks" },
  { symbol: "XU030.IS",  label: "BIST 30",   type: "endeks" },
  { symbol: "USDTRY=X",  label: "USD/TRY",   type: "doviz"  },
  { symbol: "EURTRY=X",  label: "EUR/TRY",   type: "doviz"  },
  { symbol: "GBPTRY=X",  label: "GBP/TRY",   type: "doviz"  },
  { symbol: "GC=F",      label: "ALTIN_USD",  type: "altin"  },
];

async function fetchSymbol(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d&includePrePost=false`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`${symbol} fetch failed: ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`${symbol} meta yok`);
  return {
    price: meta.regularMarketPrice as number,
    prevClose: (meta.previousClose ?? meta.chartPreviousClose ?? meta.regularMarketPreviousClose) as number,
    changePercent: meta.regularMarketChangePercent as number,
  };
}

function fmt(val: number, type: string): string {
  if (type === "endeks") return val.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (type === "doviz")  return val.toFixed(2);
  return val.toFixed(2);
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      SYMBOLS.map(async (s) => ({ ...s, ...(await fetchSymbol(s.symbol)) }))
    );

    const data = results.map((r, i) => {
      if (r.status === "rejected") {
        return { symbol: SYMBOLS[i].label, value: "–", change: "–", positive: true, type: SYMBOLS[i].type };
      }
      const d = r.value;
      const pct = d.changePercent ?? (d.prevClose ? ((d.price - d.prevClose) / d.prevClose) * 100 : 0);
      const positive = pct >= 0;
      return {
        symbol: d.label,
        value: fmt(d.price, d.type),
        change: `${positive ? "+" : ""}${pct.toFixed(2)}%`,
        positive,
        type: d.type,
        rawPrice: d.price,
        rawPct: pct,
      };
    });

    // ALTIN gram TL hesapla
    const altinUSD = data.find((d) => d.symbol === "ALTIN_USD");
    const usdtry   = data.find((d) => d.symbol === "USD/TRY");
    if (altinUSD && altinUSD.rawPrice && usdtry && usdtry.rawPrice) {
      const gramTL = (altinUSD.rawPrice / 31.1035) * usdtry.rawPrice;
      altinUSD.symbol = "ALTIN/gr";
      altinUSD.value  = gramTL.toFixed(0) + " ₺";
    }

    const ticker = data.filter((d) => d.symbol !== "ALTIN_USD");
    return NextResponse.json({ ticker, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Ticker API error:", err);
    return NextResponse.json({ error: "Veri alınamadı", ticker: [] }, { status: 500 });
  }
}
