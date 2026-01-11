/**
 * SEO 配置数据源
 * 
 * 从本地 JSON 文件获取 SEO 配置
 * 对外暴露的函数均为异步（保持接口一致性）
 */

import seoConfigData from '../../data/seo-config.json';
import type { SeoConfigRaw, SeoConfig, PageSeoConfig, PageSeoConfigRaw, GlobalSeoConfig, SitemapPageConfig, RobotsConfig, LocalizedText } from './types';
import { defaultLocale } from '@/i18n/config';
import type { SupportedLocale } from '@/i18n/types';

/**
 * 配置缓存（模块级别，避免重复加载）
 */
let configCache: SeoConfigRaw | null = null;

/**
 * 加载并处理 SEO 配置
 * 支持环境变量覆盖
 */
function loadConfig(): SeoConfigRaw {
  if (configCache) {
    return configCache;
  }

  // 直接使用 import 的 JSON 数据
  const config = { ...seoConfigData } as SeoConfigRaw;
  
  // 环境变量覆盖 siteUrl（如果存在）
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    config.global.siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  configCache = config;
  return config;
}

/**
 * 解析多语言文本，返回指定语言的值
 * 
 * @param text 多语言文本（可以是字符串或语言映射对象）
 * @param locale 目标语言
 * @returns 解析后的文本字符串
 */
function resolveLocalizedText(text: LocalizedText, locale: SupportedLocale): string {
  if (typeof text === 'string') {
    return text;
  }
  // 优先返回指定语言，回退到默认语言，最后回退到任意可用语言
  const localizedValue = (text as Record<string, string>)[locale];
  const defaultValue = (text as Record<string, string>)[defaultLocale];
  const firstValue = Object.values(text)[0];
  return localizedValue || defaultValue || firstValue || '';
}

/**
 * 将原始页面配置解析为特定语言的配置
 * 
 * @param rawConfig 原始页面配置（可能包含多语言字段）
 * @param locale 目标语言
 * @returns 解析后的页面配置
 */
function resolvePageConfig(rawConfig: PageSeoConfigRaw, locale: SupportedLocale): PageSeoConfig {
  return {
    path: rawConfig.path,
    title: resolveLocalizedText(rawConfig.title, locale),
    description: resolveLocalizedText(rawConfig.description, locale),
    keywords: rawConfig.keywords,
    ogImage: rawConfig.ogImage,
    noIndex: rawConfig.noIndex,
    canonical: rawConfig.canonical,
    openGraph: rawConfig.openGraph ? {
      ...rawConfig.openGraph,
      title: rawConfig.openGraph.title ? resolveLocalizedText(rawConfig.openGraph.title, locale) : undefined,
      description: rawConfig.openGraph.description ? resolveLocalizedText(rawConfig.openGraph.description, locale) : undefined,
    } : undefined,
    twitter: rawConfig.twitter ? {
      ...rawConfig.twitter,
      title: rawConfig.twitter.title ? resolveLocalizedText(rawConfig.twitter.title, locale) : undefined,
      description: rawConfig.twitter.description ? resolveLocalizedText(rawConfig.twitter.description, locale) : undefined,
    } : undefined,
  };
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
 * @param locale 语言代码（可选，默认为默认语言）
 * @returns Promise<PageSeoConfig | null> 页面配置，如果不存在则返回 null
 */
export async function getPageConfig(path: string, locale?: SupportedLocale): Promise<PageSeoConfig | null> {
  const config = loadConfig();
  // 规范化路径：确保路径以 / 开头，但根路径保持为 '/'
  const normalizedPath = path === '' ? '/' : (path.startsWith('/') ? path : `/${path}`);
  
  const rawPageConfig = config.pages.find((page) => page.path === normalizedPath);
  if (!rawPageConfig) {
    return null;
  }
  
  // 解析多语言字段
  return resolvePageConfig(rawPageConfig, locale || defaultLocale);
}

/**
 * 获取所有页面 SEO 配置（原始格式，包含多语言字段）
 * @returns Promise<PageSeoConfigRaw[]> 所有页面配置列表（原始格式）
 */
export async function getAllPageConfigs(): Promise<PageSeoConfigRaw[]> {
  const config = loadConfig();
  return config.pages;
}

/**
 * 获取所有页面 SEO 配置（指定语言）
 * @param locale 语言代码
 * @returns Promise<PageSeoConfig[]> 所有页面配置列表（已解析为指定语言）
 */
export async function getAllPageConfigsForLocale(locale: SupportedLocale): Promise<PageSeoConfig[]> {
  const config = loadConfig();
  return config.pages.map((page) => resolvePageConfig(page, locale));
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
export type { SeoConfig, SeoConfigRaw, PageSeoConfig, PageSeoConfigRaw, GlobalSeoConfig, SitemapPageConfig, RobotsConfig, LocalizedText } from './types';
