#!/bin/bash

# 构建产物验证脚本

echo "🔍 开始验证构建产物..."
echo ""

# 检查 out 目录是否存在
if [ ! -d "out" ]; then
    echo "❌ out 目录不存在，请先运行 pnpm build"
    exit 1
fi

echo "✅ out 目录存在"
echo ""

# 检查关键文件
echo "📄 检查关键文件..."
files=(
    "out/index.html:主页"
    "out/about/index.html:关于页面"
    "out/contact/index.html:联系页面"
    "out/robots.txt:Robots.txt"
    "out/sitemap.xml:Sitemap"
)

all_files_exist=true
for file_info in "${files[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "  ✅ $desc: $file ($size)"
    else
        echo "  ❌ $desc: $file 不存在"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo "❌ 部分关键文件缺失，验证失败"
    exit 1
fi

echo ""

# 检查静态资源目录
echo "📦 检查静态资源..."
if [ -d "out/_next/static" ]; then
    static_size=$(du -sh out/_next/static | cut -f1)
    echo "  ✅ 静态资源目录存在 ($static_size)"
else
    echo "  ⚠️  静态资源目录不存在"
fi

echo ""

# 检查 HTML 内容
echo "🔍 验证 HTML 内容..."

# 检查主页是否包含 title
if grep -q "<title>" out/index.html; then
    title=$(grep -o '<title>[^<]*</title>' out/index.html | sed 's/<[^>]*>//g')
    echo "  ✅ index.html 包含 title 标签: $title"
else
    echo "  ❌ index.html 缺少 title 标签"
fi

# 检查主页是否包含 description
if grep -q 'name="description"' out/index.html; then
    echo "  ✅ index.html 包含 description meta 标签"
else
    echo "  ⚠️  index.html 缺少 description meta 标签"
fi

# 检查 Open Graph 标签
if grep -q 'property="og:' out/index.html; then
    echo "  ✅ index.html 包含 Open Graph 标签"
else
    echo "  ⚠️  index.html 缺少 Open Graph 标签"
fi

echo ""

# 检查 sitemap
echo "🗺️  验证 Sitemap..."
if grep -q "<url>" out/sitemap.xml; then
    url_count=$(grep -c "<url>" out/sitemap.xml)
    echo "  ✅ sitemap.xml 包含 $url_count 个 URL"
    
    # 显示所有 URL
    echo "  📋 Sitemap 中的 URL:"
    grep -o '<loc>[^<]*</loc>' out/sitemap.xml | sed 's/<[^>]*>//g' | sed 's/^/    - /'
else
    echo "  ❌ sitemap.xml 缺少 URL"
fi

echo ""

# 检查 robots.txt
echo "🤖 验证 Robots.txt..."
if [ -f "out/robots.txt" ]; then
    echo "  ✅ robots.txt 内容:"
    cat out/robots.txt | sed 's/^/    /'
fi

echo ""

# 统计信息
echo "📊 构建产物统计:"
total_size=$(du -sh out | cut -f1)
html_count=$(find out -name "*.html" | wc -l | tr -d ' ')
echo "  - 总大小: $total_size"
echo "  - HTML 文件数: $html_count"

echo ""
echo "✅ 验证完成！"
echo ""
echo "💡 提示: 使用以下命令预览构建产物:"
echo "   cd out && python3 -m http.server 3000"
echo "   然后访问 http://localhost:3000"
