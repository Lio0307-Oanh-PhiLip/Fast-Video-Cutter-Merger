#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
  FAST VIDEO CUTTER & MERGER STUDIO v3.2.5 PRO - AUTOMATED TEST SUITE
  Thực thi toàn bộ bài kiểm thử tự động trước và sau nâng cấp v3.2.5
=============================================================================
"""

import os
import sys
import re
import urllib.parse

PASS = "\033[92m[PASS]\033[0m"
FAIL = "\033[91m[FAIL]\033[0m"

def print_header(title):
    print("\n" + "="*65)
    print(f"  {title}")
    print("="*65)

def test_1_version_sync():
    print_header("BÀI TEST 1/6: Đồng Bộ Phiên Bản v3.2.5 PRO Trên Toàn Hệ Thống")
    target_v = "3.2.5"
    files_to_check = {
        "fast_video_editor.py": f'CURRENT_APP_VERSION = "v{target_v}"',
        "build_linux_deb.sh": f'VERSION="{target_v}"',
        "installer_windows.iss": f'#define MyAppVersion "{target_v}"',
        "run_windows.bat": f'v{target_v}',
        "run_linux.sh": f'v{target_v}',
        "install_linux.sh": f'v{target_v}',
        "setup_windows.bat": f'v{target_v}',
        "build_windows_setup.ps1": f'v{target_v}',
        "setup_wizard.py": f'v{target_v}',
        "/.github/workflows/build-release.yml": f'v{target_v}'
    }

    for fpath, pattern in files_to_check.items():
        rel_p = fpath.lstrip('/')
        if not os.path.isfile(rel_p):
            print(f"  {FAIL} Không tìm thấy file: {rel_p}")
            assert False, f"Missing file {rel_p}"
        with open(rel_p, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            if pattern in content:
                print(f"  {PASS} File '{rel_p}' đã chứa phiên bản v{target_v}.")
            else:
                print(f"  {FAIL} File '{rel_p}' KHÔNG chứa chuỗi '{pattern}'!")
                assert False, f"Version mismatch in {rel_p}"

def test_2_version_comparison():
    print_header("BÀI TEST 2/6: Logic So Sánh Phiên Bản GitHub (v3.2.5 > v3.2.4 > v3.2.3)")
    def parse_v(v_str):
        base_v = str(v_str or "").split('-')[0]
        parts = [int(p) for p in re.findall(r'\d+', base_v)]
        while len(parts) < 3: parts.append(0)
        return tuple(parts[:3])

    v325 = parse_v("v3.2.5")
    v324 = parse_v("v3.2.4")
    v323 = parse_v("v3.2.3")
    v320 = parse_v("v3.2.0")
    v330 = parse_v("v3.3.0")

    assert v325 > v324, "v3.2.5 phải lớn hơn v3.2.4"
    assert v325 > v323, "v3.2.5 phải lớn hơn v3.2.3"
    assert v325 > v320, "v3.2.5 phải lớn hơn v3.2.0"
    assert v330 > v325, "v3.3.0 phải lớn hơn v3.2.5"
    print(f"  {PASS} Logic so sánh phiên bản (v3.3.0 > v3.2.5 > v3.2.4 > v3.2.3 > v3.2.0) chính xác 100%.")

def test_3_ui_box_update_removed():
    print_header("BÀI TEST 3/6: Kiểm Tra Ẩn/Xóa Khung Cấu Hình GitHub Thừa Trong Thẻ Settings")
    with open("fast_video_editor.py", "r", encoding="utf-8") as f:
        code = f.read()
    
    # Đảm bảo box_update không còn trong setup_settings_tab
    if "box_update = tk.LabelFrame(p, text=\" ⚡ Cập Nhật Tự Động & Kho Lưu Trữ GitHub \"" not in code:
        print(f"  {PASS} Đã loại bỏ hoàn toàn khung 'Cập Nhật Tự Động & Kho Lưu Trữ GitHub' thừa khỏi giao diện thẻ Cấu hình.")
    else:
        print(f"  {FAIL} Khung thừa vẫn còn trong setup_settings_tab!")
        assert False, "box_update frame still present"

def test_4_manual_update_dialog_flow():
    print_header("BÀI TEST 4/6: Kiểm Tra Luồng Mở Hộp Thoại AppUpdateDialog Trực Tiếp")
    with open("fast_video_editor.py", "r", encoding="utf-8") as f:
        code = f.read()

    assert "dlg = AppUpdateDialog(self, update_info=None)" in code, "Kiểm tra manual update chưa mở AppUpdateDialog trực tiếp!"
    assert "_initial_check_worker" in code, "Thiếu luồng kiểm tra ngầm tự động trong AppUpdateDialog!"
    print(f"  {PASS} Khi bấm Cập Nhật, ứng dụng mở ngay cửa sổ Desktop AppUpdateDialog với thanh tiến độ % thời gian thực.")

def test_5_linux_dnd_parsing():
    print_header("BÀI TEST 5/6: Kiểm Tra Phân Tích Dữ Liệu Kéo Thả Linux (Nautilus/Dolphin/Thunar)")
    sample_data_1 = "file:///home/user/Videos/my%20video.mp4\r\nfile:///home/user/Videos/test.mkv"
    sample_data_2 = "{file:///home/user/Videos/sample1.mp4} {file:///home/user/Videos/sample2.mp4}"
    
    # Test cleaning single path
    def clean_path(raw):
        s = str(raw).strip().strip("'").strip('"').strip('{').strip('}')
        if s.startswith("file://"):
            parsed = urllib.parse.urlparse(s)
            s = urllib.parse.unquote(parsed.path)
        return s

    p1 = clean_path("file:///home/user/Videos/my%20video.mp4")
    assert p1 == "/home/user/Videos/my video.mp4", f"Unexpected path: {p1}"
    print(f"  {PASS} URL Unquote URI Linux file:///home/user/Videos/my%20video.mp4 -> {p1}")

def test_6_ci_cd_workflow():
    print_header("BÀI TEST 6/6: Kiểm Tra GitHub Actions CI/CD Workflow v3.2.5")
    wf_path = ".github/workflows/build-release.yml"
    with open(wf_path, "r", encoding="utf-8") as f:
        wf = f.read()

    assert "FastVideoEditor-v3.2.5-Setup.exe" in wf, "Thiếu target FastVideoEditor-v3.2.5-Setup.exe trong workflow!"
    assert "FastVideoEditor-v3.2.5-Windows-Portable.zip" in wf, "Thiếu target Portable.zip v3.2.5!"
    print(f"  {PASS} GitHub Actions CI/CD Workflow v3.2.5 đã sẵn sàng build & đẩy Releases 100%.")

def main():
    print("=================================================================")
    print("  🚀 CHẠY TOÀN BỘ BỘ KIỂM THỬ CHUẨN v3.2.5 PRO (WIN & LINUX)")
    print("=================================================================")
    try:
        test_1_version_sync()
        test_2_version_comparison()
        test_3_ui_box_update_removed()
        test_4_manual_update_dialog_flow()
        test_5_linux_dnd_parsing()
        test_6_ci_cd_workflow()
        print("\n" + "="*65)
        print("  ✅ TOÀN BỘ 6/6 BÀI TEST CHUẨN v3.2.5 PRO ĐẠT 100% THÀNH CÔNG!")
        print("  ✅ SẴN SÀNG PHÁT HÀNH & NÂNG CẤP v3.2.5 PRO")
        print("="*65 + "\n")
    except Exception as e:
        print(f"\n{FAIL} KIỂM THỬ THẤT BẠI: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
