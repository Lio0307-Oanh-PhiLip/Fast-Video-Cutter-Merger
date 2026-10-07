import React, { useState } from 'react';
import { OSTheme, EngineSettings } from './types';
import { CutterTab } from './components/CutterTab';
import { MergerTab } from './components/MergerTab';
import { SettingsTab } from './components/SettingsTab';
import { CliStudioTab } from './components/CliStudioTab';
import { CodeExportTab } from './components/CodeExportTab';
import { InstallersTab } from './components/InstallersTab';
import { 
  Scissors, Layers, Settings, Terminal, Package, 
  Monitor, Cpu, ShieldCheck, Zap, HardDrive, RefreshCw, 
  Minus, Square, X, Sparkles, CheckCircle2, Box 
} from 'lucide-react';

export default function App() {
  const [currentOs, setCurrentOs] = useState<OSTheme>('windows');
  const [activeTab, setActiveTab] = useState<'cut' | 'merge' | 'installers' | 'settings' | 'cli' | 'export'>('cut');

  const [engineSettings, setEngineSettings] = useState<EngineSettings>({
    streamCopy: true,
    avoidNegativeTs: true,
    fastSeek: true,
    audioOnly: false,
    cameraAudioFix: true,
    gpuAccel: 'none',
    outputFormat: 'mp4',
  });

  const [ffmpegStatus, setFfmpegStatus] = useState<'ready' | 'checking' | 'not-found'>('ready');

  const handleTestFfmpeg = () => {
    setFfmpegStatus('checking');
    setTimeout(() => {
      setFfmpegStatus('ready');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Outer Studio Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>Fast Video Cutter &amp; Merger</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">v3.2.1 PRO</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Lossless &amp; Smart-Merge
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ứng dụng xử lý video siêu tốc 1-3s hỗ trợ đóng gói cài đặt cho cả <strong>Windows 10/11</strong> &amp; <strong>Linux</strong>
              </p>
            </div>
          </div>

          {/* Quick OS Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Xem trước giao diện:</span>
            <div className="inline-flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrentOs('windows')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  currentOs === 'windows'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>🪟 Windows</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentOs('linux')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  currentOs === 'linux'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>🐧 Linux</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content inside Desktop Window Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Authentic Desktop App Window Mockup */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* OS Window Titlebar */}
          <div className={`px-4 py-2.5 flex items-center justify-between border-b select-none transition-colors ${
            currentOs === 'windows'
              ? 'bg-slate-950 border-slate-800'
              : 'bg-stone-900 border-stone-800'
          }`}>
            {/* Left title & icon */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Fast Video Cutter &amp; Merger (Lossless) - [{currentOs === 'windows' ? 'Windows 11 Native' : 'Linux GTK / GNOME'}]</span>
            </div>

            {/* Right window control buttons */}
            {currentOs === 'windows' ? (
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  aria-label="Thu nhỏ cửa sổ Windows"
                  className="w-7 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white rounded"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Phóng to cửa sổ Windows"
                  className="w-7 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white rounded"
                >
                  <Square className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  aria-label="Đóng cửa sổ Windows"
                  className="w-7 h-6 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/90 hover:bg-rose-600 cursor-pointer shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-600 cursor-pointer shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-600 cursor-pointer shadow-sm" />
              </div>
            )}
          </div>

          {/* Navigation Bar inside the App */}
          <div className="flex border-b border-slate-800 bg-slate-950/70 overflow-x-auto no-scrollbar px-3 pt-1 gap-1">
            <button
              onClick={() => setActiveTab('cut')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'cut'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scissors className="w-4 h-4 text-indigo-400" />
              <span>Cắt Video (Lossless)</span>
            </button>

            <button
              onClick={() => setActiveTab('merge')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'merge'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Ghép Video (Lossless)</span>
            </button>

            <button
              onClick={() => setActiveTab('installers')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'installers'
                  ? 'border-purple-500 text-purple-400 bg-purple-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-4 h-4 text-purple-400" />
              <span>Đóng Gói Cài Đặt (Setup.exe &amp; .deb)</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Cài Đặt &amp; FFmpeg (Setup)</span>
            </button>

            <button
              onClick={() => setActiveTab('cli')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'cli'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Lệnh Terminal (CLI Studio)</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'export'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4 text-indigo-400" />
              <span>Mã Nguồn Python</span>
            </button>
          </div>

          {/* Active Tab Body */}
          <div className="p-5 sm:p-6 bg-slate-900/60 min-h-[500px]">
            {activeTab === 'cut' && (
              <CutterTab currentOs={currentOs} engineSettings={engineSettings} />
            )}
            {activeTab === 'merge' && (
              <MergerTab currentOs={currentOs} engineSettings={engineSettings} />
            )}
            {activeTab === 'installers' && (
              <InstallersTab currentOs={currentOs} setCurrentOs={setCurrentOs} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                currentOs={currentOs}
                setCurrentOs={setCurrentOs}
                engineSettings={engineSettings}
                setEngineSettings={setEngineSettings}
                onTestFfmpeg={handleTestFfmpeg}
                ffmpegStatus={ffmpegStatus}
              />
            )}
            {activeTab === 'cli' && (
              <CliStudioTab currentOs={currentOs} />
            )}
            {activeTab === 'export' && (
              <CodeExportTab />
            )}
          </div>

          {/* App Status Bar at Bottom */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Hệ điều hành: {currentOs === 'windows' ? 'Windows (NT)' : 'Linux (POSIX)'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-indigo-400" />
                Stream Copy: Bật (-c copy)
              </span>
              <span>•</span>
              <span>Tốc độ ghi đĩa thực tế: <strong>~700 MB/s</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Python 3.9+ &amp; FFmpeg 7.x</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Fast Video Cutter &amp; Merger (Lossless)</span>
            <span>•</span>
            <span>Bộ cài đặt tự động cho Windows (.exe) &amp; Linux (.deb, AppImage)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('installers')}
              className="hover:text-purple-400 flex items-center gap-1 underline"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Xem Bộ Cài Đặt</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="hover:text-indigo-400 flex items-center gap-1 underline"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Xem Cài Đặt FFmpeg</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
