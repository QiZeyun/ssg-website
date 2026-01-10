/**
 * 产品价格配置数据源
 * 
 * 从本地 JSON 文件获取产品价格配置
 * 对外暴露的函数均为异步（保持接口一致性）
 */

import pricingConfigData from '@/data/pricing-config.json';
import type { PricingConfig, LocalizedPricingConfig } from './types';
import { defaultLocale } from '@/i18n/config';

/**
 * 加载并处理价格配置
 * 支持环境变量覆盖（如果需要）
 */
function loadConfig(): LocalizedPricingConfig {
  // 直接使用 import 的 JSON 数据
  const config = pricingConfigData as LocalizedPricingConfig;
  
  // 环境变量覆盖（如果需要，可以在这里添加）
  // 例如：if (process.env.NEXT_PUBLIC_PRICING_OVERRIDE) { ... }
  
  return config;
}

/**
 * 获取指定语言的产品价格配置
 * @param locale 语言代码，例如 'zh' 或 'en'
 * @returns Promise<PricingConfig> 产品价格配置对象
 */
export async function getPricingConfig(locale: string): Promise<PricingConfig> {
  const configs = loadConfig();
  const normalizedLocale = locale.toLowerCase().split('-')[0];
  
  // 优先返回指定语言的配置，如果不存在则返回默认语言
  return configs[normalizedLocale] || configs[defaultLocale] || configs['zh'] || configs['en'] || {
    productName: 'Product Pricing',
    tiers: [],
  };
}

/**
 * 获取所有语言的产品价格配置
 * @returns Promise<LocalizedPricingConfig> 多语言产品价格配置对象
 */
export async function getAllPricingConfigs(): Promise<LocalizedPricingConfig> {
  return loadConfig();
}

/**
 * 检查指定语言的产品价格配置是否存在
 * @param locale 语言代码
 * @returns Promise<boolean> 是否存在
 */
export async function hasLocale(locale: string): Promise<boolean> {
  const configs = loadConfig();
  const normalizedLocale = locale.toLowerCase().split('-')[0];
  return normalizedLocale in configs;
}

/**
 * 获取支持的语言列表
 * @returns Promise<string[]> 支持的语言代码列表
 */
export async function getSupportedLocales(): Promise<string[]> {
  const configs = loadConfig();
  return Object.keys(configs);
}

// 导出类型
export type { PricingConfig, LocalizedPricingConfig } from './types';
