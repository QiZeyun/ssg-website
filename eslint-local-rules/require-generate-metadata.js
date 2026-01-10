'use strict';

/**
 * ESLint rule: Require Next.js page components to export generateMetadata function
 * 
 * This rule checks if app page.tsx files export the generateMetadata function.
 * generateMetadata is a special export function in Next.js App Router for generating page SEO metadata.
 * 
 * If a page file is missing this export, it will report an error to remind developers to add it.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require Next.js page components to export generateMetadata function',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingGenerateMetadata:
        '页面文件必须导出 generateMetadata 函数。\n' +
        'generateMetadata 是 Next.js App Router 的特殊导出函数，用于生成页面的 SEO 元数据（<head> 标签内容）。\n' +
        '删除此函数会导致页面缺少 SEO 元数据，影响搜索引擎排名和社交媒体分享效果。\n' +
        '请参考：https://nextjs.org/docs/app/api-reference/functions/generate-metadata',
    },
  },

  create(context) {
    const filename = context.getFilename();

    // Only check app directory page.tsx files
    if (!filename.includes('/app/') || !filename.endsWith('page.tsx')) {
      return {};
    }

    // Verify it's a page.tsx file (exclude other similar named files)
    if (!filename.match(/[/\\]page\.tsx$/)) {
      return {};
    }

    let hasGenerateMetadataExport = false;
    let hasDefaultExport = false;

    return {
      // Check export declarations
      'Program > ExportNamedDeclaration[declaration]'(node) {
        if (node.declaration && node.declaration.declarations) {
          // Check named export: export async function generateMetadata
          for (const declaration of node.declaration.declarations) {
            if (declaration.id && declaration.id.name === 'generateMetadata') {
              hasGenerateMetadataExport = true;
            }
          }
        }
      },

      // Check function declaration export: export async function generateMetadata() {}
      'ExportNamedDeclaration > FunctionDeclaration[id.name="generateMetadata"]'() {
        hasGenerateMetadataExport = true;
      },

      // Check export specifier: export { generateMetadata }
      'ExportNamedDeclaration > ExportSpecifier[exported.name="generateMetadata"]'() {
        hasGenerateMetadataExport = true;
      },

      // Check if default export exists (ensure this is a page component file)
      'ExportDefaultDeclaration'() {
        hasDefaultExport = true;
      },

      // Check at end of file
      'Program:exit'(node) {
        // Only check files with default export (ensure it's a page component)
        if (hasDefaultExport && !hasGenerateMetadataExport) {
          context.report({
            node,
            messageId: 'missingGenerateMetadata',
          });
        }
      },
    };
  },
};
