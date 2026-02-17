import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/legal/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
