# SSG Website

一个基于 Next.js 14 的静态站点生成（SSG）项目，具有灵活的 SEO 配置系统和自动化部署流程。

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0-orange)](https://pnpm.io/)

## ✨ 特性

- 🚀 **静态站点生成（SSG）**：基于 Next.js 14 的静态导出，生成纯静态 HTML
- 🔧 **灵活的 SEO 配置系统**：抽象的数据源接口，支持从本地文件、CMS、API 等多种数据源获取 SEO 配置
- 📊 **完整的 SEO 支持**：自动生成 sitemap.xml、robots.txt、结构化数据（JSON-LD）
- 🎨 **现代化 UI**：使用 Tailwind CSS 构建响应式界面
- 🔄 **自动化部署**：GitHub Actions 自动构建并部署到 Vercel
- ✅ **类型安全**：完整的 TypeScript 类型定义
- 🧪 **本地验证工具**：自动验证构建产物，确保部署前质量

## 🛠️ 技术栈

- **框架**: Next.js 14.2
- **语言**: TypeScript 5.3
- **样式**: Tailwind CSS 3.4
- **包管理器**: pnpm 9.0
- **部署**: Vercel
- **CI/CD**: GitHub Actions

## 📦 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9.0

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/QiZeyun/ssg-website.git
cd ssg-website

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

### 构建项目

```bash
# 构建生产版本
pnpm build

# 构建产物位于 out/ 目录
```

### 验证构建产物

```bash
# 验证构建产物
pnpm validate

# 本地预览构建产物
pnpm preview

# 一键构建+验证+预览
pnpm build:preview
```

## 📁 项目结构

```
ssg-website/
├── app/                    # Next.js App Router 页面
│   ├── about/             # 关于页面
│   ├── contact/           # 联系页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页
│   ├── robots.ts          # Robots.txt 生成
│   └── sitemap.ts         # Sitemap 生成
├── components/            # React 组件
│   ├── ContactForm.tsx    # 联系表单
│   └── StructuredData.tsx # 结构化数据组件
├── data/                  # 数据文件
│   ├── seo-config.json    # SEO 配置文件
│   └── README.md          # SEO 配置说明
├── lib/                   # 工具库
│   └── seo/               # SEO 相关工具
│       ├── config/        # SEO 配置系统
│       │   ├── interface.ts  # 数据源接口
│       │   ├── types.ts      # 类型定义
│       │   ├── file-source.ts # 本地文件数据源
│       │   └── index.ts      # 导出入口
│       └── seo.ts         # SEO 工具函数
├── scripts/               # 脚本文件
│   ├── validate-build.sh  # 构建验证脚本
│   └── preview-build.sh   # 预览脚本
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 工作流
├── out/                   # 构建产物目录（不提交）
└── package.json
```

## ⚙️ SEO 配置系统

### 概述

本项目使用抽象的数据源接口来管理 SEO 配置，当前实现是从本地 JSON 文件读取配置，未来可以轻松扩展为从 CMS、API、数据库等获取配置。

### 配置文件

配置文件位置：`data/seo-config.json`

配置文件包含以下部分：

1. **global** - 全局 SEO 配置
   - 网站名称、URL、描述
   - Open Graph 默认配置
   - Twitter Card 默认配置
   - 搜索引擎验证码

2. **pages** - 页面级别的 SEO 配置
   - 每个页面的标题、描述、关键词
   - 页面特定的 Open Graph 配置
   - 页面特定的 Twitter Card 配置

3. **sitemap** - Sitemap 配置
   - 页面列表、优先级、更新频率

4. **robots** - Robots.txt 配置
   - 爬虫规则、允许/禁止的路径

### 环境变量

可以通过环境变量覆盖配置：

- `NEXT_PUBLIC_SITE_URL` - 网站基础 URL
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Google 验证码
- `NEXT_PUBLIC_YANDEX_VERIFICATION` - Yandex 验证码
- `NEXT_PUBLIC_YAHOO_VERIFICATION` - Yahoo 验证码
- `NEXT_PUBLIC_SEO_DATA_SOURCE` - 数据源类型（默认：`file`）

### 使用示例

```typescript
// 在页面中使用
import { generateMetadataFromPath } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromPath('/about');
}
```

详细说明请参考 [data/README.md](data/README.md)

## 🧪 本地验证

### 验证构建产物

项目提供了自动化验证脚本，可以检查构建产物是否符合预期：

```bash
# 验证构建产物
pnpm validate
```

验证脚本会检查：
- ✅ 关键文件是否存在（HTML、robots.txt、sitemap.xml）
- ✅ SEO 标签是否正确（title、description、Open Graph）
- ✅ Sitemap 和 Robots.txt 内容
- ✅ 构建产物统计信息

### 本地预览

```bash
# 预览构建产物
pnpm preview

# 访问 http://localhost:3000
```

详细验证指南请参考 [VALIDATE.md](VALIDATE.md)

## 🚀 部署

### 自动部署（推荐）

项目配置了 GitHub Actions 工作流，当代码推送到 `main` 分支时会自动构建并部署到 Vercel。

#### 配置步骤

1. **在 Vercel 创建项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 导入 GitHub 仓库
   - 配置构建设置：
     - Framework Preset: Next.js
     - Build Command: `pnpm build`
     - Output Directory: `out`
     - Install Command: `pnpm install`

2. **配置 GitHub Secrets**
   
   访问 `https://github.com/QiZeyun/ssg-website/settings/secrets/actions`
   
   添加以下 Secrets：
   - `VERCEL_TOKEN` - Vercel API Token
   - `VERCEL_ORG_ID` - Vercel 组织 ID
   - `VERCEL_PROJECT_ID` - Vercel 项目 ID

3. **推送代码**
   ```bash
   git push origin main
   ```
   
   推送后，GitHub Actions 会自动触发构建和部署。

### 手动部署

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 部署到 Vercel
vercel --prod
```

详细部署指南请参考 [DEPLOY.md](DEPLOY.md)

## 📝 可用脚本

| 脚本 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器（需要先构建） |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm type-check` | 运行 TypeScript 类型检查 |
| `pnpm validate` | 验证构建产物 |
| `pnpm preview` | 预览构建产物 |
| `pnpm build:preview` | 构建 + 验证 + 预览 |

## 🔧 配置说明

### Next.js 配置

`next.config.js` 中配置了静态导出：

```javascript
{
  output: 'export',        // 启用静态导出
  images: {
    unoptimized: true      // 静态导出时禁用图片优化
  },
  trailingSlash: true      // URL 以斜杠结尾（SEO 友好）
}
```

### TypeScript 配置

项目使用 TypeScript，配置文件为 `tsconfig.json`。

### Tailwind CSS 配置

样式使用 Tailwind CSS，配置文件为 `tailwind.config.js`。

## 📚 相关文档

- [部署指南](DEPLOY.md) - 详细的部署说明和故障排查
- [验证指南](VALIDATE.md) - 本地验证构建产物的完整指南
- [SEO 配置说明](data/README.md) - SEO 配置系统的详细文档
- [GitHub Actions 工作流](.github/workflows/README.md) - CI/CD 工作流说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [GitHub 仓库](https://github.com/QiZeyun/ssg-website)

## ⚠️ 注意事项

1. **配置文件缓存**：SEO 配置文件会在首次加载时缓存，修改后需要重启开发服务器才能生效
2. **构建产物**：构建产物位于 `out/` 目录，已添加到 `.gitignore`
3. **环境变量**：生产环境需要在 Vercel 项目设置中配置环境变量
4. **静态导出限制**：使用静态导出时，某些 Next.js 功能不可用（如 API Routes、Server Components 的动态功能）

## 🆘 故障排查

### 构建失败

```bash
# 清理缓存并重新构建
rm -rf .next out dist
pnpm build
```

### 部署失败

- 检查 GitHub Secrets 是否配置正确
- 查看 GitHub Actions 日志获取详细错误信息
- 确认 `pnpm-lock.yaml` 已提交到仓库

### 页面内容不正确

- 检查 `data/seo-config.json` 配置是否正确
- 确认页面组件正确使用 `generateMetadata`
- 验证环境变量是否正确设置

更多故障排查信息请参考 [DEPLOY.md](DEPLOY.md) 和 [VALIDATE.md](VALIDATE.md)
