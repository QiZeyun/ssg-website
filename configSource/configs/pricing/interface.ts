/**
 * 产品价格配置数据源接口
 * 
 * 这个接口定义了从数据源获取产品价格配置的契约
 * 
 * 注意：调用方不应该感知数据源的具体实现（如文件系统、CMS、API、数据库等）
 * 所有数据获取都应该通过此接口的方法进行
 */

import type { PricingConfig, LocalizedPricingConfig } from './types';

/**
 * 产品价格配置数据源接口
 * 
 * 此接口定义了从数据源获取产品价格配置的契约
 * 当前实现为文件数据源，所有方法均为异步
 * 
 * 注意：调用方不应该感知数据源的具体实现（如文件系统、CMS、API、数据库等）
 * 所有数据获取都应该通过此接口的方法进行
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
