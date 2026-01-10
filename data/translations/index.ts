/**
 * 翻译数据导出和类型定义
 * 基于中文翻译作为基准，生成类型约束
 */

import { zh, type ZhTranslations } from './zh';
import { en } from './en';

/**
 * 将只读对象转换为可写对象（用于类型约束）
 */
type DeepWritable<T> = {
  -readonly [P in keyof T]: T[P] extends readonly (infer U)[]
    ? DeepWritable<U[]>
    : T[P] extends object
      ? DeepWritable<T[P]>
      : T[P];
};

/**
 * 仅保留键结构，值类型为 string（用于约束其他语言文件）
 */
type TranslationStructure<T> = {
  [K in keyof T]: T[K] extends object
    ? TranslationStructure<T[K]>
    : string;
};

/**
 * 翻译字典类型（基于中文翻译结构，值类型为 string）
 */
export type TranslationDictionary = TranslationStructure<DeepWritable<ZhTranslations>>;

/**
 * 所有翻译数据
 */
export const translations: Record<'zh' | 'en', TranslationDictionary> = {
  zh,
  en,
};

/**
 * 递归生成所有可能的点分隔键路径
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * 翻译键类型（所有可能的点分隔键路径）
 * 例如: 'nav.home' | 'common.learnMore' | 'home.feature1.title' 等
 */
export type TranslationKey = NestedKeyOf<DeepWritable<ZhTranslations>>;

// 类型检查：确保所有语言文件的结构与中文一致（编译时检查）
type _TypeCheck = {
  [K in keyof typeof translations]: typeof translations[K] extends TranslationDictionary ? true : never;
};

const _typeCheck: _TypeCheck = {
  zh: true,
  en: true,
};

// 这行代码确保类型检查生效（编译后会被移除）
void _typeCheck;
