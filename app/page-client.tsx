/**
 * 根路径页面客户端组件
 * 用于处理客户端重定向
 */

'use client';

import { useEffect } from 'react';

export default function RootPageClient() {
  useEffect(() => {
    // 立即重定向到默认语言（中文）
    window.location.replace('/zh/');
  }, []);

  // 显示加载状态（在重定向前）
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '16px',
      color: '#666',
    }}>
      正在跳转...
    </div>
  );
}
