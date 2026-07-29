import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HalkaArzlarım",
    short_name: "HalkaArzlarım",
    description: "Türkiye'nin halka arz takip platformu",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1a",
    theme_color: "#10b981",
    icons: [
      {
        src: "/logo/halkaarzlarim-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
