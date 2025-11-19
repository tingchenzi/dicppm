@echo off
chcp 65001 >nul
echo ========================================
echo   dic-crm3ppm-ui 项目初始化脚本
echo ========================================
echo.

echo [1/5] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 环境正常

echo.
echo [2/5] 检查 npm 环境...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 npm
    pause
    exit /b 1
)
echo ✅ npm 环境正常

echo.
echo [3/5] 安装项目依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

echo.
echo [4/5] 复制源代码...
if exist "scripts\copy-source.js" (
    node scripts\copy-source.js
    if errorlevel 1 (
        echo ⚠️  自动复制失败，请手动复制源代码
        echo    从: ..\crm3.0-Enterprise\src\crm3.0part7-ppm
        echo    到: .\src\crm3.0part7-ppm
    ) else (
        echo ✅ 源代码复制完成
    )
) else (
    echo ⚠️  请手动复制源代码
    echo    从: ..\crm3.0-Enterprise\src\crm3.0part7-ppm
    echo    到: .\src\crm3.0part7-ppm
)

echo.
echo [5/5] 构建插件...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✅ 构建完成

echo.
echo ========================================
echo   🎉 项目初始化完成！
echo ========================================
echo.
echo 接下来你可以:
echo   1. 运行 npm run dev 启动开发服务器
echo   2. 查看 QUICK_START.md 了解下一步操作
echo   3. 查看 docs\DEPLOYMENT.md 了解发布流程
echo.
pause
