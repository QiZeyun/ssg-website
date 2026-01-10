# GitHub Actions 工作流说明

## 部署工作流

### 工作流文件
- `.github/workflows/deploy.yml` - 自动构建和部署到 Vercel

### 触发条件
- **生产部署**：当代码推送到 `main` 分支时触发
- **预览部署**：
  - 当代码推送到除 `main` 外的任意分支时触发
  - 当创建 Pull Request 到任意分支时触发

### 工作流步骤
1. **检出代码** - 从 GitHub 仓库获取代码
2. **设置 pnpm** - 配置 pnpm 包管理器（版本 9.0.0）
3. **设置 Node.js** - 配置 Node.js 运行环境（版本 20）
4. **安装依赖** - 使用 pnpm 安装项目依赖
5. **类型检查** - 运行 TypeScript 类型检查
6. **代码检查** - 运行 ESLint 代码检查
7. **构建项目** - 使用 Next.js 构建静态网站
8. **部署到 Vercel** - 将构建产物部署到 Vercel

## 必需的 GitHub Secrets 配置

在 GitHub 仓库设置中需要配置以下 Secrets：

### 1. VERCEL_TOKEN
- 描述：Vercel API Token
- 获取方式：
  1. 访问 [Vercel Settings > Tokens](https://vercel.com/account/tokens)
  2. 创建新的 Token
  3. 复制 Token 值

### 2. VERCEL_ORG_ID
- 描述：Vercel 组织/团队 ID
- 获取方式：
  1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
  2. 在设置中找到 Organization ID
  3. 或者使用 Vercel CLI: `vercel whoami`

### 3. VERCEL_PROJECT_ID
- 描述：Vercel 项目 ID
- 获取方式：
  1. 在 Vercel 项目中，进入项目设置
  2. 在 General 页面中找到 Project ID
  3. 或者从项目的 `.vercel/project.json` 文件中获取

### 4. 可选环境变量（用于构建）
- `NEXT_PUBLIC_SITE_URL` - 网站 URL（如果未设置，默认使用 `https://example.com`）
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Google Search Console 验证码
- `NEXT_PUBLIC_YANDEX_VERIFICATION` - Yandex 验证码
- `NEXT_PUBLIC_YAHOO_VERIFICATION` - Yahoo 验证码

## 配置步骤

### 方法 1：首次部署（推荐）

1. **在 Vercel 创建项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "Add New Project"
   - 导入 GitHub 仓库 `QiZeyun/ssg-website`
   - 配置构建设置：
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `pnpm build`
     - Output Directory: `out`
   - 完成部署

2. **获取项目信息**
   - 部署完成后，在项目设置中找到：
     - Organization ID
     - Project ID

3. **在 GitHub 配置 Secrets**
   - 访问 `https://github.com/QiZeyun/ssg-website/settings/secrets/actions`
   - 添加上述三个必需的 Secrets

### 方法 2：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目目录中初始化 Vercel 项目
cd /Users/mac/codes/ssg-website
vercel

# 这会在 .vercel 目录中创建配置文件
# 查看项目 ID
cat .vercel/project.json
```

## 注意事项

1. **静态导出配置**：项目已配置 `output: 'export'`，会生成纯静态 HTML 文件
2. **构建输出**：构建产物位于 `out` 目录
3. **环境变量**：需要在 Vercel 项目设置中配置生产环境变量
4. **预览部署**：
   - 任意分支 push（除 main 外）会创建预览部署
   - Pull Request 会创建预览部署，不会影响生产环境
5. **生产部署**：只有推送到 `main` 分支时才会触发生产部署

## 故障排查

### 部署失败
- 检查 GitHub Secrets 是否配置正确
- 查看 GitHub Actions 日志获取详细错误信息
- 确认 Vercel 项目 ID 和组织 ID 是否正确
- **Vercel CLI 版本问题**：如果遇到 `--yes` 选项错误，请确保工作流使用最新版本的 Vercel Action（已移除 `--yes` 选项）

### 构建失败
- 检查 `pnpm-lock.yaml` 是否已提交
- 确认所有依赖都已正确安装
- 查看构建日志中的具体错误信息

### 部署后网站异常
- 检查环境变量是否正确配置
- 确认 `next.config.js` 中的静态导出配置正确
- 查看 Vercel 部署日志

### 常见错误

#### `Error! unknown or unexpected option: --yes`
- **原因**：Vercel CLI 25.1.0 及以上版本已移除 `--yes` 选项
- **解决方案**：从 `vercel-args` 中移除 `--yes` 选项
  - 生产部署：使用 `vercel-args: '--prod'`
  - 预览部署：不设置 `vercel-args` 或设置为空
