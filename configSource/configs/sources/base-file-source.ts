/**
 * 通用文件数据源基类
 * 
 * 提供文件数据源的通用实现，包括：
 * - 路径处理和解析
 * - 文件读取和 JSON 解析
 * - 基本的缓存机制
 * - 错误处理
 * 
 * 具体的配置数据源可以继承此类，只需实现特定的接口方法即可
 */

import { readFile } from 'fs/promises';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 文件数据源配置选项
 */
export interface FileDataSourceOptions<T> {
  /** 配置文件的路径，如果不提供则使用默认路径获取函数 */
  configPath?: string;
  /** 获取默认路径的函数 */
  getDefaultPath?: () => string;
  /** 配置验证函数，验证通过则返回，验证失败则抛出错误 */
  validateConfig?: (config: unknown) => void;
  /** 配置转换函数（用于在加载后进行额外的处理，如环境变量覆盖等） */
  transformConfig?: (config: T) => T;
  /** 异步配置转换函数（用于异步处理，如环境变量覆盖等） */
  transformConfigAsync?: (config: T) => Promise<T>;
  /** 是否使用同步读取（默认 false，使用异步） */
  useSync?: boolean;
  /** 是否启用文件修改时间检查（仅在同步模式下有效） */
  checkFileModified?: boolean;
}

/**
 * 通用文件数据源基类
 * 
 * @template T 配置数据的类型
 */
export abstract class BaseFileDataSource<T> {
  protected configPath: string;
  protected cachedConfig: T | null = null;
  protected lastModified: number = 0;
  private readonly validateConfig: ((config: unknown) => void) | undefined;
  private readonly transformConfig?: (config: T) => T;
  private readonly transformConfigAsync?: (config: T) => Promise<T>;
  private readonly useSync: boolean;
  private readonly checkFileModified: boolean;

  constructor(options: FileDataSourceOptions<T> = {}) {
    // 处理配置路径
    if (options.configPath) {
      this.configPath = options.configPath;
    } else if (options.getDefaultPath) {
      const defaultPath = options.getDefaultPath();
      // 支持相对路径和绝对路径
      this.configPath = defaultPath.startsWith('/') 
        ? defaultPath 
        : join(process.cwd(), defaultPath);
      // 添加文件扩展名（这是实现细节，不应暴露给调用方）
      if (!this.configPath.match(/\.[a-z0-9]+$/i)) {
        this.configPath = `${this.configPath}.json`;
      }
    } else {
      throw new Error('必须提供 configPath 或 getDefaultPath');
    }

    this.validateConfig = options.validateConfig;
    this.transformConfig = options.transformConfig;
    this.transformConfigAsync = options.transformConfigAsync;
    this.useSync = options.useSync ?? false;
    this.checkFileModified = options.checkFileModified ?? true;
  }

  /**
   * 从文件加载配置（同步版本）
   */
  protected loadConfigSync(): T {
    try {
      // 如果启用了文件修改检查，检查文件是否已修改
      if (this.checkFileModified) {
        const stats = statSync(this.configPath);
        const currentModified = stats.mtimeMs;

        // 如果文件未修改且缓存存在，直接返回缓存
        if (this.cachedConfig && currentModified === this.lastModified) {
          return this.cachedConfig;
        }

        this.lastModified = currentModified;
      } else if (this.cachedConfig) {
        // 如果没有启用文件修改检查，但有缓存，直接返回
        return this.cachedConfig;
      }

      // 从文件读取数据
      const fileContent = readFileSync(this.configPath, 'utf-8');
      let config = JSON.parse(fileContent) as T;

      // 验证配置（验证函数内部会抛出错误如果验证失败）
      if (this.validateConfig) {
        this.validateConfig(config);
      }

      // 应用转换函数（如环境变量覆盖等）
      // 注意：同步模式下只能使用同步的 transformConfig
      if (this.transformConfig) {
        config = this.transformConfig(config);
      }

      // 缓存配置
      this.cachedConfig = config;

      return config;
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          `配置数据未找到: ${this.configPath}. 请确保数据源存在。`
        );
      }
      throw new Error(
        `加载配置失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 从文件加载配置（异步版本）
   */
  protected async loadConfigAsync(): Promise<T> {
    try {
      // 如果有缓存，直接返回（异步模式不支持文件修改检查，因为需要同步的 statSync）
      if (this.cachedConfig) {
        return this.cachedConfig;
      }

      // 从文件读取数据
      const fileContent = await readFile(this.configPath, 'utf-8');
      let config = JSON.parse(fileContent) as T;

      // 验证配置（验证函数内部会抛出错误如果验证失败）
      if (this.validateConfig) {
        this.validateConfig(config);
      }

      // 应用转换函数（如环境变量覆盖等）
      if (this.transformConfigAsync) {
        config = await this.transformConfigAsync(config);
      } else if (this.transformConfig) {
        config = this.transformConfig(config);
      }

      // 缓存配置
      this.cachedConfig = config;

      return config;
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          `配置数据未找到: ${this.configPath}. 请确保数据源存在。`
        );
      }
      throw new Error(
        `加载配置失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 加载配置（根据 useSync 选项选择同步或异步）
   */
  protected loadConfig(): T;
  protected loadConfig(): Promise<T>;
  protected loadConfig(): T | Promise<T> {
    if (this.useSync) {
      return this.loadConfigSync();
    }
    return this.loadConfigAsync();
  }

  /**
   * 清除缓存（用于重新加载配置）
   */
  clearCache(): void {
    this.cachedConfig = null;
    this.lastModified = 0;
  }

  /**
   * 获取配置路径（用于调试或日志）
   */
  getConfigPath(): string {
    return this.configPath;
  }
}
