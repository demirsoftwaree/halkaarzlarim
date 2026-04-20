import { NextResponse } from "next/server";
import {
  fetchIpoSayisi,
  fetchYatirimciSayilari,
  fetchPiyasaDegerleri,
  SpkIpoSayisi,
  SpkYatirimci,
  SpkPiyasaDegeri,
} from "@/lib/spk-service";

export const revalidate = 3600; // 1 saatte bir yenile

const YILLAR = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

export interface YillikIpo {
  yil: number;
  toplamIpo: number;
  toplamTutarMilyarTl: number;
  sonBorsaSirketSayisi: number;
}

export interface AylikYatirimci {
  donem: string;
  yil: number;
  ay: number;
  toplamYatirimci: number;
  yerliOran: number;
  yabanciOran: number;
}

export interface AylikPiyasa {
  donem: string;
  yil: number;
  ay: number;
  toplamPiyasaMilyarTl: number;
  halkaAcikPiyasaMilyarTl: number;
  sirketSayisi: number;
}

export interface IstatistiklerResponse {
  yillikIpo: YillikIpo[];
  aylikYatirimci: AylikYatirimci[];
  aylikPiyasa: AylikPiyasa[];
  guncelleme: string;
}

async function safeIpo(yil: number): Promise<SpkIpoSayisi[]> {
  try { return await fetchIpoSayisi(yil); } catch { return []; }
}
async function safeYatirimci(yil: number): Promise<SpkYatirimci[]> {
  try { return await fetchYatirimciSayilari(yil); } catch { return []; }
}
async function safePiyasa(yil: number): Promise<SpkPiyasaDegeri[]> {
  try { return await fetchPiyasaDegerleri(yil); } catch { return []; }
}

export async function GET() {
  // Tüm yıllar için paralel fetch
  const [ipoSonuclar, yatirimciSonuclar, piyasaSonuclar] = await Promise.all([
    Promise.all(YILLAR.map(y => safeIpo(y))),
    Promise.all(YILLAR.map(y => safeYatirimci(y))),
    Promise.all(YILLAR.map(y => safePiyasa(y))),
  ]);

  // Yıllık IPO özeti
  const yillikIpo: YillikIpo[] = YILLAR.map((yil, i) => {
    const aylar = ipoSonuclar[i];
    const toplamIpo = aylar.reduce((s, a) => s + (a.borsadaIslemGormeyeBaslayanSirketSayisi || 0), 0);
    const toplamTutar = aylar.reduce((s, a) => s + (a.halkaAcilmaIhracTutariBinTl || 0), 0);
    const sonAy = aylar.filter(a => a.toplamBorsaSirketiSayisi > 0).at(-1);
    return {
      yil,
      toplamIpo,
      toplamTutarMilyarTl: Math.round(toplamTutar / 1_000_000 * 100) / 100,
      sonBorsaSirketSayisi: sonAy?.toplamBorsaSirketiSayisi ?? 0,
    };
  }).filter(y => y.toplamIpo > 0 || y.yil === new Date().getFullYear());

  // Aylık yatırımcı (son 3 yıl yeterli)
  const aylikYatirimci: AylikYatirimci[] = [];
  YILLAR.slice(-3).forEach((yil, i) => {
    const idx = YILLAR.length - 3 + i;
    yatirimciSonuclar[idx].forEach(a => {
      aylikYatirimci.push({
        donem: `${yil}/${String(a.ay).padStart(2, "0")}`,
        yil,
        ay: a.ay,
        toplamYatirimci: a.toplamYatirimciSayisi,
        yerliOran: a.borsaSirketlerininHalkaAcikBolumlerininPiyasaDegerinegoreYerliOrani,
        yabanciOran: a.borsaSirketlerininHalkaAcikBolumlerininPiyasaDegerinegoreYabanciOrani,
      });
    });
  });

  // Aylık piyasa değeri (son 3 yıl)
  const aylikPiyasa: AylikPiyasa[] = [];
  YILLAR.slice(-3).forEach((yil, i) => {
    const idx = YILLAR.length - 3 + i;
    piyasaSonuclar[idx].forEach(a => {
      aylikPiyasa.push({
        donem: `${yil}/${String(a.ay).padStart(2, "0")}`,
        yil,
        ay: a.ay,
        toplamPiyasaMilyarTl: Math.round(a.borsaSirketlerininToplamPiyasaDegeriMilyonTl / 1000 * 10) / 10,
        halkaAcikPiyasaMilyarTl: Math.round(a.borsaSirketlerininHalkaAcikKisimlarininPiyasaDegeriAcikKisimMilyonTl / 1000 * 10) / 10,
        sirketSayisi: a.borsaSirketSayisi,
      });
    });
  });

  const response: IstatistiklerResponse = {
    yillikIpo,
    aylikYatirimci,
    aylikPiyasa,
    guncelleme: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
