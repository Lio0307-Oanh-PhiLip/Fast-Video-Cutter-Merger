=============================================================================
  Fast Video Cutter & Merger Studio v3.1.7 PRO (Lossless Stream Copy)
=============================================================================

1. GIỚI THIỆU:
  - Ứng dụng cắt và ghép nối video chuẩn Lossless Stream Copy trên Windows 10/11 & Linux.
  - Tốc độ xử lý siêu tốc (chỉ từ 1 - 3 giây cho video nhiều GB) do không re-encode dữ liệu hình ảnh.
  - Giữ nguyên 100% chất lượng video gốc (Lossless bit-for-bit).

2. ĐIỂM ĐỘT PHÁ TRÊN PHIÊN BẢN v3.1.7 PRO:
  - KHẮC PHỤC TRIỆT ĐỂ LỖI CỬA SỔ TỰ TẮT KHI ĐÓNG GÓI:
    + Cửa sổ `build_windows_setup.bat` luôn giữ nguyên trạng thái (Pause protection) để người dùng xem đầy đủ nhật ký đóng gói.
    + Tự động sao chép file thực thi `FastVideoEditor.exe` ra thư mục gốc.
    + Tự động tạo Shortcut `Fast Video Cutter and Merger` ngoài màn hình Desktop.
    + Tự động kích hoạt khởi chạy ngay ứng dụng sau khi đóng gói.
  - SỬA LỖI KHỞI CHẠY (CLASS ARCHITECTURE FIX):
    + Tái cấu trúc chuẩn xác toàn bộ phương thức `run_cut_thread` và `run_merge_thread` trong class chính `VideoEditorApp`.
    + Khắc phục hoàn toàn lỗi `_tkinter.tkapp object has no attribute 'run_cut_thread'`.
  - HỖ TRỢ ĐƯỜNG DẪN KHOẢNG TRẮNG:
    + Hoạt động hoàn hảo với mọi tên user chứa dấu cách (ví dụ: `C:\Users\OS 10\...`).

3. HƯỚNG DẪN KHỞI CHẠY:
  - Cách 1: Nhấp đúp vào `build_windows_setup.bat` để tự động đóng gói và mở ứng dụng.
  - Cách 2: Nhấp đúp vào `run_windows.bat` để chạy ngay trực tiếp với Python.
  - Cách 3: Chạy trực tiếp qua lệnh:
      python fast_video_editor.py

=============================================================================
