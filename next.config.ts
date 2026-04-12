import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/araclar",
        destination: "/araclar-listesi",
      },
    ];
  },
};

export default nextConfig;
