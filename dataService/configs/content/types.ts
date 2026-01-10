/**
 * Markdown 内容类型定义
 */

import type { SupportedLocale } from '@/i18n/types';

/**
 * Frontmatter 元数据
 */
export interface ContentFrontmatter {
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 发布日期 */
  date?: string;
  /** 最后修改日期 */
  lastModified?: string;
  /** Slug（URL 路径，可选，默认为文件名） */
  slug?: string;
  /** 标签 */
  tags?: string[];
  /** 作者 */
  author?: string;
  /** SEO 图片 */
  image?: string;
  /** 自定义元数据 */
  [key: string]: unknown;
}

/**
 * Markdown 内容
 */
export interface MarkdownContent {
  /** Frontmatter 元数据 */
  frontmatter: ContentFrontmatter;
  /** HTML 内容 */
  content: string;
  /** 原始 Markdown 内容 */
  rawContent: string;
  /** Slug（URL 路径） */
  slug: string;
  /** 语言 */
  locale: SupportedLocale;
  /** 文件路径（相对于 content 目录） */
  filePath: string;
}

/**
 * 内容列表项（用于列表展示）
 */
export interface ContentListItem {
  /** Frontmatter 元数据 */
  frontmatter: ContentFrontmatter;
  /** Slug */
  slug: string;
  /** 语言 */
  locale: SupportedLocale;
  /** 文件路径 */
  filePath: string;
}

/**
 * 内容查询选项
 */
export interface ContentQueryOptions {
  /** 语言过滤 */
  locale?: SupportedLocale;
  /** 标签过滤 */
  tag?: string;
  /** 排序方式 */
  sortBy?: 'date' | 'title';
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
  /** 限制数量 */
  limit?: number;
}
