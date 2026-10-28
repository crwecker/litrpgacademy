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
      { source: '/community-favorites', destination: '/search?sort=community', permanent: true },
      // Filtered browse URLs moved to /search so /books and realm pages can stay static.
      ...['q', 'tag', 'sort', 'page'].flatMap(key => [
        { source: '/books', has: [{ type: 'query' as const, key }], destination: '/search', permanent: true },
        { source: '/realm/:realm', has: [{ type: 'query' as const, key }], destination: '/search?realm=:realm', permanent: true },
      ]),
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
