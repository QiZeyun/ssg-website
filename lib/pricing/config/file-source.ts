/**
 * 文件数据源实现
 * 从本地数据源读取产品价格配置
 * 
 * 注意：此实现封装了数据获取的具体细节，调用方不应该感知数据的具体存储格式
 */

import { readFileSync, statSync } from 'fs';
import { join } from 'path';
import { getPricingConfigPath } from '@/lib/data/config';
import type { PricingConfig, LocalizedPricingConfig } from './types';
import type { IPricingDataSource } from './interface';
import { defaultLocale } from '@/lib/i18n/config';

export class FilePricingDataSource implements IPricingDataSource {
  private configPath: string;
  private cache: LocalizedPricingConfig | null = null;
  private lastModified: number = 0;

  constructor(configPath?: string) {
    // 如果提供了完整路径，直接使用；否则从配置模块获取默认路径
    if (configPath) {
      this.configPath = configPath;
    } else {
      const defaultPath = getPricingConfigPath();
      // 支持相对路径和绝对路径
      this.configPath = defaultPath.startsWith('/') 
        ? defaultPath 
        : join(process.cwd(), defaultPath);
      // 添加文件扩展名（这是实现细节，不应暴露给调用方）
      // 如果路径已经包含扩展名，则不再添加
      if (!this.configPath.match(/\.[a-z0-9]+$/i)) {
        this.configPath = `${this.configPath}.json`;
      }
    }
  }

  /**
   * 从数据源加载配置
   * 此方法封装了数据获取的具体实现，调用方不应该感知数据的具体存储方式
   */
  private loadConfig(): LocalizedPricingConfig {
    try {
      const stats = statSync(this.configPath);
      const currentModified = stats.mtimeMs;

      // 如果数据源未修改且缓存存在，直接返回缓存
      if (this.cache && currentModified === this.lastModified) {
        return this.cache;
      }

      // 从数据源读取数据（具体实现细节被封装在此处）
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
