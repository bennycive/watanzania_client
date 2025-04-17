/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
require('dotenv').config()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [`${process.env.NEXT_PUBLIC_API_URL}`],
    unoptimized: true
  },
  trailingSlash: false,
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      require('./scripts/sitemap-generator')
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    return config
  }
}

// Conditionally set the output based on the environment
if (process.env.NEXT_PUBLIC_SEO === 'false') {
  (nextConfig.output = 'export'), (nextConfig.images.unoptimized = true)
}
// console.log(nextConfig)
module.exports = nextConfig
