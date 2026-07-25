import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['art-ua-info.ddev.site'],
  images: {
    // save-art.ddev.site резолвиться у приватну docker-мережу в DDEV-середовищі,
    // тож серверний оптимізатор next/image блокує його як потенційний SSRF.
    // Вимикаємо оптимізацію, щоб зображення з бекенду завантажувались напряму (як у Partners.tsx).
    unoptimized: true,
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
      {
        protocol: 'https',
        hostname: 'save-art.ddev.site',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
