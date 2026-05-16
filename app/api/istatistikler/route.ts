import { NextResponse } from "next/server";
import { fetchSpkIpoData, fetchSpkYatirimciData, fetchSpkPiyasaData } from "@/lib/spk-service";

export const revalidate = 3600;

const YILLAR = [2022, 2023, 2024, 2025, 2026];
const SON_3_YIL = [2024, 2025, 2026];

export interface IstatistiklerResponse {
  yillikIpo: { yil: number; toplamIpo: number; toplamTutarMilyarTl: number; sonBorsaSirketSayisi: number }[];
  aylikYatirimci: { yil: number; ay: number; toplamYatirimci: number; yerliOran: number; yabanciOran: number }[];
  aylikPiyasa: { yil: number; ay: number; toplamPiyasaMilyarTl: number; halkaAcikPiyasaMilyarTl: number; sirketSayisi: number }[];
  guncelleme: string;
}

export async function GET() {
  const [yillikIpoSonuclar, yatirimciSonuclar, piyasaSonuclar] = await Promise.all([
    Promise.all(
      YILLAR.map(async (yil) => {
        try {
          const arzlar = await fetchSpkIpoData(yil);
          const toplamTutarMilyarTl = arzlar.reduce((sum, a) => sum + (a.arsFiyatiUst > 0 ? a.arsFiyatiUst : 0), 0);
          return { yil, toplamIpo: arzlar.length, toplamTutarMilyarTl: Math.round(toplamTutarMilyarTl) / 1000, sonBorsaSirketSayisi: 0 };
        } catch {
          return { yil, toplamIpo: 0, toplamTutarMilyarTl: 0, sonBorsaSirketSayisi: 0 };
        }
      })
    ),
    Promise.all(SON_3_YIL.map(yil => fetchSpkYatirimciData(yil).catch(() => []))),
    Promise.all(SON_3_YIL.map(yil => fetchSpkPiyasaData(yil).catch(() => []))),
  ]);

  return NextResponse.json({
    yillikIpo: yillikIpoSonuclar,
    aylikYatirimci: yatirimciSonuclar.flat().sort((a, b) => a.yil !== b.yil ? a.yil - b.yil : a.ay - b.ay),
    aylikPiyasa: piyasaSonuclar.flat().sort((a, b) => a.yil !== b.yil ? a.yil - b.yil : a.ay - b.ay),
    guncelleme: new Date().toISOString(),
  } satisfies IstatistiklerResponse);
}
