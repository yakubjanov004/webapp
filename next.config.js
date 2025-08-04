/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["t.me", "cdn.telegram.org"],
    unoptimized: true,
  },
  // assetPrefix: process.env.NODE_ENV === "production" ? "/telegram-chat-webapp" : "",
  trailingSlash: true,
  output: "export",
}

module.exports = nextConfig
