import { MetadataRoute } from 'next';
import { getGlobalConfig, getSitemapConfig, getAllContents } from '@/dataService';
import { supportedLocales } from '@/i18n/config';
import type { SupportedLocale } from '@/i18n/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const globalConfig = await getGlobalConfig();
  const sitemapConfig = await getSitemapConfig();
  const baseUrl = globalConfig.siteUrl;

  // 为每个语言生成 sitemap URL
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 添加配置的页面
  for (const locale of supportedLocales) {
    for (const page of sitemapConfig) {
      // 为每个语言和页面生成 URL
      const localizedPath = `/${locale}${page.path === '/' ? '' : page.path}`;
      const url = `${baseUrl}${localizedPath}`;
      const lastModified = page.lastModified 
        ? (typeof page.lastModified === 'string' ? new Date(page.lastModified) : new Date(page.lastModified))
        : new Date();

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: page.changeFrequency || 'weekly',
        priority: page.priority || 0.8,
      });
    }
  }

  // 添加 Markdown 内容页面
  for (const locale of supportedLocales) {
    try {
      const contents = await getAllContents({
        locale: locale as SupportedLocale,
      });

      for (const content of contents) {
        const contentPath = `/${locale}/content/${content.slug}`;
        const url = `${baseUrl}${contentPath}`;
        const lastModified = content.frontmatter.lastModified || content.frontmatter.date
          ? new Date(content.frontmatter.lastModified || content.frontmatter.date || Date.now())
          : new Date();

        sitemapEntries.push({
          url,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error(`Failed to generate sitemap entries for locale: ${locale}`, error);
    }
  }

  return sitemapEntries;
}
