/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' 只在生产构建时生效，开发模式下不使用
  // 这样可以避免开发模式下的 webpack 兼容性问题
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  images: {
    unoptimized: true, // 静态导出时禁用图片优化
  },
  trailingSlash: true, // 确保 URL 以斜杠结尾（SEO 友好）
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
