@echo off
chcp 65001 >nul
echo ========================================
echo   dic-crm3ppm-ui 发布脚本
echo ========================================
echo.

echo 请选择发布方式:
echo   1. 发布到公共 npm
echo   2. 发布到私有 npm
echo   3. 仅构建（不发布）
echo   4. 退出
echo.
set /p choice="请输入选项 (1-4): "

if "%choice%"=="1" goto public_npm
if "%choice%"=="2" goto private_npm
if "%choice%"=="3" goto build_only
if "%choice%"=="4" goto end
echo 无效选项
goto end

:public_npm
echo.
echo [1/3] 构建插件...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✅ 构建完成

echo.
echo [2/3] 检查 npm 登录状态...
npm whoami >nul 2>&1
if errorlevel 1 (
    echo 请先登录 npm:
    call npm login
)

echo.
echo [3/3] 发布到 npm...
call npm publish
if errorlevel 1 (
    echo ❌ 发布失败
    pause
    exit /b 1
)
echo ✅ 发布成功！
goto end

:private_npm
echo.
set /p registry="请输入私有 npm 地址 (例: http://localhost:4873): "

echo.
echo [1/3] 构建插件...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✅ 构建完成

echo.
echo [2/3] 检查登录状态...
npm whoami --registry=%registry% >nul 2>&1
if errorlevel 1 (
    echo 请先登录私有 npm:
    call npm login --registry=%registry%
)

echo.
echo [3/3] 发布到私有 npm...
call npm publish --registry=%registry%
if errorlevel 1 (
    echo ❌ 发布失败
    pause
    exit /b 1
)
echo ✅ 发布成功！
goto end

:build_only
echo.
echo 开始构建...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✅ 构建完成！
echo 构建产物位于 lib 目录
goto end

:end
echo.
pause
