#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
  Fast Video Cutter & Merger Studio v3.2.2 PRO
  Automated 1-Click Installer Builder (PyInstaller + Inno Setup 6 Auto-Setup)
=============================================================================
"""

import os
import sys
import time
import ssl
import shutil
import tempfile
import urllib.request
import subprocess

def log(msg):
    print(f"[*] {msg}", flush=True)

def find_iscc():
    """Tim kiem ISCC.exe trong tat ca cac thu muc he thong va user data"""
    candidates = [
        r"C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
        r"C:\Program Files\Inno Setup 6\ISCC.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\InnoSetup6\ISCC.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\InnoSetup\ISCC.exe"),
        os.path.expandvars(r"%USERPROFILE%\InnoSetup6\ISCC.exe"),
        os.path.expandvars(r"%ProgramData%\Inno Setup 6\ISCC.exe"),
        shutil.which("ISCC.exe") or shutil.which("iscc")
    ]
    for c in candidates:
        if c and os.path.isfile(c):
            return c
    return None

def download_and_install_inno_setup(target_dir):
    """Tu dong tai va cai dat Inno Setup 6 vao thu muc User ma khong can quyen Admin"""
    log("Inno Setup 6 chua duoc cai dat tren he thong.")
    log(f"Dang tu dong tai va thiet lap Inno Setup 6 vao: {target_dir}...")
    
    os.makedirs(target_dir, exist_ok=True)
    iscc_path = os.path.join(target_dir, "ISCC.exe")
    if os.path.isfile(iscc_path):
        return iscc_path

    # Cac nguon tai Inno Setup Installer chinh thuc
    urls = [
        "https://github.com/jrsoftware/issrc/releases/download/is-6_3_3/innosetup-6.3.3.exe",
        "https://www.jrsoftware.org/download.php/is.exe",
        "https://files.jrsoftware.org/is/6/innosetup-6.3.3.exe"
    ]
    
    installer_tmp = os.path.join(tempfile.gettempdir(), f"inno_setup_{int(time.time())}.exe")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    downloaded = False
    for u in urls:
        try:
            log(f"Dang tai Inno Setup tu: {u}...")
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FastVideoEditor-Builder"})
            with urllib.request.urlopen(req, timeout=20, context=ctx) as resp, open(installer_tmp, "wb") as f_out:
                shutil.copyfileobj(resp, f_out)
            if os.path.exists(installer_tmp) and os.path.getsize(installer_tmp) > 500000:
                downloaded = True
                log(f"[OK] Da tai xong trinh cai dat Inno Setup ({os.path.getsize(installer_tmp) / (1024*1024):.1f} MB)")
                break
        except Exception as e:
            log(f"Thu nguon tiep theo (Loi: {str(e)[:40]})...")
            continue

    # Neu tai thanh cong qua Python, chay cai dat che do Silent vao target_dir
    if downloaded and os.path.exists(installer_tmp):
        try:
            log(f"Dang cai dat Inno Setup 6 vao {target_dir} (Silent Mode)...")
            cmd_install = [
                installer_tmp,
                "/VERYSILENT",
                "/SUPPRESSMSGBOXES",
                "/NORESTART",
                "/SP-",
                f'/DIR={target_dir}'
            ]
            subprocess.run(cmd_install, timeout=40)
            time.sleep(1.0)
            if os.path.exists(installer_tmp):
                try: os.remove(installer_tmp)
                except Exception: pass
        except Exception as e:
            log(f"Loi khi chay trinh cai dat Inno Setup: {e}")

    found = find_iscc()
    if found:
        return found

    # Neu chua duoc, thu winget voi --source winget (tranh loi msstore certificate 0x8a15005e)
    if os.name == "nt":
        log("Dang thu cai dat Inno Setup 6 qua winget (--source winget)...")
        try:
            subprocess.run(
                ["winget", "install", "--id", "JRSoftware.InnoSetup", "--source", "winget", "--silent", "--accept-source-agreements", "--accept-package-agreements"],
                timeout=60
            )
            time.sleep(1.0)
        except Exception:
            pass

    # Thu qua PowerShell BITS
    found = find_iscc()
    if not found and os.name == "nt":
        log("Dang thu tai qua PowerShell Invoke-WebRequest...")
        try:
            ps_cmd = (
                f"$url = 'https://www.jrsoftware.org/download.php/is.exe'; "
                f"$dest = '{installer_tmp}'; "
                f"[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; "
                f"Invoke-WebRequest -Uri $url -OutFile $dest; "
                f"Start-Process -FilePath $dest -ArgumentList '/VERYSILENT /SUPPRESSMSGBOXES /NORESTART /SP- /DIR=\"{target_dir}\"' -Wait"
            )
            subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], timeout=60)
            time.sleep(1.0)
            if os.path.exists(installer_tmp):
                try: os.remove(installer_tmp)
                except Exception: pass
        except Exception:
            pass

    return find_iscc()

def main():
    print("==============================================================")
    print("   FAST VIDEO CUTTER & MERGER STUDIO v3.2.2 PRO")
    print("   Trinh Dong Goi 1-Click [PyInstaller + Inno Setup 6]")
    print("==============================================================")
    print()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    # 1. Kiem tra thu vien can thiet
    log("Dang kiem tra thu vien PyInstaller, Pillow, TkinterDnD2...")
    try:
        import PyInstaller
    except ImportError:
        log("Dang cai dat PyInstaller...")
        subprocess.run([sys.executable, "-m", "pip", "install", "--quiet", "pyinstaller", "pillow", "tkinterdnd2"])

    # 2. Dong goi bang PyInstaller
    log("[1/2] Dang dong goi tap tin thuc thi FastVideoEditor.exe...")
    icon_arg = ["--icon=icon.ico"] if os.path.exists("icon.ico") else []
    cmd_pyinstaller = [
        sys.executable, "-m", "PyInstaller",
        "--noconfirm", "--onedir", "--windowed",
        "--name", "FastVideoEditor"
    ] + icon_arg + ["fast_video_editor.py"]
    
    res = subprocess.run(cmd_pyinstaller)
    if res.returncode != 0:
        log("[ERROR] Dong goi PyInstaller that bai!")
        sys.exit(1)

    dist_dir = os.path.join(base_dir, "dist", "FastVideoEditor")
    os.makedirs(dist_dir, exist_ok=True)
    
    # Sao chep cac file can thiet vao thu muc dist
    for f in ["icon.ico", "icon.png", "fast-video-editor.png", "fast_video_editor.py", "setup_wizard.py", "run_windows.bat", "README.txt"]:
        if os.path.exists(f):
            try: shutil.copy2(f, dist_dir)
            except Exception: pass

    log("[OK] Da tao thu muc thuc thi FastVideoEditor thanh cong!")

    # 3. Kiem tra & Bien dich Inno Setup
    log("[2/2] Dang kiem tra Inno Setup Compiler (ISCC.exe)...")
    iscc_exe = find_iscc()
    if not iscc_exe:
        inno_portable_dir = os.path.expandvars(r"%LOCALAPPDATA%\InnoSetup6") if os.name == "nt" else os.path.join(base_dir, "InnoSetup6")
        iscc_exe = download_and_install_inno_setup(inno_portable_dir)

    if iscc_exe and os.path.isfile(iscc_exe):
        log(f"Su dung Inno Setup Compiler: {iscc_exe}")
        log("Dang bien dich file cai dat Next-Next: FastVideoEditor_v3.2.2_Setup.exe...")
        os.makedirs("Output", exist_ok=True)
        res = subprocess.run([iscc_exe, "installer_windows.iss"])
        setup_exe = os.path.join("Output", "FastVideoEditor_v3.2.2_Setup.exe")
        if os.path.exists(setup_exe):
            sz_mb = os.path.getsize(setup_exe) / (1024 * 1024)
            print()
            print("==============================================================")
            print("   [HOAN TAT] DA TAO FILE CAI DAT WINDOWS DANG NEXT-NEXT:")
            print(f"   * File: {setup_exe} ({sz_mb:.1f} MB)")
            print("   * Nguoi dung chi can nhap dup chuot la cai dat dang Next-Next!")
            print("==============================================================")
            return
        else:
            log("[!] Qua trinh bien dich Inno Setup hoan tat nhung chua thay file Output.")
    else:
        log("[THONG BAO] Inno Setup khong kha dung tren may nay.")
        log("[i] Ban co the su dung bo cai dat GUI: setup_windows.bat")
        log("[i] Hoac dung truc tiep file chay tai: dist/FastVideoEditor/FastVideoEditor.exe")

if __name__ == "__main__":
    main()
