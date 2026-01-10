/**
 * 根路径页面
 * 用于处理静态导出时的重定向
 * 
 * 注意：静态导出不支持 middleware，因此使用客户端重定向来处理根路径
 * 使用 useEffect 和 window.location 进行客户端重定向
 */

import type { Metadata } from 'next';
import RootPageClient from './page-client';

/**
 * 生成根路径页面的 SEO Metadata
 * 
 * 注意：此页面仅用于重定向，SEO 元数据将被重定向后的页面覆盖
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Redirecting...',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RootPage() {
  return <RootPageClient />;
}
