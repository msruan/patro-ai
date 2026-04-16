import { NextConfig } from "next";
import { env } from "@/env";

void env;

const nextConfig: NextConfig = {
  devIndicators: {
		position: "bottom-right",
	},
	reactStrictMode: true,
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
};

export default nextConfig;