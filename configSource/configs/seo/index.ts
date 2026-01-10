/**
 * SEO 配置数据源
 * 
 * 从本地 JSON 文件获取 SEO 配置
 * 对外暴露的函数均为异步（保持接口一致性）
 */

import seoConfigData from '@/data/seo-config.json';
import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

/**
 * 加载并处理 SEO 配置
 * 支持环境变量覆盖
 */
function loadConfig(): SeoConfig {
  // 直接使用 import 的 JSON 数据
  const config = seoConfigData as SeoConfig;
  
  // 环境变量覆盖 siteUrl（如果存在）
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    config.global.siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  return config;
}

/**
 * 获取完整的 SEO 配置
 * @returns Promise<SeoConfig> SEO 配置对象
 */
export async function getSeoConfig(): Promise<SeoConfig> {
  return loadConfig();
}

/**
 * 获取全局 SEO 配置
 * @returns Promise<GlobalSeoConfig> 全局配置对象
 */
export async function getGlobalConfig(): Promise<GlobalSeoConfig> {
  const config = loadConfig();
  return config.global;
}

/**
 * 根据路径获取页面 SEO 配置
 * @param path 页面路径，例如 '/' 或 '/about'
 * @returns Promise<PageSeoConfig | null> 页面配置，如果不存在则返回 null
 */
export async function getPageConfig(path: string): Promise<PageSeoConfig | null> {
  const config = loadConfig();
  // 规范化路径：确保路径以 / 开头，但根路径保持为 '/'
  const normalizedPath = path === '' ? '/' : (path.startsWith('/') ? path : `/${path}`);
  
  const pageConfig = config.pages.find((page) => page.path === normalizedPath);
  return pageConfig || null;
}

/**
 * 获取所有页面 SEO 配置
 * @returns Promise<PageSeoConfig[]> 所有页面配置列表
 */
export async function getAllPageConfigs(): Promise<PageSeoConfig[]> {
  const config = loadConfig();
  return config.pages;
}

/**
 * 获取 Sitemap 配置
 * @returns Promise<SitemapPageConfig[]> Sitemap 页面配置列表
 */
export async function getSitemapConfig(): Promise<SitemapPageConfig[]> {
  const config = loadConfig();
  return config.sitemap.pages;
}

/**
 * 获取 Robots.txt 配置
 * @returns Promise<RobotsConfig> Robots 配置对象
 */
export async function getRobotsConfig(): Promise<RobotsConfig> {
  const config = loadConfig();
  return config.robots;
}

// 导出类型
export type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';
