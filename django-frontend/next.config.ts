import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '13.71.60.121',
        port: '1337',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'roomsmandu.qzz.io',
        port: '',
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'www.roomsmandu.qzz.io',
        port: '',
        pathname: '/media/**'
      }
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true
  },
  /* config options here */
};

export default nextConfig;
