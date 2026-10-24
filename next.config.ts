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
  // Routes from the 2025 app that no longer exist.
  async redirects() {
    return [
      { source: '/community-favorites', destination: '/books?sort=community', permanent: true },
      { source: '/academy', destination: '/', permanent: true },
      { source: '/add-book', destination: '/books', permanent: false },
      { source: '/my-tiers', destination: '/me', permanent: false },
      { source: '/my-reviews', destination: '/me', permanent: false },
      { source: '/signup', destination: '/signin', permanent: false },
      { source: '/auth', destination: '/signin', permanent: false },
      // Old magic links stored unhashed tokens; send them to request a new one.
      { source: '/verify', destination: '/signin?error=expired', permanent: false },
    ]
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
