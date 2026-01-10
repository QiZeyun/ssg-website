#!/usr/bin/env node

/**
 * 构建产物验证脚本
 * 验证 Next.js 静态导出产物是否符合预期
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const OUT_DIR = 'out';

interface FileCheck {
  path: string;
  description: string;
}

const REQUIRED_FILES: FileCheck[] = [
  { path: 'out/index.html', description: '主页' },
  { path: 'out/about/index.html', description: '关于页面' },
  { path: 'out/contact/index.html', description: '联系页面' },
  { path: 'out/robots.txt', description: 'Robots.txt' },
  { path: 'out/sitemap.xml', description: 'Sitemap' },
];

function getFileSize(filePath: string): string {
  try {
    const stats = statSync(filePath);
    const size = stats.size;
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}K`;
    return `${(size / 1024 / 1024).toFixed(1)}M`;
  } catch {
    return '0B';
  }
}

function getDirSize(dirPath: string): string {
  try {
    const output = execSync(`du -sh "${dirPath}" 2>/dev/null || echo "0"`, {
      encoding: 'utf-8',
    }).trim();
    return output.split('\t')[0] || '0';
  } catch {
    return '0';
  }
}

function checkFile(filePath: string): boolean {
  return existsSync(filePath) && statSync(filePath).isFile();
}

function checkDir(dirPath: string): boolean {
  return existsSync(dirPath) && statSync(dirPath).isDirectory();
}

function validateRequiredFiles(): boolean {
  console.log('📄 检查关键文件...');
  
  let allFilesExist = true;
  
  for (const file of REQUIRED_FILES) {
    if (checkFile(file.path)) {
      const size = getFileSize(file.path);
      console.log(`  ✅ ${file.description}: ${file.path} (${size})`);
    } else {
      console.log(`  ❌ ${file.description}: ${file.path} 不存在`);
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    console.log('');
    console.log('❌ 部分关键文件缺失，验证失败');
    return false;
  }
  
  return true;
}

function validateStaticAssets(): void {
  console.log('');
  console.log('📦 检查静态资源...');
  
  const staticDir = join(OUT_DIR, '_next', 'static');
  if (checkDir(staticDir)) {
    const size = getDirSize(staticDir);
    console.log(`  ✅ 静态资源目录存在 (${size})`);
  } else {
    console.log('  ⚠️  静态资源目录不存在');
  }
}

function validateHtmlContent(): void {
  console.log('');
  console.log('🔍 验证 HTML 内容...');
  
  const indexPath = join(OUT_DIR, 'index.html');
  if (!checkFile(indexPath)) {
    console.log('  ❌ index.html 不存在');
    return;
  }
  
  const htmlContent = readFileSync(indexPath, 'utf-8');
  
  const titleMatch = htmlContent.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    console.log(`  ✅ index.html 包含 title 标签: ${titleMatch[1]}`);
  } else {
    console.log('  ❌ index.html 缺少 title 标签');
  }
  
  if (htmlContent.includes('name="description"')) {
    console.log('  ✅ index.html 包含 description meta 标签');
  } else {
    console.log('  ⚠️  index.html 缺少 description meta 标签');
  }
  
  if (htmlContent.includes('property="og:')) {
    console.log('  ✅ index.html 包含 Open Graph 标签');
  } else {
    console.log('  ⚠️  index.html 缺少 Open Graph 标签');
  }
}

function validateSitemap(): void {
  console.log('');
  console.log('🗺️  验证 Sitemap...');
  
  const sitemapPath = join(OUT_DIR, 'sitemap.xml');
  if (!checkFile(sitemapPath)) {
    console.log('  ❌ sitemap.xml 不存在');
    return;
  }
  
  const sitemapContent = readFileSync(sitemapPath, 'utf-8');
  
  if (sitemapContent.includes('<url>')) {
    const urlMatches = sitemapContent.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    console.log(`  ✅ sitemap.xml 包含 ${urlCount} 个 URL`);
    
    const locMatches = sitemapContent.match(/<loc>([^<]*)<\/loc>/g);
    if (locMatches && locMatches.length > 0) {
      console.log('  📋 Sitemap 中的 URL:');
      locMatches.forEach((match) => {
        const url = match.replace(/<\/?loc>/g, '');
        console.log(`    - ${url}`);
      });
    }
  } else {
    console.log('  ❌ sitemap.xml 缺少 URL');
  }
}

function validateRobots(): void {
  console.log('');
  console.log('🤖 验证 Robots.txt...');
  
  const robotsPath = join(OUT_DIR, 'robots.txt');
  if (checkFile(robotsPath)) {
    const robotsContent = readFileSync(robotsPath, 'utf-8');
    console.log('  ✅ robots.txt 内容:');
    robotsContent.split('\n').forEach((line) => {
      if (line.trim()) {
        console.log(`    ${line}`);
      }
    });
  } else {
    console.log('  ❌ robots.txt 不存在');
  }
}

function showStatistics(): void {
  console.log('');
  console.log('📊 构建产物统计:');
  
  if (checkDir(OUT_DIR)) {
    const totalSize = getDirSize(OUT_DIR);
    console.log(`  - 总大小: ${totalSize}`);
    
    try {
      const htmlFiles = execSync(
        `find "${OUT_DIR}" -name "*.html" 2>/dev/null | wc -l`,
        { encoding: 'utf-8' }
      ).trim();
      console.log(`  - HTML 文件数: ${htmlFiles}`);
    } catch {
      console.log('  - HTML 文件数: 无法统计');
    }
  }
}

function main(): void {
  console.log('🔍 开始验证构建产物...');
  console.log('');
  
  if (!checkDir(OUT_DIR)) {
    console.log('❌ out 目录不存在，请先运行 pnpm build');
    process.exit(1);
  }
  
  console.log('✅ out 目录存在');
  console.log('');
  
  const filesValid = validateRequiredFiles();
  if (!filesValid) {
    process.exit(1);
  }
  
  validateStaticAssets();
  validateHtmlContent();
  validateSitemap();
  validateRobots();
  showStatistics();
  
  console.log('');
  console.log('✅ 验证完成！');
  console.log('');
  console.log('💡 提示: 使用以下命令预览构建产物:');
  console.log('   pnpm preview');
  console.log('   然后访问 http://localhost:3000');
}

main();
