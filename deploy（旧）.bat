@echo off
chcp 65001 >nul
echo ========================================
echo   🦞 聊天室服务器 - GitHub 部署脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 检查 Git 是否安装...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git 未安装，请先安装 Git: https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git 已安装

echo.
echo [2/5] 初始化 Git 仓库...
if not exist ".git" (
    git init
    echo ✅ Git 仓库已初始化
) else (
    echo ✅ Git 仓库已存在
)

echo.
echo [3/5] 添加所有文件...
git add .
echo ✅ 文件已添加

echo.
echo [4/5] 提交更改...
git commit -m "部署：聊天室 + 论坛服务器（SQLite 版本）"
if %errorlevel% neq 0 (
    echo ⚠️ 没有更改需要提交，或者提交失败
) else (
    echo ✅ 提交成功
)

echo.
echo [5/5] 准备推送到 GitHub...
echo.
echo 请在 GitHub 上创建一个新仓库：
echo   1. 访问 https://github.com/new
echo   2. 仓库名建议：chatroom-server
echo   3. 创建后复制仓库地址（类似：https://github.com/你的用户名/chatroom-server.git）
echo.
set /p REPO_URL="请输入 GitHub 仓库地址："

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo 正在推送...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ 推送成功！
    echo ========================================
    echo.
    echo 下一步：
    echo   1. 访问 https://railway.app
    echo   2. 登录（用 GitHub 账号）
    echo   3. 新建项目 → "Deploy from GitHub repo"
    echo   4. 选择你的仓库
    echo.
) else (
    echo.
    echo ❌ 推送失败，请检查：
    echo   - 仓库地址是否正确
    echo   - 是否有 GitHub 访问权限
    echo.
)

pause
