# 配置数据源模块

## 概述

`lib/configs/` 模块提供了统一的抽象接口，用于从外部系统（如 CMS、API、文件系统等）获取配置信息。

此模块的核心设计原则是：
- **抽象性**：调用方不需要感知数据的具体来源（文件、CMS、API、数据库等）
- **可扩展性**：易于添加新的数据源类型（如 CMS、API、数据库等）
- **封装性**：所有实现细节都被封装在数据源类中

## 目录结构

```
configSource/configs/
├── config.ts           # 配置路径管理（数据源路径配置）
├── index.ts            # 统一导出
├── sources/            # 通用数据源实现
│   ├── base-file-source.ts  # 通用文件数据源基类（减少重复代码）
│   └── README.md       # 基类使用文档
├── seo/                # SEO 配置数据源
│   ├── index.ts        # 工厂函数和默认实例
│   ├── interface.ts    # 数据源接口定义
│   ├── types.ts        # 类型定义
│   └── file-source.ts  # 文件数据源实现（继承 BaseFileDataSource）
└── pricing/            # 价格配置数据源
    ├── index.ts        # 数据源实现和导出（逻辑直接在此文件，异步实现）
    ├── interface.ts    # 数据源接口定义
    └── types.ts        # 类型定义
```

## 使用方式

### SEO 配置数据源

```typescript
import { getDefaultDataSource, createSeoDataSource } from '@/configSource/configs/seo';

// 使用默认数据源（根据环境变量自动选择）
const dataSource = getDefaultDataSource();
const globalConfig = await dataSource.getGlobalConfig();
const pageConfig = await dataSource.getPageConfig('/about');

// 或创建自定义数据源（指定配置文件路径）
const customDataSource = createSeoDataSource({
  type: 'file',
  configPath: '/custom/path/to/config'
});
```

### 价格配置数据源

```typescript
import { getDefaultPricingDataSource, createPricingDataSource } from '@/configSource/configs/pricing';

// 使用默认数据源
const dataSource = getDefaultPricingDataSource();
const pricingConfig = await dataSource.getPricingConfig('zh');

// 或创建自定义数据源（指定配置文件路径）
const customDataSource = createPricingDataSource('/custom/path/to/config');
```

## 添加新的配置类型

要添加新的配置类型（如 `news`、`products` 等），可以选择两种方式：

### 方式一：直接实现（推荐，如 pricing 模块）

直接在 `index.ts` 中实现异步数据获取逻辑，无需单独的文件：

```typescript
// configSource/configs/news/index.ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getConfigPath } from '../config';
import type { INewsDataSource } from './interface';
import type { NewsConfig } from './types';

let cachedConfig: NewsConfig | null = null;

async function loadConfig(configPath?: string): Promise<NewsConfig> {
  if (cachedConfig) return cachedConfig;
  
  const path = configPath || join(process.cwd(), getConfigPath('news') + '.json');
  const fileContent = await readFile(path, 'utf-8');
  const config = JSON.parse(fileContent) as NewsConfig;
  
  // 验证逻辑...
  validateConfig(config);
  
  cachedConfig = config;
  return config;
}

class NewsDataSource implements INewsDataSource {
  constructor(private configPath?: string) {}
  
  async getNewsConfig(): Promise<NewsConfig> {
    return loadConfig(this.configPath);
  }
}

export function getDefaultNewsDataSource(): INewsDataSource {
  return new NewsDataSource();
}

export function createNewsDataSource(configPath?: string): INewsDataSource {
  return new NewsDataSource(configPath);
}
```

### 方式二：使用 BaseFileDataSource 基类（如 seo 模块）

如果需要更复杂的缓存和文件修改检查，可以使用 `BaseFileDataSource` 基类：

```typescript
// configSource/configs/news/file-source.ts
import { BaseFileDataSource, type FileDataSourceOptions } from '../sources/base-file-source';
import { getConfigPath } from '../config';
import type { INewsDataSource } from './interface';
import type { NewsConfig } from './types';

export class FileNewsDataSource extends BaseFileDataSource<NewsConfig> implements INewsDataSource {
  constructor(configPath?: string) {
    super({
      configPath,
      getDefaultPath: () => getConfigPath('news'),
      validateConfig: (config: unknown): void => {
        // 验证逻辑
      },
      useSync: false, // 异步模式
    });
  }

  async getNewsConfig(): Promise<NewsConfig> {
    return this.loadConfig();
  }
}
```

## 注意

- **Pricing 模块**：实现方式为直接在 `index.ts` 中实现异步数据获取逻辑，简洁明了
- **SEO 模块**：使用 `BaseFileDataSource` 基类，支持更复杂的缓存和文件修改检查
- **选择建议**：如果只需要简单的异步文件读取，推荐使用 Pricing 模块的方式；如果需要文件修改检查或同步模式，使用 SEO 模块的方式

## 环境变量

### SEO 配置
- `NEXT_PUBLIC_SEO_DATA_SOURCE`: 数据源类型（`file` | `cms` | `api` | `database`），默认 `file`
- `SEO_CONFIG_PATH` 或 `NEXT_PUBLIC_SEO_CONFIG_PATH`: 数据源路径，默认 `data/seo-config`

### 价格配置
- `PRICING_CONFIG_PATH` 或 `NEXT_PUBLIC_PRICING_CONFIG_PATH`: 数据源路径，默认 `data/pricing-config`

## 设计模式

- **工厂模式**：`createSeoDataSource` 和 `createPricingDataSource` 创建数据源实例
- **单例模式**：`getDefaultDataSource` 和 `getDefaultPricingDataSource` 提供默认单例实例

## 注意事项

1. **不感知实现细节**：调用方不应该直接导入数据源实现类（如 `FileSeoDataSource`），而应该通过接口或工厂函数获取数据源

2. **路径配置**：数据源路径配置通过 `configSource/configs/config.ts` 统一管理，支持环境变量覆盖

3. **两种实现方式**：
   - **直接实现**（如 pricing）：在 `index.ts` 中直接实现异步逻辑，简洁明了
   - **使用基类**（如 seo）：使用 `BaseFileDataSource` 基类，支持更复杂的缓存和文件修改检查
