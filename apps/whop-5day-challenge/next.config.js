/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Allow importing from parent directories (to access onboarding components)
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    // Add parent directory to module resolution
    config.resolve.modules = [
      ...config.resolve.modules,
      path.resolve(__dirname, '../../'),
    ]
    return config
  },
}

module.exports = nextConfig

