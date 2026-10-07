@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.2.2 - 1-Click Setup Builder
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.2.2 PRO
echo    1-Click Windows Setup Builder (PyInstaller + Inno Setup)
echo ==============================================================
echo.

set "PYTHON_EXE="
python --version >nul 2>&1
if not errorlevel 1 set "PYTHON_EXE=python"

if "%PYTHON_EXE%"=="" (
    py -3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_EXE=py -3"
)

if "%PYTHON_EXE%"=="" (
    for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
        if exist "%%~fD\python.exe" set "PYTHON_EXE=%%~fD\python.exe"
    )
)

if "%PYTHON_EXE%"=="" (
    for /d %%D in ("%ProgramFiles%\Python*") do (
        if exist "%%~fD\python.exe" set "PYTHON_EXE=%%~fD\python.exe"
    )
)

if not "%PYTHON_EXE%"=="" (
    echo [*] Python phat hien: %PYTHON_EXE%
    echo [*] Kiem tra va cai dat PyInstaller...
    %PYTHON_EXE% -m pip install pyinstaller pillow tkinterdnd2 windnd --quiet --disable-pip-version-check >nul 2>&1
    
    echo [*] Dang bien dich PyInstaller sang thu muc dist\FastVideoEditor...
    %PYTHON_EXE% -m PyInstaller --noconfirm --onedir --windowed --name "FastVideoEditor" --icon "icon.ico" fast_video_editor.py
    
    if exist "dist\FastVideoEditor" (
        echo [*] Sao chep cac file phu tro vao thu muc dist\FastVideoEditor...
        copy /y "icon.ico" "dist\FastVideoEditor\" >nul 2>&1
        copy /y "icon.png" "dist\FastVideoEditor\" >nul 2>&1
        copy /y "fast-video-editor.png" "dist\FastVideoEditor\" >nul 2>&1
        copy /y "run_windows.bat" "dist\FastVideoEditor\" >nul 2>&1
        copy /y "setup_wizard.py" "dist\FastVideoEditor\" >nul 2>&1
        copy /y "README.txt" "dist\FastVideoEditor\" >nul 2>&1
        copy /y "README.md" "dist\FastVideoEditor\" >nul 2>&1
    )
)

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
if not exist "Output" mkdir "Output"
"%ISCC_PATH%" installer_windows.iss
if errorlevel 1 (
    echo [ERROR] Compilation failed.
    pause
    exit /b 1
)

if exist "Output\FastVideoEditor_v3.2.2_Setup.exe" (
    if not exist "dist" mkdir "dist"
    copy /y "Output\FastVideoEditor_v3.2.2_Setup.exe" "dist\FastVideoEditor_Setup_v3.2.2.exe" >nul 2>&1
)

echo.
echo ==============================================================
echo [SUCCESS] Windows Setup Package Created Successfully!
echo Output: Output\FastVideoEditor_v3.2.2_Setup.exe
echo Copy:   dist\FastVideoEditor_Setup_v3.2.2.exe
echo ==============================================================
pause
