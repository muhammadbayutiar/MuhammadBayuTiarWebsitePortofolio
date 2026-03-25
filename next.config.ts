import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.figma.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'api.github.com',
    },
    {
      protocol: 'https',
      hostname: 'github.com',
    },
  ],
  },
};

export default nextConfig;
