import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**'
      }
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true  // Allows localhost images during development
  },
  /* config options here */
};

export default nextConfig;
