/**
 * 产品价格配置数据源
 * 
 * 从本地文件读取产品价格配置
 * 对外暴露的接口方法均为异步
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { getPricingConfigPath } from '../config';
import type { IPricingDataSource } from './interface';
import type { PricingConfig, LocalizedPricingConfig } from './types';
import { defaultLocale } from '@/i18n/config';

/**
 * 配置数据缓存
 */
let cachedConfig: LocalizedPricingConfig | null = null;

/**
 * 获取配置文件路径
 */
function getConfigPath(customPath?: string): string {
  if (customPath) {
    return customPath;
  }
  
  const defaultPath = getPricingConfigPath();
  const configPath = defaultPath.startsWith('/') 
    ? defaultPath 
    : join(process.cwd(), defaultPath);
  
  // 添加文件扩展名（如果不存在）
  if (!configPath.match(/\.[a-z0-9]+$/i)) {
    return `${configPath}.json`;
  }
  
  return configPath;
}

/**
 * 验证配置结构
 */
function validateConfig(config: unknown): asserts config is LocalizedPricingConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('价格配置必须是对象');
  }
  
  // 验证每个语言键都是一个有效的 PricingConfig
  const cfg = config as Record<string, unknown>;
  for (const [locale, pricingConfig] of Object.entries(cfg)) {
    if (!pricingConfig || typeof pricingConfig !== 'object') {
      throw new Error(`价格配置中语言 "${locale}" 的配置必须是对象`);
    }
    const pc = pricingConfig as Record<string, unknown>;
    if (typeof pc.productName !== 'string') {
      throw new Error(`价格配置中语言 "${locale}" 必须包含 productName 字段`);
    }
    if (!Array.isArray(pc.tiers)) {
      throw new Error(`价格配置中语言 "${locale}" 必须包含 tiers 数组`);
    }
  }
}

/**
 * 从文件加载配置（异步）
 */
async function loadConfig(configPath?: string): Promise<LocalizedPricingConfig> {
  // 如果有缓存，直接返回
  if (cachedConfig) {
    return cachedConfig;
  }

  const path = getConfigPath(configPath);

  try {
    // 从文件读取数据
    const fileContent = await readFile(path, 'utf-8');
    let config = JSON.parse(fileContent) as LocalizedPricingConfig;

    // 验证配置结构
    validateConfig(config);

    // 缓存配置
    cachedConfig = config;

    return config;
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `价格配置数据未找到: ${path}. 请确保数据源存在。`
      );
    }
    throw new Error(
      `加载价格配置失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 清除缓存（用于重新加载配置）
 */
function clearCache(): void {
  cachedConfig = null;
}

/**
 * 价格配置数据源实现
 */
class PricingDataSource implements IPricingDataSource {
  private readonly configPath?: string;

  constructor(configPath?: string) {
    this.configPath = configPath;
  }

  /**
   * 获取指定语言的产品价格配置
   */
  async getPricingConfig(locale: string): Promise<PricingConfig> {
    const configs = await loadConfig(this.configPath);
    const normalizedLocale = locale.toLowerCase().split('-')[0];
    
    // 优先返回指定语言的配置，如果不存在则返回默认语言
    return configs[normalizedLocale] || configs[defaultLocale] || configs['zh'] || configs['en'] || {
      productName: 'Product Pricing',
      tiers: [],
    };
  }

  /**
   * 获取所有语言的产品价格配置
   */
  async getAllPricingConfigs(): Promise<LocalizedPricingConfig> {
    return loadConfig(this.configPath);
  }

  /**
   * 检查指定语言的产品价格配置是否存在
   */
  async hasLocale(locale: string): Promise<boolean> {
    const configs = await loadConfig(this.configPath);
    const normalizedLocale = locale.toLowerCase().split('-')[0];
    return normalizedLocale in configs;
  }

  /**
   * 获取支持的语言列表
   */
  async getSupportedLocales(): Promise<string[]> {
    const configs = await loadConfig(this.configPath);
    return Object.keys(configs);
  }
}

// 默认数据源实例（单例模式）
let defaultDataSource: IPricingDataSource | null = null;

/**
 * 获取默认的产品价格配置数据源
 */
export function getDefaultPricingDataSource(): IPricingDataSource {
  if (!defaultDataSource) {
    defaultDataSource = new PricingDataSource();
  }
  return defaultDataSource;
}

/**
 * 创建产品价格配置数据源
 * 
 * @param configPath 可选的配置文件路径，如果不提供则使用默认路径
 * @returns 产品价格配置数据源实例
 */
export function createPricingDataSource(configPath?: string): IPricingDataSource {
  return new PricingDataSource(configPath);
}

// 导出接口和类型
export type { IPricingDataSource } from './interface';
export type { PricingConfig, LocalizedPricingConfig } from './types';

// 导出工具函数（用于测试或高级用法）
export { clearCache };
