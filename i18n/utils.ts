/**
 * 多语言路径工具函数
 */

import { supportedLocales, defaultLocale } from './config';
import type { SupportedLocale } from './types';

/**
 * 用于匹配语言前缀的正则表达式（模块级缓存，避免重复创建）
 */
const localeRegex = new RegExp(`^/(${supportedLocales.join('|')})`);

/**
 * 从路径中移除语言前缀
 * 
 * @param path 包含语言前缀的路径，例如 '/zh/about' 或 '/en/pricing'
 * @returns 移除语言前缀后的基础路径，例如 '/about' 或 '/pricing'
 * 
 * @example
 * removeLocalePrefix('/zh/about') // 返回 '/about'
 * removeLocalePrefix('/en') // 返回 '/'
 * removeLocalePrefix('/about') // 返回 '/about'（无语言前缀时返回原路径）
 */
export function removeLocalePrefix(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // 移除语言前缀
  const basePath = normalizedPath.replace(localeRegex, '');
  // 如果结果为空，返回 '/'
  return basePath || '/';
}

/**
 * 为路径添加语言前缀
 * 
 * @param path 基础路径，可能包含或不包含语言前缀
 * @param locale 目标语言代码
 * @returns 带有指定语言前缀的完整路径
 * 
 * @example
 * addLocalePrefix('/about', 'zh') // 返回 '/zh/about'
 * addLocalePrefix('/zh/about', 'en') // 返回 '/en/about'
 * addLocalePrefix('/', 'zh') // 返回 '/zh'
 */
export function addLocalePrefix(path: string, locale: SupportedLocale): string {
  const basePath = removeLocalePrefix(path);
  return `/${locale}${basePath === '/' ? '' : basePath}`;
}

/**
 * 从路径中提取语言代码
 * 
 * @param path 包含语言前缀的路径
 * @returns 语言代码，如果没有有效的语言前缀则返回默认语言
 * 
 * @example
 * extractLocaleFromPath('/zh/about') // 返回 'zh'
 * extractLocaleFromPath('/en/pricing') // 返回 'en'
 * extractLocaleFromPath('/about') // 返回默认语言
 */
export function extractLocaleFromPath(path: string): SupportedLocale {
  const match = path.match(localeRegex);
  if (match && match[1]) {
    const locale = match[1] as SupportedLocale;
    if (supportedLocales.includes(locale)) {
      return locale;
    }
  }
  return defaultLocale;
}

/**
 * 检查路径是否包含有效的语言前缀
 * 
 * @param path 要检查的路径
 * @returns 如果路径包含有效的语言前缀则返回 true
 * 
 * @example
 * hasLocalePrefix('/zh/about') // 返回 true
 * hasLocalePrefix('/about') // 返回 false
 */
export function hasLocalePrefix(path: string): boolean {
  return localeRegex.test(path);
}
