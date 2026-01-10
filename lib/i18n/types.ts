/**
 * 多语言支持类型定义
 */

import type { TranslationDictionary, TranslationKey } from '@/lib/translations';

/**
 * 支持的语言
 */
export type SupportedLocale = 'zh' | 'en';

/**
 * 语言配置
 */
export interface LocaleConfig {
  /** 语言代码 */
  code: SupportedLocale;
  /** 语言名称（中文显示） */
  name: string;
  /** 语言名称（本地显示） */
  nativeName: string;
  /** 语言方向 */
  dir?: 'ltr' | 'rtl';
}

/**
 * 翻译键类型（重新导出）
 */
export type { TranslationKey, TranslationDictionary } from '@/lib/translations';

/**
 * 多语言翻译数据
 */
export interface Translations {
  [locale: string]: TranslationDictionary;
}
