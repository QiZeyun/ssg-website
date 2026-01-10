#!/usr/bin/env node

/**
 * Pre-commit 检查脚本
 * 在提交前运行类型检查、代码检查和验证
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { exit } from 'process';

interface CheckResult {
  name: string;
  passed: boolean;
  message?: string;
}

const checks: CheckResult[] = [];

/**
 * 运行命令并捕获结果
 */
function runCheck(name: string, command: string): CheckResult {
  console.log(`\n🔍 运行 ${name}...`);
  try {
    execSync(command, { stdio: 'inherit', encoding: 'utf-8' });
    console.log(`✅ ${name} 通过`);
    return { name, passed: true };
  } catch (error) {
    console.error(`❌ ${name} 失败`);
    return { name, passed: false, message: String(error) };
  }
}

/**
 * 运行所有检查
 */
function runAllChecks(): boolean {
  console.log('🚀 开始 pre-commit 检查...\n');

  // 1. TypeScript 类型检查
  checks.push(runCheck('类型检查', 'pnpm type-check'));

  // 2. ESLint 代码检查
  checks.push(runCheck('代码检查', 'pnpm lint'));

  // 3. 验证构建产物（如果已经构建过）
  // 注意：这里只验证已存在的构建产物，不会重新构建
  // 如果构建产物不存在，跳过验证（避免在每次提交时都构建，这会很慢）
  if (existsSync('out')) {
    checks.push(runCheck('构建产物验证', 'pnpm validate'));
  } else {
    console.log('\n⚠️  构建产物不存在，跳过验证');
    console.log('   提示: 如需验证构建产物，请先运行 pnpm build');
    checks.push({ name: '构建产物验证', passed: true });
  }

  // 统计结果
  const passed = checks.filter((check) => check.passed).length;
  const total = checks.length;
  const allPassed = checks.every((check) => check.passed);

  console.log('\n' + '='.repeat(50));
  console.log(`📊 检查结果: ${passed}/${total} 通过`);
  console.log('='.repeat(50));

  if (!allPassed) {
    console.log('\n❌ 部分检查失败，提交已阻止');
    console.log('\n请修复以下问题后重新提交：\n');
    checks
      .filter((check) => !check.passed)
      .forEach((check) => {
        console.log(`  - ${check.name}`);
        if (check.message) {
          console.log(`    错误: ${check.message}`);
        }
      });
    console.log('');
    return false;
  }

  console.log('\n✅ 所有检查通过，可以提交\n');
  return true;
}

/**
 * 主函数
 */
function main(): void {
  const allPassed = runAllChecks();
  exit(allPassed ? 0 : 1);
}

main();
