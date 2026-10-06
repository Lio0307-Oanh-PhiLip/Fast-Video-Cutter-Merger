import os
import sys
import re
import json

print("=== Upgrading run_windows.bat and fast_video_editor.py for Dynamic Execution ===")

# 1. Update run_windows.bat
run_windows_bat_content = """@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.6 - Launcher
cls

echo ==============================================================
echo    Fast Video Cutter and Merger Studio v3.1.6 PRO (Windows)
echo    Lossless Stream Copy Engine - Zero Re-encode Delay
echo ==============================================================
echo.

REM 1. Tim va uu tien chay truc tiep fast_video_editor.py de LUON CAP NHAT MA NGUON MOI NHAT
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
for /d %%D in ("%LOCALAPPDATA%\\Programs\\Python\\Python*") do (
    if exist "%%~fD\\python.exe" (
        set "PYTHON_EXE=%%~fD\\python.exe"
        set "PATH=%%~fD;%%~fD\\Scripts;%PATH%"
        goto :PY_FOUND
    )
)
for /d %%D in ("%ProgramFiles%\\Python*") do (
    if exist "%%~fD\\python.exe" (
        set "PYTHON_EXE=%%~fD\\python.exe"
        set "PATH=%%~fD;%%~fD\\Scripts;%PATH%"
        goto :PY_FOUND
    )
)

:PY_FOUND
if not "%PYTHON_EXE%"=="" (
    if exist "fast_video_editor.py" (
        echo [*] Dang chay ban cap nhat moi nhat: fast_video_editor.py...
        "%PYTHON_EXE%" %PYTHON_ARGS% fast_video_editor.py %*
        exit /b 0
    )
)

REM 2. Thuong qui: neu khong co Python thi chay file kieu Standalone Exe
if exist "FastVideoEditor.exe" (
    echo [*] Dang khoi chay FastVideoEditor.exe...
    start "" "FastVideoEditor.exe"
    exit /b 0
)

if exist "dist\\FastVideoEditor\\FastVideoEditor.exe" (
    echo [*] Dang khoi chay tu dist\\FastVideoEditor\\FastVideoEditor.exe...
    start "" "dist\\FastVideoEditor\\FastVideoEditor.exe"
    exit /b 0
)

echo [*] Dang tu dong cai dat Python qua winget...
winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements >nul 2>&1
python --version >nul 2>&1 && set "PYTHON_EXE=python"

if "%PYTHON_EXE%"=="" (
    echo [ERROR] Khong tim thay Python. Vui long cai dat Python tu https://python.org
    pause
    exit /b 1
)

echo [OK] Su dung Python: %PYTHON_EXE% %PYTHON_ARGS%
"%PYTHON_EXE%" %PYTHON_ARGS% fast_video_editor.py %*
""".replace("\r\n", "\n").replace("\n", "\r\n")

with open("run_windows.bat", "wb") as f:
    f.write(run_windows_bat_content.encode("ascii"))
print("[OK] Updated run_windows.bat to prioritize live script execution!")

# 2. Update fast_video_editor.py to support dynamic runner when frozen by PyInstaller
with open("fast_video_editor.py", "r", encoding="utf-8") as f:
    code = f.read()

# Add dynamic loader hook at entry point if getattr(sys, 'frozen', False)
runner_hook = """
# Dynamic Execution Hook: Runs latest script if present alongside frozen binary
def check_and_run_external_updated_script():
    if getattr(sys, 'frozen', False):
        try:
            exe_dir = os.path.dirname(os.path.abspath(sys.executable))
            ext_script = os.path.join(exe_dir, "fast_video_editor.py")
            if os.path.isfile(ext_script) and os.path.abspath(ext_script) != os.path.abspath(__file__):
                # Check if external script is different/newer
                with open(ext_script, "r", encoding="utf-8", errors="ignore") as f:
                    ext_code = f.read()
                if "class VideoEditorApp" in ext_code and len(ext_code) > 10000:
                    # Execute external script namespace
                    scope = {"__file__": ext_script, "__name__": "__main__"}
                    exec(compile(ext_code, ext_script, "exec"), scope)
                    sys.exit(0)
        except Exception as e:
            print(f"[DYNAMIC_RUNNER] Falling back to bundled script: {e}")

check_and_run_external_updated_script()
"""

if "check_and_run_external_updated_script()" not in code:
    code = code + "\n" + runner_hook

with open("fast_video_editor.py", "w", encoding="utf-8") as f:
    f.write(code)
print("[OK] Added dynamic runner hook to fast_video_editor.py!")

# 3. Synchronize TS Data
with open("fast_video_editor.py", "r", encoding="utf-8") as f:
    fast_editor_py = f.read()

with open("setup_wizard.py", "r", encoding="utf-8") as f:
    setup_wizard_py = f.read()

with open("installer_windows.iss", "r", encoding="utf-8") as f:
    iss_content = f.read()

with open("build_windows_setup.bat", "r", encoding="utf-8") as f:
    build_setup_bat = f.read()

with open("setup_windows.bat", "r", encoding="utf-8") as f:
    setup_win_bat = f.read()

with open("run_windows.bat", "r", encoding="utf-8") as f:
    run_win_bat = f.read()

with open("run_linux.sh", "r", encoding="utf-8") as f:
    run_linux_sh = f.read()

with open("install_linux.sh", "r", encoding="utf-8") as f:
    install_linux_sh = f.read()

with open("build_linux_deb.sh", "r", encoding="utf-8") as f:
    build_linux_deb_sh = f.read()

with open("build_linux_appimage.sh", "r", encoding="utf-8") as f:
    build_linux_appimage_sh = f.read()

with open("build_installer.py", "r", encoding="utf-8") as f:
    build_installer_py = f.read()

desktop_ts = (
    f'export const PYTHON_SCRIPT_CODE = {json.dumps(fast_editor_py)};\n\n'
    f'export const RUN_WINDOWS_BAT = {json.dumps(run_win_bat)};\n\n'
    f'export const SETUP_WINDOWS_BAT = {json.dumps(setup_win_bat)};\n\n'
    f'export const RUN_LINUX_SH = {json.dumps(run_linux_sh)};\n\n'
    f'export const INSTALL_LINUX_SH = {json.dumps(install_linux_sh)};\n\n'
    f'export const SETUP_WIZARD_PY = {json.dumps(setup_wizard_py)};\n\n'
    f'export const BUILD_WINDOWS_SETUP_BAT = {json.dumps(build_setup_bat)};\n\n'
    f'export const BUILD_INSTALLER_PY = {json.dumps(build_installer_py)};\n\n'
    f'export const INNO_SETUP_ISS = {json.dumps(iss_content)};\n\n'
    f'export const BUILD_LINUX_DEB_SH = {json.dumps(build_linux_deb_sh)};\n'
)

with open("src/data/desktopScripts.ts", "w", encoding="utf-8") as f:
    f.write(desktop_ts)

installer_ts = (
    f'export const INNO_SETUP_SCRIPT = {json.dumps(iss_content)};\n\n'
    f'export const BUILD_WINDOWS_INSTALLER_BAT = {json.dumps(build_setup_bat)};\n\n'
    f'export const ONECLICK_WINDOWS_INSTALLER_BAT = {json.dumps(setup_win_bat)};\n\n'
    f'export const SETUP_WIZARD_PY = {json.dumps(setup_wizard_py)};\n\n'
    f'export const ONECLICK_LINUX_INSTALLER_SH = {json.dumps(install_linux_sh)};\n\n'
    f'export const BUILD_LINUX_DEB_SH = {json.dumps(build_linux_deb_sh)};\n\n'
    f'export const BUILD_LINUX_APPIMAGE_SH = {json.dumps(build_linux_appimage_sh)};\n\n'
    'export interface InstallerPackage {\n'
    '  id: string;\n'
    '  name: string;\n'
    '  os: \'windows\' | \'linux\';\n'
    '  version: string;\n'
    '  type: \'wizard\' | \'inno\' | \'bat\' | \'sh\' | \'deb\';\n'
    '  description: string;\n'
    '  badge: string;\n'
    '  icon: string;\n'
    '  filename: string;\n'
    '  code: string;\n'
    '  steps: string[];\n'
    '}\n\n'
    'export const INSTALLER_PACKAGES: InstallerPackage[] = [\n'
    '  {\n'
    '    id: \'win-inno-1click\',\n'
    '    name: \'Trình Đóng Gói 1-Click Inno Setup (.exe)\',\n'
    '    os: \'windows\',\n'
    '    version: \'v3.1.6 PRO\',\n'
    '    type: \'inno\',\n'
    '    badge: \'1-Click Inno Setup 6\',\n'
    '    icon: \'PackageCheck\',\n'
    '    filename: \'build_windows_setup.bat\',\n'
    '    description: \'Tự động kiểm tra / cài đặt Inno Setup Compiler và PyInstaller, biên dịch file cài đặt FastVideoEditor_v3.1.6_Setup.exe dạng Next-Next chuyên nghiệp.\',\n'
    f'    code: {json.dumps(build_setup_bat)},\n'
    '    steps: [\n'
    '      \'Tải hoặc sao chép tập tin build_windows_setup.bat vào thư mục dự án.\',\n'
    '      \'Nhấp đúp chuột để chạy build_windows_setup.bat.\',\n'
    '      \'Hệ thống tự động cài đặt PyInstaller và Inno Setup 6 (nếu chưa có).\',\n'
    '      \'Hoàn tất và nhận ngay file cài đặt tại Output\\\\FastVideoEditor_v3.1.6_Setup.exe.\'\n'
    '    ]\n'
    '  },\n'
    '  {\n'
    '    id: \'win-setup-wizard\',\n'
    '    name: \'Trình Cài Đặt Giao Diện Đa Bước Next-Next (GUI Wizard)\',\n'
    '    os: \'windows\',\n'
    '    version: \'v3.1.6 PRO\',\n'
    '    type: \'wizard\',\n'
    '    badge: \'Khuyên Dùng Windows\',\n'
    '    icon: \'Sparkles\',\n'
    '    filename: \'setup_windows.bat\',\n'
    '    description: \'Trình cài đặt đồ họa đa bước (Welcome -> Tùy chọn -> Tiến trình -> Hoàn tất), tự động tạo Desktop Shortcut, Start Menu và liên kết file.\',\n'
    f'    code: {json.dumps(setup_win_bat)},\n'
    '    steps: [\n'
    '      \'Nhấp đúp chuột vào file setup_windows.bat trên Windows 10/11.\',\n'
    '      \'Giao diện Setup Wizard hiện lên với thiết kế Dark Slate hiện đại.\',\n'
    '      \'Chọn thư mục cài đặt, tùy chọn icon màn hình và bấm Tiếp tục.\',\n'
    '      \'Ứng dụng tự động cấu hình môi trường và khởi chạy ngay lập tức.\'\n'
    '    ]\n'
    '  },\n'
    '  {\n'
    '    id: \'inno-script\',\n'
    '    name: \'Tập Tin Cấu Hình Inno Setup Script (.iss)\',\n'
    '    os: \'windows\',\n'
    '    version: \'v3.1.6 PRO\',\n'
    '    type: \'inno\',\n'
    '    badge: \'Inno Setup Script\',\n'
    '    icon: \'Code\',\n'
    '    filename: \'installer_windows.iss\',\n'
    '    description: \'Mã nguồn cấu hình Inno Setup chuẩn Studio với icon nhúng, nén lzma2/ultra64, kiểm tra 64-bit và hỗ trợ gỡ cài đặt an toàn.\',\n'
    f'    code: {json.dumps(iss_content)},\n'
    '    steps: [\n'
    '      \'Mở tập tin installer_windows.iss bằng Inno Setup Compiler.\',\n'
    '      \'Bấm nút Compile (hoặc phím F9).\',\n'
    '      \'File cài đặt FastVideoEditor_v3.1.6_Setup.exe được tạo trong thư mục Output.\'\n'
    '    ]\n'
    '  },\n'
    '  {\n'
    '    id: \'linux-install-sh\',\n'
    '    name: \'Trình Cài Đặt Tự Động 1-Click Toàn Hệ Thống Linux (.sh)\',\n'
    '    os: \'linux\',\n'
    '    version: \'v3.1.6 PRO\',\n'
    '    type: \'sh\',\n'
    '    badge: \'Khuyên Dùng Linux\',\n'
    '    icon: \'Terminal\',\n'
    '    filename: \'install_linux.sh\',\n'
    '    description: \'Cài đặt tự động FFmpeg, Python3-tk, Tkdnd, tkinterdnd2, tích hợp logo hệ thống chuẩn FreeDesktop và đăng ký App Launcher.\',\n'
    f'    code: {json.dumps(install_linux_sh)},\n'
    '    steps: [\n'
    '      \'Mở Terminal tại thư mục chứa source code.\',\n'
    '      \'Cấp quyền thực thi: chmod +x install_linux.sh\',\n'
    '      \'Chạy lệnh cài đặt: sudo ./install_linux.sh\',\n'
    '      \'Mở ứng dụng từ Application Menu hoặc gõ lệnh fast-video-editor.\'\n'
    '    ]\n'
    '  },\n'
    '  {\n'
    '    id: \'linux-deb-builder\',\n'
    '    name: \'Trình Đóng Gói Gói Cài Đặt Debian (.deb)\',\n'
    '    os: \'linux\',\n'
    '    version: \'v3.1.6 PRO\',\n'
    '    type: \'deb\',\n'
    '    badge: \'Layers\',\n'
    '    icon: \'Layers\',\n'
    '    filename: \'build_linux_deb.sh\',\n'
    '    description: \'Đóng gói ứng dụng thành gói .deb chuẩn (fast-video-editor_3.1.6_all.deb) để cài đặt dạng 1-click trên Ubuntu, Linux Mint, Debian.\',\n'
    f'    code: {json.dumps(build_linux_deb_sh)},\n'
    '    steps: [\n'
    '      \'Chạy lệnh: chmod +x build_linux_deb.sh && ./build_linux_deb.sh\',\n'
    '      \'Nhận file gói cài đặt tại: dist/fast-video-editor_3.1.6_all.deb\',\n'
    '      \'Cài đặt bằng lệnh: sudo dpkg -i dist/fast-video-editor_3.1.6_all.deb\'\n'
    '    ]\n'
    '  }\n'
    '];\n'
)

with open('src/data/installerScripts.ts', 'w', encoding='utf-8') as f:
    f.write(installer_ts)

print("=== Full Dynamic Upgrade Completed Successfully ===")
