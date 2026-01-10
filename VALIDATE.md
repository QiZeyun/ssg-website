# 本地验证构建产物指南

## 快速验证步骤

### 1. 清理并重新构建

```bash
# 清理旧的构建产物和缓存
rm -rf .next out dist

# 重新构建
pnpm build
```

### 2. 检查构建产物

构建成功后，检查 `out` 目录的内容：

```bash
# 查看构建产物目录结构
tree out -L 2

# 或使用 ls
ls -la out/

# 检查 HTML 文件
find out -name "*.html"

# 检查静态资源
ls -lh out/_next/static/
```

### 3. 验证关键文件

#### ✅ 必须存在的文件

```bash
# 根路径（重定向）
out/index.html

# 主页（多语言）
out/zh/index.html
out/en/index.html

# 动态内容页面（从 Markdown 生成，如 about）
out/zh/about/index.html
out/en/about/index.html

# 固定路由页面
out/zh/contact/index.html
out/zh/pricing/index.html
out/en/contact/index.html
out/en/pricing/index.html

# SEO 文件
out/robots.txt
out/sitemap.xml

# 静态资源
out/_next/static/
```

#### ✅ 验证 sitemap.xml

```bash
cat out/sitemap.xml
```

应该包含所有页面的 URL，例如：
- `/zh/`（中文主页）
- `/en/`（英文主页）
- `/zh/about/`（从 Markdown 生成）
- `/zh/contact/`（固定路由）
- `/zh/pricing/`（固定路由）

#### ✅ 验证 robots.txt

```bash
cat out/robots.txt
```

应该包含：
- 允许爬虫的规则
- Sitemap 的 URL

### 4. 本地预览构建产物

#### 方法 1：使用 Python HTTP 服务器（推荐）

```bash
# Python 3
cd out
python3 -m http.server 3000

# 或指定端口
python3 -m http.server 8080

# 访问 http://localhost:3000
```

#### 方法 2：使用 Node.js http-server

```bash
# 安装 http-server（如果还没有）
npm install -g http-server

# 启动服务器
cd out
http-server -p 3000

# 访问 http://localhost:3000
```

#### 方法 3：使用 serve

```bash
# 安装 serve
npm install -g serve

# 启动服务器
cd out
serve -p 3000

# 访问 http://localhost:3000
```

### 5. 验证清单

使用以下清单验证构建产物：

#### 📄 文件结构验证

- [ ] `out/index.html` 存在（根路径重定向）
- [ ] `out/zh/index.html` 存在（中文主页）
- [ ] `out/en/index.html` 存在（英文主页，如果支持）
- [ ] `out/zh/about/index.html` 存在（从 Markdown 生成的内容页面）
- [ ] `out/zh/contact/index.html` 存在（固定路由页面）
- [ ] `out/zh/pricing/index.html` 存在（固定路由页面）
- [ ] `out/robots.txt` 存在
- [ ] `out/sitemap.xml` 存在
- [ ] `out/_next/static/` 目录存在且包含资源

#### 🔍 SEO 验证

- [ ] 每个 HTML 文件包含正确的 `<title>` 标签
- [ ] 每个 HTML 文件包含 `<meta name="description">` 标签
- [ ] Open Graph 标签正确（`<meta property="og:*">`）
- [ ] Twitter Card 标签正确（`<meta name="twitter:*">`）
- [ ] Canonical URL 正确
- [ ] Sitemap 包含所有页面 URL
- [ ] Robots.txt 配置正确

#### 🎨 内容验证

- [ ] 页面内容正确渲染
- [ ] 样式（CSS）正确加载
- [ ] 图片和资源正确加载
- [ ] 导航链接正确工作
- [ ] 表单功能正常（如果有）

#### ⚡ 性能验证

- [ ] HTML 文件大小合理（< 100KB）
- [ ] 静态资源已压缩
- [ ] 图片已优化（如果使用了 Next.js Image）

## 自动化验证脚本

创建 `scripts/validate-build.sh` 脚本：

```bash
#!/bin/bash

echo "🔍 验证构建产物..."

# 检查 out 目录是否存在
if [ ! -d "out" ]; then
    echo "❌ out 目录不存在，请先运行 pnpm build"
    exit 1
fi

# 检查关键文件
files=(
    "out/index.html"
    "out/about/index.html"
    "out/contact/index.html"
    "out/robots.txt"
    "out/sitemap.xml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查 HTML 内容
echo ""
echo "📄 验证 HTML 内容..."

# 检查主页是否包含 title
if grep -q "<title>" out/index.html; then
    echo "✅ index.html 包含 title 标签"
else
    echo "❌ index.html 缺少 title 标签"
fi

# 检查 sitemap 是否包含 URL
if grep -q "<url>" out/sitemap.xml; then
    echo "✅ sitemap.xml 包含 URL"
else
    echo "❌ sitemap.xml 缺少 URL"
fi

echo ""
echo "✅ 验证完成！"
```

使用脚本：

```bash
chmod +x scripts/validate-build.sh
./scripts/validate-build.sh
```

## 常见问题排查

### 问题 1：构建产物为空或缺失

**解决方案：**
```bash
# 清理缓存并重新构建
rm -rf .next out dist
pnpm build
```

### 问题 2：页面内容不正确

**检查：**
- SEO 配置文件 `data/seo-config.json` 是否正确
- 页面组件是否正确使用 `generateMetadata`
- 环境变量是否正确设置

### 问题 3：静态资源 404

**检查：**
- `next.config.js` 中 `output: 'export'` 配置正确
- 静态资源路径是否正确
- `trailingSlash` 配置是否与路由匹配

### 问题 4：Sitemap 或 Robots 不正确

**检查：**
- `app/sitemap.ts` 和 `app/robots.ts` 是否正确
- SEO 配置文件中的 sitemap 和 robots 配置

## 预览不同环境

### 生产环境预览

```bash
# 设置生产环境变量
export NEXT_PUBLIC_SITE_URL=https://yourdomain.com
pnpm build

# 预览
cd out
python3 -m http.server 3000
```

### 开发环境预览

```bash
# 使用开发服务器（非静态导出）
pnpm dev
```

## 与 Vercel 部署对比

部署到 Vercel 后，对比本地构建产物与线上版本：

1. **文件结构**：本地 `out` 目录应该与 Vercel 部署后的文件结构一致
2. **URL 路径**：确保路径正确（trailingSlash 配置）
3. **SEO 标签**：对比 HTML 中的 meta 标签
4. **性能**：检查文件大小和加载速度

## 相关命令

```bash
# 构建
pnpm build

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 开发模式（非静态）
pnpm dev

# 清理构建产物
rm -rf .next out dist
```

## 提示

- 🔄 每次修改 SEO 配置后，需要重新构建
- 📦 提交代码前，建议先本地验证构建产物
- 🚀 部署前，使用本地预览验证所有页面
- 🧪 定期检查构建产物大小，确保没有意外包含大文件
