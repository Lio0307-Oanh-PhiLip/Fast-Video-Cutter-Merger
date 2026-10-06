#!/usr/bin/env bash
# ==============================================================
# Script đóng gói gói cài đặt chuẩn Debian / Ubuntu (.deb) v3.1.6 PRO
# Khắc phục hoàn toàn lỗi treo hệ thống và tương thích 100% Ubuntu/Debian/Mint
# ==============================================================

set -e

PKG_NAME="fast-video-editor"
VERSION="3.1.4"
ARCH="amd64"
BUILD_DIR="build_deb/${PKG_NAME}_${VERSION}_${ARCH}"

echo "=============================================================="
echo "  ⚡ ĐANG ĐÓNG GÓI GÓI CÀI ĐẶT UBUNTU / DEBIAN (.DEB) v3.1.6 PRO"
echo "=============================================================="

# 1. Dọn dẹp thư mục tạm
rm -rf build_deb
mkdir -p "${BUILD_DIR}/DEBIAN"
mkdir -p "${BUILD_DIR}/usr/bin"
mkdir -p "${BUILD_DIR}/usr/share/applications"
mkdir -p "${BUILD_DIR}/usr/share/icons/hicolor/scalable/apps"
mkdir -p "${BUILD_DIR}/usr/share/icons/hicolor/256x256/apps"
mkdir -p "${BUILD_DIR}/usr/share/icons/hicolor/128x128/apps"
mkdir -p "${BUILD_DIR}/usr/share/pixmaps"

# 2. Tạo file cấu hình gói DEBIAN/control chuẩn quốc tế
cat << 'EOF' > "${BUILD_DIR}/DEBIAN/control"
Package: fast-video-editor
Version: 3.1.4
Section: video
Priority: optional
Architecture: amd64
Depends: ffmpeg, python3, python3-tk
Recommends: tkdnd
Maintainer: FastVideoEditor Studio <support@fastvideo.org>
Description: High-speed Lossless Video Cutter, Merger & Remuxer Studio.
 Fast Video Cutter & Merger Studio v3.1.6 - Cắt, ghép và chuyển đuôi video siêu tốc
 chuẩn Lossless Stream Copy (CRF 17 Studio Quality, Không Treo Máy).
EOF

# 3. Tạo file postinst và postrm an toàn chống treo hệ thống
cat << 'EOF' > "${BUILD_DIR}/DEBIAN/postinst"
#!/bin/sh
set -e
chmod 755 /usr/bin/fast-video-editor 2>/dev/null || true
gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor 2>/dev/null || true
update-desktop-database -q /usr/share/applications 2>/dev/null || true
exit 0
EOF
chmod 755 "${BUILD_DIR}/DEBIAN/postinst"

cat << 'EOF' > "${BUILD_DIR}/DEBIAN/postrm"
#!/bin/sh
set -e
gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor 2>/dev/null || true
update-desktop-database -q /usr/share/applications 2>/dev/null || true
exit 0
EOF
chmod 755 "${BUILD_DIR}/DEBIAN/postrm"

# 4. Sao chép file chương trình thực thi vào /usr/bin
cp fast_video_editor.py "${BUILD_DIR}/usr/bin/fast-video-editor"
chmod 755 "${BUILD_DIR}/usr/bin/fast-video-editor"

# 5. Sao chép toàn bộ Biểu Tượng HD
if [ -f "fast-video-editor.svg" ]; then
    cp fast-video-editor.svg "${BUILD_DIR}/usr/share/icons/hicolor/scalable/apps/fast-video-editor.svg"
fi
if [ -f "fast-video-editor.png" ]; then
    cp fast-video-editor.png "${BUILD_DIR}/usr/share/icons/hicolor/256x256/apps/fast-video-editor.png"
    cp fast-video-editor.png "${BUILD_DIR}/usr/share/pixmaps/fast-video-editor.png"
fi
if [ -f "fast-video-editor-128.png" ]; then
    cp fast-video-editor-128.png "${BUILD_DIR}/usr/share/icons/hicolor/128x128/apps/fast-video-editor.png"
fi

# 6. Tạo Desktop Entry chuẩn GNOME, KDE, XFCE
cat << 'EOF' > "${BUILD_DIR}/usr/share/applications/fast-video-editor.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=Fast Video Cutter & Merger Studio
GenericName=Video Editor & Remuxer
Comment=Cắt và ghép video siêu tốc Lossless Stream Copy chất lượng cao
Exec=/usr/bin/python3 /usr/bin/fast-video-editor %F
TryExec=/usr/bin/fast-video-editor
Icon=fast-video-editor
Terminal=false
StartupWMClass=fast-video-editor
Categories=AudioVideo;Video;AudioVideoEditing;Recorder;
MimeType=video/mp4;video/x-matroska;video/quicktime;video/x-msvideo;video/webm;video/x-flv;video/x-ms-wmv;video/3gpp;video/mpeg;audio/mpeg;audio/x-wav;audio/aac;audio/flac;
Keywords=video;cut;merge;ffmpeg;lossless;remux;audio;
EOF
chmod 644 "${BUILD_DIR}/usr/share/applications/fast-video-editor.desktop"

# 7. Đóng gói bằng dpkg-deb
chmod 755 "${BUILD_DIR}/DEBIAN"
if command -v dpkg-deb &> /dev/null; then
    dpkg-deb --build "${BUILD_DIR}"
    DEB_OUT="build_deb/${PKG_NAME}_${VERSION}_${ARCH}.deb"
    if [ -f "${DEB_OUT}" ]; then
        cp "${DEB_OUT}" "fast-video-editor_${VERSION}_amd64.deb" 2>/dev/null || true
        cp "${DEB_OUT}" "fast-video-editor_latest_amd64.deb" 2>/dev/null || true
        echo ""
        echo "=============================================================="
        echo "✅ ĐÓNG GÓI .DEB THÀNH CÔNG: ${DEB_OUT}"
        echo "• Cài đặt trên Ubuntu/Debian: sudo dpkg -i ${DEB_OUT} || sudo apt-get install -f"
        echo "=============================================================="
    fi
fi
