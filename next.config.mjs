/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.pexels.com",
        },
        {
          protocol: "https",
          hostname: "plus.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "i.pinimg.com",
        },
      ],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;