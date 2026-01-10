/**
 * SEO 配置类型定义
 */

import type { Metadata, MetadataRoute } from 'next';

/**
 * 页面级别的 SEO 配置
 */
export interface PageSeoConfig {
  /** 页面路径，例如 '/' 或 '/about' */
  path: string;
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词列表 */
  keywords?: string[];
  /** OG 图片 URL */
  ogImage?: string;
  /** 是否不索引此页面 */
  noIndex?: boolean;
  /** 规范 URL */
  canonical?: string;
  /** 额外的 OpenGraph 配置 */
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    locale?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  /** Twitter Card 配置 */
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
  };
}

/**
 * 全局 SEO 配置
 */
export interface GlobalSeoConfig {
  /** 网站基础 URL */
  siteUrl: string;
  /** 网站名称 */
  siteName: string;
  /** 默认标题模板 */
  titleTemplate: string;
  /** 默认描述 */
  defaultDescription: string;
  /** 默认关键词 */
  defaultKeywords: string[];
  /** 默认 OG 图片 */
  defaultOgImage: string;
  /** 作者信息 */
  authors: Array<{ name: string; url?: string }>;
  /** 创建者 */
  creator: string;
  /** 发布者 */
  publisher: string;
  /** OpenGraph 默认配置 */
  openGraph: {
    type: string;
    locale: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  /** Twitter 默认配置 */
  twitter: {
    card: string;
    creator: string;
  };
  /** 搜索引擎验证码 */
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
  };
  /** 格式检测配置 */
  formatDetection: {
    email: boolean;
    address: boolean;
    telephone: boolean;
  };
}

/**
 * Sitemap 页面配置
 */
export interface SitemapPageConfig {
  /** 页面路径 */
  path: string;
  /** 最后修改时间（ISO 字符串或 Date） */
  lastModified?: string | Date;
  /** 变更频率 */
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** 优先级（0.0 - 1.0） */
  priority?: number;
}

/**
 * Robots.txt 配置
 */
export interface RobotsConfig {
  /** 规则列表 */
  rules: Array<{
    /** User Agent */
    userAgent: string;
    /** 允许的路径 */
    allow?: string | string[];
    /** 禁止的路径 */
    disallow?: string | string[];
    /** 爬取延迟（秒） */
    crawlDelay?: number;
  }>;
  /** Sitemap URL */
  sitemap?: string | string[];
}

/**
 * 完整的 SEO 配置
 */
export interface SeoConfig {
  /** 全局配置 */
  global: GlobalSeoConfig;
  /** 页面配置 */
  pages: PageSeoConfig[];
  /** Sitemap 配置 */
  sitemap: {
    /** Sitemap 页面列表 */
    pages: SitemapPageConfig[];
  };
  /** Robots.txt 配置 */
  robots: RobotsConfig;
}
