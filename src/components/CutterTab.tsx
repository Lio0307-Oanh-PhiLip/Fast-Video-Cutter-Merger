import React, { useState, useRef, useEffect } from 'react';
import { VideoFile, OSTheme, EngineSettings } from '../types';
import { SAMPLE_VIDEOS, formatTime, parseTimeToSeconds, formatBytes } from '../data/sampleVideos';
import { InteractiveTimeline } from './InteractiveTimeline';
import { 
  Play, Pause, RotateCcw, FastForward, Rewind, Scissors, 
  Copy, Check, Download, Film, Sparkles, Volume2, 
  FolderOpen, Clock, HardDrive, CheckCircle2, FileVideo, Zap 
} from 'lucide-react';

interface CutterTabProps {
  currentOs: OSTheme;
  engineSettings: EngineSettings;
}

export const CutterTab: React.FC<CutterTabProps> = ({ currentOs, engineSettings }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoFile>(SAMPLE_VIDEOS[0]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [startTime, setStartTime] = useState<number>(10);
  const [endTime, setEndTime] = useState<number>(45);
  const [startTimeInput, setStartTimeInput] = useState<string>('00:00:10');
  const [endTimeInput, setEndTimeInput] = useState<string>('00:00:45');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFileDragging, setIsFileDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File drag & drop handlers
  const handleDragOverFile = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isFileDragging) setIsFileDragging(true);
  };

  const handleDragLeaveFile = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFileDragging(false);
    }
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newVideo: VideoFile = {
      id: 'custom-' + Date.now(),
      name: file.name,
      size: file.size,
      duration: 60,
      width: 1920,
      height: 1080,
      codec: 'H.264',
      fps: 30,
      url,
      isCustom: true,
    };

    setSelectedVideo(newVideo);
    setStartTime(0);
    setStartTimeInput('00:00:00');
    setEndTime(30);
    setEndTimeInput('00:00:30');
    setIsDone(false);
  };

  // Sync inputs when numeric state changes
  const updateStart = (val: number) => {
    const clamped = Math.max(0, Math.min(val, endTime - 0.5));
    setStartTime(clamped);
    setStartTimeInput(formatTime(clamped));
  };

  const updateEnd = (val: number) => {
    const maxDur = selectedVideo.duration || 120;
    const clamped = Math.min(maxDur, Math.max(val, startTime + 0.5));
    setEndTime(clamped);
    setEndTimeInput(formatTime(clamped));
  };

  // Video element event listeners
  const onTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 60;
      setSelectedVideo(prev => ({
        ...prev,
        duration: dur,
        width: videoRef.current?.videoWidth || 1920,
        height: videoRef.current?.videoHeight || 1080,
      }));
      setEndTime(Math.min(dur, Math.max(10, dur * 0.4)));
      setEndTimeInput(formatTime(Math.min(dur, Math.max(10, dur * 0.4))));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const stepTime = (delta: number) => {
    if (!videoRef.current) return;
    const next = Math.max(0, Math.min(selectedVideo.duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = next;
    setCurrentTime(next);
  };

  // File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newVideo: VideoFile = {
      id: 'custom-' + Date.now(),
      name: file.name,
      size: file.size,
      duration: 60,
      width: 1920,
      height: 1080,
      codec: 'H.264',
      fps: 30,
      url,
      isCustom: true,
    };

    setSelectedVideo(newVideo);
    setStartTime(0);
    setStartTimeInput('00:00:00');
    setEndTime(30);
    setEndTimeInput('00:00:30');
    setIsDone(false);
  };

  // Generate FFmpeg command
  const inputPath = currentOs === 'windows' ? `C:\\Videos\\${selectedVideo.name}` : `/home/user/Videos/${selectedVideo.name}`;
  const outExt = engineSettings.audioOnly ? 'm4a' : 'mp4';
  const outputPath = currentOs === 'windows' ? `C:\\Videos\\cut_${selectedVideo.name}.${outExt}` : `/home/user/Videos/cut_${selectedVideo.name}.${outExt}`;

  const cmdParts = ['ffmpeg', '-y'];
  if (engineSettings.fastSeek) {
    cmdParts.push('-ss', startTimeInput);
    cmdParts.push('-to', endTimeInput);
    cmdParts.push('-i', currentOs === 'windows' ? `"${inputPath}"` : `'${inputPath}'`);
  } else {
    cmdParts.push('-i', currentOs === 'windows' ? `"${inputPath}"` : `'${inputPath}'`);
    cmdParts.push('-ss', startTimeInput);
    cmdParts.push('-to', endTimeInput);
  }

  if (engineSettings.audioOnly) {
    cmdParts.push('-vn', '-c:a', 'copy');
  } else if (engineSettings.gpuAccel === 'nvenc') {
    cmdParts.push('-c:v', 'h264_nvenc', '-c:a', 'copy');
  } else if (engineSettings.gpuAccel === 'vaapi') {
    cmdParts.push('-vaapi_device', '/dev/dri/renderD128', '-c:v', 'h264_vaapi', '-c:a', 'copy');
  } else if (engineSettings.cameraAudioFix) {
    // Lossless video stream copy + safe AAC audio to avoid pcm_mulaw error on MP4
    cmdParts.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k');
    if (engineSettings.avoidNegativeTs) {
      cmdParts.push('-avoid_negative_ts', 'make_zero');
    }
    cmdParts.push('-fflags', '+genpts');
  } else {
    cmdParts.push('-c', 'copy');
    if (engineSettings.avoidNegativeTs) {
      cmdParts.push('-avoid_negative_ts', 'make_zero');
    }
  }

  cmdParts.push(currentOs === 'windows' ? `"${outputPath}"` : `'${outputPath}'`);
  const finalCommand = cmdParts.join(' ');

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(finalCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Processing Timer & Completion Timestamp
  const [procSeconds, setProcSeconds] = useState<number>(0);
  const [procDoneTime, setProcDoneTime] = useState<{ durationStr: string; clockStr: string } | null>(null);

  // Simulate ultra-fast processing
  const handleRunCut = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    setIsDone(false);
    setProcSeconds(0);
    setProcDoneTime(null);

    const startTime = Date.now();
    const liveTimer = setInterval(() => {
      setProcSeconds((Date.now() - startTime) / 1000);
    }, 100);

    const timer = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          clearInterval(liveTimer);
          const totalSec = (Date.now() - startTime) / 1000;
          const durStr = totalSec < 60 ? `${totalSec.toFixed(2)} giây` : `${Math.floor(totalSec / 60)} phút ${(totalSec % 60).toFixed(1)} giây`;
          const clockStr = new Date().toLocaleTimeString('vi-VN');
          setProcDoneTime({ durationStr: durStr, clockStr });
          setIsProcessing(false);
          setIsDone(true);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const cutDuration = Math.max(0, endTime - startTime);
  const estimatedOutputSize = Math.round(selectedVideo.size * (cutDuration / (selectedVideo.duration || 1)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Cắt Video Stream Copy
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Tốc độ: <strong>1 - 3 giây</strong> • 100% Giữ nguyên chất lượng
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-indigo-400" />
            <span>Cắt Video Tốc Độ Cao Bằng FFmpeg (Windows &amp; Linux)</span>
          </h2>
        </div>

        {/* Video selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition">
            <FolderOpen className="w-4 h-4" />
            <span>Chọn Video Từ Máy...</span>
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <select
            aria-label="Chọn video mẫu thử nghiệm"
            value={selectedVideo.id}
            onChange={(e) => {
              const found = SAMPLE_VIDEOS.find(v => v.id === e.target.value);
              if (found) {
                setSelectedVideo(found);
                setStartTime(10);
                setStartTimeInput('00:00:10');
                setEndTime(Math.min(found.duration, 45));
                setEndTimeInput(formatTime(Math.min(found.duration, 45)));
                setIsDone(false);
              }
            }}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {SAMPLE_VIDEOS.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({formatBytes(v.size)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag & Drop Visual Drop Zone Banner */}
      <div
        onDragOver={handleDragOverFile}
        onDragLeave={handleDragLeaveFile}
        onDrop={handleDropFile}
        onClick={() => fileInputRef.current?.click()}
        className={`p-3.5 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isFileDragging
            ? 'border-indigo-400 bg-indigo-500/20 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
            : 'border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <FileVideo className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>📂 KÉO THẢ VIDEO VÀO ĐÂY HOẶC BẤM ĐỂ CHỌN FILE</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold">1-Click Load</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hỗ trợ MP4, MKV, MOV, TS, camera CCTV... Kéo thả trực tiếp từ máy tính vào bất kỳ lúc nào
            </p>
          </div>
        </div>
        <button
          type="button"
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
        >
          Chọn Video...
        </button>
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
      </div>

      {/* Main Grid: Player on left, Controls on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Scrubber */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            onDragOver={handleDragOverFile}
            onDragLeave={handleDragLeaveFile}
            onDrop={handleDropFile}
            className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative group"
          >
            {/* HTML5 Video */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={selectedVideo.url}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
                playsInline
              />

              {/* Drag over overlay */}
              {isFileDragging && (
                <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center border-4 border-dashed border-indigo-400 text-white p-6 text-center animate-fade-in">
                  <FileVideo className="w-14 h-14 text-indigo-400 mb-2 animate-bounce" />
                  <h4 className="text-sm font-bold">Thả video vào đây để bắt đầu cắt ngay</h4>
                  <p className="text-xs text-indigo-200 mt-1">Định dạng sẽ được nạp và phân tích tức thì</p>
                </div>
              )}

              {/* Center Play Button Overlay */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Dừng video" : "Phát video"}
                className={`absolute w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl transition transform group-hover:scale-105 ${
                  isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-90'
                }`}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              {/* Timecode badge */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  {formatTime(currentTime)}
                </span>
                <span className="px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-mono text-slate-300 border border-slate-700">
                  {selectedVideo.width}x{selectedVideo.height} • {selectedVideo.fps}fps
                </span>
              </div>
            </div>

            {/* Visual Draggable Timeline & Controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              <InteractiveTimeline
                key={selectedVideo.id}
                duration={selectedVideo.duration}
                currentTime={currentTime}
                startTime={startTime}
                endTime={endTime}
                onSeek={(t) => {
                  setCurrentTime(t);
                  if (videoRef.current) videoRef.current.currentTime = t;
                }}
                onChangeRange={(s, e) => {
                  updateStart(s);
                  updateEnd(e);
                }}
                themeColor="indigo"
              />

              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                {/* Stepping controls with icons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => stepTime(-5)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    title="Lùi 5s"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => stepTime(-0.04)}
                    className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-mono text-[11px]"
                    title="Lùi 1 khung hình"
                  >
                    -1f
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => stepTime(0.04)}
                    className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-mono text-[11px]"
                    title="Tiến 1 khung hình"
                  >
                    +1f
                  </button>
                  <button
                    onClick={() => stepTime(5)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    title="Tiến 5s"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Mark In / Out */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateStart(currentTime)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>[ Đặt Đầu (IN)</span>
                  </button>
                  <button
                    onClick={() => updateEnd(currentTime)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Đặt Cuối (OUT) ]</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timecode Inputs & Action */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-indigo-400" />
                <span>Mốc Thời Gian Cắt</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                Thời lượng cắt: {formatTime(cutDuration)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bắt đầu (-ss):</span>
                </label>
                <input
                  type="text"
                  value={startTimeInput}
                  onChange={(e) => {
                    setStartTimeInput(e.target.value);
                    const s = parseTimeToSeconds(e.target.value);
                    if (!isNaN(s)) setStartTime(s);
                  }}
                  className="w-full text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="00:00:00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Kết thúc (-to):</span>
                </label>
                <input
                  type="text"
                  value={endTimeInput}
                  onChange={(e) => {
                    setEndTimeInput(e.target.value);
                    const s = parseTimeToSeconds(e.target.value);
                    if (!isNaN(s)) setEndTime(s);
                  }}
                  className="w-full text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="00:01:00"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Chọn nhanh:</span>
              <button
                type="button"
                onClick={() => { updateStart(0); updateEnd(Math.min(selectedVideo.duration, 30)); }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              >
                30s đầu
              </button>
              <button
                type="button"
                onClick={() => { updateStart(0); updateEnd(Math.min(selectedVideo.duration, 60)); }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              >
                1 phút đầu
              </button>
              <button
                type="button"
                onClick={() => { updateStart(0); updateEnd(selectedVideo.duration); }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              >
                Toàn bộ
              </button>
            </div>
          </div>

          {/* Generated Command Box */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Lệnh FFmpeg Chuẩn ({currentOs === 'windows' ? 'Windows' : 'Linux'}):
              </span>

              <button
                type="button"
                onClick={handleCopyCmd}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all border border-slate-800 leading-relaxed">
              {finalCommand}
            </pre>

            {/* Run Button */}
            <button
              type="button"
              onClick={handleRunCut}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm transition"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'Đang trích xuất bitstream...' : '⚡ Thực Hiện Cắt Siêu Tốc (1-3 Giây)'}</span>
            </button>

            {/* Simulation Progress */}
            {isProcessing && (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Tiến trình Stream Copy:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                      ⏱ {procSeconds.toFixed(1)}s
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{processProgress}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 transition-all duration-100 rounded-full"
                    style={{ width: `${processProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Tốc độ: <strong>~720 MB/s</strong> (Copy bitstream không mã hóa lại)
                </div>
              </div>
            )}

            {isDone && procDoneTime && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-2 text-xs text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Đã cắt xong video hoàn hảo chuẩn Lossless!</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 font-mono pt-1.5 border-t border-emerald-900/40">
                  <span>⏱ Thời gian xử lý: <strong className="text-cyan-300">{procDoneTime.durationStr}</strong></span>
                  <span>⏰ Thời điểm hoàn thành: <strong className="text-emerald-300">{procDoneTime.clockStr}</strong></span>
                </div>
                <div className="text-slate-400 text-[11px] pt-0.5">
                  Dung lượng ước tính: <strong className="text-emerald-300">{formatBytes(estimatedOutputSize)}</strong> (Lossless Bitstream Copy)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
