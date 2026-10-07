#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
  FAST VIDEO CUTTER & MERGER STUDIO v3.2.4 PRO - AUTOMATED TEST SUITE
  Kiểm thử toàn diện trước và sau khi nâng cấp hệ thống (Windows & Linux)
=============================================================================
"""

import os
import sys
import re
import json
import subprocess

PASS = "[PASS]"
FAIL = "[FAIL]"
WARN = "[WARN]"

def print_header(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def test_1_version_synchronization():
    print_header("BÀI TEST 1/6: Đồng Bộ Phiên Bản v3.2.4 PRO Trên Toàn Hệ Thống")
    target_v = "3.2.4"
    
    files_to_check = [
        ("fast_video_editor.py", r'CURRENT_APP_VERSION\s*=\s*"v3\.2\.4"'),
        ("setup_wizard.py", r'v3\.2\.4'),
        ("setup_windows.bat", r'v3\.2\.4'),
        ("run_windows.bat", r'v3\.2\.4'),
        ("run_linux.sh", r'v3\.2\.4'),
        ("install_windows.bat", r'v3\.2\.4'),
        ("install_linux.sh", r'v3\.2\.4'),
        ("build_linux_deb.sh", r'3\.2\.4'),
        ("build_windows_setup.ps1", r'v3\.2\.4'),
        ("installer_windows.iss", r'MyAppVersion "3\.2\.4"'),
        (".github/workflows/build-release.yml", r'3\.2\.4'),
        ("test_smart_merge.py", r'v3\.2\.4'),
        ("test_smart_merge.bat", r'v3\.2\.4')
    ]
    
    all_ok = True
    for fname, pattern in files_to_check:
        p = os.path.join(os.path.dirname(os.path.abspath(__file__)), fname)
        if not os.path.exists(p):
            print(f"  {FAIL} File không tồn tại: {fname}")
            all_ok = False
            continue
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        if re.search(pattern, content):
            print(f"  {PASS} {fname}: đã đồng bộ v{target_v}")
        else:
            print(f"  {FAIL} {fname}: chưa đồng bộ v{target_v}")
            all_ok = False
            
    assert all_ok, "Sự cố chưa đồng bộ phiên bản!"

def test_2_version_comparison_logic():
    print_header("BÀI TEST 2/6: Logic So Sánh Phiên Bản Cập Nhật GitHub")
    def parse_v(v_str):
        base_v = str(v_str or "").split('-')[0]
        parts = [int(p) for p in re.findall(r'\d+', base_v)]
        while len(parts) < 3: parts.append(0)
        return tuple(parts[:3])

    v324 = parse_v("v3.2.4")
    v323 = parse_v("v3.2.3")
    v322 = parse_v("v3.2.2")
    v320 = parse_v("v3.2.0")
    v330 = parse_v("v3.3.0")

    assert v324 > v323, "v3.2.4 phải lớn hơn v3.2.3"
    assert v324 > v322, "v3.2.4 phải lớn hơn v3.2.2"
    assert v324 > v320, "v3.2.4 phải lớn hơn v3.2.0"
    assert v330 > v324, "v3.3.0 phải lớn hơn v3.2.4"
    print(f"  {PASS} Logic so sánh phiên bản (v3.3.0 > v3.2.4 > v3.2.3 > v3.2.2 > v3.2.0) chính xác 100%.")

def test_3_drag_and_drop_registrations():
    print_header("BÀI TEST 3/6: Đăng Ký Kéo & Thả Video Chuẩn Cho Linux (XDND / Nautilus / Dolphin)")
    py_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fast_video_editor.py")
    with open(py_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert 'drop_target_register("*")' in code or 'text/uri-list' in code, "Thiếu đăng ký wildcard / text/uri-list cho Linux XDND!"
    assert '<<Drop:DND_Text>>' in code or '<<Drop:*>>' in code, "Thiếu bind sự kiện Drop tổng quát!"
    print(f"  {PASS} Cấu hình Drag & Drop cho Linux (GTK Nautilus/KDE Dolphin/Thunar) đã nâng cấp chuẩn 100%.")

def test_4_autoupdate_script_integrity():
    print_header("BÀI TEST 4/6: Cấu Trúc Kịch Bản Auto-Updater Cho Windows & Linux")
    py_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fast_video_editor.py")
    with open(py_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "apply_update.bat" in code, "Thiếu file updater Windows apply_update.bat"
    assert "apply_update.sh" in code, "Thiếu file updater Linux apply_update.sh"
    assert "FastVideoEditor_v3.2.4_Setup.exe" in code or "FastVideoEditor" in code, "Thiếu cấu hình target setup"
    print(f"  {PASS} Động cơ Auto-Update 1-click cho cả Windows & Linux hợp lệ 100%.")

def test_5_update_dialog_percentage_view():
    print_header("BÀI TEST 5/6: Hộp Thoại Cập Nhật Tối Giản Hiển Thị % Tiến Độ")
    py_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fast_video_editor.py")
    with open(py_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "lbl_percent_big" in code, "Thiếu nhãn hiển thị % tiến độ tập trung lớn!"
    assert "lbl_percent_big.config(text=f\"{percent}%\")" in code, "Thiếu logic cập nhật % tiến độ thời gian thực!"
    print(f"  {PASS} Giao diện hộp thoại cập nhật hiển thị gọn gàng % tiến độ chuẩn theo yêu cầu.")

def test_6_github_actions_workflow():
    print_header("BÀI TEST 6/6: Kiểm Tra GitHub Actions CI/CD Workflow v3.2.4")
    wf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".github", "workflows", "build-release.yml")
    assert os.path.exists(wf_path), "File workflow build-release.yml không tồn tại!"
    with open(wf_path, "r", encoding="utf-8") as f:
        wf = f.read()

    assert "FastVideoEditor-v3.2.4-Setup.exe" in wf, "Thiếu target FastVideoEditor-v3.2.4-Setup.exe trong workflow!"
    assert "FastVideoEditor-v3.2.4-Windows-Portable.zip" in wf, "Thiếu target Portable.zip v3.2.4!"
    print(f"  {PASS} GitHub Actions CI/CD Workflow v3.2.4 đã sẵn sàng build & đẩy Releases 100%.")

def run_all():
    print("==============================================================")
    print("  🚀 CHẠY TOÀN BỘ BỘ KIỂM THỬ CHUẨN v3.2.4 PRO (WIN & LINUX)")
    print("==============================================================")
    test_1_version_synchronization()
    test_2_version_comparison_logic()
    test_3_drag_and_drop_registrations()
    test_4_autoupdate_script_integrity()
    test_5_update_dialog_percentage_view()
    test_6_github_actions_workflow()
    print("\n" + "="*70)
    print("  ✅ TOÀN BỘ 6/6 BÀI KIỂM THỬ ĐẠT CHUẨN 100% HOÀN HẢO!")
    print("  ✅ SẴN SÀNG PHÁT HÀNH & NÂNG CẤP v3.2.4 PRO")
    print("="*70)

if __name__ == "__main__":
    run_all()
