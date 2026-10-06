import React, { useState } from 'react';
import { OSTheme, EngineSettings } from '../types';
import { 
  Monitor, Terminal, Cpu, Zap, HardDrive, ShieldCheck, 
  AlertTriangle, Copy, Check, ExternalLink, Settings, 
  FolderCheck, Sliders, CheckCircle2, Box, Package, 
  Clock, FileCode, Sparkles, RefreshCw, Volume2, ShieldAlert
} from 'lucide-react';

interface SettingsTabProps {
  currentOs: OSTheme;
  setCurrentOs: (os: OSTheme) => void;
  engineSettings: EngineSettings;
  setEngineSettings: React.Dispatch<React.SetStateAction<EngineSettings>>;
  onTestFfmpeg: () => void;
  ffmpegStatus: 'ready' | 'checking' | 'not-found';
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentOs,
  setCurrentOs,
  engineSettings,
  setEngineSettings,
  onTestFfmpeg,
  ffmpegStatus,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header bar with Icon and OS Selector */}
      <div className="bg-gradient-to-r from-indigo-900/30 via-slate-900/60 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <span>Cài Đặt Hệ Thống &amp; Môi Trường FFmpeg</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                v2026.1 Win &amp; Linux
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tùy chỉnh thông số Stream Copy, kiểm tra binary FFmpeg và hướng dẫn cài đặt đa nền tảng
            </p>
          </div>
        </div>

        {/* Operating System Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrentOs('windows')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              currentOs === 'windows'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>🪟 Windows 10/11</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentOs('linux')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              currentOs === 'linux'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>🐧 Linux (Ubuntu/Arch)</span>
          </button>
        </div>
      </div>

      {/* FFmpeg Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            ffmpegStatus === 'ready' 
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
              : 'bg-amber-950/80 text-amber-400 border border-amber-800'
          }`}>
            {ffmpegStatus === 'ready' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>Trạng thái FFmpeg Binary:</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                ffmpegStatus === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {ffmpegStatus === 'ready' ? 'ĐÃ SẴN SÀNG (FFmpeg 7.x Release)' : 'ĐANG CHỜ KIỂM TRA'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-2">
              <span>Đường dẫn:</span>
              <code className="text-indigo-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">
                {currentOs === 'windows' ? 'C:\\ffmpeg\\bin\\ffmpeg.exe (hoặc trong PATH)' : '/usr/bin/ffmpeg'}
              </code>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTestFfmpeg}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Kiểm Tra Lại FFmpeg</span>
        </button>
      </div>

      {/* Section 1: Detailed OS Installation Guide with Icons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Hướng Dẫn Cài Đặt Môi Trường Cho {currentOs === 'windows' ? 'Windows' : 'Linux'}</span>
          </h3>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Thời gian cài đặt: ~30 giây
          </span>
        </div>

        {currentOs === 'windows' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Step 1: FFmpeg */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-blue-400">
                  <Terminal className="w-4 h-4" /> 1. Cài đặt FFmpeg
                </span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px]">WinGet</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Mở <strong>PowerShell</strong> và chạy lệnh 1 dòng tự động:
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-emerald-400 text-[11px] flex items-center justify-between">
                <code className="truncate mr-2">winget install Gyan.FFmpeg</code>
                <button
                  type="button"
                  onClick={() => copyText('winget install Gyan.FFmpeg', 'win-winget')}
                  className="text-slate-400 hover:text-white shrink-0"
                  title="Sao chép"
                >
                  {copiedKey === 'win-winget' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[11px] text-slate-500 flex items-start gap-1">
                <FolderCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Hoặc tải <code>ffmpeg.exe</code> để cùng thư mục file script python.</span>
              </div>
            </div>

            {/* Step 2: Python 3.9+ */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <FileCode className="w-4 h-4" /> 2. Cài đặt Python 3.9+
                </span>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px]">Windows</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Tải bản cài đặt chính thức từ <a href="https://python.org" target="_blank" rel="noreferrer" className="text-indigo-400 underline">python.org</a> hoặc Microsoft Store.
              </p>
              <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200 text-[11px] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Lưu ý quan trọng:</strong> Tích vào ô <u>"Add python.exe to PATH"</u> ở màn hình đầu tiên khi cài đặt!
                </span>
              </div>
            </div>

            {/* Step 3: Run or Build .EXE */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Box className="w-4 h-4" /> 3. Khởi Chạy / Đóng Gói
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">1-Click</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Nhấp đúp chuột vào file <code>run_windows.bat</code> đã tải về để mở ứng dụng.
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-indigo-300 text-[11px] flex items-center justify-between">
                <code className="truncate mr-2">pyinstaller --onefile --noconsole fast_video_editor.py</code>
                <button
                  type="button"
                  onClick={() => copyText('pyinstaller --onefile --noconsole fast_video_editor.py', 'win-pyinstaller')}
                  className="text-slate-400 hover:text-white shrink-0"
                  title="Sao chép"
                >
                  {copiedKey === 'win-pyinstaller' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">Tạo file .EXE chạy không cần cài Python</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Ubuntu / Debian */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Terminal className="w-4 h-4" /> Ubuntu / Debian / Mint
                </span>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px]">apt</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Cài đặt đầy đủ FFmpeg và thư viện đồ họa GUI Tkinter:
              </p>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-emerald-400 text-[11px] flex items-center justify-between">
                <code className="truncate mr-2">sudo apt install -y ffmpeg python3 python3-tk</code>
                <button
                  type="button"
                  onClick={() => copyText('sudo apt update && sudo apt install -y ffmpeg python3 python3-tk', 'deb-cmd')}
                  className="text-slate-400 hover:text-white shrink-0"
                >
                  {copiedKey === 'deb-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Arch / Manjaro */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                  <Terminal className="w-4 h-4" /> Arch / Manjaro
                </span>
                <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px]">pacman</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Cài đặt gói chính thức từ kho repository:
              </p>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-emerald-400 text-[11px] flex items-center justify-between">
                <code className="truncate mr-2">sudo pacman -S ffmpeg tk python</code>
                <button
                  type="button"
                  onClick={() => copyText('sudo pacman -S --noconfirm ffmpeg tk python', 'arch-cmd')}
                  className="text-slate-400 hover:text-white shrink-0"
                >
                  {copiedKey === 'arch-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Fedora */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-blue-400">
                  <Terminal className="w-4 h-4" /> Fedora / RHEL
                </span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px]">dnf</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Cài đặt FFmpeg &amp; python3-tkinter:
              </p>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-emerald-400 text-[11px] flex items-center justify-between">
                <code className="truncate mr-2">sudo dnf install ffmpeg python3-tkinter</code>
                <button
                  type="button"
                  onClick={() => copyText('sudo dnf install -y ffmpeg python3-tkinter', 'fedora-cmd')}
                  className="text-slate-400 hover:text-white shrink-0"
                >
                  {copiedKey === 'fedora-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Engine Configuration (Stream Copy Flags & GPU Accel) with Prominent Icons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Cài Đặt Cấu Hình Engine Stream Copy</span>
          </h3>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> 100% Không Giảm Chất Lượng
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Toggle: Avoid negative timestamp */}
          <label className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 flex items-start gap-3 cursor-pointer transition">
            <input
              type="checkbox"
              checked={engineSettings.avoidNegativeTs}
              onChange={(e) => setEngineSettings(prev => ({ ...prev, avoidNegativeTs: e.target.checked }))}
              className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Sửa timestamp đồng bộ âm thanh (<code>-avoid_negative_ts make_zero</code>)</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Đưa mốc thời gian bắt đầu của video đã cắt về mốc 0:00:00, giúp file phát mượt mà trên mọi đầu phát tivi, điện thoại mà không bị trễ tiếng.
              </p>
            </div>
          </label>

          {/* Toggle: Fast seek */}
          <label className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 flex items-start gap-3 cursor-pointer transition">
            <input
              type="checkbox"
              checked={engineSettings.fastSeek}
              onChange={(e) => setEngineSettings(prev => ({ ...prev, fastSeek: e.target.checked }))}
              className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Tìm Keyframe siêu tốc (Đặt cờ <code>-ss</code> trước <code>-i</code>)</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Đưa cờ <code>-ss</code> ra trước cờ <code>-i</code> giúp FFmpeg dùng demuxer nhảy ngay đến I-frame mà không phải đọc giải nén từ đầu file.
              </p>
            </div>
          </label>

          {/* GPU Hardware Acceleration */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Tăng Tốc Phần Cứng GPU Hardware Encoder</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Dành cho trường hợp ghép video khác độ phân giải hoặc Smart Cut:
            </p>
            <select
              aria-label="Chọn phần cứng GPU tăng tốc mã hóa"
              value={engineSettings.gpuAccel}
              onChange={(e) => setEngineSettings(prev => ({ ...prev, gpuAccel: e.target.value as any }))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="none">Không dùng GPU (Chế độ Stream Copy nguyên bản)</option>
              <option value="nvenc">NVIDIA NVENC (Card GeForce / Quadro / RTX)</option>
              <option value="qsv">Intel QuickSync Video (CPU Intel Core HD/Iris)</option>
              <option value="vaapi">Linux VA-API Hardware Acceleration (/dev/dri/renderD128)</option>
            </select>
          </div>

          {/* Audio Mode */}
          <label className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 flex items-start gap-3 cursor-pointer transition">
            <input
              type="checkbox"
              checked={engineSettings.audioOnly}
              onChange={(e) => setEngineSettings(prev => ({ ...prev, audioOnly: e.target.checked }))}
              className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Chế độ chỉ lấy âm thanh (Audio Only <code>-vn -c:a copy</code>)</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Tự động tách nhạc/audio ra file m4a/aac mà không cần hình ảnh, tốc độ cực nhanh trong chớp mắt.
              </p>
            </div>
          </label>

          {/* Camera PCM Audio Fix */}
          <label className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30 flex items-start gap-3 cursor-pointer transition">
            <input
              type="checkbox"
              checked={engineSettings.cameraAudioFix}
              onChange={(e) => setEngineSettings(prev => ({ ...prev, cameraAudioFix: e.target.checked }))}
              className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Tương thích camera quan sát (Sửa lỗi <code>pcm_mulaw</code> / MP4)</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                Tự động chuyển mã âm thanh camera PCM sang AAC (<code>-c:v copy -c:a aac</code>) khi lưu định dạng MP4. Video vẫn giữ nguyên 100% Stream Copy siêu tốc không bị giảm chất lượng, khắc phục hoàn toàn lỗi container MP4 không hỗ trợ <code>pcm_mulaw</code>.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
