/**
 * 产品价格配置数据源工厂
 * 
 * 当前实现为文件数据源。如需支持其他数据源类型（如 CMS、API、数据库等），
 * 可以实现对应的数据源类并在本函数中添加相应的创建逻辑。
 */

import type { IPricingDataSource } from './interface';
import { FilePricingDataSource } from './file-source';

/**
 * 创建产品价格配置数据源
 * 
 * @param configPath 可选，配置数据源的路径。如果不提供则使用默认路径
 * @returns 产品价格配置数据源实例
 */
export function createPricingDataSource(configPath?: string): IPricingDataSource {
  // 当前实现：直接返回文件数据源实例
  // 调用方不需要感知数据的具体存储路径和格式
  return new FilePricingDataSource(configPath);
}

// 导出默认实例
let defaultDataSource: IPricingDataSource | null = null;

/**
 * 获取默认的产品价格配置数据源
 */
export function getDefaultPricingDataSource(): IPricingDataSource {
  if (!defaultDataSource) {
    defaultDataSource = createPricingDataSource();
  }
  return defaultDataSource;
}
