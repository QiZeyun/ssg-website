/**
 * SEO 配置数据源模块
 * 
 * 提供统一的接口来获取 SEO 配置，支持多种数据源
 */

import type { ISeoDataSource } from './interface';
import { FileSeoDataSource } from './file-source';
import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

/**
 * 数据源类型
 */
export type DataSourceType = 'file' | 'cms' | 'api' | 'database';

/**
 * 数据源工厂
 * 
 * 根据环境变量或配置创建相应的数据源实例
 * 可以通过 NEXT_PUBLIC_SEO_DATA_SOURCE 环境变量指定数据源类型
 * 
 * @param options 配置选项
 * @returns ISeoDataSource 数据源实例
 */
export function createSeoDataSource(
  options?: {
    type?: DataSourceType;
    configPath?: string;
    [key: string]: unknown;
  }
): ISeoDataSource {
  // 从环境变量获取数据源类型，默认使用 file
  const sourceType = options?.type || 
    (process.env.NEXT_PUBLIC_SEO_DATA_SOURCE as DataSourceType | undefined) || 
    'file';

  switch (sourceType) {
    case 'file':
      // 只传递 configPath（如果提供），路径的默认值由 FileSeoDataSource 内部处理
      // 调用方不需要感知数据的具体存储路径和格式
      return new FileSeoDataSource(options?.configPath as string | undefined);
    
    case 'cms':
      // TODO: 实现 CMS 数据源
      // return new CmsSeoDataSource(options);
      throw new Error('CMS 数据源尚未实现，请使用 file 数据源');
    
    case 'api':
      // TODO: 实现 API 数据源
      // return new ApiSeoDataSource(options);
      throw new Error('API 数据源尚未实现，请使用 file 数据源');
    
    case 'database':
      // TODO: 实现数据库数据源
      // return new DatabaseSeoDataSource(options);
      throw new Error('数据库数据源尚未实现，请使用 file 数据源');
    
    default:
      throw new Error(`不支持的数据源类型: ${sourceType}`);
  }
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
