import { MetadataRoute } from 'next';
import { getDefaultDataSource } from '@/lib/seo/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dataSource = getDefaultDataSource();
  const globalConfig = await dataSource.getGlobalConfig();
  const sitemapConfig = await dataSource.getSitemapConfig();
  const baseUrl = globalConfig.siteUrl;

  return sitemapConfig.map((page) => {
    const url = `${baseUrl}${page.path}`;
    const lastModified = page.lastModified 
      ? (typeof page.lastModified === 'string' ? new Date(page.lastModified) : page.lastModified)
      : new Date();

    return {
      url,
      lastModified,
      changeFrequency: page.changeFrequency || 'weekly',
      priority: page.priority || 0.8,
    };
  });
}
