# 配置数据源模块

## 概述

`configSource/configs/` 模块提供了统一的函数式接口，用于获取配置信息。

此模块的核心设计原则是：
- **抽象性**：调用方不需要感知数据的具体来源（JSON 文件、未来可能的 CMS、API 等）
- **函数式**：所有接口都是纯函数，直接调用，无需创建实例
- **封装性**：所有实现细节都被封装在模块内部

## 目录结构

```
configSource/configs/
├── index.ts            # 统一导出
├── seo/                # SEO 配置数据源
│   ├── index.ts        # 函数式实现（直接 import JSON）
│   └── types.ts        # 类型定义
└── pricing/            # 价格配置数据源
    ├── index.ts        # 函数式实现（直接 import JSON）
    └── types.ts        # 类型定义
```

## 使用方式

### SEO 配置数据源

```typescript
import { getGlobalConfig, getPageConfig, getSitemapConfig, getRobotsConfig } from '@/configSource/configs/seo';

// 获取全局 SEO 配置
const globalConfig = await getGlobalConfig();

// 根据路径获取页面 SEO 配置
const pageConfig = await getPageConfig('/about');

// 获取 Sitemap 配置
const sitemapConfig = await getSitemapConfig();

// 获取 Robots.txt 配置
const robotsConfig = await getRobotsConfig();
```

### 价格配置数据源

```typescript
import { getPricingConfig, getAllPricingConfigs, hasLocale, getSupportedLocales } from '@/configSource/configs/pricing';

// 获取指定语言的产品价格配置
const config = await getPricingConfig('zh');

// 获取所有语言的产品价格配置
const allConfigs = await getAllPricingConfigs();

// 检查指定语言是否存在
const exists = await hasLocale('zh');

// 获取支持的语言列表
const locales = await getSupportedLocales();
```

## 添加新的配置类型

要添加新的配置类型（如 `news`、`products` 等），只需要：

1. **定义类型**：创建 `types.ts` 文件定义配置类型

```typescript
// configSource/configs/news/types.ts
export interface NewsConfig {
  title: string;
  articles: Array<{...}>;
}
```

2. **实现函数**：在 `index.ts` 中直接 import JSON 并实现函数

```typescript
// configSource/configs/news/index.ts
import newsConfigData from '@/data/news-config.json';
import type { NewsConfig } from './types';

/**
 * 加载并处理配置
 */
function loadConfig(): NewsConfig {
  const config = newsConfigData as NewsConfig;
  
  // 环境变量覆盖（如果需要）
  // if (process.env.NEXT_PUBLIC_NEWS_OVERRIDE) { ... }
  
  return config;
}

/**
 * 获取新闻配置
 */
export async function getNewsConfig(): Promise<NewsConfig> {
  return loadConfig();
}

// 导出类型
export type { NewsConfig } from './types';
```

## 环境变量

### SEO 配置
- `NEXT_PUBLIC_SITE_URL`: 覆盖全局 SEO 配置中的 `siteUrl`（如果存在）

### 价格配置
- 暂无环境变量支持（可在 `loadConfig` 函数中添加）

## 实现细节

- **数据加载**：直接使用 `import` 导入 JSON 文件，由构建工具在构建时处理
- **环境变量覆盖**：在 `loadConfig` 函数中通过对象合并处理
- **异步接口**：所有函数都返回 `Promise`，保持接口一致性（虽然实际上是同步的）
- **类型安全**：使用 TypeScript 类型定义确保配置结构正确

## 注意事项

1. **不感知实现细节**：调用方不应该知道数据来自 JSON 文件，只需调用函数即可
2. **直接 import**：配置数据通过构建时的 `import` 加载，运行时无需文件系统操作
3. **类型安全**：所有配置都有对应的 TypeScript 类型定义
4. **扩展性**：如果未来需要从 API 或 CMS 获取配置，只需修改模块内部的实现，调用方代码无需改动
