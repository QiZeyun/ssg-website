/**
 * 万能路由页面
 * 
 * 此路由处理所有动态路径，自动从 Markdown 文件加载内容
 * 例如：
 * - /zh/about -> dataService/data/content/zh/about.md
 * - /zh/blog/post-1 -> dataService/data/content/zh/blog/post-1.md
 * 
 * 注意：Next.js 路由优先级：具体路由优先于 catch-all 路由
 * 因此以下路由不会被此 catch-all 路由处理：
 * - /zh (home) -> app/[locale]/page.tsx
 * - /zh/pricing -> app/[locale]/pricing/page.tsx
 * - /zh/contact -> app/[locale]/contact/page.tsx
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadataFromPath, getContentBySlug, getAllSlugs } from '@/dataService';
import { isSupportedLocale, supportedLocales, getDateLocale, type SupportedLocale } from '@/i18n';
import { MarkdownContent } from '@/components/MarkdownContent';
import Link from 'next/link';
import { t } from '@/i18n';

interface UniversalPageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

/**
 * 特殊路由列表（这些路由不应该由 markdown 处理）
 * 因为它们有专门的静态页面
 */
const RESERVED_ROUTES = ['pricing', 'contact'];

/**
 * 检查路径是否为保留路由
 */
function isReservedRoute(slug: string): boolean {
  return RESERVED_ROUTES.includes(slug.split('/')[0]);
}

/**
 * 生成页面的 SEO Metadata
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({ params }: UniversalPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const slugPath = Array.isArray(slug) ? slug.join('/') : slug || '';

  // 检查是否为保留路由
  if (isReservedRoute(slugPath)) {
    return {};
  }

  const contentResult = await getContentBySlug(slugPath, locale);
  if (!contentResult.ok) {
    throw contentResult.error;
  }
  const content = contentResult.value;

  if (!content) {
    return {};
  }

  // 从 frontmatter 获取 SEO 信息
  const { frontmatter } = content;
  const pagePath = `/${locale}/${slugPath}`;

  return generateMetadataFromPath(pagePath, {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    ogImage: frontmatter.image,
  });
}

/**
 * 生成静态参数（预生成所有 markdown 内容页面的路由）
 */
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];

  // 为每个支持的语言生成路由
  for (const locale of supportedLocales) {
    const slugsResult = await getAllSlugs(locale);
    if (!slugsResult.ok) {
      throw slugsResult.error;
    }

    for (const slug of slugsResult.value) {
      // 跳过保留路由
      if (isReservedRoute(slug)) {
        continue;
      }

      // 将 slug 转换为数组（支持嵌套路径）
      const slugArray = slug.split('/').filter(Boolean);
      params.push({
        locale,
        slug: slugArray,
      });
    }
  }

  return params;
}

export default async function UniversalPage({ params }: UniversalPageProps) {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const slugPath = Array.isArray(slug) ? slug.join('/') : slug || '';

  // 检查是否为保留路由
  if (isReservedRoute(slugPath)) {
    notFound();
  }

  // 从 markdown 获取内容
  const contentResult = await getContentBySlug(slugPath, locale);
  if (!contentResult.ok) {
    throw contentResult.error;
  }
  const content = contentResult.value;

  if (!content) {
    notFound();
  }

  const { frontmatter, content: htmlContent } = content;

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {frontmatter.title}
            </h1>

            {/* 元数据信息 */}
            {(frontmatter.date || frontmatter.author || frontmatter.tags) && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                {frontmatter.date && (
                  <time dateTime={frontmatter.date}>
                    {new Date(frontmatter.date).toLocaleDateString(getDateLocale(locale), {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
                {frontmatter.author && (
                  <span>{t(locale, 'common.author')}: {frontmatter.author}</span>
                )}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 描述 */}
            {frontmatter.description && (
              <p className="text-xl text-gray-600">{frontmatter.description}</p>
            )}
          </header>

          {/* Markdown 内容 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <MarkdownContent content={htmlContent} />
          </div>

          {/* 页脚信息 */}
          {frontmatter.lastModified && frontmatter.lastModified !== frontmatter.date && (
            <footer className="mt-8 text-sm text-gray-500">
              {t(locale, 'common.lastUpdated')}: {new Date(frontmatter.lastModified).toLocaleDateString(getDateLocale(locale))}
            </footer>
          )}

          {/* 联系按钮（可选，可根据 frontmatter 控制） */}
          {frontmatter.category === 'page' && (
            <div className="mt-12">
              <Link
                href={`/${locale}/contact`}
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t(locale, 'common.contactUs')}
              </Link>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
