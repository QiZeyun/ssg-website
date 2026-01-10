/**
 * SEO 配置文件数据源实现
 * 
 * 从本地数据源读取 SEO 配置
 * 使用通用的 BaseFileDataSource 基类，减少重复代码
 */

import { BaseFileDataSource, type FileDataSourceOptions } from '../sources/base-file-source';
import { getSeoConfigPath } from '../config';
import type { ISeoDataSource } from './interface';
import type { SeoConfig, PageSeoConfig, GlobalSeoConfig, SitemapPageConfig, RobotsConfig } from './types';

export class FileSeoDataSource extends BaseFileDataSource<SeoConfig> implements ISeoDataSource {
  constructor(configPath?: string) {
    const options: FileDataSourceOptions<SeoConfig> = {
      configPath,
      getDefaultPath: getSeoConfigPath,
      validateConfig: (config: unknown): void => {
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
      },
      transformConfigAsync: async (config: SeoConfig): Promise<SeoConfig> => {
        // 从环境变量覆盖 siteUrl（如果存在）
        if (process.env.NEXT_PUBLIC_SITE_URL) {
          config.global.siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
        }
        return config;
      },
      useSync: false, // SEO 使用异步模式
    };

    super(options);
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
