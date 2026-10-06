import React, { useState } from 'react';
import { OSTheme } from '../types';
import { 
  INNO_SETUP_SCRIPT, 
  BUILD_WINDOWS_INSTALLER_BAT, 
  BUILD_LINUX_DEB_SH, 
  BUILD_LINUX_APPIMAGE_SH, 
  ONECLICK_WINDOWS_INSTALLER_BAT, 
  ONECLICK_LINUX_INSTALLER_SH,
  SETUP_WIZARD_PY
} from '../data/installerScripts';
import { 
  Package, Monitor, Terminal, Download, Copy, Check, 
  Box, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, 
  FolderCheck, HardDrive, RefreshCw, Layers, ExternalLink, Play 
} from 'lucide-react';

interface InstallersTabProps {
  currentOs: OSTheme;
  setCurrentOs: (os: OSTheme) => void;
}

export const InstallersTab: React.FC<InstallersTabProps> = ({ currentOs, setCurrentOs }) => {
  const [selectedInstaller, setSelectedInstaller] = useState<
    'inno' | 'winBat' | 'winOneClick' | 'setupWizard' | 'deb' | 'appimage' | 'linuxOneClick'
  >(currentOs === 'windows' ? 'inno' : 'deb');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Setup Wizard Simulator state
  const [simStep, setSimStep] = useState<number>(1);
  const [simInstalling, setSimInstalling] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Start simulation
  const runSimInstall = () => {
    setSimInstalling(true);
    setSimProgress(0);
    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimInstalling(false);
          setSimStep(4);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Download all packaging files with 1 click
  const handleDownloadAllScripts = () => {
    handleDownload(BUILD_WINDOWS_INSTALLER_BAT, 'build_windows_setup.bat');
    setTimeout(() => handleDownload(INNO_SETUP_SCRIPT, 'installer_windows.iss'), 200);
    setTimeout(() => handleDownload(SETUP_WIZARD_PY, 'setup_wizard.py'), 400);
    setTimeout(() => handleDownload(ONECLICK_WINDOWS_INSTALLER_BAT, 'install_windows.bat'), 600);
    setTimeout(() => handleDownload(BUILD_LINUX_DEB_SH, 'build_linux_deb.sh'), 800);
    setTimeout(() => handleDownload(BUILD_LINUX_APPIMAGE_SH, 'build_linux_appimage.sh'), 1000);
    setTimeout(() => handleDownload(ONECLICK_LINUX_INSTALLER_SH, 'install_linux.sh'), 1200);
  };

  // Content resolver
  let activeContent = INNO_SETUP_SCRIPT;
  let activeFilename = 'installer_windows.iss';
  let activeTitle = 'Inno Setup Script (FastVideoEditor_Setup.exe)';

  if (selectedInstaller === 'winBat') {
    activeContent = BUILD_WINDOWS_INSTALLER_BAT;
    activeFilename = 'build_windows_setup.bat';
    activeTitle = 'Script Tự Động Biên Dịch Setup.exe (Windows)';
  } else if (selectedInstaller === 'winOneClick') {
    activeContent = ONECLICK_WINDOWS_INSTALLER_BAT;
    activeFilename = 'install_windows.bat';
    activeTitle = 'Trình Cài Đặt 1-Click Windows (Tự tạo Desktop Shortcut)';
  } else if (selectedInstaller === 'setupWizard') {
    activeContent = SETUP_WIZARD_PY;
    activeFilename = 'setup_wizard.py';
    activeTitle = 'Trình Cài Đặt Đồ Họa Native Windows (GUI Setup Wizard)';
  } else if (selectedInstaller === 'deb') {
    activeContent = BUILD_LINUX_DEB_SH;
    activeFilename = 'build_linux_deb.sh';
    activeTitle = 'Script Đóng Gói File .DEB (Ubuntu / Debian / Mint)';
  } else if (selectedInstaller === 'appimage') {
    activeContent = BUILD_LINUX_APPIMAGE_SH;
    activeFilename = 'build_linux_appimage.sh';
    activeTitle = 'Script Đóng Gói Universal Linux (.AppImage)';
  } else if (selectedInstaller === 'linuxOneClick') {
    activeContent = ONECLICK_LINUX_INSTALLER_SH;
    activeFilename = 'install_linux.sh';
    activeTitle = 'Trình Cài Đặt Hệ Thống Linux 1-Click (Desktop Menu Entry)';
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Package className="w-6 h-6 animate-bounce-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Đóng Gói Dạng Cài Đặt (Installers &amp; Packages)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Setup.exe &amp; .deb / AppImage
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tạo bộ cài đặt hoàn chỉnh cho người dùng cuối: không cần gõ lệnh, có wizard cài đặt và shortcut ngoài màn hình
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadAllScripts}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Tải Trọn Bộ File Đóng Gói</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentOs('windows');
              setSelectedInstaller('inno');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentOs === 'windows'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>🪟 Windows (.EXE Setup)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentOs('linux');
              setSelectedInstaller('deb');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentOs === 'linux'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>🐧 Linux (.DEB &amp; AppImage)</span>
          </button>
        </div>
      </div>

      {/* Local Folder Location Notice Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4.5 flex items-start gap-3.5 text-xs text-emerald-200">
        <FolderCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <span>📌 Các file script đóng gói đã có sẵn trong thư mục dự án của bạn!</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
              Root Directory
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Trong thư mục tải về (cùng cấp với <code>package.json</code> và <code>src/</code>), bạn sẽ thấy ngay các file thực thi đã được tạo sẵn:
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-blue-400 font-bold">
              build_windows_setup.bat
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-blue-400">
              run_windows.bat
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold">
              build_linux_deb.sh
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold">
              build_linux_appimage.sh
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-emerald-400">
              fast_video_editor.py
            </span>
          </div>
          <p className="text-slate-400 text-[11px] pt-0.5">
            👉 <strong>Trên Windows:</strong> Chỉ cần nhấp đúp vào <code>build_windows_setup.bat</code> để tự động tạo bộ cài đặt <code>FastVideoEditor_Setup.exe</code>.<br />
            👉 <strong>Trên Linux:</strong> Mở Terminal chạy <code>./build_linux_deb.sh</code> hoặc <code>./build_linux_appimage.sh</code>.
          </p>
        </div>
      </div>

      {/* Package Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentOs === 'windows' ? (
          <>
            {/* Format 1: Inno Setup (.iss) */}
            <button
              onClick={() => setSelectedInstaller('inno')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'inno'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-blue-400">
                  <Box className="w-4 h-4" /> 1. Inno Setup Wizard
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono font-bold">.iss</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tạo file <strong>FastVideoEditor_Setup.exe</strong> chuẩn Windows, có màn hình wizard Next &gt; Next &gt; Finish, Desktop Shortcut &amp; Uninstaller.
              </p>
            </button>

            {/* Format 2: Auto Build (.bat) */}
            <button
              onClick={() => setSelectedInstaller('winBat')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'winBat'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-emerald-400">
                  <RefreshCw className="w-4 h-4" /> 2. Script Tự Động Build
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">.bat</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chạy 1 lệnh để tự động gọi PyInstaller và Inno Setup Compiler đóng gói ra file cài đặt hoàn chỉnh.
              </p>
            </button>

            {/* Format 3: One-click local installer (.bat) */}
            <button
              onClick={() => setSelectedInstaller('winOneClick')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'winOneClick'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-indigo-400">
                  <Sparkles className="w-4 h-4" /> 3. Cài Đặt Nhanh 1-Click
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono font-bold">.bat</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tự động copy file vào <code>%LocalAppData%</code> và dùng VBScript tạo Shortcut trực tiếp ra màn hình Desktop.
              </p>
            </button>

            {/* Format 4: Native GUI Setup Wizard (.py) */}
            <button
              onClick={() => setSelectedInstaller('setupWizard')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'setupWizard'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-cyan-400">
                  <Monitor className="w-4 h-4" /> 4. GUI Setup Wizard
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-mono font-bold">.py</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cửa sổ giao diện đồ họa cài đặt chuẩn Windows (Tkinter GUI): chọn thư mục, thanh % tiến trình, tạo shortcut &amp; khởi chạy.
              </p>
            </button>
          </>
        ) : (
          <>
            {/* Format 1: Debian / Ubuntu package (.deb) */}
            <button
              onClick={() => setSelectedInstaller('deb')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'deb'
                  ? 'bg-amber-600/15 border-amber-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-amber-400">
                  <Box className="w-4 h-4" /> 1. Gói Cài Đặt Debian
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono font-bold">.deb</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đóng gói thành file <strong>.deb</strong> cho Ubuntu / Debian / Linux Mint. Nhấp đúp chuột để cài hoặc dùng <code>dpkg -i</code>.
              </p>
            </button>

            {/* Format 2: Universal AppImage */}
            <button
              onClick={() => setSelectedInstaller('appimage')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'appimage'
                  ? 'bg-amber-600/15 border-amber-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-cyan-400">
                  <Package className="w-4 h-4" /> 2. Universal AppImage
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-mono font-bold">.AppImage</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                File chạy độc lập cho MỌI bản Linux (Fedora, Arch, Ubuntu, openSUSE). Cấp quyền thực thi và mở ngay.
              </p>
            </button>

            {/* Format 3: Linux System Installer Script */}
            <button
              onClick={() => setSelectedInstaller('linuxOneClick')}
              className={`text-left p-4 rounded-2xl border transition space-y-2 ${
                selectedInstaller === 'linuxOneClick'
                  ? 'bg-amber-600/15 border-amber-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sm text-emerald-400">
                  <Terminal className="w-4 h-4" /> 3. Script Cài Đặt Hệ Thống
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">.sh</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cài đặt vào <code>/usr/local/bin</code> và tạo biểu tượng trong Menu ứng dụng hệ thống (App Launcher).
              </p>
            </button>
          </>
        )}
      </div>

      {/* Simulator Section: Live Setup Wizard Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Xem Trước Giao Diện Trình Cài Đặt ({currentOs === 'windows' ? 'Windows Setup Wizard' : 'Ubuntu Software Installer'})
            </span>
          </div>
          <button
            onClick={() => { setSimStep(1); setSimInstalling(false); setSimProgress(0); }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Chạy lại mô phỏng</span>
          </button>
        </div>

        {/* Mockup Window */}
        <div className="p-6 bg-slate-950/50 flex justify-center">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-xs">
            {/* Setup titlebar */}
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-indigo-400" />
                <span>Fast Video Cutter &amp; Merger - Setup Wizard v1.0.0</span>
              </span>
              <span className="text-slate-500 text-[10px]">Windows / Linux Installer</span>
            </div>

            {/* Setup Body based on Step */}
            <div className="p-6 min-h-[220px] flex flex-col justify-between space-y-4">
              {simStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow">
                      ✂️
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Chào mừng bạn đến với trình cài đặt Fast Video Editor
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Phần mềm cắt ghép video siêu tốc chuẩn Lossless Stream Copy
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
                    Bộ cài đặt sẽ tự động thiết lập chương trình và tích hợp sẵn thư viện FFmpeg để ứng dụng có thể hoạt động ngay lập tức mà không cần cấu hình phức tạp.
                  </div>
                </div>
              )}

              {simStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-sm">
                    Chọn thư mục đích cài đặt chương trình:
                  </h4>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-indigo-300 font-mono text-[11px]">
                    <span>{currentOs === 'windows' ? 'C:\\Program Files\\Fast Video Cutter & Merger' : '/usr/local/bin/fast-video-editor'}</span>
                    <button className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px]">Duyệt...</button>
                  </div>
                  <div className="space-y-1.5 pt-1 text-slate-300">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                      <span>Tạo biểu tượng ngoài màn hình Desktop</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                      <span>Tạo lối tắt trong Menu Start / App Menu</span>
                    </label>
                  </div>
                </div>
              )}

              {simStep === 3 && (
                <div className="space-y-4 py-2">
                  <h4 className="font-bold text-white text-sm">
                    {simInstalling ? 'Đang tiến hành cài đặt vào hệ thống...' : 'Sẵn sàng cài đặt'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Đang sao chép các tệp thực thi và FFmpeg...</span>
                      <span className="font-mono text-emerald-400 font-bold">{simProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2.5 transition-all duration-150 rounded-full"
                        style={{ width: `${simProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Extracting: FastVideoEditor.exe, ffmpeg.exe, licenses...
                  </div>
                </div>
              )}

              {simStep === 4 && (
                <div className="space-y-3 py-2 text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Cài Đặt Hoàn Tất Thành Công!
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Ứng dụng đã sẵn sàng sử dụng trên hệ điều hành {currentOs === 'windows' ? 'Windows 10/11' : 'Linux'}.
                  </p>
                  <label className="inline-flex items-center gap-2 pt-2 text-slate-300">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                    <span>Khởi động Fast Video Cutter &amp; Merger ngay bây giờ</span>
                  </label>
                </div>
              )}

              {/* Wizard navigation footer */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                {simStep > 1 && simStep < 4 && !simInstalling && (
                  <button
                    onClick={() => setSimStep(prev => prev - 1)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    &lt; Quay Lại
                  </button>
                )}

                {simStep < 3 && (
                  <button
                    onClick={() => setSimStep(prev => prev + 1)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                  >
                    Tiếp Tục &gt;
                  </button>
                )}

                {simStep === 3 && (
                  <button
                    onClick={runSimInstall}
                    disabled={simInstalling}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-1"
                  >
                    <span>{simInstalling ? 'Đang cài đặt...' : 'Cài Đặt Ngay'}</span>
                  </button>
                )}

                {simStep === 4 && (
                  <button
                    onClick={() => setSimStep(1)}
                    className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                  >
                    Hoàn Tất
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer & Download for the Selected Installer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-bold text-white text-xs flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>{activeTitle}</span>
            </span>
            <span className="text-[11px] text-slate-500 block font-mono">Tên tệp xuất: {activeFilename}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeContent, activeFilename)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition flex items-center gap-1.5"
            >
              {copiedKey === activeFilename ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeFilename ? 'Đã chép' : 'Sao chép mã'}</span>
            </button>

            <button
              onClick={() => handleDownload(activeContent, activeFilename)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Tệp {activeFilename}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 text-slate-200">
          <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-[420px]">
            {activeContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
