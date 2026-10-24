import type { MetadataRoute } from 'next'
import { getAllBookIds } from '@/lib/books'
import { REALMS } from '@/lib/realms'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getAllBookIds()
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/books`, changeFrequency: 'daily', priority: 0.8 },
    ...REALMS.map(realm => ({ url: `${SITE_URL}/realm/${realm.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...books.map(book => ({
      url: `${SITE_URL}/book/${encodeURIComponent(book.id)}`,
      lastModified: book.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]
}
