@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.5 - Windows Setup Builder
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.1.5 PRO
echo    Windows 1-Click Setup Builder [Inno Setup + PyInstaller]
echo ==============================================================
echo.

REM 1. Phat hien hoac Tu Dong Tich Hop Python 3.9+ (Zero-Config Integration)
set "PYTHON_EXE="
set "PYTHON_ARGS="

REM Kiem tra python truc tiep
python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=python"
    goto :PY_OK
)

REM Kiem tra py -3
py -3 --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=py"
    set PYTHON_ARGS=-3
    goto :PY_OK
)

REM Kiem tra py
py --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=py"
    goto :PY_OK
)

REM Kiem tra thu muc local tools
if exist "%~dp0tools\python\python.exe" (
    set "PYTHON_EXE=%~dp0tools\python\python.exe"
    goto :PY_OK
)

REM Kiem tra LocalAppData (ho tro ten user co dau cach nhu "OS 10")
for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_OK
    )
)

REM Kiem tra ProgramFiles
for /d %%D in ("%ProgramFiles%\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_OK
    )
)

REM Kiem tra C:\Python
for /d %%D in ("C:\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_OK
    )
)

echo [*] He thong chua co san Python. Tien hanh TICH HOP TU DONG Python 3.11...
echo [*] Vui long cho trong giay lat, qua trinh dien ra hoan toan tu dong...

where winget >nul 2>&1
if not errorlevel 1 (
    echo [*] Dang cai dat Python 3.11 qua Windows Winget...
    winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
)

for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_OK
    )
)

echo [*] Dang tu dong tai bo cai Python 3.11 tu python.org qua PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Write-Host 'Dang tai bo cai Python 3.11...'; try { Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile 'python_installer_temp.exe' -UseBasicParsing; Write-Host 'Dang thuc hien cai dat tu dong...'; Start-Process -FilePath 'python_installer_temp.exe' -ArgumentList '/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_test=0', 'SimpleInstall=1' -Wait; Remove-Item 'python_installer_temp.exe' -Force -ErrorAction SilentlyContinue; Write-Host '[OK] Da cai dat xong Python!' -ForegroundColor Green } catch { Write-Host 'Loi tai: ' $_.Exception.Message }"

for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_OK
    )
)
for /d %%D in ("%ProgramFiles%\Python*") do (
    if exist "%%~fD\python.exe" (
        set "PYTHON_EXE=%%~fD\python.exe"
        set "PATH=%%~fD;%%~fD\Scripts;%PATH%"
        goto :PY_OK
    )
)

python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=python"
    goto :PY_OK
)
py -3 --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=py"
    set PYTHON_ARGS=-3
    goto :PY_OK
)

:PY_OK
if "%PYTHON_EXE%"=="" (
    echo.
    echo ==============================================================
    echo [CANH BAO] Khong the tu dong tich hop Python qua mang.
    echo Vui long tai va cai dat Python 3.11 tai: https://www.python.org/
    echo Luu y: Nho tick chon 'Add Python to PATH' khi cai dat.
    echo ==============================================================
    echo.
    pause
    exit /b 1
)

echo [OK] Trinh thuc thi Python da san sang: "%PYTHON_EXE%" %PYTHON_ARGS%

REM 2. Tu dong kiem tra va tich hop binary FFmpeg, FFplay, FFprobe vao bo cai
if not exist "ffmpeg.exe" (
    where ffmpeg >nul 2>&1
    if not errorlevel 1 (
        for /f "delims=" %%i in ('where ffmpeg') do (
            if not exist "ffmpeg.exe" copy "%%i" "ffmpeg.exe" >nul 2>&1
        )
    )
)
if not exist "ffplay.exe" (
    where ffplay >nul 2>&1
    if not errorlevel 1 (
        for /f "delims=" %%i in ('where ffplay') do (
            if not exist "ffplay.exe" copy "%%i" "ffplay.exe" >nul 2>&1
        )
    )
)
if not exist "ffprobe.exe" (
    where ffprobe >nul 2>&1
    if not errorlevel 1 (
        for /f "delims=" %%i in ('where ffprobe') do (
            if not exist "ffprobe.exe" copy "%%i" "ffprobe.exe" >nul 2>&1
        )
    )
)

if not exist "ffmpeg.exe" (
    echo [*] Dang tu dong tai FFmpeg Essentials de nhung truc tiep vao bo cai Setup...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Write-Host 'Dang ket noi may chu tai FFmpeg zip...'; $urls = @('https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip', 'https://github.com/GyanD/codexffmpeg/releases/download/7.1/ffmpeg-7.1-essentials_build.zip', 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'); $ok = $false; foreach ($u in $urls) { try { Write-Host \"Dang tai tu: $u\"; Invoke-WebRequest -Uri $u -OutFile 'ffmpeg_setup_temp.zip' -UseBasicParsing; if (Test-Path 'ffmpeg_setup_temp.zip') { $ok = $true; break } } catch { } }; if ($ok) { Expand-Archive -Path 'ffmpeg_setup_temp.zip' -DestinationPath 'ffmpeg_setup_ext' -Force; Get-ChildItem -Path 'ffmpeg_setup_ext' -Filter 'ffmpeg.exe' -Recurse | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName -Destination 'ffmpeg.exe' -Force }; Get-ChildItem -Path 'ffmpeg_setup_ext' -Filter 'ffplay.exe' -Recurse | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName -Destination 'ffplay.exe' -Force }; Get-ChildItem -Path 'ffmpeg_setup_ext' -Filter 'ffprobe.exe' -Recurse | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName -Destination 'ffprobe.exe' -Force }; Remove-Item 'ffmpeg_setup_temp.zip', 'ffmpeg_setup_ext' -Recurse -Force -ErrorAction SilentlyContinue; Write-Host '[OK] Da tich hop san ffmpeg.exe, ffplay.exe, ffprobe.exe vao bo cai!' -ForegroundColor Green } else { Write-Host '[CANH BAO] Khong the tai truoc qua mang. Ung dung van se tu dong tai khi chay neu thieu.' -ForegroundColor Yellow }"
)

REM 3. Cai dat thu vien can thiet
echo [*] Dang kiem tra va cai dat thu vien Python can thiet...
"%PYTHON_EXE%" %PYTHON_ARGS% -m pip install --quiet --upgrade pip
"%PYTHON_EXE%" %PYTHON_ARGS% -m pip install --quiet pyinstaller windnd pillow

REM 4. Bien dich file thuc thi FastVideoEditor.exe
echo.
echo [*] Dang dong goi FastVideoEditor.exe bang PyInstaller...
set "ADD_BIN="
if exist "ffmpeg.exe" set ADD_BIN=%ADD_BIN% --add-binary "ffmpeg.exe;."
if exist "ffplay.exe" set ADD_BIN=%ADD_BIN% --add-binary "ffplay.exe;."
if exist "ffprobe.exe" set ADD_BIN=%ADD_BIN% --add-binary "ffprobe.exe;."
if exist "icon.ico" set ADD_BIN=%ADD_BIN% --icon="icon.ico"

"%PYTHON_EXE%" %PYTHON_ARGS% -m PyInstaller --noconfirm --onedir --windowed --name "FastVideoEditor" %ADD_BIN% fast_video_editor.py

REM Copy cac cong cu bo sung vao thu muc dist
if not exist "dist\FastVideoEditor" mkdir "dist\FastVideoEditor" >nul 2>&1
if exist "ffmpeg.exe" copy /y "ffmpeg.exe" "dist\FastVideoEditor\" >nul
if exist "ffplay.exe" copy /y "ffplay.exe" "dist\FastVideoEditor\" >nul
if exist "ffprobe.exe" copy /y "ffprobe.exe" "dist\FastVideoEditor\" >nul
if exist "README.txt" copy /y "README.txt" "dist\FastVideoEditor\" >nul
if exist "run_windows.bat" copy /y "run_windows.bat" "dist\FastVideoEditor\" >nul
if exist "fast_video_editor.py" copy /y "fast_video_editor.py" "dist\FastVideoEditor\" >nul

REM Copy FastVideoEditor.exe ra ngoai thu muc goc de tien khoi chay
if exist "dist\FastVideoEditor\FastVideoEditor.exe" (
    copy /y "dist\FastVideoEditor\FastVideoEditor.exe" "FastVideoEditor.exe" >nul 2>&1
    echo [OK] Da dong goi thanh cong file thuc thi: dist\FastVideoEditor\FastVideoEditor.exe
)

REM 5. Tim Inno Setup de tao file Setup.exe
echo.
echo [*] Dang kiem tra trinh bien dich Inno Setup (ISCC.exe)...
set "ISCC_CMD="
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" set "ISCC_CMD=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" set "ISCC_CMD=%ProgramFiles%\Inno Setup 6\ISCC.exe"
if exist "%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe" set "ISCC_CMD=%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe"

if "%ISCC_CMD%"=="" (
    where ISCC.exe >nul 2>&1
    if not errorlevel 1 set "ISCC_CMD=ISCC.exe"
)

REM Neu co Inno Setup Compiler, bien dich ra bo cai dat Setup.exe
if not "%ISCC_CMD%"=="" (
    echo [*] Dang bien dich bo cai dat FastVideoEditor_v3.1.5_Setup.exe...
    "%ISCC_CMD%" installer_windows.iss
    if exist "Output\FastVideoEditor_v3.1.5_Setup.exe" (
        echo.
        echo ==============================================================
        echo [THANH CONG] DA TAO THANH CONG FILE CAI DAT SETUP WINDOWS!
        echo [*] Dang tu dong mo CUA SO CAI DAT (Inno Setup Wizard)...
        echo ==============================================================
        start "" "Output\FastVideoEditor_v3.1.5_Setup.exe"
        echo.
        echo File cai dat duoc luu tai: Output\FastVideoEditor_v3.1.5_Setup.exe
        echo Nhan phim bat ky de dong cua so nay...
        pause >nul
        exit /b 0
    )
)

REM 6. Neu chua co Inno Setup, thuc hien tao Shortcut va mo ung dung
echo.
echo ==============================================================
echo [HOAN TAT DONG GOI] FAST VIDEO CUTTER & MERGER STUDIO v3.1.5 PRO
echo ==============================================================
echo.
echo - File thuc thi: dist\FastVideoEditor\FastVideoEditor.exe
echo - Ma nguon Python: fast_video_editor.py

REM Tu dong tao Shortcut ngoai Desktop
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "VBS_SCRIPT=%TEMP%\CreateShortcut_%RANDOM%.vbs"
set "EXE_TARGET=%~dp0dist\FastVideoEditor\FastVideoEditor.exe"
if not exist "%EXE_TARGET%" set "EXE_TARGET=%~dp0FastVideoEditor.exe"
if not exist "%EXE_TARGET%" set "EXE_TARGET=%~dp0run_windows.bat"

(
echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
echo sLinkFile = "%DESKTOP_DIR%\Fast Video Cutter and Merger.lnk"
echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
echo oLink.TargetPath = "%EXE_TARGET%"
echo oLink.WorkingDirectory = "%~dp0dist\FastVideoEditor"
echo oLink.Description = "Fast Video Cutter & Merger Studio v3.1.5 PRO"
if exist "%~dp0icon.ico" echo oLink.IconLocation = "%~dp0icon.ico"
echo oLink.Save
) > "%VBS_SCRIPT%"

cscript /nologo "%VBS_SCRIPT%" >nul 2>&1
if exist "%VBS_SCRIPT%" del /f /q "%VBS_SCRIPT%" >nul 2>&1
echo [OK] Da tao Shortcut 'Fast Video Cutter and Merger' tren Man Hinh Desktop!

REM Mo GUI Setup Wizard neu co hoac khoi chay truc tiep ung dung
if exist "setup_wizard.py" (
    echo [*] Dang mo Cua So Cai Dat Do Hoa (Setup Wizard)...
    start "" "%PYTHON_EXE%" %PYTHON_ARGS% setup_wizard.py
) else (
    echo [*] Dang khoi chay Fast Video Editor Studio v3.1.5...
    if exist "dist\FastVideoEditor\FastVideoEditor.exe" (
        start "" "dist\FastVideoEditor\FastVideoEditor.exe"
    ) else (
        start "" "%PYTHON_EXE%" %PYTHON_ARGS% fast_video_editor.py
    )
)

echo.
echo ==============================================================
echo [HOAN TAT] Qua trinh dong goi va khoi chay hoan tat 100%!
echo Ung dung da duoc mo tren man hinh.
echo ==============================================================
echo.
echo Nhan phim bat ky de dong cua so nay...
pause >nul
exit /b 0
