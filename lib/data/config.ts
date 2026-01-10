/**
 * 数据配置管理
 * 统一管理所有数据源的路径配置，避免硬编码
 * 
 * 注意：此模块不应该暴露数据的具体存储格式（如 JSON、文件系统等）
 * 调用方只应该通过数据源接口获取数据，而不感知数据的具体存储方式
 */

/**
 * 获取 SEO 配置数据源路径
 * 优先从环境变量读取，如果没有则使用默认路径
 * 
 * @returns 数据源路径（不含扩展名，具体格式由实现决定）
 */
export function getSeoConfigPath(): string {
  return process.env.SEO_CONFIG_PATH || process.env.NEXT_PUBLIC_SEO_CONFIG_PATH || 'data/seo-config';
}

/**
 * 获取价格配置数据源路径
 * 优先从环境变量读取，如果没有则使用默认路径
 * 
 * @returns 数据源路径（不含扩展名，具体格式由实现决定）
 */
export function getPricingConfigPath(): string {
  return process.env.PRICING_CONFIG_PATH || process.env.NEXT_PUBLIC_PRICING_CONFIG_PATH || 'data/pricing-config';
}
