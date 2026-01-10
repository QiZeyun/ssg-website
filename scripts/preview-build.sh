#!/bin/bash

# 构建产物预览脚本

echo "🚀 启动本地预览服务器..."
echo ""

# 检查 out 目录是否存在
if [ ! -d "out" ]; then
    echo "❌ out 目录不存在，正在构建..."
    pnpm build
    
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败，请检查错误信息"
        exit 1
    fi
fi

# 检查端口是否被占用
PORT=${1:-3000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 已被占用，尝试使用其他端口..."
    PORT=3001
fi

echo "📦 构建产物目录: out/"
echo "🌐 预览地址: http://localhost:$PORT"
echo ""
echo "💡 提示:"
echo "  - 按 Ctrl+C 停止服务器"
echo "  - 访问 http://localhost:$PORT 查看主页"
echo "  - 访问 http://localhost:$PORT/about/ 查看关于页面"
echo "  - 访问 http://localhost:$PORT/contact/ 查看联系页面"
echo "  - 访问 http://localhost:$PORT/sitemap.xml 查看 sitemap"
echo "  - 访问 http://localhost:$PORT/robots.txt 查看 robots.txt"
echo ""

# 启动 HTTP 服务器
cd out

# 尝试使用 Python 3
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python 3 HTTP 服务器"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python HTTP 服务器"
    python -m SimpleHTTPServer $PORT 2>/dev/null || python -m http.server $PORT
elif command -v npx &> /dev/null; then
    echo "✅ 使用 npx serve"
    npx serve -p $PORT .
else
    echo "❌ 未找到可用的 HTTP 服务器"
    echo "请安装以下任一工具："
    echo "  - Python 3: brew install python3"
    echo "  - serve: npm install -g serve"
    exit 1
fi
