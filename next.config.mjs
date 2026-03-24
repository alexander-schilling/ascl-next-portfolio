/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cms.alexanderschilling.cl",
      },
    ],
    maximumRedirects: 2,
    // Bound disk cache growth for self-hosted deployments.
    minimumCacheTTL: 60,
  },
};

export default nextConfig;

