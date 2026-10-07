import os
import json

print("=== RE-SYNCHRONIZING DESKTOP SCRIPTS AND INSTALLER SCRIPTS v3.2.0 ===")

def read_file(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

fast_editor_py = read_file("fast_video_editor.py")
setup_wizard_py = read_file("setup_wizard.py")
run_windows_bat = read_file("run_windows.bat")
run_linux_sh = read_file("run_linux.sh")
inno_setup_iss = read_file("installer_windows.iss")
build_windows_setup_bat = read_file("build_windows_setup.bat")
install_windows_bat = read_file("install_windows.bat")
install_linux_sh = read_file("install_linux.sh")
build_linux_deb_sh = read_file("build_linux_deb.sh")
build_linux_appimage_sh = read_file("build_linux_appimage.sh")

# 1. Update src/data/desktopScripts.ts
desktop_ts = f"""// Auto-generated synchronized desktop scripts (v3.2.0 PRO)
export const FAST_VIDEO_EDITOR_PY = {json.dumps(fast_editor_py, ensure_ascii=False)};
export const PYTHON_SCRIPT_CODE = FAST_VIDEO_EDITOR_PY;
export const RUN_WINDOWS_BAT = {json.dumps(run_windows_bat, ensure_ascii=False)};
export const RUN_LINUX_SH = {json.dumps(run_linux_sh, ensure_ascii=False)};
"""

with open("src/data/desktopScripts.ts", "w", encoding="utf-8") as f:
    f.write(desktop_ts)
print(f"[OK] Wrote src/data/desktopScripts.ts ({len(desktop_ts)} bytes)")

# 2. Update src/data/installerScripts.ts
installer_ts = f"""// Auto-generated synchronized installer scripts (v3.2.0 PRO)
export const INNO_SETUP_SCRIPT = {json.dumps(inno_setup_iss, ensure_ascii=False)};
export const BUILD_WINDOWS_INSTALLER_BAT = {json.dumps(build_windows_setup_bat, ensure_ascii=False)};
export const BUILD_LINUX_DEB_SH = {json.dumps(build_linux_deb_sh, ensure_ascii=False)};
export const BUILD_LINUX_APPIMAGE_SH = {json.dumps(build_linux_appimage_sh, ensure_ascii=False)};
export const ONECLICK_WINDOWS_INSTALLER_BAT = {json.dumps(install_windows_bat, ensure_ascii=False)};
export const ONECLICK_LINUX_INSTALLER_SH = {json.dumps(install_linux_sh, ensure_ascii=False)};
export const SETUP_WIZARD_PY = {json.dumps(setup_wizard_py, ensure_ascii=False)};
"""

with open("src/data/installerScripts.ts", "w", encoding="utf-8") as f:
    f.write(installer_ts)
print(f"[OK] Wrote src/data/installerScripts.ts ({len(installer_ts)} bytes)")

print("=== RE-SYNC FINISHED ===")
