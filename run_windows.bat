@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.5 - Launcher
cls

echo ==============================================================
echo    Fast Video Cutter and Merger Studio v3.1.5 PRO (Windows)
echo    Lossless Stream Copy Engine - Zero Re-encode Delay
echo ==============================================================
echo.

REM 1. Uu tien khoi chay ban Standalone Exe neu da build
if exist "FastVideoEditor.exe" (
    echo [*] Dang khoi chay FastVideoEditor.exe...
    start "" "FastVideoEditor.exe"
    exit /b 0
)

if exist "dist\FastVideoEditor\FastVideoEditor.exe" (
    echo [*] Dang khoi chay tu dist\FastVideoEditor\FastVideoEditor.exe...
    start "" "dist\FastVideoEditor\FastVideoEditor.exe"
    exit /b 0
)

REM 2. Tu dong tim hoac Tich hop Python 3.9+ (Zero-Config Integration)
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
py --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=py"
    goto :PY_FOUND
)
if exist "%~dp0tools\python\python.exe" (
    set "PYTHON_EXE=%~dp0tools\python\python.exe"
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
for /d %%D in ("C:\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_FOUND
    )
)

echo [*] He thong chua co san Python. Tien hanh TICH HOP TU DONG Python 3.11...
echo [*] Vui long cho trong giay lat, he thong dang tu dong cai dat khong can thao tac...

where winget >nul 2>&1
if not errorlevel 1 (
    echo [*] Dang cai dat Python qua Windows Winget...
    winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
)

for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_FOUND
    )
)

echo [*] Dang tu dong tai bo cai Python 3.11 tu python.org qua PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Write-Host 'Dang tai bo cai Python 3.11...'; try { Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile 'python_installer_temp.exe' -UseBasicParsing; Write-Host 'Dang thuc hien cai dat tu dong...'; Start-Process -FilePath 'python_installer_temp.exe' -ArgumentList '/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_test=0', 'SimpleInstall=1' -Wait; Remove-Item 'python_installer_temp.exe' -Force -ErrorAction SilentlyContinue; Write-Host '[OK] Da cai dat xong Python!' -ForegroundColor Green } catch { Write-Host 'Loi tai: ' $_.Exception.Message }"

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

:PY_FOUND
if "%PYTHON_EXE%"=="" (
    echo.
    echo ==============================================================
    echo [CANH BAO] Khong the tu dong tich hop Python qua mang.
    echo Vui long cai dat Python tai: https://www.python.org/
    echo Luu y: Nho tick chon 'Add Python to PATH' khi cai dat.
    echo ==============================================================
    echo.
    pause
    exit /b 1
)

REM 3. Tu dong kiem tra va cai dat thu vien phu tro
"%PYTHON_EXE%" %PYTHON_ARGS% -c "import windnd, PIL" >nul 2>&1
if errorlevel 1 (
    echo [*] Dang cai dat thu vien ho tro keo tha va render anh (windnd, pillow)...
    "%PYTHON_EXE%" %PYTHON_ARGS% -m pip install --quiet --upgrade pip
    "%PYTHON_EXE%" %PYTHON_ARGS% -m pip install --quiet windnd pillow
)

REM 4. Khoi chay ung dung Python
echo [*] Dang khoi chay Fast Video Editor Studio v3.1.5...
"%PYTHON_EXE%" %PYTHON_ARGS% fast_video_editor.py

if errorlevel 1 (
    echo.
    echo ==============================================================
    echo [THONG BAO] Ung dung da dung lai voi ma loi: %ERRORLEVEL%
    echo Neu co loi, chi tiet da duoc ghi vao file 'crash_log.txt'.
    echo ==============================================================
    echo.
    pause
)
