/**
 * 多语言配置
 */

import type { LocaleConfig, SupportedLocale } from './types';

/**
 * 支持的语言列表
 */
export const supportedLocales: SupportedLocale[] = ['zh', 'en'];

/**
 * 默认语言
 */
export const defaultLocale: SupportedLocale = 'zh';

/**
 * 语言配置映射
 */
export const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  zh: {
    code: 'zh',
    name: '中文',
    nativeName: '中文',
    dir: 'ltr',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
};

/**
 * 获取语言配置
 */
export function getLocaleConfig(locale: string): LocaleConfig {
  const normalizedLocale = locale.toLowerCase().split('-')[0] as SupportedLocale;
  return localeConfigs[normalizedLocale] || localeConfigs[defaultLocale];
}

/**
 * 检查语言是否支持
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}
