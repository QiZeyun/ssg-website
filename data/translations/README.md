# 翻译文件说明

## 文件结构

翻译文件按语言拆分成独立的 TypeScript 文件：

- `zh.ts` - 中文翻译（基准语言）
- `en.ts` - 英文翻译
- `index.ts` - 导出所有翻译数据和类型定义

## 类型约束

### 基于中文翻译结构的类型约束

所有语言文件必须遵循中文翻译的键结构。这是通过 TypeScript 类型系统实现的：

1. **中文翻译** (`zh.ts`) 定义了完整的翻译结构
2. **其他语言文件** (如 `en.ts`) 使用 `TranslationDictionary` 类型约束，确保：
   - 键结构必须与中文翻译完全一致
   - 值类型必须是 `string`（但不要求与中文相同）

### 翻译键类型

`TranslationKey` 类型自动生成所有可能的点分隔键路径，例如：
- `'nav.home'`
- `'common.learnMore'`
- `'home.feature1.title'`
- `'pricing.savePercent'`

在使用翻译函数 `t()` 和 `useTranslation()` 时，键参数会自动获得类型提示和检查。

## 添加新语言

要添加新的语言（例如日语 `ja`）：

1. 在 `lib/i18n/config.ts` 中添加语言配置：
   ```typescript
   export const supportedLocales: SupportedLocale[] = ['zh', 'en', 'ja'];
   
   export const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
     // ... existing configs
     ja: {
       code: 'ja',
       name: '日本語',
       nativeName: '日本語',
       dir: 'ltr',
     },
   };
   ```

2. 创建 `data/translations/ja.ts`：
   ```typescript
   import type { TranslationDictionary } from './index';
   
   export const ja: TranslationDictionary = {
     nav: {
       home: 'ホーム',
       about: 'について',
       pricing: '価格',
       contact: 'お問い合わせ',
     },
     // ... 其他所有键必须与 zh.ts 一致
   };
   ```

3. 在 `data/translations/index.ts` 中导出：
   ```typescript
   import { ja } from './ja';
   
   export const translations: Record<'zh' | 'en' | 'ja', TranslationDictionary> = {
     zh,
     en,
     ja,
   };
   ```

4. TypeScript 编译器会自动检查新的语言文件是否遵循结构约束。

## 添加新的翻译键

要添加新的翻译键：

1. 在 `zh.ts` 中添加新的键和中文翻译
2. 在所有其他语言文件（如 `en.ts`）中添加对应的键和翻译
3. `TranslationKey` 类型会自动更新，包含新的键路径
4. 使用翻译时，新的键会自动出现在类型提示中

## 示例

```typescript
import { t } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n';

// 服务器组件中使用
const text = t(locale, 'nav.home'); // ✅ 类型检查通过
const text2 = t(locale, 'nav.invalid'); // ❌ TypeScript 错误：键不存在

// 客户端组件中使用
const t = useTranslation(locale);
const text = t('common.learnMore'); // ✅ 类型检查通过
const text2 = t('invalid.key'); // ❌ TypeScript 错误：键不存在
```

## 注意事项

1. **键结构必须完全一致**：所有语言文件的键结构必须与中文翻译完全一致，包括嵌套层级
2. **值类型必须是字符串**：所有翻译值必须是字符串类型
3. **参数占位符**：支持 `{{paramName}}` 格式的占位符，例如 `'pricing.savePercent'`
4. **类型安全**：使用 `TranslationKey` 类型确保在编译时就能发现错误的键名
