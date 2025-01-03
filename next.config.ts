import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gewjitqzhwpnaiutkmem.supabase.co",
      },
    ],
  },
};

export default nextConfig;
