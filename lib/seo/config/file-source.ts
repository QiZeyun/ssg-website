/**
 * 本地文件数据源实现
 * 
 * 从本地 JSON 文件读取 SEO 配置
 * 这是一个简单的实现，适合开发和静态网站场景
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ISeoDataSource } from './interface';
import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

export class FileSeoDataSource implements ISeoDataSource {
  private configPath: string;
  private cachedConfig: SeoConfig | null = null;

  /**
   * 构造函数
   * @param configPath SEO 配置文件的路径，默认为项目根目录下的 data/seo-config.json
   */
  constructor(configPath?: string) {
    this.configPath = configPath || join(process.cwd(), 'data', 'seo-config.json');
  }

  /**
   * 加载配置文件
   */
  private async loadConfig(): Promise<SeoConfig> {
    // 如果有缓存，直接返回
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    try {
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
          `SEO 配置文件未找到: ${this.configPath}. 请确保配置文件存在。`
        );
      }
      throw new Error(
        `加载 SEO 配置文件失败: ${error instanceof Error ? error.message : String(error)}`
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
