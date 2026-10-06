@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Trình Cài Đặt Fast Video Cutter & Merger Studio v3.1.6 PRO (Next-Next Setup Wizard)
cls

echo ==============================================================
echo    ⚡ FAST VIDEO CUTTER & MERGER STUDIO v3.1.6 PRO
echo    Trình Hướng Dẫn Cài Đặt Đồ Họa Windows (Next-Next Setup Wizard)
echo ==============================================================
echo.

REM 1. Tìm hoặc tự động tích hợp Python
set "PYTHON_CMD="
python --version >nul 2>&1
if not errorlevel 1 set "PYTHON_CMD=python"

if "%PYTHON_CMD%"=="" (
    py -3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if "%PYTHON_CMD%"=="" (
    for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
        if exist "%%~fD\python.exe" set "PYTHON_CMD="%%~fD\python.exe""
    )
)

if "%PYTHON_CMD%"=="" (
    for /d %%D in ("%ProgramFiles%\Python*") do (
        if exist "%%~fD\python.exe" set "PYTHON_CMD="%%~fD\python.exe""
    )
)

if "%PYTHON_CMD%"=="" (
    echo [*] Đang tự động cài đặt Python 3 qua Windows Package Manager...
    winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
    python --version >nul 2>&1 && set "PYTHON_CMD=python"
)

if "%PYTHON_CMD%"=="" (
    echo [LỖI] Cần có Python 3 để chạy trình cài đặt.
    echo Vui lòng tải Python từ https://www.python.org/ (nhớ tick Add Python to PATH).
    pause
    exit /b 1
)

REM 2. Mở Cửa Sổ Trình Hướng Dẫn Cài Đặt Đồ Họa (Next-Next-Install-Finish)
echo [*] Đang mở Trình Cài Đặt Giao Diện Đồ Họa (Setup Wizard Next-Next)...
start "" %PYTHON_CMD% setup_wizard.py
exit /b 0
