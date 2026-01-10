/**
 * 根布局
 * 中间件会处理根路径的重定向到默认语言
 * 这里只需要提供一个基本的 HTML 结构作为后备
 */

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 根路径会通过 middleware 重定向到默认语言
  // 这里只是提供一个基本的 HTML 结构
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
