/** @type {import('next').NextConfig} */
import { withWhopAppConfig } from "@whop/react/next.config";

const nextConfig = {
  reactStrictMode: true,
  // Exclude apps directory from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default withWhopAppConfig(nextConfig);
