/** @type {import('next').NextConfig} */
import { withWhopAppConfig } from "@whop/react/next.config";

const nextConfig = {
  reactStrictMode: true,
  // Exclude apps directory from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable static optimization for Whop app compatibility
  output: 'standalone',
};

export default withWhopAppConfig(nextConfig);
