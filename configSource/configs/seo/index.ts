/**
 * SEO 配置数据源模块
 * 
 * 提供统一的接口来获取 SEO 配置
 * 
 * 当前实现为文件数据源。如需支持其他数据源类型（如 CMS、API、数据库等），
 * 可以实现对应的数据源类并在本函数中添加相应的创建逻辑。
 */

import type { ISeoDataSource } from './interface';
import { FileSeoDataSource } from './file-source';
import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

/**
 * 创建 SEO 配置数据源
 * 
 * @param configPath 可选，配置数据源的路径。如果不提供则使用默认路径
 * @returns ISeoDataSource 数据源实例
 */
export function createSeoDataSource(configPath?: string): ISeoDataSource {
  // 当前实现：直接返回文件数据源实例
  // 调用方不需要感知数据的具体存储路径和格式
  return new FileSeoDataSource(configPath);
}

/**
 * 默认数据源实例（单例模式）
 */
let defaultDataSource: ISeoDataSource | null = null;

/**
 * 获取默认数据源实例
 */
export function getDefaultDataSource(): ISeoDataSource {
  if (!defaultDataSource) {
    defaultDataSource = createSeoDataSource();
  }
  return defaultDataSource;
}

/**
 * 设置默认数据源实例
 */
export function setDefaultDataSource(dataSource: ISeoDataSource): void {
  defaultDataSource = dataSource;
}

// 导出类型
export type { ISeoDataSource, SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig };

// 导出实现
export { FileSeoDataSource } from './file-source';
