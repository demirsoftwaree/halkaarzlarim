import { NextResponse } from "next/server";
import { fetchSpkIpoData } from "@/lib/spk-service";

export const revalidate = 3600;

const YILLAR = [2022, 2023, 2024, 2025, 2026];

export async function GET() {
  const sonuclar = await Promise.all(
    YILLAR.map(async (yil) => {
      try {
        const arzlar = await fetchSpkIpoData(yil);
        return { yil, toplamIpo: arzlar.length };
      } catch {
        return { yil, toplamIpo: 0 };
      }
    })
  );

  return NextResponse.json({ yillikIpo: sonuclar, guncelleme: new Date().toISOString() });
}
