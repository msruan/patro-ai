import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: process.env.NODE_ENV === "production",
  typedRoutes: true,
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== "production",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;