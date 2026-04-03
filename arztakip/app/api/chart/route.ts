import { NextRequest, NextResponse } from "next/server";

const RANGE_MAP: Record<string, { interval: string; range: string }> = {
  "1g": { interval: "5m", range: "1d" },
  "1h": { interval: "60m", range: "5d" },
  "1a": { interval: "1d", range: "1mo" },
  "3a": { interval: "1d", range: "3mo" },
  "6a": { interval: "1d", range: "6mo" },
  "1y": { interval: "1d", range: "1y" },
  "tumu": { interval: "1wk", range: "max" },
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ticker = searchParams.get("ticker")?.toUpperCase();
  const rangeKey = (searchParams.get("range") || "3a").toLowerCase();

  if (!ticker) return NextResponse.json({ error: "ticker gerekli" }, { status: 400 });

  const { interval, range } = RANGE_MAP[rangeKey] || RANGE_MAP["3a"];
  const symbol = ticker.endsWith(".IS") ? ticker : `${ticker}.IS`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) return NextResponse.json({ error: "Veri yok" }, { status: 404 });

    const timestamps: number[] = result.timestamp || [];
    const closes: number[] = result.indicators?.quote?.[0]?.close || [];
    const meta = result.meta || {};

    // Null'ları temizle
    const pairs = timestamps
      .map((t, i) => ({ t, c: closes[i] }))
      .filter((p) => p.c != null);

    const cleanTs = pairs.map((p) => p.t);
    const cleanCs = pairs.map((p) => p.c);

    return NextResponse.json({
      symbol,
      timestamps: cleanTs,
      closes: cleanCs,
      regularMarketPrice: meta.regularMarketPrice,
      previousClose: meta.previousClose || meta.chartPreviousClose,
      currency: meta.currency,
    });
  } catch {
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 });
  }
}
