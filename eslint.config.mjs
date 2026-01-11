import localRules from 'eslint-plugin-local-rules';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  {
    plugins: {
      'local-rules': localRules,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "ConditionalExpression[test.type='BinaryExpression'][test.operator='==='][test.left.name='locale'][test.right.value=/^(zh|en)$/]",
          message:
            "禁止使用 locale === 'zh' 或 locale === 'en' 的方式硬编码文案。请使用翻译函数：t(locale, 'translation.key') 或 useTranslation(locale) Hook。所有文案应定义在 data/translations.json 中。",
        },
        {
          selector:
            "ConditionalExpression[test.type='BinaryExpression'][test.operator='==='][test.right.name='locale'][test.left.value=/^(zh|en)$/]",
          message:
            "禁止使用 locale === 'zh' 或 locale === 'en' 的方式硬编码文案。请使用翻译函数：t(locale, 'translation.key') 或 useTranslation(locale) Hook。所有文案应定义在 data/translations.json 中。",
        },
        {
          selector:
            "ConditionalExpression[test.type='BinaryExpression'][test.operator='==='][test.left.type='MemberExpression'][test.left.property.name='locale'][test.right.value=/^(zh|en)$/]",
          message:
            "禁止使用 locale === 'zh' 或 locale === 'en' 的方式硬编码文案。请使用翻译函数：t(locale, 'translation.key') 或 useTranslation(locale) Hook。",
        },
        {
          selector:
            "ConditionalExpression[test.type='BinaryExpression'][test.operator='==='][test.right.type='MemberExpression'][test.right.property.name='locale'][test.left.value=/^(zh|en)$/]",
          message:
            "禁止使用 locale === 'zh' 或 locale === 'en' 的方式硬编码文案。请使用翻译函数：t(locale, 'translation.key') 或 useTranslation(locale) Hook。",
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'local-rules': localRules,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXExpressionContainer > ConditionalExpression[test.type='BinaryExpression'][test.operator='==='][test.left.name='locale'][test.right.value=/^(zh|en)$/]",
          message:
            "禁止在 JSX 中使用 locale === 'zh' 或 locale === 'en' 硬编码文案。请使用翻译函数 t(locale, 'key') 或 useTranslation(locale) Hook。",
        },
        {
          selector:
            "JSXExpressionContainer > ConditionalExpression[test.type='BinaryExpression'][test.operator='==='][test.right.name='locale'][test.left.value=/^(zh|en)$/]",
          message:
            "禁止在 JSX 中使用 locale === 'zh' 或 locale === 'en' 硬编码文案。请使用翻译函数 t(locale, 'key') 或 useTranslation(locale) Hook。",
        },
      ],
      'local-rules/require-generate-metadata': 'error',
    },
  },
  {
    files: ['app/**/page.tsx'],
    plugins: {
      'local-rules': localRules,
    },
    rules: {
      'local-rules/require-generate-metadata': 'error',
    },
  },
];

export default config;

