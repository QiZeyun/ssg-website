# 配置数据源模块

## 概述

`lib/configs/` 模块提供了统一的抽象接口，用于从外部系统（如 CMS、API、文件系统等）获取配置信息。

此模块的核心设计原则是：
- **抽象性**：调用方不需要感知数据的具体来源（文件、CMS、API、数据库等）
- **可扩展性**：易于添加新的数据源类型（如 CMS、API、数据库等）
- **封装性**：所有实现细节都被封装在数据源类中

## 目录结构

```
lib/configs/
├── config.ts           # 配置路径管理（数据源路径配置）
├── index.ts            # 统一导出
├── seo/                # SEO 配置数据源
│   ├── index.ts        # 工厂函数和默认实例
│   ├── interface.ts    # 数据源接口定义
│   ├── types.ts        # 类型定义
│   └── file-source.ts  # 文件数据源实现
└── pricing/            # 价格配置数据源
    ├── index.ts        # 工厂函数和默认实例
    ├── interface.ts    # 数据源接口定义
    ├── types.ts        # 类型定义
    └── file-source.ts  # 文件数据源实现
```

## 使用方式

### SEO 配置数据源

```typescript
import { getDefaultDataSource, createSeoDataSource } from '@/configSource/configs/seo';

// 使用默认数据源（根据环境变量自动选择）
const dataSource = getDefaultDataSource();
const globalConfig = await dataSource.getGlobalConfig();
const pageConfig = await dataSource.getPageConfig('/about');

// 或创建自定义数据源
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

// 或创建自定义数据源
const customDataSource = createPricingDataSource({
  type: 'file',
  configPath: '/custom/path/to/config'
});
```

## 添加新的数据源类型

要添加新的数据源类型（如 CMS、API），需要：

1. **实现接口**：创建新的数据源类，实现对应的接口（`ISeoDataSource` 或 `IPricingDataSource`）

2. **注册到工厂函数**：在对应的 `index.ts` 中的工厂函数中添加新的 case

```typescript
// lib/configs/seo/index.ts
export function createSeoDataSource(options?: {...}): ISeoDataSource {
  const sourceType = options?.type || 'file';
  
  switch (sourceType) {
    case 'file':
      return new FileSeoDataSource(options?.configPath);
    case 'cms':
      return new CmsSeoDataSource(options); // 新增 CMS 数据源
    // ...
  }
}
```

## 环境变量

### SEO 配置
- `NEXT_PUBLIC_SEO_DATA_SOURCE`: 数据源类型（`file` | `cms` | `api` | `database`），默认 `file`
- `SEO_CONFIG_PATH` 或 `NEXT_PUBLIC_SEO_CONFIG_PATH`: 数据源路径，默认 `data/seo-config`

### 价格配置
- `NEXT_PUBLIC_PRICING_DATA_SOURCE`: 数据源类型（`file` | `cms` | `api` | `database`），默认 `file`
- `PRICING_CONFIG_PATH` 或 `NEXT_PUBLIC_PRICING_CONFIG_PATH`: 数据源路径，默认 `data/pricing-config`

## 设计模式

- **工厂模式**：`createSeoDataSource` 和 `createPricingDataSource` 根据配置创建相应的数据源实例
- **策略模式**：不同的数据源实现（FileSeoDataSource、CmsSeoDataSource 等）可以互换使用
- **单例模式**：`getDefaultDataSource` 和 `getDefaultPricingDataSource` 提供默认单例实例

## 注意事项

1. **不感知实现细节**：调用方不应该直接导入数据源实现类（如 `FileSeoDataSource`），而应该通过接口或工厂函数获取数据源

2. **路径配置**：数据源路径配置通过 `lib/configs/config.ts` 统一管理，支持环境变量覆盖

3. **扩展性**：添加新的数据源类型时，不需要修改调用方代码，只需要实现接口并在工厂函数中注册即可
