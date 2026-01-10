/**
 * Next.js 中间件
 * 用于处理多语言路由和重定向
 * 
 * 注意：此文件在 Edge Runtime 中运行，不能使用 Node.js 特定的模块
 * 因此将必要的常量直接定义在此文件中，避免导入其他模块
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 支持的语言列表（在 Edge Runtime 中直接定义，避免导入）
const supportedLocales = ['zh', 'en'] as const;
type SupportedLocale = typeof supportedLocales[number];

// 默认语言
const defaultLocale: SupportedLocale = 'zh';

// 检查语言是否支持
function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径是根路径，重定向到默认语言
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
    );
  }

  // 如果路径没有语言前缀，但也不是静态文件，则重定向到默认语言版本
  if (!pathnameHasLocale && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    // 检查是否请求的是静态资源
    const isStaticAsset = pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/);
    
    if (!isStaticAsset) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 静态文件扩展名
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
