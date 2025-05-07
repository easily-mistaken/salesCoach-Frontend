/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // Add any necessary aliases here
      },
    },
  },
  webpack: (config) => {
    // Add any necessary webpack configurations here
    return config;
  },
  // Disable Turbopack for now since it's causing issues with next-video
  turbo: false,
};

module.exports = nextConfig;
