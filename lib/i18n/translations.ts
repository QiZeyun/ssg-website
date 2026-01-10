/**
 * 翻译数据（静态导入，客户端和服务器端都可用）
 */

import translationsData from '@/data/translations.json';
import type { TranslationDictionary, Translations } from './types';

/**
 * 翻译数据（从 JSON 文件导入）
 */
const translations: Translations = translationsData as Translations;

/**
 * 获取指定语言的翻译字典（客户端和服务器端都可用）
 */
export function getTranslations(locale: string): TranslationDictionary {
  const normalizedLocale = locale.toLowerCase().split('-')[0];
  
  if (normalizedLocale in translations) {
    return translations[normalizedLocale];
  }
  
  // 回退到默认语言
  return translations['zh'] || translations['en'] || {};
}
