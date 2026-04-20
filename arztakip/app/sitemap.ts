import { MetadataRoute } from "next";

const BASE_URL = "https://www.halkaarzlarim.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const bugun = new Date().toISOString().split("T")[0];

  return [
    {
      url: BASE_URL,
      lastModified: bugun,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/halka-arzlar`,
      lastModified: bugun,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ipo-nedir`,
      lastModified: "2026-04-20",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/halka-arz-nasil-yapilir`,
      lastModified: "2026-04-20",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tavan-nedir`,
      lastModified: "2026-04-20",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/halka-arz-takvimi-2026`,
      lastModified: bugun,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/istatistikler`,
      lastModified: bugun,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hisseler`,
      lastModified: bugun,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/araclar/tavan-simulatoru`,
      lastModified: "2026-01-01",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/araclar/lot-hesaplama`,
      lastModified: "2026-01-01",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/araclar/kar-hesaplama`,
      lastModified: "2026-01-01",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/araclar/tavan-raporu`,
      lastModified: bugun,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/araclar/tavan-performansi`,
      lastModified: bugun,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/premium`,
      lastModified: "2026-01-01",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/haberler`,
      lastModified: bugun,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: bugun,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/giris`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/gizlilik-politikasi`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/kullanim-kosullari`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
