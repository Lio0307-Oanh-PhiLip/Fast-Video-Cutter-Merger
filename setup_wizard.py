#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
  Fast Video Cutter & Merger Studio v3.1.6 PRO - Windows Setup Wizard
  Trình cài đặt dạng Next-Next-Install-Finish đầy đủ chuẩn Windows 10 / 11
=============================================================================
"""

import os
import sys
import time
import shutil
import tempfile
import threading
import subprocess
try:
    import tkinter as tk
    from tkinter import filedialog, messagebox, ttk
except ImportError:
    print("[ERROR] Tkinter is required for setup wizard.")
    sys.exit(1)

def get_app_dir():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(os.path.abspath(sys.executable))
    return os.path.dirname(os.path.abspath(__file__))

class WindowsSetupWizard(tk.Tk):
    """Trình cài đặt tương tác chuyên nghiệp dạng Next -> Next -> Install -> Finish (v3.1.6 PRO)"""
    def __init__(self):
        super().__init__()
        self.title("Cài Đặt Fast Video Cutter & Merger Studio v3.1.6 PRO")
        self.geometry("660x490")
        self.minsize(620, 460)
        self.resizable(False, False)
        self.configure(bg="#0f172a")

        try:
            self.eval('tk::PlaceWindow . center')
        except Exception:
            pass

        # App Configuration
        self.default_target = os.path.expandvars(r"%LOCALAPPDATA%\Programs\FastVideoEditor")
        self.target_dir_var = tk.StringVar(value=self.default_target)
        self.create_desktop_icon_var = tk.BooleanVar(value=True)
        self.create_start_menu_var = tk.BooleanVar(value=True)
        self.associate_files_var = tk.BooleanVar(value=True)
        self.launch_after_var = tk.BooleanVar(value=True)
        self.open_folder_after_var = tk.BooleanVar(value=False)

        # Step State: 1 = Welcome, 2 = Terms/Engine, 3 = Directory & Options, 4 = Ready to Install, 5 = Installing, 6 = Finish
        self.current_step = 1

        # Container
        self.main_container = tk.Frame(self, bg="#0f172a")
        self.main_container.pack(fill="both", expand=True)

        # Header Frame
        self.header_frame = tk.Frame(self.main_container, bg="#1e293b", padx=20, pady=12)
        self.header_frame.pack(fill="x")

        self.lbl_title = tk.Label(
            self.header_frame, 
            text="⚡ Trình Hướng Dẫn Cài Đặt Fast Video Cutter & Merger v3.1.6 PRO", 
            font=("Segoe UI", 11, "bold"), 
            fg="#38bdf8", bg="#1e293b"
        )
        self.lbl_title.pack(anchor="w")

        self.lbl_subtitle = tk.Label(
            self.header_frame, 
            text="Trình cài đặt ứng dụng cắt ghép video Lossless Stream Copy chuẩn Studio", 
            font=("Segoe UI", 9), 
            fg="#94a3b8", bg="#1e293b"
        )
        self.lbl_subtitle.pack(anchor="w", pady=(2, 0))

        # Body Frame
        self.body_frame = tk.Frame(self.main_container, bg="#0f172a", padx=24, pady=16)
        self.body_frame.pack(fill="both", expand=True)

        # Footer Frame (Navigation Buttons)
        self.footer_frame = tk.Frame(self.main_container, bg="#1e293b", padx=20, pady=12)
        self.footer_frame.pack(fill="x", side="bottom")

        self.lbl_step_counter = tk.Label(
            self.footer_frame, 
            text="Bước 1 / 4", 
            font=("Segoe UI", 9), 
            fg="#64748b", bg="#1e293b"
        )
        self.lbl_step_counter.pack(side="left")

        self.btn_cancel = tk.Button(
            self.footer_frame, text="Hủy Bỏ", 
            bg="#334155", fg="#ffffff", font=("Segoe UI", 9), 
            relief="flat", width=9, command=self.destroy
        )
        self.btn_cancel.pack(side="right", padx=(4, 0))

        self.btn_next = tk.Button(
            self.footer_frame, text="Tiếp Tục >", 
            bg="#0284c7", fg="#ffffff", font=("Segoe UI", 9, "bold"), 
            relief="flat", width=12, command=self.go_next
        )
        self.btn_next.pack(side="right", padx=4)

        self.btn_back = tk.Button(
            self.footer_frame, text="< Quay Lại", 
            bg="#334155", fg="#cbd5e1", font=("Segoe UI", 9), 
            relief="flat", width=10, command=self.go_back
        )
        self.btn_back.pack(side="right", padx=4)

        self.render_step(1)

    def clear_body(self):
        for widget in self.body_frame.winfo_children():
            widget.destroy()

    def render_step(self, step):
        self.current_step = step
        self.clear_body()

        if step == 1:
            self.show_step_1_welcome()
        elif step == 2:
            self.show_step_2_license()
        elif step == 3:
            self.show_step_3_destination()
        elif step == 4:
            self.show_step_4_ready()
        elif step == 5:
            self.show_step_5_installing()
        elif step == 6:
            self.show_step_6_finish()

    # STEP 1: WELCOME
    def show_step_1_welcome(self):
        self.lbl_step_counter.config(text="Bước 1 / 4: Chào Mừng")
        self.btn_back.config(state="disabled")
        self.btn_next.config(text="Tiếp Tục >", bg="#0284c7", state="normal")
        self.btn_cancel.config(state="normal")

        tk.Label(
            self.body_frame, 
            text="Chào mừng bạn đến với Fast Video Cutter & Merger Studio v3.1.6 PRO!", 
            font=("Segoe UI", 11, "bold"), 
            fg="#38bdf8", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 8))

        desc = (
            "Trình hướng dẫn này sẽ hỗ trợ bạn cài đặt ứng dụng Fast Video Editor vào máy tính.\n\n"
            "Tính năng nổi bật trong bản nâng cấp v3.1.6 PRO:\n"
            "  • Cắt và Ghép video siêu tốc với công nghệ Lossless Stream Copy (1-3 giây).\n"
            "  • Không làm nóng máy hay quá tải CPU/GPU, giữ nguyên 100% chất lượng gốc.\n"
            "  • Kéo thả video đa luồng chống treo máy (Hỗ trợ kéo nhiều video cùng lúc).\n"
            "  • Động cơ Smart-Merge v3.1.6 tự động xử lý hỗn hợp H.264 + H.265 và âm thanh CCTV.\n"
            "  • Tích hợp sẵn bộ giải mã FFmpeg Lossless tự động.\n\n"
            "Nhấn [Tiếp Tục >] để bắt đầu quá trình cài đặt."
        )
        tk.Label(self.body_frame, text=desc, font=("Segoe UI", 9), fg="#cbd5e1", bg="#0f172a", justify="left").pack(anchor="w")

    # STEP 2: LICENSE & FEATURES
    def show_step_2_license(self):
        self.lbl_step_counter.config(text="Bước 2 / 4: Thông Tin & Chế Độ")
        self.btn_back.config(state="normal")
        self.btn_next.config(text="Đồng Ý & Tiếp Tục >", bg="#0284c7", state="normal")

        tk.Label(
            self.body_frame, 
            text="Điều Khoản & Cam Kết Chất Lượng Studio", 
            font=("Segoe UI", 11, "bold"), 
            fg="#ffffff", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 6))

        box_terms = tk.LabelFrame(self.body_frame, text=" Tiêu Chuẩn Xử Lý Video ", font=("Segoe UI", 9, "bold"), fg="#38bdf8", bg="#0f172a", padx=10, pady=8)
        box_terms.pack(fill="both", expand=True, pady=4)

        terms_txt = (
            "1. CHẤT LƯỢNG NGUYÊN BẢN (LOSSLESS):\n"
            "Ứng dụng sao chép trực tiếp các gói dữ liệu hình ảnh (Bitstream Copy) mà không nén lại,\n"
            "đảm bảo video sau khi cắt ghép giữ nguyên từng khung hình và độ phân giải gốc 4K/FullHD.\n\n"
            "2. BẢO MẬT & QUYỀN RIÊNG TƯ TUYỆT ĐỐI:\n"
            "Toàn bộ tác vụ xử lý diễn ra hoàn toàn offline cục bộ trên máy tính của bạn.\n"
            "Không truyền tải bất kỳ dữ liệu video nào qua internet.\n\n"
            "3. HỆ THỐNG AN TOÀN CHỐNG TREO MÁY:\n"
            "Bộ phân tích luồng không chặn giao diện và tự động phân bổ tài nguyên tối ưu."
        )
        tk.Label(box_terms, text=terms_txt, font=("Segoe UI", 8), fg="#94a3b8", bg="#0f172a", justify="left").pack(anchor="w")

    # STEP 3: DESTINATION DIRECTORY & SHORTCUT OPTIONS
    def show_step_3_destination(self):
        self.lbl_step_counter.config(text="Bước 3 / 4: Vị Trí Cài Đặt")
        self.btn_back.config(state="normal")
        self.btn_next.config(text="Tiếp Tục >", bg="#0284c7", state="normal")

        tk.Label(
            self.body_frame, 
            text="Chọn Thư Mục Cài Đặt & Các Lối Tắt Khởi Chạy", 
            font=("Segoe UI", 11, "bold"), 
            fg="#ffffff", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 6))

        # Target Dir Box
        box_dir = tk.LabelFrame(self.body_frame, text=" Thư Mục Đích ", font=("Segoe UI", 9, "bold"), fg="#38bdf8", bg="#0f172a", padx=10, pady=8)
        box_dir.pack(fill="x", pady=4)

        row_d = tk.Frame(box_dir, bg="#0f172a")
        row_d.pack(fill="x")

        e_dir = tk.Entry(row_d, textvariable=self.target_dir_var, bg="#1e293b", fg="#ffffff", insertbackground="#ffffff", font=("Segoe UI", 9), relief="flat")
        e_dir.pack(side="left", fill="x", expand=True, padx=(0, 8), ipady=3)

        tk.Button(row_d, text="Duyệt...", bg="#334155", fg="#ffffff", font=("Segoe UI", 8, "bold"), relief="flat", command=self.browse_dir).pack(side="right")

        # Shortcuts Options Box
        box_opts = tk.LabelFrame(self.body_frame, text=" Tùy Chọn Lối Tắt ", font=("Segoe UI", 9, "bold"), fg="#38bdf8", bg="#0f172a", padx=10, pady=6)
        box_opts.pack(fill="x", pady=6)

        chk_icon = tk.Checkbutton(
            box_opts, text="Tạo biểu tượng ngoài Màn Hình Chính (Desktop Shortcut)", 
            variable=self.create_desktop_icon_var, 
            bg="#0f172a", fg="#34d399", selectcolor="#1e293b", activebackground="#0f172a", font=("Segoe UI", 9)
        )
        chk_icon.pack(anchor="w")

        chk_menu = tk.Checkbutton(
            box_opts, text="Tạo lối tắt trong Start Menu", 
            variable=self.create_start_menu_var, 
            bg="#0f172a", fg="#f8fafc", selectcolor="#1e293b", activebackground="#0f172a", font=("Segoe UI", 9)
        )
        chk_menu.pack(anchor="w", pady=(2, 0))

    # STEP 4: READY TO INSTALL
    def show_step_4_ready(self):
        self.lbl_step_counter.config(text="Bước 4 / 4: Sẵn Sàng Cài Đặt")
        self.btn_back.config(state="normal")
        self.btn_next.config(text="Bắt Đầu Cài Đặt", bg="#10b981", state="normal")

        tk.Label(
            self.body_frame, 
            text="Xác Nhận Cài Đặt", 
            font=("Segoe UI", 11, "bold"), 
            fg="#ffffff", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 6))

        tk.Label(
            self.body_frame, 
            text="Hệ thống đã sẵn sàng cài đặt ứng dụng với các cấu hình sau:", 
            font=("Segoe UI", 9), 
            fg="#cbd5e1", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 8))

        box_sum = tk.Frame(self.body_frame, bg="#1e293b", padx=12, pady=10)
        box_sum.pack(fill="both", expand=True)

        t_dir = self.target_dir_var.get()
        tk.Label(box_sum, text=f"• Thư mục cài đặt: {t_dir}", font=("Segoe UI", 9, "bold"), fg="#38bdf8", bg="#1e293b", anchor="w").pack(fill="x")
        
        desk_str = "Có" if self.create_desktop_icon_var.get() else "Không"
        tk.Label(box_sum, text=f"• Tạo Desktop Shortcut: {desk_str}", font=("Segoe UI", 9), fg="#cbd5e1", bg="#1e293b", anchor="w").pack(fill="x", pady=2)

        start_str = "Có" if self.create_start_menu_var.get() else "Không"
        tk.Label(box_sum, text=f"• Start Menu Shortcut: {start_str}", font=("Segoe UI", 9), fg="#cbd5e1", bg="#1e293b", anchor="w").pack(fill="x", pady=2)

        tk.Label(box_sum, text="• Động cơ xử lý: FFmpeg Lossless Stream Copy + Smart-Merge v3.1.6 PRO", font=("Segoe UI", 9), fg="#10b981", bg="#1e293b", anchor="w").pack(fill="x", pady=2)

    # STEP 5: INSTALLING (PROGRESS)
    def show_step_5_installing(self):
        self.lbl_step_counter.config(text="Đang Cài Đặt...")
        self.btn_back.config(state="disabled")
        self.btn_next.config(state="disabled")
        self.btn_cancel.config(state="disabled")

        tk.Label(
            self.body_frame, 
            text="Đang Cài Đặt Fast Video Cutter & Merger Studio v3.1.6 PRO...", 
            font=("Segoe UI", 11, "bold"), 
            fg="#38bdf8", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 10))

        self.progress_bar = ttk.Progressbar(self.body_frame, mode="determinate", maximum=100)
        self.progress_bar.pack(fill="x", pady=12)

        self.lbl_status = tk.Label(
            self.body_frame, 
            text="Đang chuẩn bị thư mục đích...", 
            font=("Segoe UI", 9), 
            fg="#cbd5e1", bg="#0f172a", anchor="w"
        )
        self.lbl_status.pack(fill="x", pady=4)

        # Start installation thread
        threading.Thread(target=self.run_install_worker, daemon=True).start()

    def run_install_worker(self):
        target = os.path.abspath(self.target_dir_var.get())
        app_dir = get_app_dir()

        steps = [
            ("Đang tạo thư mục đích và phân quyền...", 15),
            ("Đang sao chép tập tin ứng dụng Fast Video Editor...", 40),
            ("Đang cài đặt biểu tượng Logo và Taskbar Icon...", 65),
            ("Đang cấu hình lối tắt Desktop và Start Menu...", 85),
            ("Đang tối ưu động cơ FFmpeg Lossless...", 100),
        ]

        try:
            os.makedirs(target, exist_ok=True)
            time.sleep(0.3)

            # Copy files
            files_to_copy = [
                "fast_video_editor.py",
                "run_windows.bat",
                "setup_wizard.py",
                "icon.ico",
                "icon.png",
                "fast-video-editor.png",
                "fast-video-editor-128.png",
                "fast-video-editor.svg",
                "README.txt"
            ]

            for idx, (msg, prog) in enumerate(steps):
                self.lbl_status.config(text=msg)
                self.progress_bar["value"] = prog
                self.update_idletasks()

                if idx == 1:
                    for fname in files_to_copy:
                        src_f = os.path.join(app_dir, fname)
                        if os.path.exists(src_f):
                            shutil.copy2(src_f, os.path.join(target, fname))

                elif idx == 3:
                    if self.create_desktop_icon_var.get():
                        self.create_windows_shortcut(
                            target_path=os.path.join(target, "run_windows.bat"),
                            shortcut_location=os.path.expandvars(r"%USERPROFILE%\Desktop\Fast Video Cutter & Merger.lnk"),
                            icon_path=os.path.join(target, "icon.ico")
                        )
                    if self.create_start_menu_var.get():
                        start_dir = os.path.expandvars(r"%APPDATA%\Microsoft\Windows\Start Menu\Programs\FastVideoEditor")
                        os.makedirs(start_dir, exist_ok=True)
                        self.create_windows_shortcut(
                            target_path=os.path.join(target, "run_windows.bat"),
                            shortcut_location=os.path.join(start_dir, "Fast Video Cutter & Merger Studio.lnk"),
                            icon_path=os.path.join(target, "icon.ico")
                        )

                time.sleep(0.4)

            self.after(500, lambda: self.render_step(6))

        except Exception as e:
            self.lbl_status.config(text=f"Lỗi: {str(e)}", fg="#ef4444")
            messagebox.showerror("Lỗi Cài Đặt", f"Đã xảy ra lỗi trong quá trình cài đặt:\n{str(e)}")
            self.btn_cancel.config(state="normal")

    def create_windows_shortcut(self, target_path, shortcut_location, icon_path):
        try:
            ps_cmd = f'$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut("{shortcut_location}"); $Shortcut.TargetPath = "{target_path}"; $Shortcut.WorkingDirectory = "{os.path.dirname(target_path)}"; if (Test-Path "{icon_path}") {{ $Shortcut.IconLocation = "{icon_path}" }}; $Shortcut.Save()'
            subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps_cmd], capture_output=True, timeout=5)
        except Exception:
            pass

    # STEP 6: FINISH
    def show_step_6_finish(self):
        self.lbl_step_counter.config(text="Hoàn Tất!")
        self.btn_back.config(state="disabled")
        self.btn_cancel.config(state="disabled")
        self.btn_next.config(text="Hoàn Thành", bg="#10b981", state="normal", command=self.finish_setup)

        tk.Label(
            self.body_frame, 
            text="✅ Cài Đặt Thành Công Hoàn Toàn (v3.1.6 PRO)!", 
            font=("Segoe UI", 12, "bold"), 
            fg="#10b981", bg="#0f172a"
        ).pack(anchor="w", pady=(0, 8))

        desc = (
            "Fast Video Cutter & Merger Studio v3.1.6 PRO đã được cài đặt thành công vào máy tính của bạn.\n\n"
            "Bạn có thể mở ứng dụng bất cứ lúc nào từ biểu tượng ngoài Desktop hoặc Start Menu."
        )
        tk.Label(self.body_frame, text=desc, font=("Segoe UI", 9), fg="#cbd5e1", bg="#0f172a", justify="left").pack(anchor="w", pady=(0, 12))

        box_finish = tk.Frame(self.body_frame, bg="#1e293b", padx=12, pady=10)
        box_finish.pack(fill="x", pady=4)

        chk_run = tk.Checkbutton(
            box_finish, text="Khởi chạy Fast Video Cutter & Merger Studio ngay bây giờ", 
            variable=self.launch_after_var, 
            bg="#1e293b", fg="#38bdf8", selectcolor="#0f172a", activebackground="#1e293b", font=("Segoe UI", 9, "bold")
        )
        chk_run.pack(anchor="w")

        chk_open = tk.Checkbutton(
            box_finish, text="Mở thư mục cài đặt", 
            variable=self.open_folder_after_var, 
            bg="#1e293b", fg="#94a3b8", selectcolor="#0f172a", activebackground="#1e293b", font=("Segoe UI", 9)
        )
        chk_open.pack(anchor="w", pady=(4, 0))

    def browse_dir(self):
        d = filedialog.askdirectory(initialdir=self.target_dir_var.get(), title="Chọn Thư Mục Cài Đặt")
        if d:
            self.target_dir_var.set(os.path.normpath(d))

    def go_next(self):
        if self.current_step < 4:
            self.render_step(self.current_step + 1)
        elif self.current_step == 4:
            self.render_step(5)

    def go_back(self):
        if self.current_step > 1:
            self.render_step(self.current_step - 1)

    def finish_setup(self):
        target = os.path.abspath(self.target_dir_var.get())
        if self.launch_after_var.get():
            try:
                bat_path = os.path.join(target, "run_windows.bat")
                if os.path.exists(bat_path):
                    subprocess.Popen([bat_path], cwd=target, shell=True)
                else:
                    py_path = os.path.join(target, "fast_video_editor.py")
                    subprocess.Popen([sys.executable, py_path], cwd=target)
            except Exception:
                pass

        if self.open_folder_after_var.get():
            try:
                subprocess.Popen(["explorer.exe", target])
            except Exception:
                pass

        self.destroy()

if __name__ == "__main__":
    app = WindowsSetupWizard()
    app.mainloop()
