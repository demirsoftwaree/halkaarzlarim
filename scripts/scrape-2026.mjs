import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

await page.goto("https://halkarz.com/k/halka-arz/2026/", {
  waitUntil: "domcontentloaded", timeout: 15000
}).catch(e => console.log("Hata:", e.message));

await new Promise(r => setTimeout(r, 2000));

// Tüm linkleri ve içerikleri çek
const arzlar = await page.evaluate(() => {
  // Tablo satırlarını veya kart yapısını bul
  const rows = Array.from(document.querySelectorAll("tr, .arz-row, .company-row, [class*='ipo'], [class*='arz']"));
  const cards = Array.from(document.querySelectorAll(".card, article, [class*='item'], [class*='list']"));

  // Tüm link metinleri ve içerikleri
  const links = Array.from(document.querySelectorAll("a")).map(a => ({
    href: a.href,
    text: a.textContent.trim().slice(0, 100),
    parent: a.parentElement?.className?.slice(0, 50)
  })).filter(l => l.href.includes("halkarz.com") && l.text.length > 2);

  return {
    rowCount: rows.length,
    cardCount: cards.length,
    links: links.slice(0, 40),
    bodyText: document.body.innerText.slice(0, 3000)
  };
});

console.log("Body text:", arzlar.bodyText);
console.log("\nLinkler:");
arzlar.links.forEach(l => console.log(`  [${l.parent}] ${l.text} -> ${l.href}`));

// Şirket detay sayfasını dene
const firstCompanyLink = arzlar.links.find(l =>
  l.href.match(/halkarz\.com\/[a-z]/) &&
  !l.href.includes("/k/") &&
  !l.href.includes("halkarz.com/#")
);

if (firstCompanyLink) {
  console.log("\nŞirket sayfası deneniyor:", firstCompanyLink.href);
  await page.goto(firstCompanyLink.href, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  const detail = await page.evaluate(() => ({
    title: document.title,
    text: document.body.innerText.slice(0, 2000),
    metas: Array.from(document.querySelectorAll("meta[property], meta[name]")).map(m => ({
      name: m.getAttribute("property") || m.getAttribute("name"),
      content: m.getAttribute("content")?.slice(0, 100)
    }))
  }));
  console.log("Şirket sayfası:", detail.title);
  console.log(detail.text);
}

await browser.close();
