/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['*.amazonaws.com'],
  },
}

module.exports = nextConfig
