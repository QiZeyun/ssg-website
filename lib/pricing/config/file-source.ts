/**
 * 文件数据源实现
 * 从本地 JSON 文件读取产品价格配置
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { PricingConfig, LocalizedPricingConfig } from './types';
import type { IPricingDataSource } from './interface';
import { defaultLocale } from '@/lib/i18n/config';

export class FilePricingDataSource implements IPricingDataSource {
  private configPath: string;
  private cache: LocalizedPricingConfig | null = null;
  private lastModified: number = 0;

  constructor(configPath?: string) {
    this.configPath = configPath || join(process.cwd(), 'data', 'pricing-config.json');
  }

  /**
   * 加载配置文件
   */
  private loadConfig(): LocalizedPricingConfig {
    try {
      const stats = require('fs').statSync(this.configPath);
      const currentModified = stats.mtimeMs;

      // 如果文件未修改且缓存存在，直接返回缓存
      if (this.cache && currentModified === this.lastModified) {
        return this.cache;
      }

      const fileContent = readFileSync(this.configPath, 'utf-8');
      const config = JSON.parse(fileContent) as LocalizedPricingConfig;

      // 更新缓存
      this.cache = config;
      this.lastModified = currentModified;

      return config;
    } catch (error) {
      console.error('Failed to load pricing config:', error);
      return {} as LocalizedPricingConfig;
    }
  }

  /**
   * 获取指定语言的产品价格配置
   */
  async getPricingConfig(locale: string): Promise<PricingConfig> {
    const configs = this.loadConfig();
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
    return this.loadConfig();
  }

  /**
   * 检查指定语言的产品价格配置是否存在
   */
  async hasLocale(locale: string): Promise<boolean> {
    const configs = this.loadConfig();
    const normalizedLocale = locale.toLowerCase().split('-')[0];
    return normalizedLocale in configs;
  }

  /**
   * 获取支持的语言列表
   */
  async getSupportedLocales(): Promise<string[]> {
    const configs = this.loadConfig();
    return Object.keys(configs);
  }
}
