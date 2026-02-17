import { MetadataRoute } from 'next';
import { contentRegistry } from '@/content/registry';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const contentPages = contentRegistry.flatMap((c) => [
    {
      url: `${BASE_URL}/p/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  const categoryPages = ['fortune', 'test', 'quiz', 'game'].map((cat) => ({
    url: `${BASE_URL}/c/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...contentPages,
    ...categoryPages,
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];
}
