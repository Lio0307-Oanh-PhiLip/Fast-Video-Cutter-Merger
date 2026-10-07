# ==============================================================
# Fast Video Cutter & Merger Studio v3.2.3 PRO
# Windows 1-Click Setup Builder (PowerShell Engine)
# ==============================================================

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "   FAST VIDEO CUTTER AND MERGER STUDIO v3.2.3 PRO" -ForegroundColor Green
Write-Host "   Automated Build & Package Engine for Windows 10 / 11" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Tìm hoặc Tự Động Tích Hợp Python
$PythonExe = ""
$Candidates = @(
    "python",
    "py",
    "$PSScriptRoot\tools\python\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python310\python.exe",
    "C:\Python311\python.exe",
    "C:\Python312\python.exe"
)

foreach ($c in $Candidates) {
    try {
        $ver = & $c --version 2>&1
        if ($LASTEXITCODE -eq 0 -or $ver -like "*Python*") {
            $PythonExe = $c
            break
        }
    } catch {}
}

if (-not $PythonExe) {
    Write-Host "[*] Chưa tìm thấy Python 3.9+ trên hệ thống." -ForegroundColor Yellow
    Write-Host "[*] Tiến hành TỰ ĐỘNG TÍCH HỢP Python 3.11 qua Windows Winget..." -ForegroundColor Cyan
    try {
        winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements
        $PythonExe = "python"
    } catch {
        Write-Host "[*] Đang tải installer Python 3.11 từ python.org..." -ForegroundColor Gray
        Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile 'python_temp.exe' -UseBasicParsing
        Start-Process -FilePath 'python_temp.exe' -ArgumentList '/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_test=0' -Wait
        Remove-Item 'python_temp.exe' -Force -ErrorAction SilentlyContinue
        $PythonExe = "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"
    }
}

Write-Host "[*] Python runtime: $PythonExe" -ForegroundColor Green

# 2. Tự động tải FFmpeg Essentials nếu chưa có
if (-not (Test-Path "ffmpeg.exe")) {
    Write-Host "[*] Đang tự động tải FFmpeg Essentials binaries (ffmpeg, ffplay, ffprobe)..." -ForegroundColor Yellow
    $ProgressPreference = 'SilentlyContinue'
    $urls = @(
        'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip',
        'https://github.com/GyanD/codexffmpeg/releases/download/7.1/ffmpeg-7.1-essentials_build.zip',
        'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'
    )
    $downloaded = $false
    foreach ($u in $urls) {
        try {
            Write-Host "  -> Thử tải từ: $u" -ForegroundColor Gray
            Invoke-WebRequest -Uri $u -OutFile "ffmpeg_ps_temp.zip" -UseBasicParsing
            if (Test-Path "ffmpeg_ps_temp.zip") {
                $downloaded = $true
                break
            }
        } catch {}
    }

    if ($downloaded) {
        Write-Host "[*] Đang giải nén bộ công cụ FFmpeg..." -ForegroundColor Cyan
        Expand-Archive -Path "ffmpeg_ps_temp.zip" -DestinationPath "ffmpeg_ps_ext" -Force
        Get-ChildItem -Path "ffmpeg_ps_ext" -Filter "ffmpeg.exe" -Recurse | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName -Destination "ffmpeg.exe" -Force }
        Get-ChildItem -Path "ffmpeg_ps_ext" -Filter "ffplay.exe" -Recurse | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName -Destination "ffplay.exe" -Force }
        Get-ChildItem -Path "ffmpeg_ps_ext" -Filter "ffprobe.exe" -Recurse | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName -Destination "ffprobe.exe" -Force }
        Remove-Item "ffmpeg_ps_temp.zip", "ffmpeg_ps_ext" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "[OK] Đã tích hợp thành công ffmpeg.exe, ffplay.exe, ffprobe.exe!" -ForegroundColor Green
    }
}

# 3. Cài đặt thư viện Python
Write-Host "[*] Cài đặt dependencies (pyinstaller, windnd, pillow)..." -ForegroundColor Cyan
& $PythonExe -m pip install --quiet --upgrade pip
& $PythonExe -m pip install --quiet pyinstaller windnd pillow

# 4. Biên dịch PyInstaller
Write-Host "[*] Đang đóng gói file thực thi độc lập FastVideoEditor.exe..." -ForegroundColor Cyan
$extraArgs = @()
if (Test-Path "ffmpeg.exe") { $extraArgs += @("--add-binary", "ffmpeg.exe;.") }
if (Test-Path "ffplay.exe") { $extraArgs += @("--add-binary", "ffplay.exe;.") }
if (Test-Path "ffprobe.exe") { $extraArgs += @("--add-binary", "ffprobe.exe;.") }
if (Test-Path "icon.ico") { $extraArgs += @("--icon", "icon.ico") }

& $PythonExe -m PyInstaller --noconfirm --onedir --windowed --name "FastVideoEditor" @extraArgs fast_video_editor.py

if (Test-Path "dist\FastVideoEditor\FastVideoEditor.exe") {
    Write-Host "[OK] Đã tạo thành công standalone executable tại dist\FastVideoEditor\" -ForegroundColor Green
    if (Test-Path "ffmpeg.exe") { Copy-Item "ffmpeg.exe" "dist\FastVideoEditor\" -Force }
    if (Test-Path "ffplay.exe") { Copy-Item "ffplay.exe" "dist\FastVideoEditor\" -Force }
    if (Test-Path "ffprobe.exe") { Copy-Item "ffprobe.exe" "dist\FastVideoEditor\" -Force }
    if (Test-Path "README.txt") { Copy-Item "README.txt" "dist\FastVideoEditor\" -Force }
    if (Test-Path "run_windows.bat") { Copy-Item "run_windows.bat" "dist\FastVideoEditor\" -Force }
}

# 5. Inno Setup Builder & Tự động mở cửa sổ cài đặt
$Iscc = ""
$InnoPaths = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe",
    "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe"
)
foreach ($ip in $InnoPaths) {
    if (Test-Path $ip) {
        $Iscc = $ip
        break
    }
}

if (-not $Iscc) {
    try {
        winget install JRSoftware.InnoSetup --silent --accept-source-agreements --accept-package-agreements
        foreach ($ip in $InnoPaths) { if (Test-Path $ip) { $Iscc = $ip; break } }
    } catch {}
}

if ($Iscc -and (Test-Path "installer_windows.iss")) {
    Write-Host "[*] Đang tạo bộ cài đặt Windows Setup qua Inno Setup..." -ForegroundColor Cyan
    & $Iscc installer_windows.iss
    if (Test-Path "Output\FastVideoEditor_v3.2.3_Setup.exe") {
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host "[THÀNH CÔNG] Đang mở Cửa Sổ Cài Đặt: Output\FastVideoEditor_v3.2.3_Setup.exe" -ForegroundColor Green
        Write-Host "==============================================================" -ForegroundColor Green
        Start-Process "Output\FastVideoEditor_v3.2.3_Setup.exe"
        exit 0
    }
}

# Mở Native Setup Wizard nếu chưa có Inno Setup
Write-Host "[*] Đang mở Cửa Sổ Trình Cài Đặt (GUI Setup Wizard)..." -ForegroundColor Cyan
if (Test-Path "setup_wizard.py") {
    Start-Process $PythonExe "setup_wizard.py"
} else {
    Start-Process "install_windows.bat"
}
