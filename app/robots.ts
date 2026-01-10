import { MetadataRoute } from 'next';
import { getDefaultDataSource } from '@/lib/configs/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const dataSource = getDefaultDataSource();
  const globalConfig = await dataSource.getGlobalConfig();
  const robotsConfig = await dataSource.getRobotsConfig();
  const baseUrl = globalConfig.siteUrl;

  // 处理 sitemap URL（如果配置中使用了相对路径，则补充完整 URL）
  const sitemap = robotsConfig.sitemap
    ? (Array.isArray(robotsConfig.sitemap)
        ? robotsConfig.sitemap.map((url) => url.startsWith('http') ? url : `${baseUrl}${url}`)
        : (robotsConfig.sitemap.startsWith('http') ? robotsConfig.sitemap : `${baseUrl}${robotsConfig.sitemap}`))
    : `${baseUrl}/sitemap.xml`;

  return {
    rules: robotsConfig.rules,
    sitemap,
  };
}
