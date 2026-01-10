/**
 * 价格配置文件数据源实现
 * 
 * 从本地数据源读取产品价格配置
 * 使用通用的 BaseFileDataSource 基类，减少重复代码
 */

import { BaseFileDataSource, type FileDataSourceOptions } from '../sources/base-file-source';
import { getPricingConfigPath } from '../config';
import type { IPricingDataSource } from './interface';
import type { PricingConfig, LocalizedPricingConfig } from './types';
import { defaultLocale } from '@/i18n/config';

export class FilePricingDataSource extends BaseFileDataSource<LocalizedPricingConfig> implements IPricingDataSource {
  constructor(configPath?: string) {
    const options: FileDataSourceOptions<LocalizedPricingConfig> = {
      configPath,
      getDefaultPath: getPricingConfigPath,
      validateConfig: (config: unknown): void => {
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
      },
      useSync: true, // Pricing 使用同步模式（支持文件修改检查）
      checkFileModified: true, // 启用文件修改检查
    };

    super(options);
  }

  /**
   * 获取指定语言的产品价格配置
   */
  async getPricingConfig(locale: string): Promise<PricingConfig> {
    // 使用同步模式加载配置（useSync: true），async 函数会自动将返回值包装为 Promise
    const configs = this.loadConfigSync();
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
    // 使用同步模式加载配置（useSync: true），async 函数会自动将返回值包装为 Promise
    return this.loadConfigSync();
  }

  /**
   * 检查指定语言的产品价格配置是否存在
   */
  async hasLocale(locale: string): Promise<boolean> {
    // 使用同步模式加载配置（useSync: true），async 函数会自动将返回值包装为 Promise
    const configs = this.loadConfigSync();
    const normalizedLocale = locale.toLowerCase().split('-')[0];
    return normalizedLocale in configs;
  }

  /**
   * 获取支持的语言列表
   */
  async getSupportedLocales(): Promise<string[]> {
    // 使用同步模式加载配置（useSync: true），async 函数会自动将返回值包装为 Promise
    const configs = this.loadConfigSync();
    return Object.keys(configs);
  }
}
