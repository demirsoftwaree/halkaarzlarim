import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

const jsonCalls = [];

page.on("response", async res => {
  const url = res.url();
  const ct  = res.headers()["content-type"] || "";
  if (ct.includes("application/json")) {
    try {
      const body = await res.text();
      jsonCalls.push({ url, method: "?", body: body.slice(0, 800) });
    } catch {}
  }
});

// Önce takvim sayfasını aç
await page.goto("https://www.halkaarz.info/tr/halka-arz-takvimi", {
  waitUntil: "networkidle0", timeout: 25000
}).catch(() => {});
await new Promise(r => setTimeout(r, 2000));

// Sayfada scroll yap — lazy load tetikle
await page.evaluate(() => window.scrollTo(0, 1000));
await new Promise(r => setTimeout(r, 2000));

// /en/ipo-calendar sayfasını dene
await page.goto("https://www.halkaarz.info/en/ipo-calendar", {
  waitUntil: "networkidle0", timeout: 25000
}).catch(() => {});
await new Promise(r => setTimeout(r, 3000));

console.log("=== JSON API ÇAĞRILARI ===");
for (const c of jsonCalls) {
  console.log("\nURL:", c.url);
  console.log("Data:", c.body);
}

await browser.close();
