import { NextResponse } from "next/server";
import { getArzlar } from "@/lib/arz-utils";

export const revalidate = 3600; // 1 saat cache

export async function GET() {
  try {
    const { arzlar, source } = await getArzlar();
    return NextResponse.json({
      arzlar,
      source,
      count: arzlar.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Arz API error:", err);
    return NextResponse.json({ arzlar: [], source: "error", count: 0 }, { status: 500 });
  }
}
