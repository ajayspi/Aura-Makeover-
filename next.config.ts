import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/fr/kit/styler/:slug',
        destination: '/kit/styler/:slug',
        permanent: true,
      },
      {
        source: '/kit/styler',
        destination: '/kit/styler/kitchen_5',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
