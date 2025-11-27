import { MetadataRoute } from 'next';
import { fetchAllRoadSlugs } from '@/lib/api-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://whobuiltmyroad.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let roadPages: MetadataRoute.Sitemap = [];
  try {
    const roadSlugs = await fetchAllRoadSlugs();
    roadPages = roadSlugs.map((slug: string) => ({
      url: `${baseUrl}/roads/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching road slugs for sitemap:', error);
  }

  return [...staticPages, ...roadPages];
}

