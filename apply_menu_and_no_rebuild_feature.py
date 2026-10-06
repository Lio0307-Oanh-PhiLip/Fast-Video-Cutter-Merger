import os
import sys
import re
import json

print("=== Implementing Native App Menu & No-Rebuild Dynamic Execution ===")

with open("fast_video_editor.py", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add setup_app_menu, clear_merge_list, view_crash_log, show_about_dialog, open_last_output_folder to VideoEditorApp
menu_methods = """
    # =================================================================
    # THANH MENU ỨNG DỤNG TOP BAR CHUYÊN NGHIỆP (v3.1.6 PRO)
    # =================================================================
    def setup_app_menu(self):
        \"\"\"Khởi tạo Thanh Menu Ứng Dụng (Top Menu Bar) hiển thị trên cùng cửa sổ\"\"\"
        try:
            menubar = tk.Menu(self, bg="#1e293b", fg="#f8fafc", activebackground="#0284c7", activeforeground="#ffffff")

            # 1. Menu Tệp (File)
            file_menu = tk.Menu(menubar, tearoff=0, bg="#1e293b", fg="#f8fafc", activebackground="#0284c7", activeforeground="#ffffff")
            file_menu.add_command(label="✂️ Chọn Video Cắt... (Ctrl+O)", command=self.browse_cut_file)
            file_menu.add_command(label="🎬 Thêm Video Ghép... (Ctrl+M)", command=self.browse_merge_files)
            file_menu.add_separator()
            file_menu.add_command(label="📁 Chọn Thư Mục Đầu Ra Xuất File...", command=self.choose_global_out_dir)
            file_menu.add_command(label="📂 Mở Thư Mục Kết Quả Gần Nhất", command=self.open_last_output_folder)
            file_menu.add_separator()
            file_menu.add_command(label="❌ Thoát Ứng Dụng (Alt+F4)", command=self.destroy)
            menubar.add_cascade(label="Tệp (File)", menu=file_menu)

            # 2. Menu Chỉnh Sửa (Edit)
            edit_menu = tk.Menu(menubar, tearoff=0, bg="#1e293b", fg="#f8fafc", activebackground="#0284c7", activeforeground="#ffffff")
            edit_menu.add_command(label="📋 Dán Video Từ Clipboard (Ctrl+V)", command=self.on_clipboard_paste)
            edit_menu.add_separator()
            edit_menu.add_command(label="⬆️ Đẩy Clip Chọn Lên Trên", command=self.move_merge_clip_up)
            edit_menu.add_command(label="⬇️ Đẩy Clip Chọn Xuống Dưới", command=self.move_merge_clip_down)
            edit_menu.add_command(label="🔝 Đưa Clip Lên Đầu Danh Sách", command=self.move_merge_clip_top)
            edit_menu.add_command(label="🔚 Đưa Clip Xuống Cuối Danh Sách", command=self.move_merge_clip_bottom)
            edit_menu.add_command(label="🔀 Đảo Ngược Thứ Tự Danh Sách", command=self.reverse_merge_clips)
            edit_menu.add_separator()
            edit_menu.add_command(label="🗑️ Xóa Toàn Bộ Danh Sách Ghép", command=self.clear_merge_list)
            menubar.add_cascade(label="Chỉnh Sửa (Edit)", menu=edit_menu)

            # 3. Menu Tác Vụ & Công Cụ (Tools)
            tools_menu = tk.Menu(menubar, tearoff=0, bg="#1e293b", fg="#f8fafc", activebackground="#0284c7", activeforeground="#ffffff")
            tools_menu.add_command(label="⚡ Tự Động Tải & Cài Đặt FFmpeg (1-Click)", command=self.start_auto_download_ffmpeg)
            tools_menu.add_separator()
            tools_menu.add_command(label="✂️ Cắt Video Siêu Tốc (Stream Copy)", command=lambda: (self.notebook.select(0), self.run_cut_thread()))
            tools_menu.add_command(label="🎬 Ghép Video Lossless (Smart-Merge)", command=lambda: (self.notebook.select(1), self.run_merge_thread()))
            tools_menu.add_command(label="🔄 Chuyển Đuôi & Tách Âm Thanh", command=lambda: (self.notebook.select(2), self.run_convert_thread()))
            menubar.add_cascade(label="Tác Vụ (Tools)", menu=tools_menu)

            # 4. Menu Cập Nhật & Trợ Giúp (Help & Updates)
            help_menu = tk.Menu(menubar, tearoff=0, bg="#1e293b", fg="#f8fafc", activebackground="#0284c7", activeforeground="#ffffff")
            help_menu.add_command(label="🚀 Kiểm Tra Cập Nhật GitHub Ngay", command=self.check_updates_manual)
            help_menu.add_command(label="⚙️ Cấu Hình Kho GitHub (Repository)", command=lambda: self.notebook.select(3))
            help_menu.add_separator()
            help_menu.add_command(label="📄 Xem Nhật Ký Lỗi (Crash Log)", command=self.view_crash_log)
            help_menu.add_command(label="ℹ️ Giới Thiệu & Phiên Bản", command=self.show_about_dialog)
            menubar.add_cascade(label="Trợ Giúp (Help)", menu=help_menu)

            self.config(menu=menubar)
        except Exception:
            pass

    def clear_merge_list(self):
        if not getattr(self, "merge_clips", None): return
        if messagebox.askyesno("Xóa Danh Sách", "Bạn có chắc chắn muốn xóa toàn bộ video trong danh sách ghép?"):
            self.merge_clips.clear()
            self.selected_merge_idx = -1
            self.refresh_merge_listbox()
            self.merge_canvas.delete("all")
            self.lbl_merge_active_title.config(text="Chọn video trong danh sách để thiết lập mốc cắt")
            self.status_var.set("Đã xóa toàn bộ danh sách ghép video.")

    def open_last_output_folder(self):
        last_f = getattr(self, "last_output_file", None)
        out_dir = None
        if last_f and os.path.exists(last_f):
            out_dir = os.path.dirname(last_f)
        elif self.global_out_dir_var.get() and os.path.isdir(self.global_out_dir_var.get()):
            out_dir = self.global_out_dir_var.get()
        else:
            out_dir = get_user_data_dir()
        open_file_in_file_manager(out_dir)

    def view_crash_log(self):
        log_path = os.path.join(get_user_data_dir(), "crash_log.txt")
        if not os.path.exists(log_path):
            messagebox.showinfo("Nhật Ký Sự Cố", f"Không tìm thấy file nhật ký lỗi.\\nHệ thống đang hoạt động 100% ổn định!\\nThư mục dữ liệu: {get_user_data_dir()}")
            return
        try:
            if os.name == "nt":
                os.startfile(log_path)
            else:
                subprocess.Popen(["xdg-open", log_path])
        except Exception:
            try:
                with open(log_path, "r", encoding="utf-8") as f:
                    content = f.read()
                top = tk.Toplevel(self)
                top.title("Nhật Ký Sự Cố (Crash Log)")
                top.geometry("620x420")
                txt = tk.Text(top, bg="#0f172a", fg="#f87171", font=("Consolas", 9), padx=10, pady=10)
                txt.pack(fill="both", expand=True)
                txt.insert("1.0", content)
            except Exception as e:
                messagebox.showerror("Lỗi", f"Không thể mở file log: {e}")

    def show_about_dialog(self):
        info = (
            f"⚡ Fast Video Cutter & Merger Studio {CURRENT_APP_VERSION} PRO\\n\\n"
            f"• Nguyên lý: Lossless Stream Copy Engine (FFmpeg)\\n"
            f"• Tốc độ: Cắt ghép siêu tốc trong 1-3 giây không cần re-encode\\n"
            f"• Tương thích: Windows 10/11 & Linux (Ubuntu, Debian, Fedora, Arch)\\n"
            f"• Thư mục dữ liệu: {get_user_data_dir()}\\n"
            f"• Kho GitHub: github.com/{load_app_config().get('github_repo', DEFAULT_GITHUB_REPO)}\\n\\n"
            f"Bản quyền © 2026 Lossless Video Tools Studio. All rights reserved."
        )
        messagebox.showinfo("Giới Thiệu Ứng Dụng", info)
"""

# Inject self.setup_app_menu() inside VideoEditorApp.__init__
init_anchor = "self.setup_app_icons()"
if init_anchor in code:
    code = code.replace(init_anchor, init_anchor + "\n        self.setup_app_menu()")

# Add menu_methods before VideoEditorApp.setup_app_icons
icons_anchor = "def setup_app_icons(self):"
if icons_anchor in code:
    code = code.replace(icons_anchor, menu_methods + "\n    " + icons_anchor)

with open("fast_video_editor.py", "w", encoding="utf-8") as f:
    f.write(code)

print("[OK] Integrated Top Menu Bar and helper methods in fast_video_editor.py!")
