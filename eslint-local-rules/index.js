/**
 * Local ESLint rules plugin
 * 
 * Provides project-specific ESLint rules
 * 
 * eslint-plugin-local-rules will automatically load rules from eslint-local-rules/index.js
 */

module.exports = {
  'require-generate-metadata': require('./require-generate-metadata'),
};
