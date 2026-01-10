# SEO 配置文件说明

## 概述

本项目使用抽象的数据源接口来管理 SEO 配置，当前实现是从本地 JSON 文件读取配置。

## 配置文件

配置文件位置：`dataService/data/seo-config.json`

### 配置结构

配置文件包含以下主要部分：

1. **global** - 全局 SEO 配置
   - `siteUrl`: 网站基础 URL（可通过 `NEXT_PUBLIC_SITE_URL` 环境变量覆盖）
   - `siteName`: 网站名称
   - `titleTemplate`: 标题模板（例如 `%s | Your Company Name`）
   - `defaultDescription`: 默认页面描述
   - `defaultKeywords`: 默认关键词列表
   - `defaultOgImage`: 默认 OG 图片路径
   - `authors`: 作者信息列表
   - `creator`: 创建者
   - `publisher`: 发布者
   - `openGraph`: OpenGraph 默认配置
   - `twitter`: Twitter Card 默认配置
   - `verification`: 搜索引擎验证码（可通过环境变量覆盖）
   - `formatDetection`: 格式检测配置

2. **pages** - 页面级别的 SEO 配置
   - `path`: 页面路径（例如 `/`、`/about`）
   - `title`: 页面标题
   - `description`: 页面描述
   - `keywords`: 关键词列表（可选）
   - `ogImage`: OG 图片路径（可选）
   - `noIndex`: 是否不索引此页面（可选）
   - `canonical`: 规范 URL（可选）
   - `openGraph`: OpenGraph 配置（可选）
   - `twitter`: Twitter Card 配置（可选）

3. **sitemap** - Sitemap 配置
   - `pages`: Sitemap 页面列表
     - `path`: 页面路径
     - `lastModified`: 最后修改时间（可选）
     - `changeFrequency`: 变更频率（可选）
     - `priority`: 优先级（0.0 - 1.0，可选）

4. **robots** - Robots.txt 配置
   - `rules`: 规则列表
     - `userAgent`: User Agent
     - `allow`: 允许的路径（可选）
     - `disallow`: 禁止的路径（可选）
     - `crawlDelay`: 爬取延迟（秒，可选）
   - `sitemap`: Sitemap URL

## 环境变量

以下环境变量可以覆盖配置文件中的设置：

- `NEXT_PUBLIC_SITE_URL`: 网站基础 URL（覆盖 `global.siteUrl`）
- `NEXT_PUBLIC_GOOGLE_VERIFICATION`: Google 验证码
- `NEXT_PUBLIC_YANDEX_VERIFICATION`: Yandex 验证码
- `NEXT_PUBLIC_YAHOO_VERIFICATION`: Yahoo 验证码
- `NEXT_PUBLIC_SEO_DATA_SOURCE`: 数据源类型（默认为 `file`）

## 扩展数据源

要添加新的数据源（如 CMS、API、数据库），需要：

1. 实现 `ISeoDataSource` 接口（位于 `lib/seo/config/interface.ts`）
2. 在 `lib/seo/config/index.ts` 的 `createSeoDataSource` 函数中添加相应的 case

示例：

```typescript
case 'cms':
  return new CmsSeoDataSource(options);
```

## 使用示例

### 在页面中获取 SEO 配置

```typescript
import type { Metadata } from 'next';
import { generateMetadataFromPath } from '@/dataService';

/**
 * ⚠️ 重要：这是 Next.js App Router 的特殊导出函数，用于生成页面的 <head> 标签内容。
 * 此方法会在构建时被 Next.js 自动调用，生成页面的 SEO 元数据。
 * 删除此方法会导致页面缺少 SEO 元数据，影响搜索引擎排名和社交媒体分享效果。
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromPath('/about');
}
```

**重要说明**：
- `generateMetadata` 是 Next.js App Router 的特殊约定函数名，不能随意修改或删除
- 此函数会在构建时被 Next.js 自动调用，将返回的 `Metadata` 对象转换为 HTML 的 `<head>` 标签
- 删除此函数会导致页面缺少 SEO 元数据（title、description、Open Graph、Twitter Card 等）
- `generateMetadataFromPath` 函数在 `dataService/seo` 模块中，它是对配置数据获取和 Metadata 生成的封装

### 获取全局配置

```typescript
import { getGlobalConfig } from '@/dataService';

const globalConfig = await getGlobalConfig();
console.log(globalConfig.siteName);
```

### 获取页面配置

```typescript
import { getPageConfig } from '@/dataService';

const pageConfig = await getPageConfig('/about');
if (pageConfig) {
  console.log(pageConfig.title);
}
```

## 注意事项

1. 配置文件直接通过 `import` 加载，由构建工具在构建时处理
2. 页面路径应该以 `/` 开头，根路径使用 `/` 而不是空字符串
3. `siteUrl` 可以通过环境变量 `NEXT_PUBLIC_SITE_URL` 在运行时动态覆盖
4. 所有配置数据获取函数和 Metadata 生成工具函数都在 `@/dataService` 模块中统一导出
