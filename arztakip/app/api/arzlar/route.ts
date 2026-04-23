import { NextResponse } from "next/server";
import { getArzlar } from "@/lib/arz-utils";

export const revalidate = 300; // 5 dakika cache

export async function GET() {
  try {
    const { arzlar, source } = await getArzlar();
    return NextResponse.json(
      { arzlar, source, count: arzlar.length, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("Arz API error:", err);
    return NextResponse.json({ arzlar: [], source: "error", count: 0 }, { status: 500 });
  }
}
