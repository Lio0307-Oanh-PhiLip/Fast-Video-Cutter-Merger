@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.6 - 1-Click Setup Builder
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.1.6 PRO
echo    1-Click Setup Builder [Inno Setup + PyInstaller]
echo ==============================================================
echo.

set "PYTHON_CMD="

python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=python"
    goto :RUN_BUILD
)

py -3 --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=py -3"
    goto :RUN_BUILD
)

for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_CMD=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :RUN_BUILD
    )
)

for /d %%D in ("%ProgramFiles%\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_CMD=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :RUN_BUILD
    )
)

echo [*] Dang tu dong cai dat Python qua winget...
winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
python --version >nul 2>&1 && set "PYTHON_CMD=python"

:RUN_BUILD
if "%PYTHON_CMD%"=="" (
    echo [ERROR] Khong tim thay Python. Vui long cai dat Python 3.9+ tu https://python.org
    pause
    exit /b 1
)

echo [OK] Su dung Python: %PYTHON_CMD%
echo.
%PYTHON_CMD% build_installer.py

echo.
pause
