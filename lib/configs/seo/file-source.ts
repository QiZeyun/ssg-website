/**
 * 文件数据源实现
 * 
 * 从本地数据源读取 SEO 配置
 * 这是一个简单的实现，适合开发和静态网站场景
 * 
 * 注意：此实现封装了数据获取的具体细节，调用方不应该感知数据的具体存储格式
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { getSeoConfigPath } from '../config';
import type { ISeoDataSource } from './interface';
import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

export class FileSeoDataSource implements ISeoDataSource {
  private configPath: string;
  private cachedConfig: SeoConfig | null = null;

  /**
   * 构造函数
   * @param configPath 配置数据源的路径，如果不提供则使用默认路径
   */
  constructor(configPath?: string) {
    // 如果提供了完整路径，直接使用；否则从配置模块获取默认路径
    if (configPath) {
      this.configPath = configPath;
    } else {
      const defaultPath = getSeoConfigPath();
      // 支持相对路径和绝对路径
      this.configPath = defaultPath.startsWith('/') 
        ? defaultPath 
        : join(process.cwd(), defaultPath);
      // 添加文件扩展名（这是实现细节，不应暴露给调用方）
      // 如果路径已经包含扩展名，则不再添加
      if (!this.configPath.match(/\.[a-z0-9]+$/i)) {
        this.configPath = `${this.configPath}.json`;
      }
    }
  }

  /**
   * 从数据源加载配置
   * 此方法封装了数据获取的具体实现，调用方不应该感知数据的具体存储方式
   */
  private async loadConfig(): Promise<SeoConfig> {
    // 如果有缓存，直接返回
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    try {
      // 从数据源读取数据（具体实现细节被封装在此处）
      const fileContent = await readFile(this.configPath, 'utf-8');
      const config = JSON.parse(fileContent) as SeoConfig;
      
      // 验证配置结构
      this.validateConfig(config);
      
      // 从环境变量覆盖 siteUrl（如果存在）
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        config.global.siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      }
      
      // 缓存配置
      this.cachedConfig = config;
      
      return config;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(
          `SEO 配置数据未找到: ${this.configPath}. 请确保数据源存在。`
        );
      }
      throw new Error(
        `加载 SEO 配置失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 验证配置结构
   */
  private validateConfig(config: unknown): asserts config is SeoConfig {
    if (!config || typeof config !== 'object') {
      throw new Error('SEO 配置必须是对象');
    }

    const cfg = config as Record<string, unknown>;

    if (!cfg.global || typeof cfg.global !== 'object') {
      throw new Error('SEO 配置必须包含 global 字段');
    }

    if (!Array.isArray(cfg.pages)) {
      throw new Error('SEO 配置必须包含 pages 数组');
    }

    if (!cfg.sitemap || typeof cfg.sitemap !== 'object') {
      throw new Error('SEO 配置必须包含 sitemap 字段');
    }

    if (!cfg.robots || typeof cfg.robots !== 'object') {
      throw new Error('SEO 配置必须包含 robots 字段');
    }
  }

  /**
   * 清除缓存（用于重新加载配置）
   */
  clearCache(): void {
    this.cachedConfig = null;
  }

  async getSeoConfig(): Promise<SeoConfig> {
    return this.loadConfig();
  }

  async getGlobalConfig(): Promise<GlobalSeoConfig> {
    const config = await this.loadConfig();
    return config.global;
  }

  async getPageConfig(path: string): Promise<PageSeoConfig | null> {
    const config = await this.loadConfig();
    // 规范化路径：确保路径以 / 开头，但根路径保持为 '/'
    const normalizedPath = path === '' ? '/' : (path.startsWith('/') ? path : `/${path}`);
    
    const pageConfig = config.pages.find((page) => page.path === normalizedPath);
    return pageConfig || null;
  }

  async getAllPageConfigs(): Promise<PageSeoConfig[]> {
    const config = await this.loadConfig();
    return config.pages;
  }

  async getSitemapConfig(): Promise<SitemapPageConfig[]> {
    const config = await this.loadConfig();
    return config.sitemap.pages;
  }

  async getRobotsConfig(): Promise<RobotsConfig> {
    const config = await this.loadConfig();
    return config.robots;
  }
}
