import { MetadataRoute } from 'next';
import { getGlobalConfig, getRobotsConfig } from '@/configSource/configs/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const globalConfig = await getGlobalConfig();
  const robotsConfig = await getRobotsConfig();
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
