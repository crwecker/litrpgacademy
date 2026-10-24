import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Object form (not new URL(...)) so cover URLs with a ?time= cache-buster are allowed.
    remotePatterns: [
      { protocol: 'https', hostname: 'www.royalroadcdn.com', pathname: '/public/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/images/**' },
    ],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
