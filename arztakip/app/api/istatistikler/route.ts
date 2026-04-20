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

const IPO_YILLAR   = [2022, 2023, 2024, 2025, 2026]; // SPK 2020-2021 için bu endpoint'i tutmuyor
const GRAFIK_YILLAR = [2024, 2025, 2026];            // Aylık grafikler için son 3 yıl

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
  // Paralel fetch — sadece gerekli yıllar
  const [ipoSonuclar, yatirimciSonuclar, piyasaSonuclar] = await Promise.all([
    Promise.all(IPO_YILLAR.map(y => safeIpo(y))),
    Promise.all(GRAFIK_YILLAR.map(y => safeYatirimci(y))),
    Promise.all(GRAFIK_YILLAR.map(y => safePiyasa(y))),
  ]);

  // Yıllık IPO özeti
  const yillikIpo: YillikIpo[] = IPO_YILLAR.map((yil, i) => {
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
  });

  // Aylık yatırımcı (son 3 yıl)
  const aylikYatirimci: AylikYatirimci[] = [];
  GRAFIK_YILLAR.forEach((yil, i) => {
    yatirimciSonuclar[i].forEach(a => {
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
  GRAFIK_YILLAR.forEach((yil, i) => {
    piyasaSonuclar[i].forEach(a => {
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
