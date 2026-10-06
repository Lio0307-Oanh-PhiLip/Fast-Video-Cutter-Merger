#!/usr/bin/env bash
# ==============================================================
# Script đóng gói file chạy Universal Linux (.AppImage)
# Chạy được trên MỌI bản phân phối Linux (Ubuntu, Fedora, Arch, Debian)
# ==============================================================

set -e

APP_NAME="FastVideoEditor"
APP_DIR="AppDir"

echo "=============================================================="
echo "  ĐANG ĐÓNG GÓI FILE UNIVERSAL LINUX (.APPIMAGE)  "
echo "=============================================================="

# 1. Chuẩn bị thư mục AppDir
rm -rf "${APP_DIR}"
mkdir -p "${APP_DIR}/usr/bin"
mkdir -p "${APP_DIR}/usr/share/icons/hicolor/256x256/apps"

# 2. Biên dịch mã nguồn bằng PyInstaller
pip install --upgrade pyinstaller
pyinstaller --noconsole --onefile --clean --name "fast-video-editor" fast_video_editor.py
cp dist/fast-video-editor "${APP_DIR}/usr/bin/fast-video-editor"
chmod +x "${APP_DIR}/usr/bin/fast-video-editor"

# 3. Tạo AppRun
cat << 'EOF' > "${APP_DIR}/AppRun"
#!/bin/sh
HERE="$(dirname "$(readlink -f "${0}")")"
exec "${HERE}/usr/bin/fast-video-editor" "$@"
EOF
chmod +x "${APP_DIR}/AppRun"

# 4. Tạo Desktop file
cat << 'EOF' > "${APP_DIR}/fast-video-editor.desktop"
[Desktop Entry]
Name=Fast Video Cutter & Merger
Exec=fast-video-editor
Icon=fast-video-editor
Type=Application
Categories=AudioVideo;
EOF

# 5. Tải appimagetool và đóng gói (nếu chưa có)
if ! command -v appimagetool &> /dev/null; then
    echo "[*] Đang tải công cụ appimagetool..."
    wget -q https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O appimagetool || true
    if [ -f "appimagetool" ]; then
        chmod +x appimagetool
        ./appimagetool "${APP_DIR}" "${APP_NAME}-x86_64.AppImage"
    fi
else
    appimagetool "${APP_DIR}" "${APP_NAME}-x86_64.AppImage"
fi

if [ -f "${APP_NAME}-x86_64.AppImage" ]; then
    echo ""
    echo "=============================================================="
    echo "✅ ĐÃ TẠO FILE APPIMAGE THÀNH CÔNG: ${APP_NAME}-x86_64.AppImage"
    echo "Người dùng chỉ cần cấp quyền và chạy:"
    echo "   chmod +x ${APP_NAME}-x86_64.AppImage && ./${APP_NAME}-x86_64.AppImage"
    echo "=============================================================="
else
    echo "Đã chuẩn bị xong AppDir. Hãy cài appimagetool để xuất file AppImage."
fi
