/**
 * 翻译数据（静态导入，客户端和服务器端都可用）
 */

import { translations } from '@/lib/translations';
import type { TranslationDictionary } from './types';
import { defaultLocale, supportedLocales } from './config';

/**
 * 获取指定语言的翻译字典（客户端和服务器端都可用）
 */
export function getTranslations(locale: string): TranslationDictionary {
  const normalizedLocale = locale.toLowerCase().split('-')[0] as keyof typeof translations;
  
  if (normalizedLocale in translations) {
    return translations[normalizedLocale];
  }
  
  // 回退到默认语言
  const fallbackLocale = defaultLocale as keyof typeof translations;
  return translations[fallbackLocale] || translations['zh'] || translations['en'] || ({} as TranslationDictionary);
}
