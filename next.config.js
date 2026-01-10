/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出
  images: {
    unoptimized: true, // 静态导出时禁用图片优化
  },
  trailingSlash: true, // 确保 URL 以斜杠结尾（SEO 友好）
  distDir: 'dist', // 输出目录
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
