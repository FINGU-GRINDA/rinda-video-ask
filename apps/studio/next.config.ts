import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Use standalone output for Docker builds (set STANDALONE=true in Dockerfile)
  // Skip on Windows local dev due to symlink permission issues
  ...(process.env.STANDALONE === 'true' ? { output: 'standalone' as const } : {}),
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.rindaask.com',
      },
    ],
  },
  transpilePackages: ['@rinda/ui', '@rinda/database'],
}

export default withNextIntl(nextConfig)
