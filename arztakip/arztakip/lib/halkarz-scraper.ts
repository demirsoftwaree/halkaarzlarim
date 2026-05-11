import * as cheerio from "cheerio";
import { Arz, ArzDurum } from "./types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const TR_MONTHS: Record<string, string> = {
  "Ocak": "01", "Şubat": "02", "Mart": "03", "Nisan": "04",
  "Mayıs": "05", "Haziran": "06", "Temmuz": "07", "Ağustos": "08",
  "Eylül": "09", "Ekim": "10", "Kasım": "11", "Aralık": "12",
};

/** "2-3-4 Mart 2026" → { start: "2026-03-02", end: "2026-03-04" } */
function parseDateRange(raw: string): { start: string; end: string } {
  const cleaned = raw.trim();
  // "28-29-30 Ocak 2026" or "2-3-4 Mart 2026" or "5 Nisan 2026"
  const match = cleaned.match(/(\d+(?:-\d+)*)\s+(\w+)\s+(\d{4})/);
  if (!match) return { start: "", end: "" };
  const days = match[1].split("-");
  const month = TR_MONTHS[match[2]] ?? "01";
  const year = match[3];
  const pad = (d: string) => d.padStart(2, "0");
  return {
    start: `${year}-${month}-${pad(days[0])}`,
    end:   `${year}-${month}-${pad(days[days.length - 1])}`,
  };
}

/** "80,00 TL" → { low: 80, high: 80 } | "8,50 TL - 10,00 TL" → { low: 8.5, high: 10 } */
function parsePrice(raw: string): { low: number; high: number } {
  const nums = raw.replace(/\./g, "").replace(/,/g, ".").match(/\d+\.?\d*/g) ?? [];
  if (nums.length === 0) return { low: 0, high: 0 };
  const vals = nums.map(Number);
  return { low: vals[0], high: vals[vals.length - 1] };
}

/** "18.900.000 Lot" → 18900000 */
function parseLot(raw: string): number {
  return parseInt(raw.replace(/\./g, "").replace(/[^\d]/g, "")) || 0;
}

/** "%20,40" → 20.4 */
function parsePct(raw: string): number {
  return parseFloat(raw.replace("%", "").replace(",", ".")) || 50;
}

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function determineDurum(startDate: string, endDate: string): ArzDurum {
  if (!startDate) return "yaklasan";
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate || startDate);
  if (isNaN(start.getTime())) return "yaklasan";
  if (now < start) return "yaklasan";
  if (now >= start && now <= end) return "aktif";
  return "tamamlandi";
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "tr-TR,tr;q=0.9" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function parseCompanyPage(
  ticker: string,
  name: string,
  url: string,
  logo: string
): Promise<Arz | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    // Label → Value çiftlerini tabloden çek
    const data: Record<string, string> = {};
    $("table tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 2) {
        const label = $(cells.eq(0)).text().trim().replace(/\s*:\s*$/, "");
        const value = $(cells.eq(1)).text().trim();
        if (label) data[label] = value;
      }
    });

    const rawDate    = data["Halka Arz Tarihi"]        ?? data["Talep Tarihi"] ?? "";
    const rawPrice   = data["Halka Arz Fiyatı/Aralığı"] ?? data["Fiyat Aralığı"] ?? data["Fiyat"] ?? "";
    const rawLot     = data["Pay"]                     ?? data["Toplam Lot"] ?? "";
    const rawBroker  = data["Aracı Kurum"]             ?? "";
    const rawPctStr  = data["Fiili Dolaşımdaki Pay Oranı (%)"] ?? data["Bireysel Pay Oranı"] ?? "";
    const rawBorsaKod = data["Bist Kodu"]              ?? ticker;


    const { start, end } = parseDateRange(rawDate);
    const { low, high }  = parsePrice(rawPrice);
    const totalLots      = parseLot(rawLot);
    const bireyselPct    = rawPctStr ? parsePct(rawPctStr) : 50;

    // Şirket hakkında kısa açıklama
    const aciklama = $(".entry-content p, .post-content p, .sirket-hakkinda p").first().text().trim()
      || `${name} halka arz bilgileri.`;

    const durum = determineDurum(start, end);

    // Sektör tahmini — pazar + isimden
    let sektor = "Diğer";
    const nameLower = name.toLowerCase();
    if (nameLower.includes("gayrimenkul") || nameLower.includes("gyo")) sektor = "GYO";
    else if (nameLower.includes("teknoloji") || nameLower.includes("yazılım") || nameLower.includes("bilişim")) sektor = "Teknoloji";
    else if (nameLower.includes("gıda") || nameLower.includes("un") || nameLower.includes("tarım")) sektor = "Gıda";
    else if (nameLower.includes("enerji") || nameLower.includes("elektrik")) sektor = "Enerji";
    else if (nameLower.includes("turizm")) sektor = "Turizm";
    else if (nameLower.includes("inşaat")) sektor = "İnşaat";
    else if (nameLower.includes("elektronik") || nameLower.includes("kimya")) sektor = "Sanayi";
    else if (nameLower.includes("finans") || nameLower.includes("yatırım") || nameLower.includes("sigorta")) sektor = "Finans";

    return {
      id:              slugify(rawBorsaKod || ticker),
      ticker:          rawBorsaKod || ticker,
      sirketAdi:       name,
      logo:            logo || undefined,
      slug:            slugify(rawBorsaKod || ticker) || slugify(name),
      durum,
      sektor,
      talepBaslangic:  start,
      talepBitis:      end,
      arsFiyatiAlt:    low,
      arsFiyatiUst:    high,
      lotBuyuklugu:    100,
      araciKurum:      rawBroker,
      toplamArzLot:    totalLots,
      bireyselPayYuzde: bireyselPct,
      kapLinki:        "https://www.kap.org.tr",
      aciklama:        aciklama.slice(0, 500),
    };
  } catch (e) {
    console.error("parseCompanyPage error:", ticker, e);
    return null;
  }
}

/** Ana fonksiyon — halkarz.com'dan tüm 2026 arzlarını çeker */
export async function scrapeHalkarz(year = 2026): Promise<Arz[]> {
  const listHtml = await fetchHtml(`https://halkarz.com/k/halka-arz/${year}/`);
  const $ = cheerio.load(listHtml);

  const companies: { ticker: string; name: string; url: string; logo: string }[] = [];

  $("article.index-list").each((_, el) => {
    const ticker = $(el).find(".il-bist-kod").text().trim();
    const nameEl = $(el).find(".il-halka-arz-sirket a");
    const name   = nameEl.text().trim();
    const url    = nameEl.attr("href") || "";
    const logo   = $(el).find("img.slogo").attr("src") || "";
    if (ticker && name && url) {
      companies.push({ ticker, name, url, logo });
    }
  });

  // Paralel çek ama max 4 aynı anda (rate limit koruması)
  const results: Arz[] = [];
  for (let i = 0; i < companies.length; i += 4) {
    const batch = companies.slice(i, i + 4);
    const batchResults = await Promise.all(
      batch.map(c => parseCompanyPage(c.ticker, c.name, c.url, c.logo))
    );
    results.push(...batchResults.filter((r): r is Arz => r !== null));
    if (i + 4 < companies.length) {
      await new Promise(r => setTimeout(r, 500)); // hafif gecikme
    }
  }

  return results;
}
