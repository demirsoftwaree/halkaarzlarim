import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
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
