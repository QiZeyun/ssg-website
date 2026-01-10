# 工程亮点与知识点总结

## 📋 目录

1. [工程亮点总结](#工程亮点总结)
2. [初学者学习路径](#初学者学习路径)
3. [SSG（静态站点生成）知识点](#ssg静态站点生成知识点)
4. [Next.js 技术要点](#nextjs-技术要点)
5. [SEO 优化知识点](#seo-优化知识点)
6. [CMS 内容管理知识点](#cms-内容管理知识点)
7. [工程化实践](#工程化实践)
8. [知识点扩展](#知识点扩展)

---

## 🎯 工程亮点总结

### 1. 架构设计亮点

#### ✅ 可扩展的 SEO 配置系统
- **函数式接口**：所有配置获取都是纯函数，直接调用
- **当前实现**：从本地 JSON 文件读取配置（`dataService/data/seo-config.json`）
- **未来扩展**：可以在内部实现中切换数据源（CMS、API、数据库等），调用方无需感知
- **类型安全**：完整的 TypeScript 类型定义，编译时类型检查

```typescript
// 函数式接口，直接调用
import { 
  getGlobalConfig, 
  getPageConfig, 
  getSitemapConfig, 
  getRobotsConfig 
} from '@/dataService';

// 使用示例
const globalConfig = await getGlobalConfig();
const pageConfig = await getPageConfig('/about');
```

#### ✅ Markdown 内容管理系统（CMS）
- **零代码内容管理**：运营人员只需创建 Markdown 文件即可生成页面
- **自动路由生成**：文件名自动映射为 URL 路径（如 `about.md` → `/zh/about`）
- **Frontmatter 元数据**：支持 title、description、date、tags、author、image 等丰富元数据
- **自动扫描和解析**：构建时自动扫描所有 Markdown 文件并解析
- **多语言支持**：不同语言目录下的同名文件自动生成对应语言版本

```typescript
// 自动从 Markdown 文件获取内容
const content = await getContentBySlug('about', 'zh');
// 返回：{ frontmatter, content, slug, locale, filePath }
```

#### ✅ 类型安全的国际化系统
- **编译时类型检查**：翻译键的类型约束基于中文翻译结构
- **自动补全**：IDE 自动提示所有可用的翻译键
- **参数化翻译**：支持 `{{paramName}}` 格式的占位符
- **禁止硬编码**：ESLint 规则强制要求使用翻译函数，禁止硬编码文案

```typescript
// ✅ 正确：类型安全，自动补全
const text = t(locale, 'pricing.perMonth');
const text2 = t(locale, 'pricing.savePercent', { percent: 20 });

// ❌ 错误：硬编码文案会被 ESLint 检查拦截
const text = locale === 'zh' ? '/月' : '/month';
```

#### ✅ 组件化架构
- **服务器组件**：默认使用服务器组件（`app/` 目录），减少客户端 JavaScript
- **客户端组件**：按需使用客户端组件（`'use client'`），如交互式表单
- **可复用组件**：`ContactForm`、`PricingTable`、`MarkdownContent`、`StructuredData` 等
- **组件职责清晰**：每个组件都有明确的单一职责

### 2. 开发体验亮点

#### ✅ 完整的开发工具链
- **TypeScript 支持**：完整的类型检查，编译时发现错误
- **ESLint 代码规范**：自动代码检查，包含自定义规则（如强制要求 `generateMetadata`）
- **Pre-commit Hooks**：提交前自动检查（类型检查、代码检查、构建验证）
- **本地验证工具**：自动化验证构建产物（`pnpm validate`）

#### ✅ 自动化脚本
- **验证脚本**（`pnpm validate`）：自动验证构建产物完整性、SEO 标签、Sitemap 等
- **预览脚本**（`pnpm preview`）：本地预览构建产物，使用 `serve` 启动静态服务器
- **一键构建+验证+预览**（`pnpm build:preview`）：完整的本地测试流程

### 3. 生产就绪特性

#### ✅ 完整的 SEO 支持
- **自动生成 Sitemap**：`app/sitemap.ts` 自动生成 `sitemap.xml`
- **自动生成 Robots.txt**：`app/robots.ts` 自动生成 `robots.txt`
- **结构化数据（JSON-LD）**：`StructuredData` 组件支持多种 Schema.org 类型
- **Open Graph 标签**：社交媒体分享优化（微信、微博、Facebook 等）
- **Twitter Card**：Twitter 分享优化
- **Metadata API**：Next.js 14 的 Metadata API，自动生成所有 SEO 标签

#### ✅ 自动化 CI/CD
- **GitHub Actions**：自动构建和部署
- **Vercel 集成**：自动部署到 Vercel
- **预览部署**：Pull Request 自动创建预览部署
- **环境变量管理**：通过 GitHub Secrets 管理敏感配置

#### ✅ 性能优化
- **静态导出**：生成纯静态 HTML，加载速度快
- **代码分割**：自动代码分割和按需加载
- **图片优化**：Next.js 图片优化（静态导出时禁用，使用 `unoptimized: true`）
- **CDN 加速**：部署到 Vercel CDN，全球加速

### 4. 代码质量保障

#### ✅ Pre-commit Hooks
- **类型检查**：`pnpm type-check`
- **代码检查**：`pnpm lint`
- **构建验证**：`pnpm validate`（如果构建产物存在）
- **Lint-staged**：只检查暂存的文件，提高速度

#### ✅ 构建验证
- **文件完整性检查**：检查关键文件是否存在
- **SEO 标签验证**：验证 title、description、Open Graph 等
- **Sitemap 和 Robots.txt 验证**：验证内容正确性
- **统计信息**：构建产物大小和文件数量

#### ✅ ESLint 自定义规则
- **require-generate-metadata**：强制要求所有 `app/**/page.tsx` 文件必须导出 `generateMetadata` 函数
- **禁止硬编码文案**：通过项目规范强制要求使用翻译函数

---

## 🎓 初学者学习路径

> 如果你是一名不了解 SSG、Next.js、SEO 优化、CMS 运营的初学者，以下是你需要学习的知识点和学习顺序。

### 📚 第一阶段：基础概念理解（1-2 周）

#### 1. 什么是静态网站生成（SSG）？

**学习目标**：理解 SSG 的基本概念和优势

**核心概念**：
- **SSG（Static Site Generation）**：在构建时预渲染页面，生成静态 HTML 文件
- **与 SSR 的区别**：SSG 在构建时生成，SSR 在请求时生成
- **与 CSR 的区别**：SSG 生成的是完整 HTML，CSR 需要 JavaScript 渲染

**学习资源**：
- [Next.js 官方文档 - Static Site Generation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#static-site-generation)
- 阅读本项目的 `PROJECT_HIGHLIGHTS.md` 中的 SSG 章节

#### 2. 什么是 Next.js？

**学习目标**：理解 Next.js 框架的核心概念

**核心概念**：
- **Next.js**：基于 React 的全栈框架
- **App Router**：Next.js 14 的新路由系统（本项目使用）
- **Server Components vs Client Components**：服务器组件和客户端组件的区别
- **Metadata API**：用于生成 SEO 元数据的 API

**学习资源**：
- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js App Router 文档](https://nextjs.org/docs/app)

**实践任务**：
- 阅读 `app/[locale]/page.tsx`，理解页面组件结构
- 阅读 `app/[locale]/layout.tsx`，理解布局组件
- 理解 `generateMetadata` 函数的作用

#### 3. 什么是 SEO（搜索引擎优化）？

**学习目标**：理解 SEO 的基本概念和重要性

**核心概念**：
- **SEO（Search Engine Optimization）**：通过优化网站内容和结构，提高在搜索引擎中的排名
- **Meta 标签**：title、description、keywords 等
- **结构化数据（JSON-LD）**：帮助搜索引擎理解页面内容
- **Sitemap**：网站地图，帮助搜索引擎发现和索引页面
- **Robots.txt**：告诉搜索引擎哪些页面可以抓取

**学习资源**：
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org) - 结构化数据标准

**实践任务**：
- 查看 `dataService/data/seo-config.json`，理解 SEO 配置结构
- 运行 `pnpm build`，查看生成的 `out/sitemap.xml` 和 `out/robots.txt`
- 使用浏览器开发者工具查看页面的 `<head>` 标签

#### 4. 业界主流官网：运营人员如何使用 CMS 系统？

**学习目标**：理解业界主流官网中运营人员如何使用 CMS 系统，以及背后的工作原理

**业界主流 CMS 使用方式**：

1. **传统 CMS（如 WordPress、Drupal）**
   - **使用方式**：运营人员登录后台管理系统，通过可视化编辑器编辑内容
   - **工作流程**：登录后台 → 创建/编辑页面 → 填写表单（标题、正文、图片等）→ 预览 → 发布
   - **特点**：所见即所得编辑器，无需懂代码，但系统耦合度高，性能较差

2. **Headless CMS（如 Contentful、Strapi、Sanity）**
   - **使用方式**：运营人员登录 CMS 后台，通过结构化的表单填写内容，内容通过 API 提供给前端
   - **工作流程**：登录 CMS 后台 → 创建内容类型（如"文章"、"产品"）→ 填写内容字段 → 发布 → 前端通过 API 获取内容并渲染
   - **特点**：内容与展示分离，前端技术栈灵活，但需要额外的 CMS 服务成本

3. **基于文件的 CMS（如 Jekyll、Hugo、本项目）**
   - **使用方式**：运营人员编辑 Markdown 文件，通过 Git 提交，系统自动构建发布
   - **工作流程**：编辑 Markdown 文件 → 提交到 Git → CI/CD 自动构建 → 自动部署
   - **特点**：版本控制友好，性能优秀，成本低，但需要一定的 Git 基础

**背后的工作原理**：

```
┌─────────────────────────────────────────────────────────┐
│              CMS 系统工作原理流程图                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  运营人员操作                                            │
│  ├─ 传统 CMS：登录后台 → 可视化编辑 → 保存到数据库        │
│  ├─ Headless CMS：登录后台 → 填写表单 → 保存到数据库/API  │
│  └─ 文件 CMS：编辑 Markdown → Git 提交 → 保存到文件系统   │
│         ↓                    ↓                ↓          │
│  内容存储                                                 │
│  ├─ 传统 CMS：MySQL/PostgreSQL 数据库                    │
│  ├─ Headless CMS：云数据库 + REST/GraphQL API           │
│  └─ 文件 CMS：Markdown 文件（Frontmatter + 正文）        │
│         ↓                    ↓                ↓          │
│  内容获取                                                 │
│  ├─ 传统 CMS：直接从数据库读取（请求时）                 │
│  ├─ Headless CMS：通过 API 获取（请求时或构建时）       │
│  └─ 文件 CMS：构建时读取文件并解析                       │
│         ↓                    ↓                ↓          │
│  内容渲染                                                 │
│  ├─ 传统 CMS：PHP/服务器端模板引擎渲染                   │
│  ├─ Headless CMS：前端框架（React/Vue）渲染             │
│  └─ 文件 CMS：Markdown → HTML（构建时转换）             │
│         ↓                    ↓                ↓          │
│  最终展示                                                 │
│  └─ 生成 HTML 页面，用户访问                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**本项目的工作原理**：

1. **内容存储**：
   - 运营人员编辑 `dataService/data/content/[locale]/*.md` 文件
   - Frontmatter（元数据）+ Markdown 正文
   - 文件存储在代码仓库中，版本可控

2. **内容获取**（构建时）：
   ```typescript
   // 构建时自动扫描所有 Markdown 文件
   const contentFiles = scanMarkdownFiles(contentDir);
   
   // 解析 Frontmatter 和正文
   const { frontmatter, content } = parseMarkdown(fileContent);
   ```

3. **内容转换**（构建时）：
   ```typescript
   // Markdown → HTML
   const htmlContent = markdownToHtml(markdownContent);
   ```

4. **页面生成**（构建时）：
   ```typescript
   // 通过动态路由生成静态页面
   // app/[locale]/[...slug]/page.tsx
   export async function generateStaticParams() {
     const slugs = await getAllSlugs();
     return slugs.map(slug => ({ locale, slug }));
   }
   ```

5. **静态部署**：
   - 生成纯静态 HTML 文件到 `out/` 目录
   - 部署到 CDN（如 Vercel）
   - 用户访问时直接返回静态 HTML

**不同 CMS 方案对比**：

| 特性 | 传统 CMS | Headless CMS | 文件 CMS（本项目） |
|------|---------|-------------|------------------|
| **学习成本** | 低（可视化编辑） | 中（需要理解内容模型） | 中（需要 Git 和 Markdown） |
| **性能** | 较差（数据库查询） | 中（API 调用） | 优秀（静态 HTML） |
| **成本** | 中（需要服务器） | 高（云服务费用） | 低（免费托管） |
| **灵活性** | 低（耦合后端） | 高（前后端分离） | 高（完全控制） |
| **SEO** | 好（服务器渲染） | 好（SSG/SSR） | 优秀（静态生成） |
| **版本控制** | 困难 | 困难 | 友好（Git） |

**运营人员具体使用场景**：

#### 场景 1：管理产品卡片内容

**需求**：在首页展示产品卡片，每个卡片包含标题、描述、图片、价格、链接等字段。

**传统 CMS（WordPress）操作流程**：
1. 登录 WordPress 后台
2. 进入"产品"内容类型
3. 创建新产品，填写表单字段：
   - 标题：`"产品 A"`
   - 描述：`"这是产品 A 的详细描述..."`
   - 特色图片：上传图片
   - 价格：`99`
   - 链接：`/products/product-a`
4. 点击"发布"
5. 前端页面自动从数据库读取并渲染卡片

**Headless CMS（Contentful）操作流程**：
1. 登录 Contentful 后台
2. 进入"Product"内容模型（Content Model）
3. 创建新条目（Entry），填写字段：
   - `title`（短文本）：`"产品 A"`
   - `description`（长文本）：`"这是产品 A 的详细描述..."`
   - `image`（媒体）：上传图片
   - `price`（数字）：`99`
   - `slug`（短文本）：`"product-a"`
4. 点击"发布"
5. 前端通过 API 获取数据并渲染卡片：
   ```typescript
   // 前端代码
   const products = await fetch('https://api.contentful.com/...');
   products.map(product => (
     <ProductCard
       title={product.title}
       description={product.description}
       image={product.image.url}
       price={product.price}
       link={`/products/${product.slug}`}
     />
   ));
   ```

**文件 CMS（本项目）操作流程**：
1. 在 `dataService/data/content/zh/products/` 目录下创建 `product-a.md`
2. 编辑 Markdown 文件，填写 Frontmatter 字段：
   ```markdown
   ---
   title: "产品 A"
   description: "这是产品 A 的详细描述..."
   image: "/images/products/product-a.jpg"
   price: 99
   slug: "product-a"
   tags: ["product", "featured"]
   category: "product"
   ---
   
   # 产品 A
   
   这是产品 A 的详细描述...
   ```
3. 提交到 Git
4. CI/CD 自动构建，前端在构建时读取并渲染

**本工程的实际实现**：

**步骤 1：创建内容获取函数**（已实现，`dataService/configs/content/index.ts`）

```typescript
// 获取所有产品内容（构建时调用）
import { getAllContents } from '@/dataService';

// 在页面组件中获取产品列表
const products = await getAllContents({ 
  locale: 'zh',
  tag: 'product',  // 通过标签筛选产品
  sortBy: 'date',   // 按日期排序
  sortOrder: 'desc' // 降序（最新的在前）
});
// 返回：MarkdownContent[] 数组
// 每个元素包含：{ frontmatter, content, slug, locale, filePath }
```

**步骤 2：创建产品卡片组件**（需要创建 `components/ProductCard.tsx`）

```typescript
// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  price?: number;
  link: string;
  locale: string;
}

export function ProductCard({ 
  title, 
  description, 
  image, 
  price, 
  link,
  locale 
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 产品图片 */}
      {image && (
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* 产品信息 */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* 价格 */}
        {price !== undefined && (
          <div className="text-2xl font-bold text-primary-600 mb-4">
            ¥{price}
          </div>
        )}
        
        {/* 链接按钮 */}
        <Link
          href={link}
          className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          了解详情
        </Link>
      </div>
    </div>
  );
}
```

**步骤 3：在页面中渲染产品卡片**（示例：`app/[locale]/products/page.tsx`）

```typescript
// app/[locale]/products/page.tsx
import { getAllContents } from '@/dataService';
import { ProductCard } from '@/components/ProductCard';
import { isSupportedLocale } from '@/i18n';
import { notFound } from 'next/navigation';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  // 构建时获取所有产品内容
  const products = await getAllContents({ 
    locale,
    tag: 'product',  // 只获取带有 'product' 标签的内容
    sortBy: 'date',
    sortOrder: 'desc'
  });

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          我们的产品
        </h1>
        
        {/* 产品卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              title={product.frontmatter.title || ''}
              description={product.frontmatter.description || ''}
              image={product.frontmatter.image || '/images/default-product.jpg'}
              price={product.frontmatter.price}
              link={`/${locale}/products/${product.slug}`}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

**步骤 4：内容字段映射关系**

```
┌──────────────────────────────────────────────────┐
│  Markdown Frontmatter → 组件 Props 映射关系        │
├──────────────────────────────────────────────────┤
│                                                  │
│  Frontmatter 字段         组件 Props              │
│  ├─ title          →      title                 │
│  ├─ description    →      description           │
│  ├─ image          →      image                 │
│  ├─ price          →      price                 │
│  ├─ slug           →      link (构造 URL)        │
│  └─ tags           →      (用于筛选，不直接传递) │
│                                                  │
└──────────────────────────────────────────────────┘
```

**关键实现要点**：

1. **构建时数据获取**：`getAllContents` 在构建时（`generateStaticParams` 或页面组件中）调用，不是请求时
2. **标签筛选**：使用 `tags: ['product']` 来标识产品内容，然后通过 `getAllContents({ tag: 'product' })` 筛选
3. **类型安全**：`ProductCard` 组件接收明确的 Props 类型，确保类型安全
4. **SEO 友好**：产品列表页面同样需要实现 `generateMetadata` 函数
5. **静态生成**：所有产品页面在构建时生成静态 HTML，性能优秀

**与本项目其他实现的对比**：

- **价格卡片**：使用 `pricing-config.json` 配置文件 + `PricingCard` 组件（已实现）
- **功能卡片**：使用翻译文件 `translations/*.ts` + 硬编码的卡片结构（首页已实现）
- **产品卡片**：使用 Markdown 文件 + `ProductCard` 组件（可按上述方式实现）

#### 场景 2：管理博客文章列表

**需求**：在博客页面展示文章列表，每个文章卡片包含标题、摘要、作者、发布日期、标签等。

**传统 CMS 操作**：
- 在后台创建"文章"内容，填写标题、正文、作者、日期、标签等字段
- 前端通过数据库查询获取文章列表并渲染

**Headless CMS 操作**：
- 在 CMS 后台创建"Article"内容模型，定义字段结构
- 创建文章条目，填写各个字段
- 前端通过 API 获取文章列表：
  ```typescript
  const articles = await contentful.getEntries({
    content_type: 'article',
    order: '-sys.createdAt'
  });
  ```

**文件 CMS（本项目）操作**：
- 在 `dataService/data/content/zh/blog/` 目录下创建 `article-1.md`
- 编辑 Frontmatter：
  ```markdown
  ---
  title: "如何优化网站 SEO"
  description: "本文介绍网站 SEO 优化的最佳实践..."
  author: "张三"
  date: "2024-01-15"
  tags: ["SEO", "优化", "网站"]
  ---
  ```

**本工程的实际实现**：

**实现方式**：本项目已经实现了博客文章的完整流程，通过 `app/[locale]/[...slug]/page.tsx` 动态路由自动处理所有 Markdown 内容。

**步骤 1：创建文章 Markdown 文件**

在 `dataService/data/content/zh/blog/seo-guide.md`：

```markdown
---
title: "如何优化网站 SEO"
description: "本文介绍网站 SEO 优化的最佳实践，包括 Meta 标签、结构化数据、Sitemap 等内容。"
author: "张三"
date: "2024-01-15"
tags: ["SEO", "优化", "网站"]
image: "/images/blog/seo-guide.jpg"
---

# 如何优化网站 SEO

## 什么是 SEO？

SEO（Search Engine Optimization）是搜索引擎优化的缩写...
```

**步骤 2：构建时自动扫描和路由生成**（已实现，`app/[locale]/[...slug]/page.tsx`）

```typescript
// app/[locale]/[...slug]/page.tsx 中的 generateStaticParams
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];
  
  for (const locale of supportedLocales) {
    const slugs = await getAllSlugs(locale);
    
    for (const slug of slugs) {
      // slug: 'blog/seo-guide' → ['blog', 'seo-guide']
      const slugArray = slug.split('/').filter(Boolean);
      params.push({ locale, slug: slugArray });
    }
  }
  
  return params;
}
// 结果：自动生成 /zh/blog/seo-guide 路由
```

**步骤 3：文章列表页面实现**（需要创建 `app/[locale]/blog/page.tsx`）

```typescript
// app/[locale]/blog/page.tsx
import { getAllContents, generateMetadataFromPath } from '@/dataService';
import Link from 'next/link';
import { isSupportedLocale, getDateLocale, t } from '@/i18n';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromPath(`/${locale}/blog`);
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  // 构建时获取所有博客文章
  const articles = await getAllContents({ 
    locale,
    // 可以通过 tag 筛选，或者通过路径前缀筛选
    sortBy: 'date',
    sortOrder: 'desc'
  }).then(items => 
    // 只保留 blog/ 路径下的文章
    items.filter(item => item.slug.startsWith('blog/'))
  );

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t(locale, 'nav.blog')}
        </h1>
        
        {/* 文章列表 */}
        <div className="space-y-8">
          {articles.map((article) => (
            <article 
              key={article.slug}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              {/* 文章标题 */}
              <Link href={`/${locale}/${article.slug}`}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-primary-600">
                  {article.frontmatter.title}
                </h2>
              </Link>
              
              {/* 文章元数据 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {article.frontmatter.date && (
                  <time dateTime={article.frontmatter.date}>
                    {new Date(article.frontmatter.date).toLocaleDateString(
                      getDateLocale(locale),
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </time>
                )}
                {article.frontmatter.author && (
                  <span>{t(locale, 'common.author')}: {article.frontmatter.author}</span>
                )}
                {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 文章描述 */}
              {article.frontmatter.description && (
                <p className="text-gray-600 mb-4">
                  {article.frontmatter.description}
                </p>
              )}
              
              {/* 阅读更多链接 */}
              <Link
                href={`/${locale}/${article.slug}`}
                className="inline-block text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t(locale, 'common.readMore')} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
```

**关键实现要点**：

1. **自动路由**：Markdown 文件路径 `blog/seo-guide.md` 自动映射为 URL `/zh/blog/seo-guide`
2. **内容获取**：通过 `getAllContents` 获取所有文章，然后通过路径前缀筛选博客文章
3. **排序**：按日期降序排序，最新的文章在前
4. **SEO 优化**：每篇文章都有独立的页面，包含完整的 SEO 元数据（通过 `generateMetadata`）
5. **静态生成**：所有文章列表和详情页都在构建时生成静态 HTML

#### 场景 3：管理首页轮播图

**需求**：在首页展示轮播图，每张图片包含标题、描述、链接、图片 URL。

**不同 CMS 的实现方式**：

**传统 CMS**：
- 后台创建"轮播图"自定义内容类型
- 填写图片、标题、描述、链接字段
- 前端从数据库读取并渲染轮播组件

**Headless CMS**：
- 创建"Banner"内容模型，定义字段
- 创建多个 Banner 条目
- 前端通过 API 获取并渲染：
  ```typescript
  const banners = await cms.getBanners();
  <Carousel>
    {banners.map(banner => (
      <BannerSlide
        image={banner.image.url}
        title={banner.title}
        description={banner.description}
        link={banner.link}
      />
    ))}
  </Carousel>
  ```

**文件 CMS（本项目）**：

**实现方式 1：使用 JSON 配置文件**（推荐）

创建 `dataService/data/banners-config.json`：

```json
{
  "zh": [
    {
      "title": "欢迎使用我们的产品",
      "description": "了解更多信息",
      "image": "/images/banner-1.jpg",
      "link": "/zh/products",
      "buttonText": "立即了解"
    },
    {
      "title": "新功能上线",
      "description": "立即体验",
      "image": "/images/banner-2.jpg",
      "link": "/zh/features",
      "buttonText": "立即体验"
    }
  ],
  "en": [
    {
      "title": "Welcome to Our Product",
      "description": "Learn more",
      "image": "/images/banner-1.jpg",
      "link": "/en/products",
      "buttonText": "Learn More"
    }
  ]
}
```

**在配置模块中添加获取函数**（`dataService/configs/banners/index.ts`）：

```typescript
import bannersConfig from '../../data/banners-config.json';

export async function getBannersConfig(locale: string) {
  return bannersConfig[locale as keyof typeof bannersConfig] || [];
}
```

**实现轮播组件**（`components/Carousel.tsx`）：

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Banner {
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText?: string;
}

interface CarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({ banners, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[500px] bg-gray-200">
      {/* 轮播图片 */}
      <Image
        src={currentBanner.image}
        alt={currentBanner.title}
        fill
        className="object-cover"
        priority
      />
      
      {/* 内容覆盖层 */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {currentBanner.title}
          </h2>
          <p className="text-xl mb-6 max-w-2xl">
            {currentBanner.description}
          </p>
          <Link
            href={currentBanner.link}
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {currentBanner.buttonText || '了解更多'}
          </Link>
        </div>
      </div>

      {/* 指示器 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

**在首页使用**（`app/[locale]/page.tsx`）：

```typescript
import { getBannersConfig } from '@/dataService/configs/banners';
import { Carousel } from '@/components/Carousel';

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // 构建时获取轮播图配置
  const banners = await getBannersConfig(locale);

  return (
    <main className="min-h-screen">
      {/* 轮播图 */}
      <Carousel banners={banners} autoPlay={true} interval={5000} />
      
      {/* 其他内容... */}
    </main>
  );
}
```

**实现方式 2：使用 Markdown 文件**（不推荐，但可行）

创建 `dataService/data/content/zh/home/banners.md`，但这种方式不如 JSON 灵活。

#### 场景 4：管理价格表

**需求**：在价格页面展示不同套餐的价格、功能列表、按钮文本等。

**本项目实际实现**（`dataService/data/pricing-config.json`）：
```json
{
  "zh": {
    "productName": "产品名称",
    "tiers": [
      {
        "name": "基础版",
        "price": 99,
        "billingPeriod": "monthly",
        "features": [
          { "name": "功能 1", "included": true },
          { "name": "功能 2", "included": true }
        ],
        "buttonText": "立即购买"
      }
    ]
  }
}
```

**本工程的实际实现**（已完整实现）：

**步骤 1：配置文件**（`dataService/data/pricing-config.json`）

配置文件结构完整，包含多语言支持、多个套餐、月付/年付切换等功能。

**步骤 2：获取配置**（`dataService/configs/pricing/index.ts`）

```typescript
// 已实现的获取函数
import { getPricingConfig } from '@/dataService';

// 在页面中使用
const pricingConfig = await getPricingConfig(locale);
// 返回：LocalizedPricingConfig 类型，包含 tiers、productName 等
```

**步骤 3：价格卡片组件**（`components/PricingCard.tsx` - 已实现）

组件功能完整：
- 显示套餐名称、价格、描述
- 功能列表（支持/不支持）
- 月付/年付价格切换
- CTA 按钮
- 响应式设计

**步骤 4：价格表格组件**（`components/PricingTable.tsx` - 已实现）

组件功能完整：
- 套餐卡片网格布局
- 月付/年付切换开关
- FAQ 部分（可选）
- 完整的类型定义

**步骤 5：价格页面**（`app/[locale]/pricing/page.tsx` - 已实现）

```typescript
// 实际实现代码
export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  
  // 构建时获取价格配置
  const pricingConfig = await getPricingConfig(locale);
  
  return (
    <main className="min-h-screen bg-gray-50">
      <PricingTable config={pricingConfig} locale={locale} />
    </main>
  );
}
```

**关键实现要点**：

1. **配置驱动**：所有价格信息都在 JSON 配置文件中，运营人员可以直接修改
2. **类型安全**：完整的 TypeScript 类型定义（`PricingConfig`、`PricingTier` 等）
3. **多语言支持**：配置文件中包含 `zh` 和 `en` 两个语言版本
4. **灵活的价格结构**：支持月付/年付、不同货币、功能列表等
5. **客户端交互**：价格切换使用客户端组件（`'use client'`），提供流畅的用户体验
6. **SEO 优化**：价格页面包含完整的 SEO 元数据（通过 `generateMetadata`）

**与场景 1（产品卡片）的区别**：

- **产品卡片**：从 Markdown 文件动态获取，每个产品一个文件，更灵活
- **价格表**：从 JSON 配置文件获取，结构固定，更适合标准化的套餐展示

#### 场景 5：内容字段与前端渲染的对应关系

**核心概念**：CMS 中的内容字段 → 前端组件的 Props

```
┌─────────────────────────────────────────────────┐
│        内容字段 → 前端渲染的映射关系               │
├─────────────────────────────────────────────────┤
│                                                 │
│  CMS 内容字段                                    │
│  ├─ title (标题)                                 │
│  ├─ description (描述)                          │
│  ├─ image (图片)                                 │
│  ├─ price (价格)                                 │
│  ├─ tags (标签)                                  │
│  └─ ... (其他字段)                               │
│         ↓                                        │
│  前端组件 Props                                   │
│  <ProductCard                                    │
│    title={content.title}                        │
│    description={content.description}            │
│    image={content.image}                        │
│    price={content.price}                        │
│    tags={content.tags}                          │
│  />                                              │
│         ↓                                        │
│  渲染结果                                         │
│  ┌─────────────────────┐                        │
│  │  [图片]             │                        │
│  │  标题               │                        │
│  │  描述文字...        │                        │
│  │  ¥99                │                        │
│  │  [标签1] [标签2]    │                        │
│  └─────────────────────┘                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**实际例子**（本项目的 Markdown 内容 → 页面渲染）：

1. **运营人员编辑** `about.md`：
   ```markdown
   ---
   title: "关于我们"
   description: "了解我们的公司..."
   date: "2024-01-10"
   tags: ["公司", "介绍"]
   ---
   
   # 关于我们
   
   这是正文内容...
   ```

2. **构建时解析**：
   ```typescript
   const content = await getContentBySlug('about', 'zh');
   // content.frontmatter = { title, description, date, tags }
   // content.content = "<h1>关于我们</h1><p>这是正文内容...</p>"
   ```

3. **构建时解析**：
   ```typescript
   // 在 app/[locale]/[...slug]/page.tsx 中
   const content = await getContentBySlug(slugPath, locale);
   
   // content 对象结构：
   // {
   //   frontmatter: {
   //     title: "关于我们",
   //     description: "了解我们的公司...",
   //     date: "2024-01-10",
   //     tags: ["公司", "介绍"],
   //     author: "公司团队"
   //   },
   //   content: "<h1>关于我们</h1><p>这是正文内容...</p>",
   //   slug: "about",
   //   locale: "zh",
   //   filePath: "zh/about.md"
   // }
   ```

4. **前端页面渲染**（`app/[locale]/[...slug]/page.tsx` - 已实现）：

```typescript
// 实际实现代码（简化版）
export default async function UniversalPage({ params }: UniversalPageProps) {
  const { locale, slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug || '';
  
  // 获取 Markdown 内容
  const content = await getContentBySlug(slugPath, locale);
  
  if (!content) {
    notFound();
  }

  const { frontmatter, content: htmlContent } = content;

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 - 从 frontmatter.title 获取 */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {frontmatter.title}
            </h1>

            {/* 元数据信息 - 从 frontmatter.date/author/tags 获取 */}
            {(frontmatter.date || frontmatter.author || frontmatter.tags) && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                {frontmatter.date && (
                  <time dateTime={frontmatter.date}>
                    {new Date(frontmatter.date).toLocaleDateString(
                      getDateLocale(locale),
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
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

            {/* 描述 - 从 frontmatter.description 获取 */}
            {frontmatter.description && (
              <p className="text-xl text-gray-600">{frontmatter.description}</p>
            )}
          </header>

          {/* Markdown 正文 - 从 content (已转换为 HTML) 渲染 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <MarkdownContent content={htmlContent} />
          </div>

          {/* 最后修改时间 - 从 frontmatter.lastModified 获取 */}
          {frontmatter.lastModified && frontmatter.lastModified !== frontmatter.date && (
            <footer className="mt-8 text-sm text-gray-500">
              {t(locale, 'common.lastUpdated')}: {' '}
              {new Date(frontmatter.lastModified).toLocaleDateString(getDateLocale(locale))}
            </footer>
          )}
        </div>
      </article>
    </main>
  );
}
```

**完整的字段映射流程**：

```
┌──────────────────────────────────────────────────────────┐
│  Markdown 文件 → 构建时解析 → 前端渲染的完整流程           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 运营人员编辑 Markdown 文件                            │
│     └─ about.md (包含 Frontmatter + 正文)                 │
│         ↓                                                 │
│  2. 构建时扫描并解析                                      │
│     └─ parseMarkdown() 解析 Frontmatter 和正文           │
│         ↓                                                 │
│  3. 转换为 HTML                                          │
│     └─ remark + rehype 将 Markdown 转换为 HTML           │
│         ↓                                                 │
│  4. 生成内容对象                                          │
│     └─ { frontmatter, content, slug, locale }            │
│         ↓                                                 │
│  5. 路由生成                                              │
│     └─ generateStaticParams() 生成静态路由               │
│         ↓                                                 │
│  6. 页面渲染                                              │
│     └─ UniversalPage 组件接收内容并渲染                  │
│         ↓                                                 │
│  7. 生成静态 HTML                                         │
│     └─ /zh/about/index.html (纯静态文件)                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**关键理解**：

1. **内容字段**：运营人员在 Markdown Frontmatter 中填写的结构化数据（title、description、tags 等）
2. **前端组件**：开发人员编写的 React 组件（如 `UniversalPage`），接收解析后的内容对象
3. **字段映射**：Frontmatter 字段通过 `content.frontmatter.fieldName` 访问，直接传递给组件
4. **渲染结果**：前端组件根据内容字段动态生成 HTML，最终输出静态 HTML 文件
5. **构建时处理**：所有解析和转换都在构建时完成，运行时只是展示静态 HTML

**与本项目其他实现的对比**：

- **Markdown 内容页面**（场景 5）：从 Markdown 文件获取，支持富文本内容，字段通过 Frontmatter 定义
- **价格表**（场景 4）：从 JSON 配置文件获取，结构固定，适合标准化的数据展示
- **功能卡片**（首页）：从翻译文件获取，适合简单的、不需要动态内容的功能展示

#### 场景 6：运营人员做 SEO 优化

**需求**：运营人员需要为每个页面配置 SEO 元数据，包括标题、描述、关键词、Open Graph 图片等，以提高搜索引擎排名和社交媒体分享效果。

**传统 CMS（WordPress）操作流程**：
1. 登录 WordPress 后台
2. 编辑页面或文章
3. 在 SEO 插件（如 Yoast SEO）中填写：
   - **页面标题**：`"关于我们 | 公司名称"`
   - **Meta 描述**：`"了解我们的公司、使命和价值观..."`
   - **焦点关键词**：`"公司介绍"、"企业信息"`
   - **Open Graph 图片**：上传分享图片
   - **社交媒体标题和描述**：自定义社交分享内容
4. 点击"更新"保存
5. SEO 插件自动生成 `<meta>` 标签和 Open Graph 标签

**Headless CMS（Contentful）操作流程**：
1. 登录 Contentful 后台
2. 在内容模型中添加 SEO 字段：
   - `seoTitle`（短文本）
   - `seoDescription`（长文本）
   - `seoKeywords`（短文本，多个）
   - `ogImage`（媒体）
   - `twitterCard`（短文本）
3. 创建或编辑内容条目，填写 SEO 字段
4. 前端通过 API 获取 SEO 数据并生成 Meta 标签：
   ```typescript
   const entry = await contentful.getEntry('entry-id');
   const seoData = {
     title: entry.fields.seoTitle,
     description: entry.fields.seoDescription,
     keywords: entry.fields.seoKeywords,
     ogImage: entry.fields.ogImage?.fields?.file?.url
   };
   ```

**文件 CMS（本项目）操作流程**：

**方式 1：通过 Markdown Frontmatter 配置**（推荐，适合内容页面）

在 Markdown 文件的 Frontmatter 中填写 SEO 字段：

```markdown
---
title: "关于我们"
description: "了解我们的公司、使命和价值观。我们致力于为客户提供优质产品和服务。"
date: "2024-01-10"
tags: ["公司", "介绍", "企业信息"]
image: "/og-about.jpg"  # Open Graph 分享图片
author: "公司团队"
---

# 关于我们

这是正文内容...
```

**方式 2：通过 SEO 配置文件**（适合固定路由页面）

在 `dataService/data/seo-config.json` 中配置：

```json
{
  "pages": [
    {
      "path": "/about",
      "title": "关于我们",
      "description": "了解我们的公司、使命和价值观",
      "keywords": ["公司", "介绍", "企业信息"],
      "ogImage": "/og-about.jpg",
      "openGraph": {
        "title": "关于我们 | 公司名称",
        "description": "了解我们的公司、使命和价值观",
        "images": [
          {
            "url": "/og-about.jpg",
            "width": 1200,
            "height": 630,
            "alt": "关于我们"
          }
        ]
      },
      "twitter": {
        "card": "summary_large_image",
        "title": "关于我们",
        "description": "了解我们的公司、使命和价值观",
        "images": ["/og-about.jpg"]
      }
    }
  ]
}
```

**本工程的实际实现**：

**实现方式 1：Markdown 页面的 SEO 配置**（已实现）

**步骤 1：运营人员在 Markdown Frontmatter 中填写 SEO 字段**

```markdown
# dataService/data/content/zh/about.md
---
title: "关于我们"
description: "了解我们的公司、使命和价值观。我们致力于为客户提供优质产品和服务。"
date: "2024-01-10"
tags: ["公司", "介绍", "企业信息"]
image: "/og-about.jpg"  # SEO 分享图片
author: "公司团队"
---

# 关于我们

这是正文内容...
```

**步骤 2：页面组件自动从 Frontmatter 获取 SEO 信息**（已实现，`app/[locale]/[...slug]/page.tsx`）

```typescript
// app/[locale]/[...slug]/page.tsx
export async function generateMetadata({ params }: UniversalPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug || '';
  
  // 获取 Markdown 内容
  const content = await getContentBySlug(slugPath, locale);
  
  if (!content) {
    return {};
  }

  // 从 Frontmatter 获取 SEO 信息
  const { frontmatter } = content;
  const pagePath = `/${locale}/${slugPath}`;

  // 调用 generateMetadataFromPath，传入 Frontmatter 中的 SEO 字段
  return generateMetadataFromPath(pagePath, {
    title: frontmatter.title,           // 从 Frontmatter 获取
    description: frontmatter.description, // 从 Frontmatter 获取
    keywords: frontmatter.tags,         // tags 转换为 keywords
    ogImage: frontmatter.image,         // 从 Frontmatter 获取
  });
}
```

**步骤 3：generateMetadataFromPath 生成完整的 SEO 元数据**（已实现，`dataService/generateMetadata.ts`）

```typescript
// dataService/generateMetadata.ts
export async function generateMetadataFromPath(
  path: string,
  overrides?: Partial<PageSeoConfig>
): Promise<Metadata> {
  const globalConfig = await getGlobalConfig();
  const basePath = path.replace(new RegExp(`^/(${localePattern})`), '') || '/';
  const pageConfig = await getPageConfig(basePath);

  // 合并：全局配置 → SEO 配置文件 → Frontmatter 覆盖
  const finalConfig: PageSeoConfig = {
    title: overrides?.title || pageConfig?.title || 'Page',
    description: overrides?.description || pageConfig?.description || globalConfig.defaultDescription,
    keywords: overrides?.keywords || pageConfig?.keywords || globalConfig.defaultKeywords,
    ogImage: overrides?.ogImage || pageConfig?.ogImage || globalConfig.defaultOgImage,
    // ... 其他字段
  };

  // 生成 Next.js Metadata 对象
  return generateMetadata(finalConfig, globalConfig);
}
```

**步骤 4：生成的 HTML Meta 标签**

构建后，页面 HTML 中会自动包含：

```html
<head>
  <!-- 基础 SEO 标签 -->
  <title>关于我们 | Your Company Name</title>
  <meta name="description" content="了解我们的公司、使命和价值观。我们致力于为客户提供优质产品和服务。">
  <meta name="keywords" content="公司,介绍,企业信息">
  
  <!-- Open Graph 标签（社交媒体分享） -->
  <meta property="og:title" content="关于我们 | Your Company Name">
  <meta property="og:description" content="了解我们的公司、使命和价值观。我们致力于为客户提供优质产品和服务。">
  <meta property="og:image" content="https://example.com/og-about.jpg">
  <meta property="og:url" content="https://example.com/zh/about">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card 标签 -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="关于我们">
  <meta name="twitter:description" content="了解我们的公司、使命和价值观。我们致力于为客户提供优质产品和服务。">
  <meta name="twitter:image" content="https://example.com/og-about.jpg">
  
  <!-- 规范 URL -->
  <link rel="canonical" href="https://example.com/zh/about">
</head>
```

**实现方式 2：固定路由页面的 SEO 配置**（已实现）

**步骤 1：在 SEO 配置文件中添加页面配置**

编辑 `dataService/data/seo-config.json`：

```json
{
  "pages": [
    {
      "path": "/contact",
      "title": "联系我们",
      "description": "获取联系方式，我们期待与您沟通",
      "keywords": ["联系", "联系方式", "客服"],
      "ogImage": "/og-contact.jpg"
    }
  ]
}
```

**步骤 2：页面组件使用 generateMetadataFromPath**（已实现，`app/[locale]/contact/page.tsx`）

```typescript
// app/[locale]/contact/page.tsx
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  // 从 SEO 配置文件读取配置
  return generateMetadataFromPath(`/${locale}/contact`);
}
```

**实现方式 3：全局 SEO 配置**（已实现）

**在 `dataService/data/seo-config.json` 中配置全局设置**：

```json
{
  "global": {
    "siteUrl": "https://example.com",
    "siteName": "Your Company Name",
    "titleTemplate": "%s | Your Company Name",
    "defaultDescription": "网站默认描述",
    "defaultKeywords": ["网站", "公司", "业务"],
    "defaultOgImage": "/og-image.jpg",
    "openGraph": {
      "type": "website",
      "locale": "zh_CN",
      "siteName": "Your Company Name"
    },
    "twitter": {
      "card": "summary_large_image",
      "creator": "@yourcompany"
    },
    "verification": {
      "google": "google-verification-code",
      "yandex": "yandex-verification-code"
    }
  }
}
```

**实现方式 4：Sitemap 和 Robots.txt 配置**（已实现）

**Sitemap 配置**（`dataService/data/seo-config.json`）：

```json
{
  "sitemap": {
    "baseUrl": "https://example.com",
    "pages": [
      {
        "path": "/zh/about",
        "lastModified": "2024-01-15",
        "changeFrequency": "monthly",
        "priority": 0.8
      }
    ]
  }
}
```

**自动生成 Sitemap**（`app/sitemap.ts` - 已实现）：

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const config = await getSitemapConfig();
  
  return config.pages.map((page) => ({
    url: `${config.baseUrl}${page.path}`,
    lastModified: page.lastModified || new Date(),
    changeFrequency: page.changeFrequency || 'weekly',
    priority: page.priority || 0.5,
  }));
}
// 构建后自动生成 /sitemap.xml
```

**Robots.txt 配置**（`dataService/data/seo-config.json`）：

```json
{
  "robots": {
    "sitemap": "https://example.com/sitemap.xml",
    "rules": [
      {
        "userAgent": "*",
        "allow": ["/"],
        "disallow": ["/admin", "/api"]
      }
    ]
  }
}
```

**自动生成 Robots.txt**（`app/robots.ts` - 已实现）：

```typescript
// app/robots.ts
export default async function robots() {
  const config = await getRobotsConfig();
  
  return {
    rules: config.rules.map((rule) => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow,
    })),
    sitemap: config.sitemap,
  };
}
// 构建后自动生成 /robots.txt
```

**关键实现要点**：

1. **多层级配置优先级**：
   - 全局配置（默认值）
   - SEO 配置文件（`seo-config.json`）
   - Markdown Frontmatter（最高优先级，会覆盖前面的配置）

2. **自动生成 Meta 标签**：
   - 所有页面都通过 `generateMetadata` 函数自动生成 SEO 元数据
   - 支持 title、description、keywords、Open Graph、Twitter Card 等

3. **类型安全**：
   - 完整的 TypeScript 类型定义（`PageSeoConfig`、`GlobalSeoConfig`）
   - 编译时检查，避免配置错误

4. **自动生成 Sitemap 和 Robots.txt**：
   - 构建时自动生成，无需手动维护
   - 支持配置更新频率、优先级等

5. **多语言支持**：
   - 不同语言版本可以有不同的 SEO 配置
   - URL 路径自动包含语言前缀（`/zh/about`、`/en/about`）

6. **社交媒体优化**：
   - 自动生成 Open Graph 标签，优化微信、Facebook 等平台分享效果
   - 支持 Twitter Card，优化 Twitter 分享效果

**运营人员 SEO 优化工作流程**：

```
1. 创建/编辑 Markdown 文件
   ↓
2. 在 Frontmatter 中填写 SEO 字段
   ├─ title（必需）
   ├─ description（强烈建议）
   ├─ tags（关键词）
   └─ image（分享图片）
   ↓
3. 对于固定路由页面，在 seo-config.json 中配置
   ↓
4. 提交到 Git
   ↓
5. CI/CD 自动构建
   ↓
6. 自动生成：
   ├─ Meta 标签（title、description、keywords）
   ├─ Open Graph 标签（社交媒体分享）
   ├─ Twitter Card 标签
   ├─ Sitemap.xml（搜索引擎索引）
   └─ Robots.txt（爬虫规则）
   ↓
7. 部署到生产环境
   ↓
8. 搜索引擎自动抓取和索引
```

**SEO 优化最佳实践**：

1. **标题（Title）**：
   - 长度：30-60 个字符
   - 包含关键词
   - 每个页面唯一

2. **描述（Description）**：
   - 长度：120-160 个字符
   - 吸引用户点击
   - 包含核心关键词

3. **关键词（Keywords）**：
   - 使用 tags 字段，3-8 个关键词
   - 与内容相关
   - 避免堆砌

4. **分享图片（OG Image）**：
   - 尺寸：1200 x 630 像素（2:1 比例）
   - 文件大小：< 1MB
   - 包含页面标题或核心信息

5. **URL 结构**：
   - 清晰、语义化
   - 包含关键词（如 `/zh/products/seo-tool`）
   - 使用连字符分隔

6. **内容质量**：
   - 原创、有价值的内容
   - 定期更新（更新 `lastModified` 字段）
   - 内部链接优化

**学习资源**：
- [WordPress 使用指南](https://wordpress.org/documentation/) - 了解传统 CMS
- [Contentful 文档](https://www.contentful.com/developers/docs/) - 了解 Headless CMS
- [Markdown 基础语法](https://www.markdownguide.org/basic-syntax/) - 了解文件 CMS
- [Google Search Central](https://developers.google.com/search) - SEO 优化指南
- [Open Graph Protocol](https://ogp.me) - 社交媒体分享优化
- 阅读本项目的 `dataService/data/README.md`（1219 行详细指南，面向运营人员）

**实践任务**：
- 对比不同 CMS 方案，理解各自的优缺点
- 阅读 `dataService/configs/content/index.ts`，理解文件 CMS 的工作原理
- 在 `dataService/data/content/zh/` 目录下创建一个新的 Markdown 文件
- 在 Markdown Frontmatter 中填写 SEO 字段（title、description、tags、image）
- 编辑 `dataService/data/seo-config.json`，为固定路由页面配置 SEO
- 运行 `pnpm build`，观察从 Markdown 到静态 HTML 的转换过程
- 查看生成的 `out/` 目录，理解静态文件结构
- 使用浏览器开发者工具查看生成的 HTML，检查 Meta 标签是否正确
- 查看生成的 `out/sitemap.xml` 和 `out/robots.txt` 文件

### 📚 第二阶段：技术栈深入学习（2-4 周）

#### 5. Next.js 深入

**学习目标**：深入理解 Next.js 的核心功能

**核心概念**：
- **App Router**：基于文件系统的路由
- **Server Components**：服务器端组件（默认）
- **Client Components**：客户端组件（`'use client'`）
- **Metadata API**：`generateMetadata` 函数
- **静态导出**：`output: 'export'` 配置
- **动态路由**：`[locale]`、`[...slug]` 等

**学习资源**：
- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [Next.js 路由文档](https://nextjs.org/docs/app/building-your-application/routing)

**实践任务**：
- 阅读 `app/[locale]/[...slug]/page.tsx`，理解动态路由
- 理解 `generateStaticParams` 函数的作用
- 尝试创建一个新的页面路由

#### 6. Markdown 处理和渲染

**学习目标**：理解 Markdown 如何转换为 HTML

**核心概念**：
- **Markdown 解析**：使用 `gray-matter` 解析 Frontmatter
- **Markdown 转 HTML**：使用 `remark` 和 `rehype` 生态系统
- **代码高亮**：使用 `highlight.js` 和 `rehype-highlight`
- **GFM（GitHub Flavored Markdown）**：支持表格、任务列表等扩展语法

**学习资源**：
- [Remark 文档](https://remark.js.org/)
- [Rehype 文档](https://github.com/rehypejs/rehype)

**实践任务**：
- 阅读 `dataService/configs/content/parser.ts`，理解 Markdown 解析逻辑
- 理解 `components/MarkdownContent.tsx` 如何渲染 HTML

### 📚 第三阶段：项目特定技术（1-2 周）

#### 7. SEO 配置系统

**学习目标**：理解 SEO 配置系统的设计

**核心概念**：
- **配置数据源抽象**：函数式接口，支持未来扩展
- **配置结构**：global、pages、sitemap、robots
- **Metadata 生成**：`generateMetadataFromPath` 函数
- **环境变量覆盖**：通过环境变量覆盖配置

**学习资源**：
- 阅读 `dataService/configs/seo/index.ts`，理解配置获取逻辑
- 阅读 `dataService/generateMetadata.ts`，理解 Metadata 生成逻辑

**实践任务**：
- 修改 `seo-config.json`，添加一个新页面的 SEO 配置
- 理解配置如何被应用到页面

#### 8. 内容管理系统（CMS）

**学习目标**：理解 Markdown 内容管理系统

**核心概念**：
- **内容文件扫描**：构建时自动扫描所有 Markdown 文件
- **内容解析**：解析 Frontmatter 和 Markdown 正文
- **路由生成**：根据文件名自动生成路由
- **内容查询**：`getContentBySlug`、`getAllContents` 等函数

**学习资源**：
- 阅读 `dataService/configs/content/index.ts`，理解内容获取逻辑
- 阅读 `dataService/data/README.md`，理解运营人员如何使用

**实践任务**：
- 创建一个新的 Markdown 文件
- 理解文件路径如何映射为 URL
- 理解 Frontmatter 字段的作用

### 📚 第四阶段：工程化实践（1-2 周）

#### 9. CI/CD 和部署

**学习目标**：理解自动化部署流程

**核心概念**：
- **GitHub Actions**：自动化工作流
- **Vercel 部署**：静态站点部署
- **环境变量管理**：GitHub Secrets
- **预览部署**：Pull Request 自动创建预览

**学习资源**：
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 文档](https://vercel.com/docs)
- 阅读 `.github/workflows/deploy.yml`

**实践任务**：
- 理解 GitHub Actions 工作流
- 理解如何配置 Vercel 部署

### 📚 学习建议

1. **循序渐进**：按照上述阶段顺序学习，不要跳跃
2. **实践为主**：每学习一个概念，都要在项目中实践
3. **阅读代码**：多阅读项目代码，理解实际实现
4. **查阅文档**：遇到不懂的概念，查阅官方文档
5. **做笔记**：记录学习过程中的问题和解决方案
6. **提问**：遇到问题及时提问，不要卡在一个地方太久

---

## 📚 SSG（静态站点生成）知识点

### 什么是 SSG？

**SSG（Static Site Generation）**：静态站点生成，是一种在构建时预渲染页面的技术。

#### SSG vs SSR vs CSR

```
┌─────────────────────────────────────────────────┐
│                 渲染时机对比                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  SSG (Static Site Generation)                  │
│  ┌─────────────────────────────────────────┐   │
│  │  构建时 (Build Time)                     │   │
│  │  ↓                                       │   │
│  │  生成静态 HTML 文件                      │   │
│  │  ↓                                       │   │
│  │  部署到 CDN                              │   │
│  │  ↓                                       │   │
│  │  用户请求 → 直接返回 HTML                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  SSR (Server-Side Rendering)                   │
│  ┌─────────────────────────────────────────┐   │
│  │  请求时 (Request Time)                   │   │
│  │  ↓                                       │   │
│  │  服务器渲染 HTML                         │   │
│  │  ↓                                       │   │
│  │  返回 HTML 给用户                        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  CSR (Client-Side Rendering)                   │
│  ┌─────────────────────────────────────────┐   │
│  │  浏览器中 (Browser)                      │   │
│  │  ↓                                       │   │
│  │  加载 JavaScript                         │   │
│  │  ↓                                       │   │
│  │  在浏览器中渲染                          │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### SSG 的优缺点

#### ✅ 优点

1. **性能优秀**
   - 纯静态 HTML，加载速度快
   - 可以部署到 CDN，全球加速
   - 减少服务器负载

2. **SEO 友好**
   - 内容在 HTML 中，搜索引擎可以直接索引
   - 首屏渲染快，提升 SEO 排名

3. **安全性高**
   - 没有服务器端代码，减少攻击面
   - 可以部署到静态托管服务（GitHub Pages、Vercel、Netlify）

4. **成本低**
   - 可以使用免费的静态托管服务
   - 不需要服务器维护

5. **可扩展性强**
   - 可以轻松处理高流量
   - CDN 自动处理流量峰值

#### ❌ 缺点

1. **动态内容限制**
   - 构建时内容已经确定，无法根据用户请求动态生成
   - 需要重新构建才能更新内容

2. **构建时间**
   - 大型站点可能需要较长的构建时间
   - 每次内容更新都需要重新构建

3. **功能限制**
   - 无法使用服务器端功能（如 API Routes、Server Components 的动态功能）
   - 无法处理实时数据

### Next.js 中的 SSG

#### 如何启用 SSG？

```javascript
// next.config.js
module.exports = {
  output: 'export',  // 启用静态导出
};
```

#### Next.js SSG 的工作原理

```
开发阶段 (Development)
├── 使用 next dev 进行开发
├── 支持热重载和实时预览
└── 不使用 output: 'export'

构建阶段 (Build)
├── 运行 next build
├── Next.js 预渲染所有页面
├── 生成静态 HTML 文件
└── 输出到 out/ 目录

部署阶段 (Deploy)
├── 将 out/ 目录部署到静态托管服务
├── 所有页面都是静态 HTML
└── 可以通过 CDN 加速
```

#### Next.js SSG 的特性

1. **自动代码分割**
   - 每个页面只加载必要的 JavaScript
   - 减少初始加载时间

2. **图片优化**
   - 自动图片优化（静态导出时禁用）
   - 支持 WebP 等现代格式

3. **路由优化**
   - 基于文件系统的路由
   - 自动生成静态路由

4. **SEO 优化**
   - 自动生成 metadata
   - 支持结构化数据

### 本工程中的 SSG 实践

#### 配置

```javascript
// next.config.js
const nextConfig = {
  // 只在生产构建时启用静态导出
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
  images: {
    unoptimized: true,  // 静态导出时禁用图片优化
  },
  trailingSlash: true,  // URL 以斜杠结尾（SEO 友好）
};
```

#### 静态路由生成

```
app/
├── [locale]/
│   ├── page.tsx          → /[locale]/index.html (主页)
│   ├── [...slug]/page.tsx → /[locale]/[...slug]/index.html (动态内容页面，如 about、blog/post-1)
│   ├── contact/page.tsx  → /[locale]/contact/index.html (固定路由)
│   └── pricing/page.tsx  → /[locale]/pricing/index.html (固定路由)
└── page.tsx              → /index.html (根路径重定向)
```

**路由优先级**：
- 固定路由（如 `contact`、`pricing`）优先于 catch-all 路由（`[...slug]`）
- 动态路由 `[...slug]` 自动处理所有 Markdown 内容页面
- 内容文件位置：`dataService/data/content/[locale]/`

#### 静态文件生成

```
out/
├── index.html                    # 根路径（重定向）
├── [locale]/
│   ├── index.html               # 主页
│   ├── about/index.html         # 从 Markdown 生成
│   ├── blog/post-1/index.html   # 从 Markdown 生成
│   ├── contact/index.html       # 固定路由
│   └── pricing/index.html       # 固定路由
├── robots.txt
├── sitemap.xml
└── _next/static/                # 静态资源
```

---

## ⚙️ Next.js 技术要点

### Next.js 14 的核心概念

#### 1. App Router vs Pages Router

**本工程使用 App Router**：

```
app/                    # App Router（推荐）
├── [locale]/          # 多语言路由
│   ├── layout.tsx     # 语言布局
│   ├── page.tsx       # 主页
│   ├── [...slug]/     # 动态路由（处理 Markdown 内容页面）
│   │   └── page.tsx   # 万能路由页面（自动从 Markdown 生成）
│   ├── contact/       # 联系页面（固定路由）
│   │   └── page.tsx
│   └── pricing/       # 价格页面（固定路由）
│       └── page.tsx
├── page.tsx           # 根路径（重定向到默认语言）
└── layout.tsx         # 根布局
```

**App Router 的优势**：
- ✅ 支持 React Server Components
- ✅ 更好的数据获取方式
- ✅ 更灵活的路由系统
- ✅ 更好的 SEO 支持

#### 2. Server Components vs Client Components

**Server Components（默认）**：
- 在服务器端渲染
- 不包含客户端 JavaScript
- 适合静态内容

**Client Components（`'use client'`）**：
- 在客户端渲染
- 包含客户端 JavaScript
- 适合交互式组件（如表单）

**本工程中的实践**：

```tsx
// Server Component（默认）
export default function HomePage() {
  return <div>Hello World</div>;
}

// Client Component（需要交互时）
'use client';
export function ContactForm() {
  const [formData, setFormData] = useState({});
  // ...
}
```

#### 3. Metadata API

**本工程的 Metadata 实践**：

```typescript
// 页面级别的 Metadata
/**
 * ⚠️ 重要：这是 Next.js App Router 的特殊导出函数，用于生成页面的 <head> 标签内容。
 * 删除此方法会导致页面缺少 SEO 元数据，影响搜索引擎排名和社交媒体分享效果。
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromPath('/about');
}

// 全局 Metadata（在 layout.tsx 中）
/**
 * ⚠️ 重要：布局级别的 generateMetadata 设置全局默认 SEO 配置，
 * 所有子页面都会继承这些配置，页面级别的配置会覆盖布局级别的配置。
 * 删除此方法会导致所有页面缺少全局 SEO 元数据。
 */
export async function generateMetadata(): Promise<Metadata> {
  const globalConfig = await getGlobalConfig();
  return {
    title: {
      default: globalConfig.siteName,
      template: globalConfig.titleTemplate,
    },
    // ...
  };
}
```

**重要提示**：
- `generateMetadata` 是 Next.js App Router 的特殊约定函数名，会在构建时自动调用
- 此函数用于生成页面的 SEO 元数据（title、description、Open Graph、Twitter Card 等）
- 删除此函数会导致页面缺少 SEO 元数据，严重影响搜索引擎排名和社交媒体分享效果
- 所有页面都应该包含此函数，即使使用默认配置也应保留

#### 4. 静态导出配置

**开发模式 vs 生产构建**：

```javascript
// next.config.js
const nextConfig = {
  // 只在生产构建时启用静态导出
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
};
```

**为什么这样做？**
- 开发模式：使用标准 Next.js 开发服务器，支持热重载
- 生产构建：启用静态导出，生成静态 HTML

### Next.js 与 Webpack 的关系

**Next.js 封装了 Webpack**：
- Next.js 内部使用 Webpack 作为打包工具
- 用户无需直接配置 Webpack
- Next.js 会根据配置自动生成 Webpack 配置

**本工程中的实践**：
- 虽然使用 `output: 'export'` 配置，但实际是 Next.js 处理
- 错误信息中会出现 Webpack 相关内容（因为底层使用 Webpack）
- 开发模式下需要特殊处理（避免 Webpack 配置冲突）

---

## 🔍 SEO 优化知识点

### SEO 基础知识

#### 什么是 SEO？

**SEO（Search Engine Optimization）**：搜索引擎优化，通过优化网站内容和结构，提高在搜索引擎中的排名。

#### SEO 的重要性

1. **提高可见性**：排名越高，被用户看到的概率越大
2. **免费流量**：不需要付费广告
3. **长期效果**：一旦排名提升，可以持续获得流量
4. **用户信任**：排名靠前的内容更容易获得用户信任

### SEO 优化技术

#### 1. 页面 Meta 标签

**本工程的实践**：

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    // 基础标签
    title: 'Page Title',
    description: 'Page Description',
    keywords: ['keyword1', 'keyword2'],
    
    // Open Graph（社交媒体分享）
    openGraph: {
      title: 'Page Title',
      description: 'Page Description',
      images: ['/og-image.jpg'],
      url: 'https://example.com/page',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'Page Title',
      description: 'Page Description',
      images: ['/twitter-image.jpg'],
    },
    
    // 搜索引擎验证
    verification: {
      google: 'verification-code',
    },
  };
}
```

#### 2. 结构化数据（JSON-LD）

**本工程的实践**：

```tsx
<StructuredData
  type="Organization"
  data={{
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Your Company",
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
    },
  }}
/>
```

#### 3. Sitemap.xml

**本工程的实践**：

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const config = await getSitemapConfig();
  return config.pages.map((page) => ({
    url: `${config.baseUrl}${page.path}`,
    lastModified: page.lastModified || new Date(),
    changeFrequency: page.changeFrequency || 'weekly',
    priority: page.priority || 0.5,
  }));
}
```

#### 4. Robots.txt

**本工程的实践**：

```typescript
// app/robots.ts
export default async function robots() {
  const config = await getRobotsConfig();
  return {
    rules: config.rules.map((rule) => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow,
      crawlDelay: rule.crawlDelay,
    })),
    sitemap: config.sitemap,
  };
}
```

### SEO 最佳实践

#### ✅ 本工程实现的 SEO 最佳实践

1. **完整的 Meta 标签**
   - title、description、keywords
   - Open Graph 标签
   - Twitter Card 标签

2. **结构化数据**
   - JSON-LD 格式
   - 支持多种 Schema.org 类型

3. **Sitemap 和 Robots.txt**
   - 自动生成
   - 符合搜索引擎规范

4. **URL 优化**
   - 使用 `trailingSlash: true`（SEO 友好）
   - 清晰的 URL 结构

5. **性能优化**
   - 静态生成，加载速度快
   - 首屏渲染快

### SEO 配置系统设计

**本工程的可扩展 SEO 配置系统**：

```typescript
// 函数式接口，直接调用
import { 
  getGlobalConfig, 
  getPageConfig, 
  getSitemapConfig, 
  getRobotsConfig 
} from '@/dataService';

// 使用示例
const globalConfig = await getGlobalConfig();
const pageConfig = await getPageConfig('/about');
const sitemapConfig = await getSitemapConfig();
const robotsConfig = await getRobotsConfig();
```

**当前实现**：直接 import JSON 文件，由构建工具在构建时处理
**未来可扩展**：可以在内部实现中切换数据源（CMS、API 等），调用方无需感知

---

## 📝 CMS 内容管理知识点

### 什么是 CMS？

**CMS（Content Management System）**：内容管理系统，用于管理网站内容，让非技术人员也能轻松更新网站内容。

### 本工程的 CMS 实现

#### 核心特性

1. **Markdown 文件驱动**
   - 内容存储在 Markdown 文件中
   - 运营人员只需编辑 Markdown 文件即可更新内容
   - 无需编写代码

2. **自动路由生成**
   - 文件名自动映射为 URL 路径
   - 例如：`about.md` → `/zh/about`
   - 支持嵌套目录：`blog/post-1.md` → `/zh/blog/post-1`

3. **Frontmatter 元数据**
   - 支持丰富的元数据字段
   - title、description、date、tags、author、image 等
   - 用于 SEO 和页面展示

4. **多语言支持**
   - 不同语言目录下的同名文件自动生成对应语言版本
   - 例如：`content/zh/about.md` 和 `content/en/about.md`

#### 工作流程

```
1. 运营人员创建/编辑 Markdown 文件
   ↓
2. 开发人员运行 pnpm build
   ↓
3. 系统自动扫描所有 Markdown 文件
   ↓
4. 解析 Frontmatter 和 Markdown 正文
   ↓
5. 将 Markdown 转换为 HTML
   ↓
6. 通过动态路由生成静态页面
   ↓
7. 部署到生产环境
```

#### 内容文件结构

```
dataService/data/content/
├── zh/              # 中文内容
│   ├── about.md    # 关于页面
│   ├── blog/       # 博客目录
│   │   └── post-1.md
│   └── products/   # 产品目录
│       └── product-1.md
└── en/              # 英文内容
    ├── about.md
    └── ...
```

#### Frontmatter 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 页面标题 |
| `description` | string | ❌ | 页面描述（SEO 重要） |
| `date` | string | ❌ | 发布日期 |
| `lastModified` | string | ❌ | 最后修改日期 |
| `tags` | string[] | ❌ | 标签列表 |
| `author` | string | ❌ | 作者名称 |
| `image` | string | ❌ | SEO 分享图片 |
| `slug` | string | ❌ | 自定义 URL 路径 |

详细说明请参考 `dataService/data/README.md`

#### 内容获取 API

```typescript
// 根据 slug 获取内容
const content = await getContentBySlug('about', 'zh');

// 获取所有内容
const allContents = await getAllContents({ locale: 'zh' });

// 获取内容列表（仅元数据）
const contentList = await getContentList({ locale: 'zh', tag: 'SEO' });
```

### CMS 的优势

1. **内容与代码分离**
   - 运营人员不需要懂代码
   - 内容更新不需要重新部署代码

2. **版本控制**
   - Markdown 文件可以用 Git 管理
   - 可以追踪内容变更历史

3. **简单易用**
   - Markdown 语法简单
   - 学习成本低

4. **可扩展**
   - 未来可以接入 Headless CMS（如 Contentful、Strapi）
   - 保持接口一致性，调用方无需感知

---

## 🛠️ 工程化实践

### 1. 代码质量保障

#### Pre-commit Hooks

**本工程的实践**：

```bash
# .husky/pre-commit
# 1. Lint-staged（只检查暂存的文件）
npx lint-staged

# 2. 完整的工程检查
pnpm pre-commit:check
  ├── 类型检查（pnpm type-check）
  ├── 代码检查（pnpm lint）
  └── 构建验证（pnpm validate，如果构建产物存在）
```

**工具链**：
- **Husky**：Git hooks 管理
- **Lint-staged**：只检查暂存的文件
- **TypeScript**：类型检查
- **ESLint**：代码规范检查

#### 构建验证

**本工程的实践**：

```typescript
// scripts/validate-build.ts
// 验证构建产物是否符合预期
- ✅ 关键文件是否存在
- ✅ SEO 标签是否正确
- ✅ Sitemap 和 Robots.txt 内容
- ✅ 构建产物统计信息
```

### 2. 自动化 CI/CD

#### GitHub Actions 工作流

**本工程的实践**：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    steps:
      - 检出代码
      - 设置 Node.js 和 pnpm
      - 安装依赖
      - 类型检查
      - 代码检查
      - 构建项目
      - 部署到 Vercel
```

**自动化流程**：
- ✅ 代码推送 → 自动触发构建
- ✅ Pull Request → 创建预览部署
- ✅ 构建成功 → 自动部署到 Vercel

### 3. 开发工具链

#### 本地开发工具

```bash
# 开发模式
pnpm dev              # 启动开发服务器（支持热重载）

# 构建验证
pnpm validate         # 验证构建产物
pnpm preview          # 本地预览构建产物
pnpm build:preview    # 一键构建+验证+预览

# 代码质量
pnpm type-check       # TypeScript 类型检查
pnpm lint             # ESLint 代码检查
pnpm pre-commit:check # Pre-commit 检查
```

### 4. 文档化

**本工程的文档体系**：

- ✅ **README.md**：项目概述和使用指南
- ✅ **DEPLOY.md**：详细部署指南
- ✅ **VALIDATE.md**：本地验证指南
- ✅ **WEBPACK_ERROR_EXPLANATION.md**：技术问题解释
- ✅ **data/README.md**：SEO 配置说明（1219 行详细文档）
- ✅ **.husky/README.md**：Pre-commit Hooks 说明

---

## 📖 知识点扩展

### 1. 静态站点生成器对比

#### 主流 SSG 工具

| 工具 | 语言 | 特点 | 适用场景 |
|------|------|------|---------|
| **Next.js** | JavaScript/TypeScript | 全栈框架，支持 SSG/SSR/ISR | 复杂应用，需要 React 生态 |
| **Gatsby** | JavaScript/TypeScript | GraphQL 数据层，丰富的插件生态 | 内容驱动网站，CMS 集成 |
| **Nuxt.js** | JavaScript/TypeScript | Vue.js 全栈框架 | Vue.js 项目 |
| **Hugo** | Go | 极快的构建速度 | 博客、文档网站 |
| **Jekyll** | Ruby | 简单易用，GitHub Pages 原生支持 | 个人博客、简单网站 |
| **VitePress** | JavaScript/TypeScript | 基于 Vite，专为文档设计 | 文档网站 |

#### 为什么选择 Next.js？

1. **React 生态**：使用 React，生态系统丰富
2. **全栈能力**：支持 SSG、SSR、ISR 等多种渲染模式
3. **开发体验**：优秀的开发体验和工具链
4. **生产就绪**：Vercel 团队维护，生产环境验证
5. **性能优秀**：自动代码分割、图片优化等

### 2. 渲染策略对比

#### SSG（Static Site Generation）

**特点**：
- ✅ 构建时生成静态 HTML
- ✅ 性能优秀，加载快
- ✅ SEO 友好
- ❌ 内容更新需要重新构建

**适用场景**：
- 官网、博客、文档网站
- 内容相对固定的网站
- 需要优秀 SEO 的网站

#### SSR（Server-Side Rendering）

**特点**：
- ✅ 每次请求时服务器渲染
- ✅ 可以获取实时数据
- ✅ SEO 友好
- ❌ 需要服务器，成本较高

**适用场景**：
- 需要实时数据的网站
- 需要用户认证的网站
- 需要个性化内容的网站

#### ISR（Incremental Static Regeneration）

**特点**：
- ✅ 静态页面 + 定时重新生成
- ✅ 性能优秀
- ✅ 可以更新内容
- ✅ SEO 友好
- ❌ Next.js 专用功能

**适用场景**：
- 需要定期更新的静态内容
- 大型内容网站
- 需要平衡性能和内容更新的网站

#### CSR（Client-Side Rendering）

**特点**：
- ✅ 不需要服务器
- ✅ 交互丰富
- ❌ SEO 不友好
- ❌ 首屏加载慢

**适用场景**：
- 后台管理系统
- 需要丰富交互的应用
- 不需要 SEO 的应用

### 3. 现代前端开发最佳实践

#### 开发工具链

```
代码编辑
  ↓
TypeScript / ESLint（代码质量）
  ↓
Git Hooks（Pre-commit 检查）
  ↓
CI/CD（自动构建和部署）
  ↓
生产环境
```

#### 性能优化策略

1. **静态生成**：使用 SSG，预渲染页面
2. **代码分割**：按需加载代码
3. **图片优化**：使用现代图片格式，懒加载
4. **CDN 加速**：部署到 CDN
5. **缓存策略**：合理设置缓存

#### SEO 优化策略

1. **Meta 标签**：完整的 title、description、keywords
2. **结构化数据**：使用 JSON-LD
3. **Sitemap**：自动生成 Sitemap
4. **Robots.txt**：正确配置爬虫规则
5. **URL 优化**：清晰、语义化的 URL
6. **性能优化**：快速加载，良好的用户体验

### 4. 相关技术学习路径

#### 基础技术

1. **React**
   - 组件化开发
   - Hooks 使用
   - 状态管理

2. **TypeScript**
   - 类型系统
   - 接口和类型定义
   - 泛型

3. **Next.js**
   - App Router
   - Server Components vs Client Components
   - Metadata API
   - 静态导出

#### 进阶技术

1. **SEO 优化**
   - Meta 标签优化
   - 结构化数据
   - Sitemap 和 Robots.txt

2. **性能优化**
   - 代码分割
   - 图片优化
   - CDN 使用

3. **工程化**
   - Git Hooks
   - CI/CD
   - 自动化测试
   - 代码质量工具

### 5. 推荐学习资源

#### 官方文档

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

#### SEO 相关

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)
- [Open Graph Protocol](https://ogp.me)

#### 工程化相关

- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [GitHub Actions](https://docs.github.com/en/actions)
- [ESLint](https://eslint.org/docs/latest)

---

## 🎓 总结

### 本工程的核心价值

1. **完整的 SSG 实践**：从开发到部署的完整流程
2. **可扩展的架构**：SEO 配置系统支持未来扩展
3. **零代码内容管理**：运营人员只需编辑 Markdown 文件
4. **生产就绪**：完整的工具链和最佳实践
5. **文档完善**：详细的技术文档和使用指南

### 学到的知识点

1. **SSG 概念和实践**：理解静态站点生成的原理和应用
2. **Next.js 技术**：掌握 App Router、Server Components 等
3. **SEO 优化**：了解 SEO 优化的技术和实践
4. **CMS 内容管理**：理解 Markdown 驱动的 CMS 系统
5. **工程化实践**：学习代码质量保障和 CI/CD
6. **架构设计**：理解可扩展架构的设计模式

### 扩展学习方向

1. **深入 Next.js**：学习 SSR、ISR、API Routes 等
2. **性能优化**：深入学习前端性能优化技术
3. **SEO 进阶**：学习更高级的 SEO 技术
4. **CMS 集成**：学习接入 Headless CMS（如 Contentful、Strapi）
5. **架构设计**：学习更多架构模式和设计原则
6. **DevOps**：深入学习 CI/CD 和自动化部署

---

**希望这份总结能帮助你更好地理解工程和技术栈！** 🚀
