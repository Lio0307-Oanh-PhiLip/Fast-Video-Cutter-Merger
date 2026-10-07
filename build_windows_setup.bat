@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.9 - 1-Click Setup Builder
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.1.9 PRO
echo    1-Click Windows Setup Builder (Inno Setup)
echo ==============================================================
echo.

set "ISCC_PATH="
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
    goto :RUN_BUILD
)
if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=%ProgramFiles%\Inno Setup 6\ISCC.exe"
    goto :RUN_BUILD
)
if exist "%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe"
    goto :RUN_BUILD
)
where iscc.exe >nul 2>&1
if not errorlevel 1 (
    set "ISCC_PATH=iscc.exe"
    goto :RUN_BUILD
)

echo [*] Installing Inno Setup 6 silently via winget...
winget install JRSoftware.InnoSetup --silent --accept-source-agreements --accept-package-agreements >nul 2>&1

if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
    goto :RUN_BUILD
)

if "%ISCC_PATH%"=="" (
    echo [ERROR] Inno Setup is required. Download from https://jrsoftware.org/isdl.php
    pause
    exit /b 1
)

:RUN_BUILD
echo [*] Compiling Inno Setup Script: installer_windows.iss...
"%ISCC_PATH%" installer_windows.iss
if errorlevel 1 (
    echo [ERROR] Compilation failed.
    pause
    exit /b 1
)

echo.
echo ==============================================================
echo [SUCCESS] Windows Setup Package Created Successfully!
echo Output: dist\FastVideoEditor_Setup_v3.1.9.exe
echo ==============================================================
pause
