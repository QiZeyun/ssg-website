/**
 * 产品价格配置数据源工厂
 */

import type { IPricingDataSource } from './interface';
import { FilePricingDataSource } from './file-source';

type DataSourceType = 'file' | 'cms' | 'api' | 'database';

/**
 * 创建产品价格配置数据源
 * 
 * @param options 数据源配置选项
 * @returns 产品价格配置数据源实例
 */
export function createPricingDataSource(
  options?: {
    type?: DataSourceType;
    configPath?: string;
    [key: string]: unknown;
  }
): IPricingDataSource {
  const sourceType = options?.type ||
    (process.env.NEXT_PUBLIC_PRICING_DATA_SOURCE as DataSourceType | undefined) ||
    'file';

  switch (sourceType) {
    case 'file':
      // 只传递 configPath（如果提供），路径的默认值由 FilePricingDataSource 内部处理
      // 调用方不需要感知数据的具体存储路径和格式
      return new FilePricingDataSource(options?.configPath as string | undefined);

    case 'cms':
      // TODO: 实现 CMS 数据源
      // return new CmsPricingDataSource(options);
      throw new Error('CMS 数据源尚未实现，请使用 file 数据源');

    case 'api':
      // TODO: 实现 API 数据源
      // return new ApiPricingDataSource(options);
      throw new Error('API 数据源尚未实现，请使用 file 数据源');

    case 'database':
      // TODO: 实现数据库数据源
      // return new DatabasePricingDataSource(options);
      throw new Error('数据库数据源尚未实现，请使用 file 数据源');

    default:
      throw new Error(`不支持的数据源类型: ${sourceType}`);
  }
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
