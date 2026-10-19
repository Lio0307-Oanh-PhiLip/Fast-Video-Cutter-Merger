#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
  BỘ KIỂM THỬ CHUẨN HÓA TOÀN DIỆN - FAST VIDEO CUTTER & MERGER STUDIO v3.2.7 PRO
  Tác giả: TRỊNH PHI LÍP (philiptrinh1990@gmail.com | Zalo/VPBank: 0917417252)
=============================================================================
Kiểm tra toàn diện các hạng mục nâng cấp v3.2.7 PRO:
  1. Đồng bộ phiên bản v3.2.7 PRO trên toàn bộ mã nguồn, giao diện & bộ đóng gói.
  2. Bản quyền tác giả TRỊNH PHI LÍP, Email, Zalo, VPBank 0917417252 & Ma trận QR.
  3. Khắc phục triệt để Kéo & Thả Video trên Linux (X11/Wayland/XDND Tcl patch,
     Nautilus/Nemo/Dolphin/Thunar URI & tiếng Việt có dấu, chống treo hover %D).
  4. Hệ thống Cập Nhật Tự Động thông minh: kiểm tra ngầm khi khởi động, hộp thoại
     lựa chọn [Cập Nhật Ngay] hoặc [Bỏ Qua], chống lỗi 40% & chống tải nhầm bản cũ.
  5. Đóng gói GitHub Actions CI/CD, Linux .deb & .AppImage, Windows Inno Setup.
"""

import os
import re
import sys
import ast
import base64
import tempfile
import unittest
import urllib.parse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)


class TestFastVideoEditorV327(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.editor_path = os.path.join(BASE_DIR, "fast_video_editor.py")
        with open(cls.editor_path, "r", encoding="utf-8") as f:
            cls.editor_code = f.read()
        cls.tree = ast.parse(cls.editor_code, filename="fast_video_editor.py")

    def test_01_python_syntax_and_ast_integrity(self):
        """Kiểm tra cú pháp Python chuẩn xác trên tất cả các tệp .py chính"""
        py_files = ["fast_video_editor.py", "setup_wizard.py", "build_installer.py"]
        for fn in py_files:
            p = os.path.join(BASE_DIR, fn)
            self.assertTrue(os.path.exists(p), f"Thiếu file {fn}")
            with open(p, "r", encoding="utf-8") as f:
                src = f.read()
            parsed = ast.parse(src, filename=fn)
            self.assertIsNotNone(parsed)

    def test_02_version_synchronization_v327(self):
        """Đảm bảo đồng bộ tuyệt đối phiên bản 3.2.7 PRO trên toàn bộ công cụ và tệp đóng gói"""
        self.assertIn('CURRENT_APP_VERSION = "v3.2.7"', self.editor_code)
        self.assertIn("Fast Video Cutter & Merger Studio v3.2.7 PRO", self.editor_code)

        # Không còn chuỗi 3.2.3, 3.2.5 hay 3.2.6 sót lại trong fast_video_editor.py
        stale_versions = re.findall(r"3\.2\.[0-6]", self.editor_code)
        self.assertEqual(
            stale_versions, [],
            f"Phát hiện phiên bản cũ còn sót trong fast_video_editor.py: {stale_versions}"
        )

        # Kiểm tra các tệp đóng gói & giao diện Web
        critical_files = [
            "setup_wizard.py",
            "build_installer.py",
            "installer_windows.iss",
            "build_linux_deb.sh",
            "build_linux_appimage.sh",
            "src/App.tsx",
            "src/components/SettingsTab.tsx",
        ]
        for fn in critical_files:
            with open(os.path.join(BASE_DIR, fn), "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn("3.2.7", content, f"File {fn} chưa được nâng cấp lên 3.2.7")
            old_matches = re.findall(r"3\.2\.[0-6]", content)
            self.assertEqual(
                old_matches, [],
                f"File {fn} vẫn còn sót chuỗi phiên bản cũ: {old_matches}"
            )

    def test_03_author_copyright_and_vpbank_qr(self):
        """Kiểm tra thông tin bản quyền tác giả TRỊNH PHI LÍP, Email, Zalo & QR VPBank 0917417252"""
        self.assertIn('AUTHOR_NAME = "TRỊNH PHI LÍP"', self.editor_code)
        self.assertIn('AUTHOR_EMAIL = "philiptrinh1990@gmail.com"', self.editor_code)
        self.assertIn('AUTHOR_ZALO = "0917417252"', self.editor_code)
        self.assertIn('AUTHOR_BANK = "0917417252 - VPBank (TRỊNH PHI LÍP)"', self.editor_code)
        self.assertIn("VPBANK_QR_B64 =", self.editor_code)

        # Kiểm tra dữ liệu ảnh PNG nhúng sẵn VPBANK_QR_B64 hợp lệ
        m = re.search(r'VPBANK_QR_B64\s*=\s*"([^"]+)"', self.editor_code)
        self.assertIsNotNone(m)
        qr_bytes = base64.b64decode(m.group(1))
        self.assertTrue(qr_bytes.startswith(b"\x89PNG\r\n\x1a\n"), "VPBANK_QR_B64 phải là ảnh PNG chuẩn")

    def test_04_linux_xdnd_drag_and_drop_thorough_fix(self):
        """Kiểm tra khắc phục triệt để lỗi Kéo & Thả Video trên Linux (X11/Wayland/XDND)"""
        # 1. Phải có bản vá Tcl XDND chống treo hover NeedsPositionData và mở rộng MIME Linux
        self.assertIn("def _configure_tkdnd_linux_fixes(self):", self.editor_code)
        self.assertIn("proc ::tkdnd::xdnd::NeedsPositionData", self.editor_code)
        self.assertIn("text/uri-list;charset=utf-8", self.editor_code)
        self.assertIn("x-special/gnome-copied-files", self.editor_code)
        self.assertIn("x-special/mate-copied-files", self.editor_code)
        self.assertIn("x-special/nemo-copied-files", self.editor_code)
        self.assertIn("application/vnd.portal.files", self.editor_code)

        # 2. Phải bind <<DropEnter>> và <<DropPosition>> KHÔNG dùng %D để tránh XConvertSelection mỗi pixel
        self.assertIn("self.tk.call('bind', w._w, '<<DropEnter>>'", self.editor_code)
        self.assertIn("self.tk.call('bind', w._w, '<<DropPosition>>', 'return copy')", self.editor_code)

        # 3. Phải lắng nghe sự kiện chuyển Tab <<NotebookTabChanged>> để làm mới XdndAware trên X11
        self.assertIn("def _rebind_active_tab_dnd(self, event=None):", self.editor_code)
        self.assertIn('self.notebook.bind("<<NotebookTabChanged>>"', self.editor_code)

        # 4. Kiểm thử thực tế bộ giải mã đường dẫn kéo thả (_clean_single_path & _parse_dnd_event_data)
        env = {"os": os, "sys": sys, "re": re, "urllib": urllib}
        for node in self.tree.body:
            if isinstance(node, ast.ClassDef) and node.name == "VideoEditorApp":
                for method in node.body:
                    if isinstance(method, ast.FunctionDef) and method.name in ("_clean_single_path", "_parse_dnd_event_data"):
                        exec(compile(ast.Module(body=[method], type_ignores=[]), method.name, "exec"), env)

        self.assertIn("_clean_single_path", env)
        self.assertIn("_parse_dnd_event_data", env)

        class DummyTk:
            def splitlist(self, s):
                res = []
                i, n = 0, len(s)
                while i < n:
                    while i < n and s[i].isspace():
                        i += 1
                    if i >= n:
                        break
                    if s[i] == "{":
                        depth = 1
                        i += 1
                        start = i
                        while i < n and depth > 0:
                            if s[i] == "{":
                                depth += 1
                            elif s[i] == "}":
                                depth -= 1
                            i += 1
                        res.append(s[start:i - 1])
                    else:
                        start = i
                        while i < n and not s[i].isspace():
                            i += 1
                        res.append(s[start:i])
                return tuple(res)

        class DummyApp:
            tk = DummyTk()
            _clean_single_path = env["_clean_single_path"]
            _parse_dnd_event_data = env["_parse_dnd_event_data"]

        dummy = DummyApp()

        with tempfile.TemporaryDirectory() as tmpdir:
            f_vn = os.path.join(tmpdir, "Video Cắt Ghép 01.mp4")
            f_clip2 = os.path.join(tmpdir, "Clip 2.mkv")
            with open(f_vn, "wb") as f:
                f.write(b"0000")
            with open(f_clip2, "wb") as f:
                f.write(b"0000")

            # Case A: Nautilus / Nemo URI list với khoảng trắng (%20) và tiếng Việt UTF-8
            uri_vn = "file://" + urllib.parse.quote(f_vn)
            uri_clip2 = "file://" + urllib.parse.quote(f_clip2)
            raw_nautilus = f"{uri_vn}\r\n{uri_clip2}\r\n"
            parsed_a = dummy._parse_dnd_event_data(raw_nautilus)
            self.assertEqual(parsed_a, [os.path.normpath(f_vn), os.path.normpath(f_clip2)])

            # Case B: GNOME / MATE x-special/gnome-copied-files payload
            raw_gnome = f"copy\n{uri_vn}\n{uri_clip2}"
            parsed_b = dummy._parse_dnd_event_data(raw_gnome)
            self.assertEqual(parsed_b, [os.path.normpath(f_vn), os.path.normpath(f_clip2)])

            # Case C: KDE Dolphin file://localhost/ URI
            raw_kde = "file://localhost" + urllib.parse.quote(f_vn)
            parsed_c = dummy._parse_dnd_event_data(raw_kde)
            self.assertEqual(parsed_c, [os.path.normpath(f_vn)])

            # Case D: Tcl brace-wrapped paths có dấu cách trên Linux/Windows
            raw_tcl = f"{{{f_vn}}} {{{f_clip2}}}"
            parsed_d = dummy._parse_dnd_event_data(raw_tcl)
            self.assertEqual(parsed_d, [os.path.normpath(f_vn), os.path.normpath(f_clip2)])

    def test_05_smart_update_version_comparison_and_notification(self):
        """Kiểm tra logic so sánh phiên bản cập nhật (chống lỗi 40%, chống tải bản cũ, thông báo Cập Nhật / Bỏ Qua)"""
        env = {"re": re, "CURRENT_APP_VERSION": "v3.2.7"}
        for node in self.tree.body:
            if isinstance(node, ast.FunctionDef) and node.name in ("parse_version_tuple", "is_version_newer"):
                exec(compile(ast.Module(body=[node], type_ignores=[]), node.name, "exec"), env)

        is_newer = env["is_version_newer"]

        # Cùng phiên bản 3.2.7 -> KHÔNG báo có bản mới
        self.assertFalse(is_newer("v3.2.7", "v3.2.7"))
        self.assertFalse(is_newer("3.2.7 PRO", "v3.2.7"))
        # Phiên bản cũ hơn (3.2.6, 3.2.5) -> TUYỆT ĐỐI KHÔNG tải đè bản cũ
        self.assertFalse(is_newer("v3.2.6", "v3.2.7"))
        self.assertFalse(is_newer("v3.2.5", "v3.2.7"))
        # Phiên bản mới hơn (3.2.8, 3.3.0, 4.0.0) -> Báo có bản cập nhật mới
        self.assertTrue(is_newer("v3.2.8", "v3.2.7"))
        self.assertTrue(is_newer("v3.3.0 PRO", "v3.2.7"))
        self.assertTrue(is_newer("4.0.0", "v3.2.7"))

        # Kiểm tra sự tồn tại của tính năng thông báo cập nhật khi khởi động (Cập Nhật Ngay / Bỏ Qua)
        self.assertIn("def start_background_update_check(self):", self.editor_code)
        self.assertIn("def show_update_banner(self, update_info):", self.editor_code)
        self.assertIn("def skip_update_notification(self, skipped_ver=None):", self.editor_code)
        self.assertIn("⚡ Cập Nhật Ngay", self.editor_code)
        self.assertIn("⏭️ Bỏ Qua", self.editor_code)

    def test_06_github_workflow_and_linux_packaging(self):
        """Kiểm tra cấu hình đóng gói GitHub Actions & Linux .deb / .AppImage"""
        wf_path = os.path.join(BASE_DIR, ".github", "workflows", "build-release.yml")
        self.assertTrue(os.path.exists(wf_path))
        with open(wf_path, "r", encoding="utf-8") as f:
            wf_txt = f.read()

        self.assertIn("permissions:", wf_txt)
        self.assertIn("contents: write", wf_txt)
        self.assertIn("--collect-all tkinterdnd2", wf_txt)
        self.assertIn("./build_linux_deb.sh", wf_txt)

        deb_path = os.path.join(BASE_DIR, "build_linux_deb.sh")
        with open(deb_path, "r", encoding="utf-8") as f:
            deb_txt = f.read()
        self.assertIn('VERSION="3.2.7"', deb_txt)
        self.assertIn("tkinterdnd2", deb_txt)
        self.assertIn("dpkg-deb --root-owner-group --build", deb_txt)

    def test_07_draggable_timeline_playhead_cut_overlap_and_scrubbing(self):
        """
        Kiểm tra triệt để lỗi thanh tua màu đỏ (Playhead 'cur') khi trùng với điểm cắt ('start' / 'end'):
        - Khi cur == start (ví dụ 00:00:00) hoặc cur == end (ví dụ 00:29:59):
          + Nhấp vào đầu ghim đỏ (y < track_y) hoặc tâm kim đỏ (x == x_cur) PHẢI chọn 'cur' (kéo thanh tua màu đỏ),
            tuyệt đối không kéo nhầm điểm cắt và không làm thay đổi mốc cắt start/end.
          + Nhấp vào cánh ngoài bên trái của tam giác Đầu (x_s - 6, y >= track_y) vẫn kéo được 'start'.
          + Nhấp vào cánh ngoài bên phải của tam giác Cuối (x_e + 6, y >= track_y) vẫn kéo được 'end'.
        """
        class FakeCanvasBase:
            def __init__(self, parent=None, **kwargs):
                self._w_px = int(kwargs.get("width", 400))
                self._h_px = int(kwargs.get("height", 52))
                self.cursor = kwargs.get("cursor", "hand2")

            def bind(self, *args, **kwargs):
                pass

            def winfo_width(self):
                return self._w_px

            def winfo_height(self):
                return self._h_px

            def cget(self, key):
                if key == "width":
                    return self._w_px
                if key == "height":
                    return self._h_px
                return ""

            def config(self, **kwargs):
                if "cursor" in kwargs:
                    self.cursor = kwargs["cursor"]

            def delete(self, *args):
                pass

            def create_rectangle(self, *args, **kwargs):
                pass

            def create_line(self, *args, **kwargs):
                pass

            def create_polygon(self, *args, **kwargs):
                pass

            def create_text(self, *args, **kwargs):
                pass

        class FakeTkModule:
            Canvas = FakeCanvasBase

        env = {"tk": FakeTkModule}
        for node in self.tree.body:
            if isinstance(node, ast.FunctionDef) and node.name == "format_seconds":
                exec(compile(ast.Module(body=[node], type_ignores=[]), "format_seconds", "exec"), env)
            elif isinstance(node, ast.ClassDef) and node.name == "DraggableTimeline":
                exec(compile(ast.Module(body=[node], type_ignores=[]), "DraggableTimeline", "exec"), env)

        self.assertIn("DraggableTimeline", env)
        DraggableTimeline = env["DraggableTimeline"]

        seek_calls = []
        change_calls = []
        tl = DraggableTimeline(
            None,
            duration=1800.0,  # 00:30:00
            width=400,
            height=52,
            on_change_callback=lambda s, e, c: change_calls.append((round(s, 1), round(e, 1), round(c, 1))),
            on_seek_callback=lambda c: seek_calls.append(round(c, 1)),
        )

        class Ev:
            def __init__(self, x, y):
                self.x = x
                self.y = y

        # =================================================================
        # CASE 1 (Hình 2): Thanh tua màu đỏ trùng với Điểm Đầu [IN] tại 00:00:00
        # =================================================================
        tl.set_times(0.0, 900.0, 0.0)
        x_s = tl._time_to_x(0.0)
        x_cur = tl._time_to_x(0.0)
        self.assertAlmostEqual(x_s, x_cur)

        # 1a. Nhấp vào đầu ghim màu đỏ (y=10) hoặc tâm kim đỏ (y=26) tại x_cur -> Phải bắt đúng 'cur'!
        self.assertEqual(tl._pick_handle(x_cur, 10), "cur")
        self.assertEqual(tl._pick_handle(x_cur, 26), "cur")

        # 1b. Thực hiện Click & Kéo từ x_cur sang phải (tới giữa thanh = 900s) -> Chỉ di chuyển 'cur', giữ nguyên start=0.0!
        seek_calls.clear()
        change_calls.clear()
        tl.on_mouse_down(Ev(x_cur, 12))
        self.assertEqual(tl.dragging, "cur")
        tl.on_mouse_move(Ev(tl._time_to_x(450.0), 12))
        tl.on_mouse_up(Ev(tl._time_to_x(450.0), 12))

        self.assertAlmostEqual(tl.current_time, 450.0, places=1)
        self.assertAlmostEqual(tl.start_time, 0.0, places=1)  # Điểm cắt Đầu KHÔNG bị kéo theo!
        self.assertEqual(change_calls, [])  # Không kích hoạt cắt lọc nhầm!
        self.assertTrue(len(seek_calls) >= 1 and abs(seek_calls[-1] - 450.0) < 1.0)

        # 1c. Khi trùng nhau tại 0.0, nếu người dùng muốn kéo mốc Đầu [IN], nhấp vào cánh trái (x_s - 6, y=28) -> Bắt 'start'
        tl.set_times(0.0, 900.0, 0.0)
        self.assertEqual(tl._pick_handle(x_s - 6, 28), "start")

        # =================================================================
        # CASE 2 (Hình 1): Thanh tua màu đỏ trùng với Điểm Cuối [OUT] tại 00:29:59
        # =================================================================
        tl.set_times(1358.0, 1799.0, 1799.0)
        x_e = tl._time_to_x(1799.0)
        x_cur = tl._time_to_x(1799.0)
        self.assertAlmostEqual(x_e, x_cur)

        # 2a. Nhấp vào đầu ghim đỏ (y=10) hoặc tâm kim đỏ (y=26) tại x_cur -> Phải bắt đúng 'cur'!
        self.assertEqual(tl._pick_handle(x_cur, 10), "cur")
        self.assertEqual(tl._pick_handle(x_cur, 26), "cur")

        # 2b. Kéo thanh tua đỏ về 1500.0s -> Chỉ di chuyển 'cur', giữ nguyên end=1799.0!
        seek_calls.clear()
        change_calls.clear()
        tl.on_mouse_down(Ev(x_cur, 15))
        self.assertEqual(tl.dragging, "cur")
        tl.on_mouse_move(Ev(tl._time_to_x(1500.0), 15))
        tl.on_mouse_up(Ev(tl._time_to_x(1500.0), 15))

        self.assertAlmostEqual(tl.current_time, 1500.0, places=1)
        self.assertAlmostEqual(tl.end_time, 1799.0, places=1)  # Điểm cắt Cuối KHÔNG bị kéo theo!
        self.assertEqual(change_calls, [])

        # 2c. Khi trùng nhau tại 1799.0, nếu nhấp vào cánh phải của tam giác Cuối (x_e + 6, y=28) -> Bắt 'end'
        tl.set_times(1358.0, 1799.0, 1799.0)
        self.assertEqual(tl._pick_handle(x_e + 6, 28), "end")

        # =================================================================
        # CASE 3: Kéo độc lập Điểm Đầu ('start') và Điểm Cuối ('end') khi không trùng
        # =================================================================
        tl.set_times(300.0, 1200.0, 750.0)
        change_calls.clear()
        tl.on_mouse_down(Ev(tl._time_to_x(300.0), 28))
        self.assertEqual(tl.dragging, "start")
        tl.on_mouse_move(Ev(tl._time_to_x(400.0), 28))
        tl.on_mouse_up(Ev(tl._time_to_x(400.0), 28))
        self.assertAlmostEqual(tl.start_time, 400.0, places=1)
        self.assertAlmostEqual(tl.current_time, 750.0, places=1)
        self.assertTrue(len(change_calls) >= 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
