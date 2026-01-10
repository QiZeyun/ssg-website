/**
 * 产品价格配置数据源接口
 * 
 * 这个接口定义了从外部系统（如 CMS、API、本地文件等）获取产品价格配置的契约
 */

import type { PricingConfig, LocalizedPricingConfig } from './types';

/**
 * 产品价格配置数据源接口
 * 
 * 实现此接口可以支持从不同的数据源获取产品价格配置：
 * - 本地文件（FilePricingDataSource）
 * - CMS 系统（CmsPricingDataSource）
 * - REST API（ApiPricingDataSource）
 * - 数据库（DatabasePricingDataSource）
 * 等等
 */
export interface IPricingDataSource {
  /**
   * 获取指定语言的产品价格配置
   * @param locale 语言代码，例如 'zh' 或 'en'
   * @returns Promise<PricingConfig> 产品价格配置对象
   */
  getPricingConfig(locale: string): Promise<PricingConfig>;

  /**
   * 获取所有语言的产品价格配置
   * @returns Promise<LocalizedPricingConfig> 多语言产品价格配置对象
   */
  getAllPricingConfigs(): Promise<LocalizedPricingConfig>;

  /**
   * 检查指定语言的产品价格配置是否存在
   * @param locale 语言代码
   * @returns Promise<boolean> 是否存在
   */
  hasLocale(locale: string): Promise<boolean>;

  /**
   * 获取支持的语言列表
   * @returns Promise<string[]> 支持的语言代码列表
   */
  getSupportedLocales(): Promise<string[]>;
}
