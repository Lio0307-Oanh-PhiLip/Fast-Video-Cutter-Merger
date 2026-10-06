#!/usr/bin/env bash
# ==============================================================
# Trình cài đặt tự động 1-click cho Linux (Ubuntu / Debian / Arch / Fedora)
# Cài đặt biểu tượng hệ thống chuẩn HD, Desktop Shortcut & Drag-Drop v3.1.5 PRO
# ==============================================================

set -e

echo "=============================================================="
echo "   ⚡ CÀI ĐẶT FAST VIDEO CUTTER & MERGER VÀO HỆ THỐNG LINUX v3.1.5"
echo "=============================================================="
echo ""

# 1. Kiểm tra quyền sudo/root
if [ "$EUID" -ne 0 ]; then
  echo "Vui lòng chạy với quyền root (sudo) để cài đặt toàn hệ thống:"
  echo "   sudo ./install_linux.sh"
  exit 1
fi

# 2. Cài đặt các gói phụ thuộc (FFmpeg, Tkinter, Tkdnd)
echo "[1/3] Đang cài đặt FFmpeg, Tkinter và Drag-Drop..."
if command -v apt &> /dev/null; then
    apt update -qq && apt install -y -qq ffmpeg python3 python3-tk python3-pip tkdnd 2>/dev/null || apt install -y -qq ffmpeg python3 python3-tk python3-pip
elif command -v pacman &> /dev/null; then
    pacman -S --noconfirm --needed ffmpeg tk python python-pip
elif command -v dnf &> /dev/null; then
    dnf install -y ffmpeg python3-tkinter python3-pip
fi

# Cài đặt tkinterdnd2 nếu có thể
python3 -m pip install tkinterdnd2 --break-system-packages 2>/dev/null || python3 -m pip install tkinterdnd2 2>/dev/null || true

# 3. Cài đặt file thực thi vào /usr/bin và /usr/local/bin
echo "[2/3] Đang cài đặt tệp chương trình vào hệ thống..."
cp fast_video_editor.py /usr/bin/fast-video-editor
chmod +x /usr/bin/fast-video-editor
cp fast_video_editor.py /usr/local/bin/fast-video-editor 2>/dev/null || true
chmod +x /usr/local/bin/fast-video-editor 2>/dev/null || true

# 4. Cài đặt Biểu Tượng Logo chuẩn FreeDesktop Hicolor
echo "[3/3] Đang cài đặt Biểu Tượng Logo & Taskbar Icon đồng bộ..."
mkdir -p /usr/share/icons/hicolor/scalable/apps
mkdir -p /usr/share/icons/hicolor/256x256/apps
mkdir -p /usr/share/icons/hicolor/128x128/apps
mkdir -p /usr/share/icons/hicolor/64x64/apps
mkdir -p /usr/share/pixmaps

if [ -f "fast-video-editor.svg" ]; then
    cp fast-video-editor.svg /usr/share/icons/hicolor/scalable/apps/fast-video-editor.svg
fi
if [ -f "fast-video-editor.png" ]; then
    cp fast-video-editor.png /usr/share/icons/hicolor/256x256/apps/fast-video-editor.png
    cp fast-video-editor.png /usr/share/pixmaps/fast-video-editor.png
elif [ -f "icon.png" ]; then
    cp icon.png /usr/share/icons/hicolor/256x256/apps/fast-video-editor.png
    cp icon.png /usr/share/pixmaps/fast-video-editor.png
fi
if [ -f "fast-video-editor-128.png" ]; then
    cp fast-video-editor-128.png /usr/share/icons/hicolor/128x128/apps/fast-video-editor.png
fi

# Đăng ký Desktop Entry chuẩn GNOME, KDE, XFCE với StartupWMClass
cat << 'EOF' > /usr/share/applications/fast-video-editor.desktop
[Desktop Entry]
Version=1.0
Type=Application
Name=Fast Video Cutter & Merger Studio
GenericName=Video Editor & Remuxer
Comment=Cắt ghép video siêu tốc Lossless Stream Copy không mất chất lượng
Exec=/usr/bin/python3 /usr/bin/fast-video-editor %F
TryExec=/usr/bin/fast-video-editor
Icon=fast-video-editor
Terminal=false
StartupWMClass=fast-video-editor
Categories=AudioVideo;Video;AudioVideoEditing;Recorder;
MimeType=video/mp4;video/x-matroska;video/quicktime;video/x-msvideo;video/webm;video/x-flv;video/x-ms-wmv;video/3gpp;video/mpeg;audio/mpeg;audio/x-wav;audio/aac;audio/flac;
Keywords=video;cut;merge;ffmpeg;lossless;remux;audio;
EOF

chmod 644 /usr/share/applications/fast-video-editor.desktop
gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor 2>/dev/null || true
update-desktop-database -q /usr/share/applications 2>/dev/null || true

echo ""
echo "=============================================================="
echo "✅ CÀI ĐẶT HOÀN TẤT THÀNH CÔNG 100% (v3.1.5 PRO)!"
echo "• Ứng dụng đã sẵn sàng trong App Menu và thanh Dock/Taskbar."
echo "• Mở bằng lệnh: fast-video-editor"
echo "=============================================================="
