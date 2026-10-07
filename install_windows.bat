@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.2.3 PRO Setup Wizard
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.2.3 PRO
echo    Windows Setup Wizard
echo ==============================================================
echo.

set "PYTHON_CMD="
python --version >nul 2>&1
if not errorlevel 1 set "PYTHON_CMD=python"

if "%PYTHON_CMD%"=="" (
    py -3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if "%PYTHON_CMD%"=="" (
    for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
        if exist "%%~fD\python.exe" set "PYTHON_CMD=%%~fD\python.exe"
    )
)

if "%PYTHON_CMD%"=="" (
    for /d %%D in ("%ProgramFiles%\Python*") do (
        if exist "%%~fD\python.exe" set "PYTHON_CMD=%%~fD\python.exe"
    )
)

if "%PYTHON_CMD%"=="" (
    echo [*] Installing Python 3 via Windows Package Manager...
    winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
    python --version >nul 2>&1 && set "PYTHON_CMD=python"
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python 3 is required to run the installer.
    echo Please install Python 3 from https://www.python.org/
    pause
    exit /b 1
)

echo [*] Launching Setup Wizard...
start "" "%PYTHON_CMD%" setup_wizard.py
exit /b 0
