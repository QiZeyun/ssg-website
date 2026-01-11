/**
 * SEO 工具函数
 * 提供常用的 SEO 相关辅助函数
 */

import type { Metadata } from 'next';
import { getGlobalConfig, getPageConfig } from './configs/seo';
import type { PageSeoConfig, GlobalSeoConfig } from './configs/seo/types';
import { removeLocalePrefix, extractLocaleFromPath } from '@/i18n/utils';

/**
 * 生成页面 Metadata（从数据源获取配置）
 * 
 * @param path 页面路径，例如 '/' 或 '/about' 或 '/zh/about' 或 '/en/pricing'
 * @param overrides 可选，覆盖默认配置
 * @returns Promise<Metadata> 生成的 Metadata
 */
export async function generateMetadataFromPath(
  path: string,
  overrides?: Partial<PageSeoConfig>
): Promise<Metadata> {
  const globalConfig = await getGlobalConfig();
  
  // 从多语言路径中提取语言代码和基础路径
  // 例如：'/zh/about' -> locale='zh', basePath='/about'
  const locale = extractLocaleFromPath(path);
  const basePath = removeLocalePrefix(path);
  const pageConfig = await getPageConfig(basePath, locale);

  // 合并全局配置和页面配置
  const finalConfig: PageSeoConfig = {
    path,
    title: overrides?.title || pageConfig?.title || 'Page',
    description: overrides?.description || pageConfig?.description || globalConfig.defaultDescription,
    keywords: overrides?.keywords || pageConfig?.keywords || globalConfig.defaultKeywords,
    ogImage: overrides?.ogImage || pageConfig?.ogImage || globalConfig.defaultOgImage,
    noIndex: overrides?.noIndex ?? pageConfig?.noIndex ?? false,
    canonical: overrides?.canonical || pageConfig?.canonical || path,
    openGraph: overrides?.openGraph || pageConfig?.openGraph,
    twitter: overrides?.twitter || pageConfig?.twitter,
  };

  return generateMetadata({
    title: finalConfig.title,
    description: finalConfig.description,
    keywords: finalConfig.keywords,
    image: finalConfig.ogImage,
    noIndex: finalConfig.noIndex,
    canonical: finalConfig.canonical,
    openGraph: finalConfig.openGraph,
    twitter: finalConfig.twitter,
  }, globalConfig);
}

/**
 * 生成页面 Metadata
 * 
 * @param config 页面 SEO 配置
 * @param globalConfig 全局 SEO 配置（可选，如果不提供则从数据源获取）
 * @returns Metadata 生成的 Metadata
 */
export function generateMetadata(
  config: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    noIndex?: boolean;
    canonical?: string;
    openGraph?: PageSeoConfig['openGraph'];
    twitter?: PageSeoConfig['twitter'];
  },
  globalConfig?: GlobalSeoConfig
): Metadata {
  const baseUrl = globalConfig?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const siteName = globalConfig?.siteName || 'Your Company Name';
  const ogImage = config.image 
    ? (config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`)
    : `${baseUrl}${globalConfig?.defaultOgImage || '/og-image.jpg'}`;
  const canonicalUrl = config.canonical 
    ? (config.canonical.startsWith('http') ? config.canonical : `${baseUrl}${config.canonical}`)
    : '';

  // 合并全局和页面级别的 OpenGraph 配置
  const defaultOpenGraph = globalConfig?.openGraph || {
    type: 'website',
    locale: 'en_US',
    siteName,
    images: [{
      url: ogImage,
      width: 1200,
      height: 630,
      alt: config.title,
    }],
  };

  const openGraph = config.openGraph 
    ? {
        ...defaultOpenGraph,
        ...config.openGraph,
        title: config.openGraph.title || config.title,
        description: config.openGraph.description || config.description,
        images: config.openGraph.images || defaultOpenGraph.images,
      }
    : {
        ...defaultOpenGraph,
        url: canonicalUrl,
        title: config.title,
        description: config.description,
      };

  // 合并全局和页面级别的 Twitter 配置
  const defaultTwitter = globalConfig?.twitter || {
    card: 'summary_large_image',
    creator: '@yourcompany',
  };

  const twitter = config.twitter
    ? {
        ...defaultTwitter,
        ...config.twitter,
        title: config.twitter.title || config.title,
        description: config.twitter.description || config.description,
        images: config.twitter.images || [ogImage],
      }
    : {
        ...defaultTwitter,
        title: config.title,
        description: config.description,
        images: [ogImage],
      };

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
      googleBot: {
        index: !config.noIndex,
        follow: !config.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph,
    twitter,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

