@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.2.0 - Launcher
cls

echo ==============================================================
echo    Fast Video Cutter and Merger Studio v3.2.0 PRO (Windows)
echo    Lossless Stream Copy Engine - Zero Re-encode Delay
echo ==============================================================
echo.

if exist "FastVideoEditor.exe" (
    echo [*] Dang khoi chay FastVideoEditor.exe...
    start "" "FastVideoEditor.exe" %*
    exit /b 0
)

if exist "dist\FastVideoEditor\FastVideoEditor.exe" (
    echo [*] Dang khoi chay tu dist\FastVideoEditor\FastVideoEditor.exe...
    start "" "dist\FastVideoEditor\FastVideoEditor.exe" %*
    exit /b 0
)

set "PYTHON_EXE="
set "PYTHON_ARGS="

python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=python"
    goto :PY_FOUND
)
py -3 --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=py"
    set PYTHON_ARGS=-3
    goto :PY_FOUND
)
for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_FOUND
    )
)
for /d %%D in ("%ProgramFiles%\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_FOUND
    )
)

echo [*] Dang tu dong cai dat Python qua winget...
winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
python --version >nul 2>&1 && set "PYTHON_EXE=python"

:PY_FOUND
if "%PYTHON_EXE%"=="" (
    echo [ERROR] Khong tim thay Python. Vui long cai dat Python tu https://python.org
    pause
    exit /b 1
)

"%PYTHON_EXE%" -c "import tkinterdnd2, windnd" >nul 2>&1
if errorlevel 1 (
    echo [*] Cai dat bo sung thu vien keo tha video (tkinterdnd2, windnd)...
    "%PYTHON_EXE%" -m pip install tkinterdnd2 windnd --quiet --disable-pip-version-check >nul 2>&1
)

echo [OK] Su dung Python: %PYTHON_EXE% %PYTHON_ARGS%
"%PYTHON_EXE%" %PYTHON_ARGS% fast_video_editor.py %*
