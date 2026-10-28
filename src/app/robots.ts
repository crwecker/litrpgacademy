import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// AI training crawlers fetch every page without sending readers back, and each uncached page
// costs a server render. Search engines stay welcome.
const AI_CRAWLERS = [
  'GPTBot',
  'CCBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'PerplexityBot',
  'Diffbot',
  'Omgilibot',
  'ImagesiftBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/search', '/signin', '/me', '/auth/'] },
      { userAgent: AI_CRAWLERS, disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
