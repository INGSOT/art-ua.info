import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['art-ua-info.ddev.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
