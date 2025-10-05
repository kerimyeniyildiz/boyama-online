import { MetadataRoute } from 'next';
import { getCategoriesWithImages } from '@/lib/fileSystem';
import { siteConfig } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();
  const categories = await getCategoriesWithImages();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: category.images.length ? new Date(category.images[category.images.length - 1].uploadDate) : now,
    changeFrequency: 'weekly',
    priority: category.featured ? 0.9 : 0.7,
  }));

  const imageRoutes: MetadataRoute.Sitemap = categories.flatMap((category) =>
    category.images.map((image) => ({
      url: `${baseUrl}${image.originalPath}`,
      lastModified: new Date(image.uploadDate),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  );

  return [...staticRoutes, ...categoryRoutes, ...imageRoutes];
}
