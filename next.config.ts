import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  devIndicators: false,
  reactStrictMode: false,
};

export default nextConfig;
