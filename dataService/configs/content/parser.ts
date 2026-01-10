/**
 * Markdown 解析工具
 * 
 * 负责将 Markdown 文件解析为 HTML，提取 frontmatter 元数据
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';
import type { ContentFrontmatter } from './types';

/**
 * 解析 Markdown 文件内容
 * 
 * @param rawContent 原始 Markdown 内容（包含 frontmatter）
 * @returns 解析后的内容对象
 */
export function parseMarkdown(rawContent: string): {
  frontmatter: ContentFrontmatter;
  content: string;
} {
  // 提取 frontmatter
  const { data, content: markdownContent } = matter(rawContent);

  // 规范化 frontmatter
  const frontmatter: ContentFrontmatter = {
    title: data.title || '',
    description: data.description,
    date: data.date,
    lastModified: data.lastModified || data.date,
    slug: data.slug,
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author,
    image: data.image,
    ...data, // 保留其他自定义字段
  };

  // 将 Markdown 转换为 HTML
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // 支持原始 HTML
    .use(rehypeHighlight as any) // 代码高亮（使用 any 避免类型错误）
    .use(rehypeStringify);

  const htmlContent = processor.processSync(markdownContent).toString();

  return {
    frontmatter,
    content: htmlContent,
  };
}

/**
 * 从文件路径提取 slug
 * 
 * @param filePath 文件路径（相对于 content 目录）
 * @returns slug（URL 路径）
 */
export function extractSlugFromPath(filePath: string): string {
  // 移除 .md 扩展名
  const withoutExt = filePath.replace(/\.md$/, '');
  // 移除开头的斜杠
  const cleanPath = withoutExt.replace(/^\/+/, '');
  // 返回作为 slug
  return cleanPath || 'index';
}
