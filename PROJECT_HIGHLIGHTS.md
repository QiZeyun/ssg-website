# 工程亮点与知识点总结

## 📋 目录

1. [工程亮点总结](#工程亮点总结)
2. [SSG（静态站点生成）知识点](#ssg静态站点生成知识点)
3. [官网开发知识点](#官网开发知识点)
4. [Next.js 技术要点](#nextjs-技术要点)
5. [SEO 优化知识点](#seo-优化知识点)
6. [工程化实践](#工程化实践)
7. [知识点扩展](#知识点扩展)

---

## 🎯 工程亮点总结

### 1. 架构设计亮点

#### ✅ 可扩展的 SEO 配置系统
- **函数式接口**：所有配置获取都是纯函数，直接调用
- **当前实现**：直接 import JSON 文件，构建时处理
- **未来扩展**：可以在内部实现中切换数据源（CMS、API 等），调用方无需感知

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

#### ✅ 类型安全的配置系统
- **完整的 TypeScript 类型定义**：所有配置都有明确的类型
- **编译时类型检查**：避免运行时错误
- **IDE 智能提示**：提高开发效率

#### ✅ 组件化架构
- **服务器组件**：默认使用服务器组件（`app/` 目录）
- **客户端组件**：按需使用客户端组件（`'use client'`）
- **可复用组件**：`ContactForm`、`StructuredData` 等

### 2. 开发体验亮点

#### ✅ 完整的开发工具链
- **TypeScript 支持**：完整的类型检查
- **ESLint 代码规范**：自动代码检查
- **Pre-commit Hooks**：提交前自动检查（类型检查、代码检查、构建验证）
- **本地验证工具**：自动化验证构建产物

#### ✅ 自动化脚本
- **验证脚本**（`pnpm validate`）：自动验证构建产物
- **预览脚本**（`pnpm preview`）：本地预览构建产物
- **一键构建+验证+预览**（`pnpm build:preview`）

#### ✅ 完善的文档
- **README.md**：项目概述和使用指南
- **DEPLOY.md**：详细部署指南
- **VALIDATE.md**：本地验证指南
- **WEBPACK_ERROR_EXPLANATION.md**：技术问题解释
- **SEO 配置说明**：`data/README.md`

### 3. 生产就绪特性

#### ✅ 完整的 SEO 支持
- **自动生成 Sitemap**：`app/sitemap.ts`
- **自动生成 Robots.txt**：`app/robots.ts`
- **结构化数据（JSON-LD）**：`StructuredData` 组件
- **Open Graph 标签**：社交媒体分享优化
- **Twitter Card**：Twitter 分享优化

#### ✅ 自动化 CI/CD
- **GitHub Actions**：自动构建和部署
- **Vercel 集成**：自动部署到 Vercel
- **预览部署**：Pull Request 自动创建预览部署

#### ✅ 性能优化
- **静态导出**：生成纯静态 HTML，加载速度快
- **代码分割**：自动代码分割和按需加载
- **图片优化**：Next.js 图片优化（静态导出时禁用）

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
├── page.tsx          → /index.html
├── about/page.tsx    → /about/index.html
└── contact/page.tsx  → /contact/index.html
```

#### 静态文件生成

```
out/
├── index.html
├── about/index.html
├── contact/index.html
├── robots.txt
├── sitemap.xml
└── _next/static/     # 静态资源
```

---

## 🌐 官网开发知识点

### 官网的特点和需求

#### 官网的特点

1. **内容相对固定**
   - 公司信息、产品介绍、联系方式等
   - 不需要频繁更新

2. **注重 SEO**
   - 需要被搜索引擎收录
   - 需要良好的 SEO 排名

3. **注重性能**
   - 快速加载
   - 良好的用户体验

4. **需要现代化设计**
   - 响应式设计
   - 现代化 UI

### 官网开发最佳实践

#### 1. SEO 优化

**本工程的 SEO 实践**：

- ✅ **Meta 标签优化**
  ```typescript
  export async function generateMetadata(): Promise<Metadata> {
    return {
      title: 'Page Title',
      description: 'Page Description',
      keywords: ['keyword1', 'keyword2'],
      openGraph: { /* ... */ },
      twitter: { /* ... */ },
    };
  }
  ```

- ✅ **结构化数据（JSON-LD）**
  ```tsx
  <StructuredData
    type="Website"
    data={{
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Your Company",
      url: "https://example.com",
    }}
  />
  ```

- ✅ **Sitemap 和 Robots.txt**
  - 自动生成 `sitemap.xml`
  - 自动生成 `robots.txt`

#### 2. 性能优化

- ✅ **静态生成**：所有页面都是静态 HTML
- ✅ **代码分割**：自动代码分割
- ✅ **CDN 加速**：部署到 Vercel CDN
- ✅ **图片优化**：使用 Next.js Image 组件

#### 3. 用户体验

- ✅ **响应式设计**：使用 Tailwind CSS
- ✅ **快速加载**：静态 HTML，加载快
- ✅ **现代化 UI**：使用 Tailwind CSS 构建

#### 4. 可维护性

- ✅ **组件化**：可复用组件
- ✅ **类型安全**：TypeScript
- ✅ **配置化**：SEO 配置统一管理

### 官网的架构设计

```
┌─────────────────────────────────────────┐
│           官网架构层次                    │
├─────────────────────────────────────────┤
│                                         │
│  表现层 (Presentation Layer)            │
│  ├── React 组件                          │
│  ├── Tailwind CSS                        │
│  └── 响应式设计                          │
│                                         │
│  数据层 (Data Layer)                    │
│  ├── SEO 配置（本地文件/CMS/API）       │
│  ├── 页面内容                            │
│  └── 结构化数据                          │
│                                         │
│  构建层 (Build Layer)                   │
│  ├── Next.js SSG                        │
│  ├── TypeScript 编译                    │
│  └── 静态资源优化                        │
│                                         │
│  部署层 (Deployment Layer)              │
│  ├── GitHub Actions                     │
│  ├── Vercel 部署                        │
│  └── CDN 加速                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚙️ Next.js 技术要点

### Next.js 14 的核心概念

#### 1. App Router vs Pages Router

**本工程使用 App Router**：

```
app/                    # App Router（推荐）
├── layout.tsx         # 根布局
├── page.tsx           # 主页
├── about/
│   └── page.tsx       # 关于页面
└── contact/
    └── page.tsx       # 联系页面
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
- ✅ **data/README.md**：SEO 配置说明
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
3. **生产就绪**：完整的工具链和最佳实践
4. **文档完善**：详细的技术文档和使用指南

### 学到的知识点

1. **SSG 概念和实践**：理解静态站点生成的原理和应用
2. **Next.js 技术**：掌握 App Router、Server Components 等
3. **SEO 优化**：了解 SEO 优化的技术和实践
4. **工程化实践**：学习代码质量保障和 CI/CD
5. **架构设计**：理解可扩展架构的设计模式

### 扩展学习方向

1. **深入 Next.js**：学习 SSR、ISR、API Routes 等
2. **性能优化**：深入学习前端性能优化技术
3. **SEO 进阶**：学习更高级的 SEO 技术
4. **架构设计**：学习更多架构模式和设计原则
5. **DevOps**：深入学习 CI/CD 和自动化部署

---

**希望这份总结能帮助你更好地理解工程和技术栈！** 🚀
