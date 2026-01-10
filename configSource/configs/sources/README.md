# 数据源实现模块

## 概述

此模块提供了通用的文件数据源基类，用于减少重复代码并降低维护成本。

## 核心设计

### BaseFileDataSource 基类

`BaseFileDataSource<T>` 是一个泛型抽象基类，提供了文件数据源的通用实现：

- **路径处理**：自动处理相对路径、绝对路径和文件扩展名
- **文件读取**：支持同步和异步两种模式
- **缓存机制**：支持配置缓存，提高性能
- **文件修改检查**：同步模式下支持检查文件修改时间，自动刷新缓存
- **配置验证**：可选的配置结构验证
- **配置转换**：支持在加载后进行配置转换（如环境变量覆盖）

### 使用方式

```typescript
import { BaseFileDataSource, type FileDataSourceOptions } from '../sources/base-file-source';

export class FileMyConfigDataSource extends BaseFileDataSource<MyConfig> implements IMyConfigDataSource {
  constructor(configPath?: string) {
    const options: FileDataSourceOptions<MyConfig> = {
      configPath,
      getDefaultPath: () => 'data/my-config', // 默认路径
      validateConfig: (config: unknown): void => {
        // 验证配置结构，验证失败则抛出错误
        if (!config || typeof config !== 'object') {
          throw new Error('配置必须是对象');
        }
        // ... 更多验证逻辑
      },
      transformConfigAsync: async (config: MyConfig): Promise<MyConfig> => {
        // 可选的配置转换，如环境变量覆盖
        if (process.env.MY_CONFIG_VALUE) {
          config.someField = process.env.MY_CONFIG_VALUE;
        }
        return config;
      },
      useSync: false, // 是否使用同步模式
      checkFileModified: true, // 是否检查文件修改（仅在同步模式下有效）
    };

    super(options);
  }

  // 实现接口方法
  async getMyConfig(): Promise<MyConfig> {
    return this.loadConfig(); // 使用基类提供的加载方法
  }
}
```

## 同步 vs 异步模式

### 异步模式（useSync: false，默认）

- 使用 `readFile` 异步读取文件
- 不支持文件修改时间检查（因为需要同步的 `statSync`）
- 适合服务器端组件和异步场景
- 示例：`FileSeoDataSource`

### 同步模式（useSync: true）

- 使用 `readFileSync` 同步读取文件
- 支持文件修改时间检查（自动刷新缓存）
- 适合构建时或需要同步访问的场景
- 示例：`FileSeoDataSource`

注意：即使在同步模式下，接口方法仍然应该是 `async`，async 函数会自动将同步返回值包装为 Promise。

## 添加新的配置数据源

添加新的配置数据源只需要：

1. **定义类型**：在对应的 `types.ts` 中定义配置类型

2. **定义接口**：在对应的 `interface.ts` 中定义数据源接口

3. **实现文件数据源**：继承 `BaseFileDataSource`，只需：
   ```typescript
   export class FileMyConfigDataSource extends BaseFileDataSource<MyConfig> implements IMyConfigDataSource {
     constructor(configPath?: string) {
       super({
         configPath,
         getDefaultPath: () => 'data/my-config',
         validateConfig: (config) => { /* 验证逻辑 */ },
         // ... 其他选项
       });
     }

     // 实现接口方法，使用 this.loadConfig() 或 this.loadConfigSync()
     async getMyConfig(): Promise<MyConfig> {
       return this.loadConfig();
     }
   }
   ```

4. **注册到工厂函数**：在对应的 `index.ts` 中添加工厂函数的 case

**优势**：
- ✅ 无需重写文件读取、路径处理、缓存等逻辑
- ✅ 统一的错误处理和配置验证机制
- ✅ 易于扩展和维护
- ✅ 代码复用率高

## 配置选项说明

### FileDataSourceOptions<T>

- `configPath?: string` - 配置文件的完整路径，如果提供则直接使用
- `getDefaultPath?: () => string` - 获取默认路径的函数（如果不提供 configPath）
- `validateConfig?: (config: unknown) => void` - 配置验证函数，验证失败应抛出错误
- `transformConfig?: (config: T) => T` - 同步配置转换函数
- `transformConfigAsync?: (config: T) => Promise<T>` - 异步配置转换函数
- `useSync?: boolean` - 是否使用同步读取（默认 false）
- `checkFileModified?: boolean` - 是否检查文件修改时间（仅在同步模式下有效，默认 true）

## 最佳实践

1. **使用异步模式**：除非有特殊需求，建议使用异步模式（`useSync: false`）
2. **验证配置**：始终提供 `validateConfig` 函数，确保配置结构正确
3. **使用转换函数**：对于需要环境变量覆盖等场景，使用 `transformConfigAsync`
4. **接口一致性**：即使使用同步模式，接口方法仍应保持 `async`，以保持接口一致性
