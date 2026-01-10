/**
 * Markdown 内容数据源
 * 
 * 从本地 Markdown 文件获取内容
 * 对外暴露的函数均为异步（保持接口一致性）
 * 
 * 注意：此模块在构建时使用 Node.js fs 模块读取文件
 */

import type { SupportedLocale } from '@/i18n/types';
import type { MarkdownContent, ContentListItem, ContentQueryOptions } from './types';
import { parseMarkdown, extractSlugFromPath } from './parser';
import { defaultLocale, supportedLocales } from '@/i18n/config';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

/**
 * 内容文件映射表
 * 结构：{ locale: { slug: { rawContent, filePath } } }
 */
type ContentFilesMap = Record<SupportedLocale, Record<string, { rawContent: string; filePath: string }>>;

/**
 * 内容目录路径（相对于项目根目录）
 */
const CONTENT_DIR = join(process.cwd(), 'dataService', 'data', 'content');

/**
 * 读取 Markdown 文件内容
 * 
 * @param locale 语言代码
 * @param slug slug（文件名，不含扩展名）
 * @returns 文件内容，如果文件不存在则返回 null
 */
function readContentFile(locale: SupportedLocale, slug: string): string | null {
  const filePath = join(CONTENT_DIR, locale, `${slug}.md`);
  
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read content file: ${filePath}`, error);
    return null;
  }
}

/**
 * 递归扫描目录，查找所有 .md 文件
 * 
 * @param dir 要扫描的目录路径（绝对路径）
 * @param localeDir 语言目录的绝对路径（用于计算相对路径）
 * @returns slug 列表（相对于 content/[locale] 目录的路径，不含扩展名）
 */
function scanMarkdownFiles(dir: string, localeDir: string): string[] {
  const slugs: string[] = [];
  
  if (!existsSync(dir)) {
    return slugs;
  }

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录
        const subSlugs = scanMarkdownFiles(fullPath, localeDir);
        slugs.push(...subSlugs);
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        // 找到 .md 文件，计算相对于 localeDir 的路径作为 slug
        const relativePath = relative(localeDir, fullPath);
        // 移除扩展名，并将路径分隔符统一为 /
        const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
        slugs.push(slug);
      }
    }
  } catch (error) {
    console.error(`Failed to scan directory: ${dir}`, error);
  }

  return slugs;
}

/**
 * 初始化内容文件映射
 * 在构建时自动扫描并读取所有 markdown 文件
 */
function initContentFiles(): ContentFilesMap {
  // 初始化文件映射对象，为每个支持的语言创建空对象
  const files = {} as ContentFilesMap;
  for (const locale of supportedLocales) {
    files[locale] = {};
  }

  // 自动扫描所有 markdown 文件
  for (const locale of supportedLocales) {
    const localeDir = join(CONTENT_DIR, locale);
    
    if (!existsSync(localeDir)) {
      continue;
    }

    // 扫描该语言目录下的所有 .md 文件
    const slugs = scanMarkdownFiles(localeDir, localeDir);

    // 读取每个文件的内容
    for (const slug of slugs) {
      // 根据 slug 构建文件路径
      // slug 可能包含子目录，例如 'blog/post-1' -> 'blog/post-1.md'
      const filePath = join(localeDir, `${slug}.md`);

      if (existsSync(filePath)) {
        try {
          const rawContent = readFileSync(filePath, 'utf-8');
          if (rawContent) {
            files[locale][slug] = {
              rawContent,
              filePath: `${locale}/${slug}.md`,
            };
          }
        } catch (error) {
          console.error(`Failed to read content file: ${filePath}`, error);
        }
      }
    }
  }

  return files;
}

// 缓存内容文件映射（在模块加载时初始化）
let contentFilesCache: ContentFilesMap | null = null;

/**
 * 获取内容文件映射（懒加载）
 */
function getContentFiles(): ContentFilesMap {
  if (!contentFilesCache) {
    contentFilesCache = initContentFiles();
  }
  return contentFilesCache;
}

/**
 * 根据 slug 和语言获取 Markdown 内容
 * 
 * @param slug 内容 slug（URL 路径）
 * @param locale 语言代码
 * @returns Promise<MarkdownContent | null> Markdown 内容对象，如果不存在则返回 null
 */
export async function getContentBySlug(
  slug: string,
  locale: SupportedLocale
): Promise<MarkdownContent | null> {
  // 规范化 slug（移除前后斜杠）
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '') || 'index';

  // 获取内容文件映射
  const contentFiles = getContentFiles();

  // 获取指定语言的内容文件
  const localeFiles = contentFiles[locale] || contentFiles[defaultLocale];
  const fileData = localeFiles[normalizedSlug];

  if (!fileData) {
    return null;
  }

  // 解析 Markdown
  const { frontmatter, content } = parseMarkdown(fileData.rawContent);

  // 使用 frontmatter 中的 slug，如果没有则使用传入的 slug
  const finalSlug = frontmatter.slug || normalizedSlug;

  return {
    frontmatter,
    content,
    rawContent: fileData.rawContent,
    slug: finalSlug,
    locale,
    filePath: fileData.filePath,
  };
}

/**
 * 获取所有 Markdown 内容
 * 
 * @param options 查询选项
 * @returns Promise<MarkdownContent[]> 所有符合条件的 Markdown 内容列表
 */
export async function getAllContents(
  options: ContentQueryOptions = {}
): Promise<MarkdownContent[]> {
  const {
    locale,
    tag,
    sortBy = 'date',
    sortOrder = 'asc',
    limit,
  } = options;

  const results: MarkdownContent[] = [];

  // 确定要查询的语言列表
  const localesToQuery: SupportedLocale[] = locale
    ? [locale]
    : [...supportedLocales];

  // 获取内容文件映射
  const contentFiles = getContentFiles();

  // 遍历所有语言
  for (const loc of localesToQuery) {
    const localeFiles = contentFiles[loc] || {};

    // 遍历该语言的所有文件
    for (const [slug, fileData] of Object.entries(localeFiles)) {
      // 解析 Markdown
      const { frontmatter, content } = parseMarkdown(fileData.rawContent);

      // 过滤：标签
      if (tag && (!frontmatter.tags || !frontmatter.tags.includes(tag))) {
        continue;
      }

      const finalSlug = frontmatter.slug || slug;

      results.push({
        frontmatter,
        content,
        rawContent: fileData.rawContent,
        slug: finalSlug,
        locale: loc,
        filePath: fileData.filePath,
      });
    }
  }

  // 排序
  results.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
        const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case 'title':
        comparison = (a.frontmatter.title || '').localeCompare(b.frontmatter.title || '');
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 限制数量
  if (limit && limit > 0) {
    return results.slice(0, limit);
  }

  return results;
}

/**
 * 获取内容列表（仅包含元数据，不包含 HTML 内容）
 * 
 * @param options 查询选项
 * @returns Promise<ContentListItem[]> 内容列表项
 */
export async function getContentList(
  options: ContentQueryOptions = {}
): Promise<ContentListItem[]> {
  const contents = await getAllContents(options);

  // 只返回列表项（不包含 HTML 内容）
  return contents.map(({ frontmatter, slug, locale, filePath }) => ({
    frontmatter,
    slug,
    locale,
    filePath,
  }));
}

/**
 * 获取所有可用的 slug 列表
 * 
 * @param locale 语言代码（可选）
 * @returns Promise<string[]> slug 列表
 */
export async function getAllSlugs(locale?: SupportedLocale): Promise<string[]> {
  const contents = await getAllContents({
    locale,
  });

  return contents.map((content) => content.slug);
}

/**
 * 检查指定的 slug 是否存在
 * 
 * @param slug slug
 * @param locale 语言代码
 * @returns Promise<boolean> 是否存在
 */
export async function hasSlug(slug: string, locale: SupportedLocale): Promise<boolean> {
  const content = await getContentBySlug(slug, locale);
  return content !== null;
}

// 导出类型
export type {
  MarkdownContent,
  ContentListItem,
  ContentFrontmatter,
  ContentQueryOptions,
} from './types';
