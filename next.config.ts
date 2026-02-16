import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'zerodha.com' },
      { protocol: 'https', hostname: 'upstox.com' },
      { protocol: 'https', hostname: 'www.angelone.in' },
      { protocol: 'https', hostname: 'www.hdfcsec.com' },
      { protocol: 'https', hostname: 'www.icicidirect.com' },
      { protocol: 'https', hostname: 'www.kotaksecurities.com' },
      { protocol: 'https', hostname: 'www.motilaloswal.com' },
      { protocol: 'https', hostname: 'www.sharekhan.com' },
      { protocol: 'https', hostname: 'shoonya.com' },
    ],
  },
};

export default nextConfig;
