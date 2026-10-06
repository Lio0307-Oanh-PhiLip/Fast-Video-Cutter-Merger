import React, { useState } from 'react';
import { PYTHON_SCRIPT_CODE, RUN_WINDOWS_BAT, RUN_LINUX_SH } from '../data/desktopScripts';
import { 
  FileCode, Monitor, Terminal, Box, Download, 
  Copy, Check, Package, Sparkles, ExternalLink 
} from 'lucide-react';

export const CodeExportTab: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'py' | 'bat' | 'sh' | 'pyinstaller'>('py');
  const [copied, setCopied] = useState<boolean>(false);

  const pyinstallerGuide = `# Đóng gói thành file chạy .EXE độc lập không cần Python:

# 1. Trên Windows:
pip install pyinstaller
pyinstaller --onefile --noconsole --name "FastVideoEditor" fast_video_editor.py

# 2. Trên Linux:
pip install pyinstaller
pyinstaller --onefile --noconsole --name "fast-video-editor" fast_video_editor.py
`;

  let content = PYTHON_SCRIPT_CODE;
  let filename = 'fast_video_editor.py';

  if (activeFile === 'bat') {
    content = RUN_WINDOWS_BAT;
    filename = 'run_windows.bat';
  } else if (activeFile === 'sh') {
    content = RUN_LINUX_SH;
    filename = 'run_linux.sh';
  } else if (activeFile === 'pyinstaller') {
    content = pyinstallerGuide;
    filename = 'build_instructions.txt';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (str: string, name: string) => {
    const blob = new Blob([str], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    handleDownload(PYTHON_SCRIPT_CODE, 'fast_video_editor.py');
    setTimeout(() => handleDownload(RUN_WINDOWS_BAT, 'run_windows.bat'), 200);
    setTimeout(() => handleDownload(RUN_LINUX_SH, 'run_linux.sh'), 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Package className="w-3.5 h-3.5" /> Mã Nguồn Desktop (Tkinter + Python)
            </span>
            <span className="text-xs text-slate-400">
              Chạy native trên cả <strong>Windows</strong> &amp; <strong>Linux</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <span>Mã Nguồn Ứng Dụng &amp; Script Khởi Chạy Tự Động</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={downloadAll}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          <span>Tải Trọn Bộ (.py + .bat + .sh)</span>
        </button>
      </div>

      {/* Editor Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Tab buttons */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-950/80 gap-2">
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveFile('py')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeFile === 'py' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>fast_video_editor.py</span>
            </button>

            <button
              onClick={() => setActiveFile('bat')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeFile === 'bat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>run_windows.bat</span>
            </button>

            <button
              onClick={() => setActiveFile('sh')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeFile === 'sh' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>run_linux.sh</span>
            </button>

            <button
              onClick={() => setActiveFile('pyinstaller')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeFile === 'pyinstaller' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Đóng gói .EXE (PyInstaller)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={() => handleDownload(content, filename)}
              className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition flex items-center gap-1 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải {filename}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 text-slate-200">
          <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-[500px]">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};
