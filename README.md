# ⚡ Fast Video Cutter & Merger (Lossless Stream Copy)

Bộ phần mềm cắt ghép video siêu tốc chuẩn **Lossless Stream Copy** không giải mã lại, hỗ trợ đa nền tảng cho **Windows 10/11** và **Linux** (Ubuntu, Debian, Fedora, Arch...).

---

## 📁 Danh Sách Các Tệp Script Đóng Gói & Khởi Chạy Sẵn Có

Thư mục này đã bao gồm đầy đủ các tệp thực thi và đóng gói tự động:

| Tên Tệp | Hệ Điều Hành | Mục Đích |
| :--- | :--- | :--- |
| `build_windows_setup.bat` | 🪟 Windows | **Script tự động đóng gói bộ cài đặt `Setup.exe` chuyên nghiệp** (kết hợp PyInstaller + Inno Setup) |
| `run_windows.bat` | 🪟 Windows | Khởi chạy ứng dụng ngay lập tức trên Windows bằng 1 cú nhấp đúp |
| `installer_windows.iss` | 🪟 Windows | Tệp cấu hình Inno Setup để tạo trình cài đặt có giao diện Wizard Next &gt; Next &gt; Finish |
| `build_linux_deb.sh` | 🐧 Linux | **Script tự động đóng gói file cài đặt `.deb` cho Ubuntu / Debian / Mint** |
| `build_linux_appimage.sh` | 🐧 Linux | **Script tự động đóng gói file chạy Universal `.AppImage` cho mọi bản Linux** |
| `run_linux.sh` | 🐧 Linux | Khởi chạy ứng dụng ngay lập tức trên Linux (`./run_linux.sh`) |
| `install_linux.sh` | 🐧 Linux | Cài đặt ứng dụng vào hệ thống (`/usr/local/bin`) và đăng ký Menu ứng dụng |
| `fast_video_editor.py` | 🌐 Cả 2 OS | Mã nguồn Python giao diện đồ họa Tkinter native |

---

## 🚀 Hướng Dẫn Đóng Gói Thành Bộ Cài Đặt (Installer)

### 🪟 1. Trên Windows:
1. **Cách nhanh nhất:** Nhấp đúp vào tệp `build_windows_setup.bat`.
   - Script sẽ tự động cài `pyinstaller` và biên dịch `fast_video_editor.py` thành `dist\FastVideoEditor.exe`.
   - Nếu máy có cài sẵn [Inno Setup](https://jrsoftware.org/isdl.php), script sẽ tự động tạo file `Output\FastVideoEditor_v1.0.0_Setup.exe` có Desktop shortcut và Uninstaller!
2. **Khởi chạy trực tiếp không cần đóng gói:** Nhấp đúp vào `run_windows.bat`.

---

### 🐧 2. Trên Linux (Ubuntu, Debian, Mint, Fedora, Arch...):
1. **Đóng gói thành gói `.deb` cho Ubuntu / Debian:**
   ```bash
   chmod +x build_linux_deb.sh
   ./build_linux_deb.sh
   ```
   File xuất ra: `build_deb/fast-video-editor_1.0.0_amd64.deb`. Cài đặt bằng:
   ```bash
   sudo dpkg -i build_deb/fast-video-editor_1.0.0_amd64.deb
   ```

2. **Đóng gói Universal `.AppImage` (Chạy trên mọi hệ điều hành Linux):**
   ```bash
   chmod +x build_linux_appimage.sh
   ./build_linux_appimage.sh
   ```

3. **Cài đặt trực tiếp vào hệ thống (1-click):**
   ```bash
   chmod +x install_linux.sh
   sudo ./install_linux.sh
   ```

4. **Khởi chạy trực tiếp:**
   ```bash
   chmod +x run_linux.sh
   ./run_linux.sh
   ```

---

## ⚙️ Yêu Cầu Hệ Thống
- **Python:** 3.9 trở lên
- **FFmpeg:** Cài đặt bằng `winget install Gyan.FFmpeg` (Windows) hoặc `sudo apt install ffmpeg python3-tk` (Linux).
