/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
    JUDGE0_API_URL: process.env.JUDGE0_API_URL,
  },
  publicRuntimeConfig: {
    // Add public configs here if needed
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
