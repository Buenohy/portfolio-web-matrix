import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://192.168.100.197'],
  transpilePackages: ['three'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
