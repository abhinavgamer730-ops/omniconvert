import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://omniconvert.app';

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: tool.popular ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...toolEntries,
  ];
}
