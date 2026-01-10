/**
 * 配置路径管理
 * 统一管理所有数据源的路径配置，避免硬编码
 * 
 * 注意：此模块不应该暴露数据的具体存储格式（如 JSON、文件系统等）
 * 调用方只应该通过数据源接口获取数据，而不感知数据的具体存储方式
 */

/**
 * 配置数据源路径映射
 * 通过统一的方式管理所有配置数据源的路径
 */
const CONFIG_PATHS = {
  seo: 'data/seo-config',
  pricing: 'data/pricing-config',
} as const;

/**
 * 获取配置数据源路径
 * 优先从环境变量读取，如果没有则使用默认路径
 * 
 * @param configType 配置类型，例如 'seo' 或 'pricing'
 * @returns 数据源路径（不含扩展名，具体格式由实现决定）
 */
export function getConfigPath(configType: keyof typeof CONFIG_PATHS): string {
  const envKey = `${configType.toUpperCase()}_CONFIG_PATH`;
  const publicEnvKey = `NEXT_PUBLIC_${envKey}`;
  
  return process.env[envKey] || 
    process.env[publicEnvKey] || 
    CONFIG_PATHS[configType];
}

/**
 * 获取 SEO 配置数据源路径
 * 优先从环境变量读取，如果没有则使用默认路径
 * 
 * @returns 数据源路径（不含扩展名，具体格式由实现决定）
 */
export function getSeoConfigPath(): string {
  return getConfigPath('seo');
}

/**
 * 获取价格配置数据源路径
 * 优先从环境变量读取，如果没有则使用默认路径
 * 
 * @returns 数据源路径（不含扩展名，具体格式由实现决定）
 */
export function getPricingConfigPath(): string {
  return getConfigPath('pricing');
}
