#!/usr/bin/env node

/**
 * 构建产物预览脚本
 * 使用 serve 启动本地 HTTP 服务器预览构建产物
 */

import { existsSync } from 'fs';
import { execSync, spawn } from 'child_process';

const OUT_DIR = 'out';

/**
 * 检查端口是否被占用
 */
function isPortInUse(port: number): boolean {
  try {
    execSync(`lsof -Pi :${port} -sTCP:LISTEN -t`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * 查找可用端口
 */
function findAvailablePort(startPort: number): number {
  let port = startPort;
  while (isPortInUse(port) && port < startPort + 100) {
    port++;
  }
  return port;
}

/**
 * 运行构建命令
 */
function buildProject(): boolean {
  console.log('🔨 正在构建项目...');
  try {
    execSync('pnpm build', { stdio: 'inherit' });
    return true;
  } catch {
    console.log('❌ 构建失败，请检查错误信息');
    return false;
  }
}

/**
 * 启动 serve 服务器
 */
function startServer(port: number): void {
  console.log('✅ 使用 serve 启动 HTTP 服务器');
  
  // 使用 pnpm exec 来运行 serve（确保使用项目依赖中的 serve）
  const serveProcess = spawn('pnpm', ['exec', 'serve', '-p', port.toString(), OUT_DIR], {
    stdio: 'inherit',
    shell: true,
  });
  
  // 处理进程退出
  serveProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log(`\n❌ 服务器异常退出，退出码: ${code}`);
      process.exit(code);
    }
  });
  
  // 处理错误
  serveProcess.on('error', (error) => {
    console.error('❌ 启动服务器失败:', error);
    console.log('\n请确保已安装 serve: pnpm add -D serve');
    process.exit(1);
  });
}

/**
 * 主函数
 */
function main(): void {
  const args = process.argv.slice(2);
  const requestedPort = args[0] ? parseInt(args[0], 10) : 3000;
  
  console.log('🚀 启动本地预览服务器...');
  console.log('');
  
  // 检查 out 目录是否存在
  if (!existsSync(OUT_DIR)) {
    console.log('❌ out 目录不存在，正在构建...');
    if (!buildProject()) {
      process.exit(1);
    }
  }
  
  // 检查并查找可用端口
  let port = requestedPort;
  if (isPortInUse(port)) {
    console.log(`⚠️  端口 ${port} 已被占用，尝试使用其他端口...`);
    port = findAvailablePort(port + 1);
  }
  
  console.log(`📦 构建产物目录: ${OUT_DIR}/`);
  console.log(`🌐 预览地址: http://localhost:${port}`);
  console.log('');
  console.log('💡 提示:');
  console.log('  - 按 Ctrl+C 停止服务器');
  console.log(`  - 访问 http://localhost:${port} 查看主页`);
  console.log(`  - 访问 http://localhost:${port}/about/ 查看关于页面`);
  console.log(`  - 访问 http://localhost:${port}/contact/ 查看联系页面`);
  console.log(`  - 访问 http://localhost:${port}/sitemap.xml 查看 sitemap`);
  console.log(`  - 访问 http://localhost:${port}/robots.txt 查看 robots.txt`);
  console.log('');
  
  // 启动服务器
  startServer(port);
}

// 运行主函数
main();
