import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) — built in CI, copied to our own server, run by pm2.
  output: 'standalone',
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // Basic hardening for every response.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  poweredByHeader: false,
  // Old site URLs → new pages (301), so Google rankings and old links carry over (spec S2).
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      // Not /book: that page is noindex, so the old page's ranking would be wasted. Home is where booking starts.
      { source: '/appointment', destination: '/', permanent: true },
      { source: '/services', destination: '/pricing', permanent: true },
      { source: '/servicesDetails', destination: '/pricing', permanent: true },
      // www → bare domain (the old site did this in _redirects)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.deepcleanz.com' }],
        destination: 'https://deepcleanz.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
