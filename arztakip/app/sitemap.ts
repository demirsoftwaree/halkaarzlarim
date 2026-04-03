import { MetadataRoute } from "next";
import { getArzlar } from "@/lib/arz-utils";

const BASE_URL = "https://www.halkaarzlarim.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let arzPages: MetadataRoute.Sitemap = [];

  try {
    const { arzlar } = await getArzlar();
    arzPages = arzlar.map((arz) => ({
      url: `${BASE_URL}/halka-arz/${arz.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {
    // Arz verisi alınamazsa sadece statik sayfalarla devam et
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                          lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/halka-arzlar`,                        lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/haberler`,                            lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/hisseler`,                            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/araclar/tavan-simulatoru`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/araclar/lot-hesaplama`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/araclar/kar-hesaplama`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/premium`,                             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/iletisim`,                            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE_URL}/gizlilik-politikasi`,                 lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/kullanim-kosullari`,                  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  return [...staticPages, ...arzPages];
}
