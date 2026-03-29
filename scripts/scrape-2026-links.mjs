import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

await page.goto("https://halkarz.com/k/halka-arz/2026/", { waitUntil: "domcontentloaded", timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));

// Sayfanın asıl içerik kısmını bul
const data = await page.evaluate(() => {
  // halkarz.com'da şirket kartları genellikle belirli bir class altında
  // Tüm a etiketlerini al
  const allLinks = Array.from(document.querySelectorAll("a[href]")).map(a => ({
    href: a.href,
    text: a.closest(".post-content, .entry-content, article, main") ? "MAIN_CONTENT" : "OTHER",
    innerText: a.innerText.trim().slice(0, 80)
  }));

  // article veya post linkleri
  const articleLinks = Array.from(document.querySelectorAll("article a, .post a, .entry a, main a")).map(a => ({
    href: a.href, text: a.innerText.trim().slice(0, 80)
  }));

  // tüm liste elementleri
  const listItems = Array.from(document.querySelectorAll("li")).map(li => ({
    text: li.innerText.trim().slice(0, 100),
    link: li.querySelector("a")?.href
  })).filter(li => li.text && !li.text.includes("submenu") && !li.text.includes("Yılı") && li.text.length > 3 && li.text.length < 80);

  // HTML yapısına bak
  const mainContent = document.querySelector("main, .main-content, #content, .content, article, .entry-content");
  const mainHTML = mainContent?.innerHTML?.slice(0, 3000) || "";

  return { allLinks: allLinks.slice(0, 20), articleLinks, listItems: listItems.slice(0, 30), mainHTML };
});

console.log("Makale linkleri:", JSON.stringify(data.articleLinks, null, 2));
console.log("\nListe öğeleri:", JSON.stringify(data.listItems, null, 2));
console.log("\nMain HTML:", data.mainHTML.slice(0, 2000));

await browser.close();
