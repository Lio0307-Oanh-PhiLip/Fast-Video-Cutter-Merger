import React, { useState } from 'react';
import { OSTheme } from '../types';
import { 
  Terminal, Copy, Check, Download, Zap, Cpu, 
  Volume2, ShieldCheck, Film, Sparkles 
} from 'lucide-react';

interface CliStudioTabProps {
  currentOs: OSTheme;
}

export const CliStudioTab: React.FC<CliStudioTabProps> = ({ currentOs }) => {
  const [shell, setShell] = useState<'cmd' | 'powershell' | 'bash'>(
    currentOs === 'windows' ? 'cmd' : 'bash'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    {
      id: 'cut',
      title: 'Cắt video Stream Copy không re-encode',
      icon: Zap,
      cmd: currentOs === 'windows'
        ? 'ffmpeg -y -ss 00:01:00 -to 00:02:30 -i "C:\\Videos\\input.mp4" -c copy -avoid_negative_ts make_zero "C:\\Videos\\output.mp4"'
        : "ffmpeg -y -ss 00:01:00 -to 00:02:30 -i '/home/user/Videos/input.mp4' -c copy -avoid_negative_ts make_zero '/home/user/Videos/output.mp4'",
      desc: 'Cắt video từ phút 1:00 đến 2:30 chỉ mất 1 giây, giữ 100% chất lượng ban đầu.',
    },
    {
      id: 'merge',
      title: 'Ghép Concat Demuxer không re-encode',
      icon: Film,
      cmd: currentOs === 'windows'
        ? 'ffmpeg -y -f concat -safe 0 -i list.txt -c copy "C:\\Videos\\merged.mp4"'
        : "ffmpeg -y -f concat -safe 0 -i list.txt -c copy '/home/user/Videos/merged.mp4'",
      desc: 'Nối các file trong list.txt lại với tốc độ đọc/ghi ổ cứng.',
    },
    {
      id: 'remux',
      title: 'Chuyển MKV sang MP4 trong 1 giây',
      icon: Sparkles,
      cmd: currentOs === 'windows'
        ? 'ffmpeg -y -i "C:\\Videos\\movie.mkv" -c copy "C:\\Videos\\movie.mp4"'
        : "ffmpeg -y -i '/home/user/Videos/movie.mkv' -c copy '/home/user/Videos/movie.mp4'",
      desc: 'Đổi container mà không nén lại bất kỳ pixel hình ảnh nào.',
    },
    {
      id: 'audio',
      title: 'Trích xuất âm thanh lossless (không nén lại)',
      icon: Volume2,
      cmd: currentOs === 'windows'
        ? 'ffmpeg -y -i "C:\\Videos\\music_video.mp4" -vn -c:a copy "C:\\Videos\\audio.m4a"'
        : "ffmpeg -y -i '/home/user/Videos/music_video.mp4' -vn -c:a copy '/home/user/Videos/audio.m4a'",
      desc: 'Lấy âm thanh gốc nguyên bản từ file video.',
    },
    {
      id: 'gpu',
      title: 'Tăng tốc card GPU NVIDIA (NVENC)',
      icon: Cpu,
      cmd: currentOs === 'windows'
        ? 'ffmpeg -y -hwaccel cuda -i "C:\\Videos\\input.mp4" -c:v h264_nvenc -cq 19 -c:a copy "C:\\Videos\\output_nvenc.mp4"'
        : "ffmpeg -y -vaapi_device /dev/dri/renderD128 -i '/home/user/Videos/input.mp4' -vf 'format=nv12,hwupload' -c:v h264_vaapi -c:a copy '/home/user/Videos/output_vaapi.mp4'",
      desc: 'Sử dụng card màn hình rời để render siêu nhanh khi cần re-encode.',
    },
  ];

  const [activePreset, setActivePreset] = useState(presets[0]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>Thư Viện Lệnh FFmpeg Chuẩn Cho Windows &amp; Linux</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cú pháp đã được tối ưu hóa đường dẫn và tham số cho từng hệ điều hành
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setShell('cmd')}
            className={`px-3 py-1.5 rounded-lg transition ${
              shell === 'cmd' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Windows CMD
          </button>
          <button
            onClick={() => setShell('powershell')}
            className={`px-3 py-1.5 rounded-lg transition ${
              shell === 'powershell' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            PowerShell
          </button>
          <button
            onClick={() => setShell('bash')}
            className={`px-3 py-1.5 rounded-lg transition ${
              shell === 'bash' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Linux Bash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2">
          {presets.map(p => {
            const Icon = p.icon;
            const isSel = p.id === activePreset.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePreset(p)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-start gap-3 ${
                  isSel
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSel ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">{p.title}</div>
                  <div className={`mt-0.5 text-[11px] line-clamp-1 ${isSel ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {p.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activePreset.title}:
              </span>

              <button
                type="button"
                onClick={() => handleCopy(activePreset.cmd)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all border border-slate-800 leading-relaxed">
              {activePreset.cmd}
            </pre>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activePreset.desc}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tại sao lệnh này lại tối ưu cho {currentOs === 'windows' ? 'Windows' : 'Linux'}?</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Đường dẫn đã được bao trong dấu ngoặc kép an toàn với khoảng trắng trong tên file.</li>
              <li>Sử dụng cờ <code>-y</code> tự động ghi đè mà không bị treo tiến trình hỏi Yes/No.</li>
              <li>Cờ <code>-avoid_negative_ts make_zero</code> sửa triệt để lỗi mất âm thanh vài giây đầu khi mở trên các trình phát VLC, Windows Media Player hoặc QuickTime.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
