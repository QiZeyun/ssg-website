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
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, relative, extname } from 'path';
import { err, ok, type Result } from '@/dataService/result';
import { AppError } from '@/dataService/errors';

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
/**
 * 递归扫描目录，查找所有 .md 文件
 * 
 * @param dir 要扫描的目录路径（绝对路径）
 * @param localeDir 语言目录的绝对路径（用于计算相对路径）
 * @returns slug 列表（相对于 content/[locale] 目录的路径，不含扩展名）
 */
function scanMarkdownFiles(dir: string, localeDir: string): Result<string[], AppError> {
  const slugs: string[] = [];
  
  if (!existsSync(dir)) {
    return ok(slugs);
  }

  let entries: Array<{ name: string; isDirectory: () => boolean; isFile: () => boolean }>;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (cause) {
    return err(
      new AppError({
        code: 'CONTENT_DIR_SCAN_FAILED',
        message: 'Failed to scan content directory',
        context: { dir },
        cause,
      })
    );
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const subResult = scanMarkdownFiles(fullPath, localeDir);
      if (!subResult.ok) {
        return subResult;
      }
      slugs.push(...subResult.value);
      continue;
    }

    if (entry.isFile() && extname(entry.name) === '.md') {
      const relativePath = relative(localeDir, fullPath);
      const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
      slugs.push(slug);
    }
  }

  return ok(slugs);
}

/**
 * 初始化内容文件映射
 * 在构建时自动扫描并读取所有 markdown 文件
 */
function initContentFiles(): Result<ContentFilesMap, AppError> {
  // 初始化文件映射对象，为每个支持的语言创建空对象
  const files = {} as ContentFilesMap;
  for (const locale of supportedLocales) {
    files[locale] = {};
  }

  // 自动扫描所有 markdown 文件
  for (const locale of supportedLocales) {
    const localeDir = join(CONTENT_DIR, locale);
    
    if (!existsSync(localeDir)) {
      return err(
        new AppError({
          code: 'CONTENT_LOCALE_DIR_MISSING',
          message: 'Content locale directory is missing',
          context: { locale, localeDir },
        })
      );
    }

    // 扫描该语言目录下的所有 .md 文件
    const slugsResult = scanMarkdownFiles(localeDir, localeDir);
    if (!slugsResult.ok) {
      return slugsResult;
    }

    // 读取每个文件的内容
    for (const slug of slugsResult.value) {
      // 根据 slug 构建文件路径
      // slug 可能包含子目录，例如 'blog/post-1' -> 'blog/post-1.md'
      const filePath = join(localeDir, `${slug}.md`);

      if (existsSync(filePath)) {
        try {
          const rawContent = readFileSync(filePath, 'utf-8');
          files[locale][slug] = {
            rawContent,
            filePath: `${locale}/${slug}.md`,
          };
        } catch (cause) {
          return err(
            new AppError({
              code: 'CONTENT_FILE_READ_FAILED',
              message: 'Failed to read content file',
              context: { locale, filePath },
              cause,
            })
          );
        }
      }
    }
  }

  return ok(files);
}

// 缓存内容文件映射（在模块加载时初始化）
let contentFilesCache: Result<ContentFilesMap, AppError> | null = null;

/**
 * 获取内容文件映射（懒加载）
 */
function getContentFiles(): Result<ContentFilesMap, AppError> {
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
): Promise<Result<MarkdownContent | null, AppError>> {
  // 规范化 slug（移除前后斜杠）
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '') || 'index';

  // 获取内容文件映射
  const contentFilesResult = getContentFiles();
  if (!contentFilesResult.ok) {
    return contentFilesResult;
  }
  const contentFiles = contentFilesResult.value;

  // 获取指定语言的内容文件
  const localeFiles = contentFiles[locale] || contentFiles[defaultLocale];
  const fileData = localeFiles[normalizedSlug];

  if (!fileData) {
    return ok(null);
  }

  // 解析 Markdown
  let frontmatter: any;
  let content: string;
  try {
    const parsed = parseMarkdown(fileData.rawContent);
    frontmatter = parsed.frontmatter;
    content = parsed.content;
  } catch (cause) {
    return err(
      new AppError({
        code: 'CONTENT_MARKDOWN_PARSE_FAILED',
        message: 'Failed to parse markdown content',
        context: { locale, slug: normalizedSlug, filePath: fileData.filePath },
        cause,
      })
    );
  }

  // 使用 frontmatter 中的 slug，如果没有则使用传入的 slug
  const finalSlug = frontmatter.slug || normalizedSlug;

  return ok({
    frontmatter,
    content,
    rawContent: fileData.rawContent,
    slug: finalSlug,
    locale,
    filePath: fileData.filePath,
  });
}

/**
 * 获取所有 Markdown 内容
 * 
 * @param options 查询选项
 * @returns Promise<MarkdownContent[]> 所有符合条件的 Markdown 内容列表
 */
export async function getAllContents(
  options: ContentQueryOptions = {}
): Promise<Result<MarkdownContent[], AppError>> {
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
  const contentFilesResult = getContentFiles();
  if (!contentFilesResult.ok) {
    return contentFilesResult;
  }
  const contentFiles = contentFilesResult.value;

  // 遍历所有语言
  for (const loc of localesToQuery) {
    const localeFiles = contentFiles[loc] || {};

    // 遍历该语言的所有文件
    for (const [slug, fileData] of Object.entries(localeFiles)) {
      // 解析 Markdown
      let frontmatter: any;
      let content: string;
      try {
        const parsed = parseMarkdown(fileData.rawContent);
        frontmatter = parsed.frontmatter;
        content = parsed.content;
      } catch (cause) {
        return err(
          new AppError({
            code: 'CONTENT_MARKDOWN_PARSE_FAILED',
            message: 'Failed to parse markdown content',
            context: { locale: loc, slug, filePath: fileData.filePath },
            cause,
          })
        );
      }

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
    return ok(results.slice(0, limit));
  }

  return ok(results);
}

/**
 * 获取内容列表（仅包含元数据，不包含 HTML 内容）
 * 
 * @param options 查询选项
 * @returns Promise<ContentListItem[]> 内容列表项
 */
export async function getContentList(
  options: ContentQueryOptions = {}
): Promise<Result<ContentListItem[], AppError>> {
  const contentsResult = await getAllContents(options);
  if (!contentsResult.ok) {
    return contentsResult;
  }
  const contents = contentsResult.value;

  // 只返回列表项（不包含 HTML 内容）
  return ok(contents.map(({ frontmatter, slug, locale, filePath }) => ({
    frontmatter,
    slug,
    locale,
    filePath,
  })));
}

/**
 * 获取所有可用的 slug 列表
 * 
 * @param locale 语言代码（可选）
 * @returns Promise<string[]> slug 列表
 */
export async function getAllSlugs(locale?: SupportedLocale): Promise<Result<string[], AppError>> {
  const contentsResult = await getAllContents({
    locale,
  });

  if (!contentsResult.ok) {
    return contentsResult;
  }

  return ok(contentsResult.value.map((content) => content.slug));
}

/**
 * 检查指定的 slug 是否存在
 * 
 * @param slug slug
 * @param locale 语言代码
 * @returns Promise<boolean> 是否存在
 */
export async function hasSlug(slug: string, locale: SupportedLocale): Promise<boolean> {
  const result = await getContentBySlug(slug, locale);
  return result.ok && result.value !== null;
}

// 导出类型
export type {
  MarkdownContent,
  ContentListItem,
  ContentFrontmatter,
  ContentQueryOptions,
} from './types';
