/**
 * SEO 配置数据源接口
 * 
 * 这个接口定义了从数据源获取 SEO 配置的契约
 * 任何实现了这个接口的类都可以作为 SEO 配置的数据源
 * 
 * 注意：调用方不应该感知数据源的具体实现（如文件系统、CMS、API、数据库等）
 * 所有数据获取都应该通过此接口的方法进行
 */

import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

/**
 * SEO 配置数据源接口
 * 
 * 实现此接口可以支持从不同的数据源获取 SEO 配置：
 * - 本地数据源（FileSeoDataSource）
 * - CMS 系统（CmsSeoDataSource）
 * - REST API（ApiSeoDataSource）
 * - 数据库（DatabaseSeoDataSource）
 * 等等
 * 
 * 所有实现都应该封装数据获取的具体细节，调用方只需调用接口方法即可
 */
export interface ISeoDataSource {
  /**
   * 获取完整的 SEO 配置
   * @returns Promise<SeoConfig> SEO 配置对象
   */
  getSeoConfig(): Promise<SeoConfig>;

  /*
   * 获取全局 SEO 配置
   * @returns Promise<GlobalSeoConfig> 全局配置对象
   */
  getGlobalConfig(): Promise<GlobalSeoConfig>;

  /**
   * 根据路径获取页面 SEO 配置
   * @param path 页面路径，例如 '/' 或 '/about'
   * @returns Promise<PageSeoConfig | null> 页面配置，如果不存在则返回 null
   */
  getPageConfig(path: string): Promise<PageSeoConfig | null>;

  /**
   * 获取所有页面 SEO 配置
   * @returns Promise<PageSeoConfig[]> 所有页面配置列表
   */
  getAllPageConfigs(): Promise<PageSeoConfig[]>;

  /**
   * 获取 Sitemap 配置
   * @returns Promise<SitemapPageConfig[]> Sitemap 页面配置列表
   */
  getSitemapConfig(): Promise<SitemapPageConfig[]>;

  /**
   * 获取 Robots.txt 配置
   * @returns Promise<RobotsConfig> Robots 配置对象
   */
  getRobotsConfig(): Promise<RobotsConfig>;
}
