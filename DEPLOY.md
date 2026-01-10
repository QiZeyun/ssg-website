# 部署指南

## GitHub Actions 自动部署到 Vercel

### 快速开始

#### 1. 在 Vercel 创建项目（如果还没有）

访问 [Vercel Dashboard](https://vercel.com/dashboard) 并创建新项目：

1. 点击 "Add New Project"
2. 导入 GitHub 仓库：`QiZeyun/ssg-website`
3. 配置构建设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `out`
   - **Install Command**: `pnpm install`
4. 点击 "Deploy" 完成首次部署

#### 2. 获取 Vercel 配置信息

部署完成后，获取以下信息：

**方法 1：从 Vercel Dashboard**
1. 进入项目设置 (Project Settings)
2. 在 **General** 页面找到：
   - **Organization ID** (在页面顶部显示)
   - **Project ID** (在项目信息中)

**方法 2：使用 Vercel CLI**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目目录中初始化（如果还没有）
cd /Users/mac/codes/ssg-website
vercel

# 查看项目配置（包含项目 ID 和组织 ID）
cat .vercel/project.json
```

#### 3. 配置 GitHub Secrets

访问 GitHub 仓库设置：`https://github.com/QiZeyun/ssg-website/settings/secrets/actions`

添加以下 Secrets：

| Secret 名称 | 描述 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel API Token | [Vercel Settings > Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel 组织/团队 ID | 项目设置 > General > Organization ID |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | 项目设置 > General > Project ID |

**可选环境变量**（用于构建时使用）：
- `NEXT_PUBLIC_SITE_URL` - 网站 URL
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Google 验证码
- `NEXT_PUBLIC_YANDEX_VERIFICATION` - Yandex 验证码
- `NEXT_PUBLIC_YAHOO_VERIFICATION` - Yahoo 验证码

### 工作流说明

#### 触发条件
- **生产部署**：当代码推送到 `main` 分支时自动触发
- **预览部署**：当创建 Pull Request 到 `main` 分支时创建预览部署

#### 工作流步骤
1. ✅ 检出代码
2. ✅ 设置 pnpm (v9.0.0)
3. ✅ 设置 Node.js (v20)
4. ✅ 安装依赖
5. ✅ 运行类型检查
6. ✅ 运行代码检查 (ESLint)
7. ✅ 构建项目 (Next.js 静态导出)
8. ✅ 部署到 Vercel

### 验证部署

部署完成后：
1. 访问 GitHub Actions 页面查看部署状态：`https://github.com/QiZeyun/ssg-website/actions`
2. 在 Vercel Dashboard 查看部署日志
3. 访问生产网站 URL

### 故障排查

#### 部署失败
- ✅ 检查 GitHub Secrets 是否已正确配置
- ✅ 确认 `VERCEL_TOKEN` 有效且未过期
- ✅ 验证 `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID` 是否正确
- ✅ 查看 GitHub Actions 日志获取详细错误信息

#### 构建失败
- ✅ 确保 `pnpm-lock.yaml` 已提交到仓库
- ✅ 检查 `next.config.js` 配置是否正确
- ✅ 确认所有依赖都正确安装
- ✅ 查看构建日志中的具体错误

#### 部署后网站异常
- ✅ 检查环境变量是否正确配置
- ✅ 确认 SEO 配置文件 `data/seo-config.json` 存在
- ✅ 验证 `NEXT_PUBLIC_SITE_URL` 是否设置正确

### 手动部署（如果需要）

如果自动部署有问题，可以手动部署：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 部署到 Vercel
vercel --prod
```

### 相关链接

- [GitHub Actions 工作流文件](.github/workflows/deploy.yml)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Actions 页面](https://github.com/QiZeyun/ssg-website/actions)
