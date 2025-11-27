/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable double rendering in development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
}

module.exports = nextConfig

