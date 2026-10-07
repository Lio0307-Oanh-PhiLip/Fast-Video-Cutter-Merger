#!/usr/bin/env bash
# ==============================================================
# ⚡ Fast Video Cutter & Merger Launcher (Linux) v3.2.2 PRO
# ==============================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo -e "\033[0;32m==============================================================\033[0m"
echo -e "\033[0;32m   ⚡ Fast Video Cutter & Merger - Stream Copy (Linux v3.2.2 PRO)\033[0m"
echo -e "\033[0;32m==============================================================\033[0m"

# 1. Kiểm tra Python 3
if ! command -v python3 &> /dev/null; then
    echo "[LỖI] Chưa cài đặt python3 trên hệ thống Linux!"
    echo "Ubuntu/Debian: sudo apt install python3 python3-tk -y"
    exit 1
fi

# 2. Kiểm tra Tkinter & Tkdnd
python3 -c "import tkinter" &> /dev/null || {
    echo "[CẢNH BÁO] Thiếu thư viện đồ họa python3-tk!"
    echo "Đang thử cài đặt bổ sung..."
    if command -v apt &> /dev/null; then
        sudo apt update && sudo apt install -y python3-tk ffmpeg tkdnd 2>/dev/null || sudo apt install -y python3-tk ffmpeg
    elif command -v pacman &> /dev/null; then
        sudo pacman -S --noconfirm tk ffmpeg
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y python3-tkinter ffmpeg
    fi
}

# 3. Cài đặt tkinterdnd2 nếu có thể để kích hoạt kéo thả siêu tốc trên Linux
python3 -c "import tkinterdnd2" 2>/dev/null || {
    python3 -m pip install tkinterdnd2 --break-system-packages 2>/dev/null || python3 -m pip install tkinterdnd2 2>/dev/null || true
}

# 4. Đồng bộ icon cục bộ cho người dùng
mkdir -p ~/.local/share/icons/hicolor/256x256/apps 2>/dev/null || true
if [ -f "$DIR/fast-video-editor.png" ]; then
    cp "$DIR/fast-video-editor.png" ~/.local/share/icons/hicolor/256x256/apps/fast-video-editor.png 2>/dev/null || true
fi

# 5. Khởi chạy ứng dụng bằng Python 3
echo "Khởi động giao diện Fast Video Editor Studio v3.2.2..."
/usr/bin/env python3 "$DIR/fast_video_editor.py" "$@"
