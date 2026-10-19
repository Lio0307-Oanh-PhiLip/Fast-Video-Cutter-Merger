#!/usr/bin/env bash
# ==============================================================
# Script đóng gói gói cài đặt chuẩn Debian / Ubuntu (.deb) v3.2.8 PRO
# Tác giả: TRỊNH PHI LÍP (philiptrinh1990@gmail.com, Zalo: 0917417252)
# ==============================================================

set -e

PKG_NAME="fast-video-editor"
VERSION="3.2.8"
ARCH="amd64"
BUILD_DIR="build_deb/${PKG_NAME}_${VERSION}_${ARCH}"

echo "=============================================================="
echo "  ⚡ ĐANG ĐÓNG GÓI GÓI CÀI ĐẶT UBUNTU / DEBIAN (.DEB) v3.2.8 PRO"
echo "=============================================================="

# 1. Dọn dẹp thư mục tạm
rm -rf build_deb
mkdir -p "${BUILD_DIR}/DEBIAN"
mkdir -p "${BUILD_DIR}/usr/bin"
mkdir -p "${BUILD_DIR}/usr/share/fast-video-editor/libs"
mkdir -p "${BUILD_DIR}/usr/share/applications"
mkdir -p "${BUILD_DIR}/usr/share/icons/hicolor/scalable/apps"
mkdir -p "${BUILD_DIR}/usr/share/icons/hicolor/256x256/apps"
mkdir -p "${BUILD_DIR}/usr/share/icons/hicolor/128x128/apps"
mkdir -p "${BUILD_DIR}/usr/share/pixmaps"

# 2. Tạo file cấu hình gói DEBIAN/control chuẩn quốc tế
cat << 'EOF' > "${BUILD_DIR}/DEBIAN/control"
Package: fast-video-editor
Version: 3.2.8
Section: video
Priority: optional
Architecture: amd64
Depends: ffmpeg, python3, python3-tk
Recommends: tkdnd
Maintainer: TRỊNH PHI LÍP <philiptrinh1990@gmail.com>
Description: High-speed Lossless Video Cutter, Merger & Remuxer Studio.
 Fast Video Cutter & Merger Studio v3.2.8 - Cắt, ghép và chuyển đuôi video siêu tốc
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

# 4. Tích hợp sẵn thư viện kéo thả tkinterdnd2 vào gói .deb (Zero-Pip Offline Bundle)
if command -v python3 &> /dev/null; then
    python3 -c '
import os, json, urllib.request, zipfile
lib_dir = "'"${BUILD_DIR}/usr/share/fast-video-editor/libs"'"
os.makedirs(lib_dir, exist_ok=True)
try:
    req = urllib.request.Request("https://pypi.org/pypi/tkinterdnd2/json", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        data = json.loads(r.read().decode("utf-8"))
    whl_url = None
    for u in data.get("urls", []):
        fn = u.get("filename", "")
        if fn.endswith(".whl") and ("none-any" in fn or "manylinux" in fn):
            whl_url = u.get("url")
            break
    if whl_url:
        whl_path = os.path.join(lib_dir, "tkdnd.whl")
        urllib.request.urlretrieve(whl_url, whl_path)
        with zipfile.ZipFile(whl_path, "r") as zf:
            zf.extractall(lib_dir)
        os.remove(whl_path)
        print("[OK] Đã nhúng thư viện kéo thả tkinterdnd2 trực tiếp vào gói .deb!")
except Exception as e:
    print("[WARN] Bỏ qua nhúng sẵn tkinterdnd2 (sẽ tự tải khi chạy):", e)
' || true
fi

# 5. Sao chép file chương trình thực thi vào /usr/bin
cp fast_video_editor.py "${BUILD_DIR}/usr/bin/fast-video-editor"
chmod 755 "${BUILD_DIR}/usr/bin/fast-video-editor"

# 6. Sao chép toàn bộ Biểu Tượng HD
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

# 7. Tạo Desktop Entry chuẩn GNOME, KDE, XFCE
cat << 'EOF' > "${BUILD_DIR}/usr/share/applications/fast-video-editor.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=Fast Video Cutter & Merger Studio
GenericName=Video Editor & Remuxer
Comment=Cắt và ghép video siêu tốc Lossless Stream Copy chất lượng cao (v3.2.8 PRO)
Exec=/usr/bin/python3 /usr/bin/fast-video-editor %F
TryExec=/usr/bin/fast-video-editor
Icon=fast-video-editor
Terminal=false
StartupWMClass=fast-video-editor
Categories=AudioVideo;Video;AudioVideoEditing;Recorder;
MimeType=video/mp4;video/x-matroska;video/quicktime;video/x-msvideo;video/webm;video/x-flv;video/x-ms-wmv;video/3gpp;video/mpeg;audio/mpeg;audio/x-wav;audio/aac;audio/flac;
Keywords=video;cut;merge;ffmpeg;lossless;remux;audio;
EOF

# 8. Chuẩn hóa phân quyền chuẩn Debian Policy và đóng gói bằng dpkg-deb
chmod -R 755 "${BUILD_DIR}"
chmod 644 "${BUILD_DIR}/DEBIAN/control"
chmod 755 "${BUILD_DIR}/DEBIAN/postinst"
chmod 755 "${BUILD_DIR}/DEBIAN/postrm"
chmod 755 "${BUILD_DIR}/usr/bin/fast-video-editor"
chmod 644 "${BUILD_DIR}/usr/share/applications/fast-video-editor.desktop"

if command -v dpkg-deb &> /dev/null; then
    dpkg-deb --root-owner-group --build "${BUILD_DIR}" 2>/dev/null || dpkg-deb --build "${BUILD_DIR}"
    DEB_OUT="build_deb/${PKG_NAME}_${VERSION}_${ARCH}.deb"
    if [ -f "${DEB_OUT}" ]; then
        echo ""
        echo "=============================================================="
        echo "✅ ĐÓNG GÓI .DEB THÀNH CÔNG: ${DEB_OUT}"
        echo "• Cài đặt trên Ubuntu/Debian: sudo dpkg -i ${DEB_OUT} || sudo apt-get install -f"
        echo "=============================================================="
    fi
fi
