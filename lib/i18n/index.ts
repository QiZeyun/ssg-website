/**
 * 多语言工具函数
 * 客户端和服务器端都可用
 */

import { getTranslations } from './translations';
import type { TranslationDictionary, Translations, SupportedLocale } from './types';
import { defaultLocale, isSupportedLocale } from './config';

// 重新导出类型和配置
export type { SupportedLocale, TranslationDictionary, Translations } from './types';
export { isSupportedLocale, defaultLocale, supportedLocales, localeConfigs, getLocaleConfig } from './config';
export { getTranslations } from './translations';

/**
 * 翻译函数
 * 
 * @param locale 语言代码
 * @param key 翻译键，支持点号分隔的嵌套键，例如 'nav.home'
 * @param params 可选的参数对象，用于替换占位符
 * @returns 翻译后的文本
 */
export function t(locale: string, key: string, params?: Record<string, string | number>): string {
  const translations = getTranslations(locale);
  const keys = key.split('.');
  
  let value: any = translations;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 如果找不到翻译，返回键本身
      return key;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // 替换参数占位符
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
}

/**
 * 获取翻译函数（柯里化版本，用于客户端组件）
 * 
 * @param locale 语言代码
 * @returns 翻译函数
 */
export function useTranslation(locale: string) {
  return (key: string, params?: Record<string, string | number>) => {
    return t(locale, key, params);
  };
}
