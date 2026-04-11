import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Eski slug formatından yeni ticker slug'larına 301 yönlendirme
      { source: "/halka-arz/metropal-kurumsal-hizmetler", destination: "/halka-arz/mcard", permanent: true },
      { source: "/halka-arz/eners-yenilenebilir-enerji", destination: "/halka-arz/arfye", permanent: true },
      // Artık mevcut olmayan eski sayfalar → arz listesine yönlendir
      { source: "/halka-arz/bitest-yazilim-teknoloji", destination: "/halka-arzlar", permanent: true },
      { source: "/halka-arz/f-finans-grubu", destination: "/halka-arzlar", permanent: true },
      { source: "/halka-arz/sagliktek-medikal-teknoloji", destination: "/halka-arzlar", permanent: true },
    ];
  },
};

export default nextConfig;
