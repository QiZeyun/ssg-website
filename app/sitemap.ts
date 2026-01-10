import { MetadataRoute } from 'next';
import { getDefaultDataSource } from '@/configSource/configs/seo';
import { supportedLocales } from '@/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dataSource = getDefaultDataSource();
  const globalConfig = await dataSource.getGlobalConfig();
  const sitemapConfig = await dataSource.getSitemapConfig();
  const baseUrl = globalConfig.siteUrl;

  // 为每个语言生成 sitemap URL
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of supportedLocales) {
    for (const page of sitemapConfig) {
      // 为每个语言和页面生成 URL
      const localizedPath = `/${locale}${page.path === '/' ? '' : page.path}`;
      const url = `${baseUrl}${localizedPath}`;
      const lastModified = page.lastModified 
        ? (typeof page.lastModified === 'string' ? new Date(page.lastModified) : page.lastModified)
        : new Date();

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: page.changeFrequency || 'weekly',
        priority: page.priority || 0.8,
      });
    }
  }

  return sitemapEntries;
}
