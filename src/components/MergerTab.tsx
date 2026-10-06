import React, { useState, useRef, useEffect } from 'react';
import { OSTheme, EngineSettings, MergeQueueClip } from '../types';
import { SAMPLE_VIDEOS, formatTime, formatBytes } from '../data/sampleVideos';
import { InteractiveTimeline } from './InteractiveTimeline';
import { 
  Layers, Plus, Trash2, ArrowUp, ArrowDown, Copy, Check, 
  CheckCircle2, AlertTriangle, Sparkles, FileText, Zap, 
  RefreshCw, FolderPlus, Play, Pause, Rewind, FastForward, 
  Clock, Scissors, Film, HardDrive, CheckSquare, Square,
  GripVertical, ArrowUpDown, ChevronsUp, ChevronsDown, 
  Shuffle, Eye, SlidersHorizontal, RotateCcw
} from 'lucide-react';

interface MergerTabProps {
  currentOs: OSTheme;
  engineSettings: EngineSettings;
}

export const MergerTab: React.FC<MergerTabProps> = ({ currentOs, engineSettings }) => {
  // Initialize sample clips with custom trim ranges
  const [queue, setQueue] = useState<MergeQueueClip[]>([
    {
      id: 'clip-1',
      file: SAMPLE_VIDEOS[0], // 180s
      trimStart: 5,
      trimEnd: 40, // 35s
      trimEnabled: true,
      pathWin: `C:\\Videos\\${SAMPLE_VIDEOS[0].name}`,
      pathLinux: `/home/user/Videos/${SAMPLE_VIDEOS[0].name}`,
    },
    {
      id: 'clip-2',
      file: SAMPLE_VIDEOS[1], // 95s
      trimStart: 10,
      trimEnd: 60, // 50s
      trimEnabled: true,
      pathWin: `C:\\Videos\\${SAMPLE_VIDEOS[1].name}`,
      pathLinux: `/home/user/Videos/${SAMPLE_VIDEOS[1].name}`,
    },
    {
      id: 'clip-3',
      file: SAMPLE_VIDEOS[2], // 120s
      trimStart: 0,
      trimEnd: 45, // 45s
      trimEnabled: false,
      pathWin: `C:\\Videos\\${SAMPLE_VIDEOS[2].name}`,
      pathLinux: `/home/user/Videos/${SAMPLE_VIDEOS[2].name}`,
    }
  ]);

  // Selected clip for Preview & Trimming
  const [selectedClipId, setSelectedClipId] = useState<string>(queue[0]?.id || '');
  const activeClip = queue.find(q => q.id === selectedClipId) || queue[0];

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingSegmentOnly, setIsPlayingSegmentOnly] = useState<boolean>(false);

  // Time string inputs for the currently active clip
  const [trimStartInput, setTrimStartInput] = useState<string>('00:00:05');
  const [trimEndInput, setTrimEndInput] = useState<string>('00:00:40');

  // Drag-and-drop state for queue reordering
  const [draggedClipIndex, setDraggedClipIndex] = useState<number | null>(null);
  const [dragOverClipIndex, setDragOverClipIndex] = useState<number | null>(null);

  // Synchronize inputs & video player when active clip switches
  useEffect(() => {
    if (activeClip) {
      setTrimStartInput(formatTime(activeClip.trimStart));
      setTrimEndInput(formatTime(activeClip.trimEnd));
      setIsPlaying(false);
      setIsPlayingSegmentOnly(false);

      if (videoRef.current) {
        // Safe seek
        try {
          videoRef.current.currentTime = activeClip.trimStart;
        } catch {
          // Video may still be buffering metadata
        }
        setCurrentTime(activeClip.trimStart);
      }
    }
  }, [activeClip?.id]);

  // When video loads metadata, ensure duration and start position are precisely synchronized
  const onLoadedMetadata = () => {
    if (!videoRef.current || !activeClip) return;
    const realDur = videoRef.current.duration;
    if (realDur && !isNaN(realDur) && realDur > 0) {
      // Clamp activeClip trim values if out of bounds
      const safeStart = Math.min(activeClip.trimStart, Math.max(0, realDur - 0.5));
      const safeEnd = Math.min(activeClip.trimEnd, realDur);

      setQueue(prev => prev.map(c => {
        if (c.id === activeClip.id) {
          return {
            ...c,
            trimStart: safeStart,
            trimEnd: safeEnd > safeStart ? safeEnd : realDur,
            file: {
              ...c.file,
              duration: realDur,
              width: videoRef.current?.videoWidth || c.file.width,
              height: videoRef.current?.videoHeight || c.file.height,
            }
          };
        }
        return c;
      }));

      try {
        videoRef.current.currentTime = safeStart;
      } catch {
        // Ignored
      }
      setCurrentTime(safeStart);
    }
  };

  // Video time update handler
  const onTimeUpdate = () => {
    if (!videoRef.current || !activeClip) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    // If currently previewing trimmed segment only: stop when reaching trimEnd
    if (isPlayingSegmentOnly && t >= activeClip.trimEnd) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsPlayingSegmentOnly(false);
      videoRef.current.currentTime = activeClip.trimStart;
      setCurrentTime(activeClip.trimStart);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsPlayingSegmentOnly(false);
    } else {
      setIsPlayingSegmentOnly(false);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Play ONLY the selected cut segment [IN -> OUT]
  const handlePlaySegmentOnly = () => {
    if (!videoRef.current || !activeClip) return;
    videoRef.current.currentTime = activeClip.trimStart;
    setCurrentTime(activeClip.trimStart);
    setIsPlayingSegmentOnly(true);
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const stepTime = (delta: number) => {
    if (!videoRef.current || !activeClip) return;
    const dur = activeClip.file.duration || 60;
    const next = Math.max(0, Math.min(dur, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = next;
    setCurrentTime(next);
  };

  // Trim updates
  const updateClipTrim = (id: string, start: number, end: number, enabled: boolean) => {
    setQueue(prev => prev.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          trimStart: Math.max(0, start), 
          trimEnd: Math.max(start + 0.1, end), 
          trimEnabled: enabled 
        };
      }
      return c;
    }));
  };

  const setInPoint = () => {
    if (!activeClip) return;
    const newStart = Math.min(currentTime, activeClip.trimEnd - 0.2);
    updateClipTrim(activeClip.id, newStart, activeClip.trimEnd, true);
    setTrimStartInput(formatTime(newStart));
  };

  const setOutPoint = () => {
    if (!activeClip) return;
    const newEnd = Math.max(currentTime, activeClip.trimStart + 0.2);
    updateClipTrim(activeClip.id, activeClip.trimStart, newEnd, true);
    setTrimEndInput(formatTime(newEnd));
  };

  const toggleClipTrimEnabled = (id: string) => {
    setQueue(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, trimEnabled: !c.trimEnabled };
      }
      return c;
    }));
  };

  // Quick Cut Presets for active clip
  const applyPresetTrim = (preset: 'all' | 'first10' | 'mid30' | 'last15') => {
    if (!activeClip) return;
    const dur = activeClip.file.duration || 60;
    let s = 0;
    let e = dur;

    if (preset === 'all') {
      s = 0;
      e = dur;
    } else if (preset === 'first10') {
      s = 0;
      e = Math.min(10, dur);
    } else if (preset === 'mid30') {
      const mid = dur / 2;
      s = Math.max(0, mid - 15);
      e = Math.min(dur, mid + 15);
    } else if (preset === 'last15') {
      s = Math.max(0, dur - 15);
      e = dur;
    }

    updateClipTrim(activeClip.id, s, e, true);
    setTrimStartInput(formatTime(s));
    setTrimEndInput(formatTime(e));
    if (videoRef.current) {
      videoRef.current.currentTime = s;
      setCurrentTime(s);
    }
  };

  // Stepper adjustments for Start/End
  const adjustTrimStart = (deltaSeconds: number) => {
    if (!activeClip) return;
    const newStart = Math.max(0, Math.min(activeClip.trimEnd - 0.5, activeClip.trimStart + deltaSeconds));
    updateClipTrim(activeClip.id, newStart, activeClip.trimEnd, true);
    setTrimStartInput(formatTime(newStart));
    if (videoRef.current) {
      videoRef.current.currentTime = newStart;
      setCurrentTime(newStart);
    }
  };

  const adjustTrimEnd = (deltaSeconds: number) => {
    if (!activeClip) return;
    const dur = activeClip.file.duration || 60;
    const newEnd = Math.min(dur, Math.max(activeClip.trimStart + 0.5, activeClip.trimEnd + deltaSeconds));
    updateClipTrim(activeClip.id, activeClip.trimStart, newEnd, true);
    setTrimEndInput(formatTime(newEnd));
  };

  // Reorder queue: Move up/down by 1
  const move = (idx: number, delta: number) => {
    const nextIdx = idx + delta;
    if (nextIdx < 0 || nextIdx >= queue.length) return;
    const copy = [...queue];
    const item = copy[idx];
    copy[idx] = copy[nextIdx];
    copy[nextIdx] = item;
    setQueue(copy);
  };

  // Reorder queue: Move to top or bottom
  const moveToExtreme = (idx: number, to: 'top' | 'bottom') => {
    if (idx < 0 || idx >= queue.length) return;
    const copy = [...queue];
    const [item] = copy.splice(idx, 1);
    if (to === 'top') {
      copy.unshift(item);
    } else {
      copy.push(item);
    }
    setQueue(copy);
  };

  // Direct move to specific position (0-indexed)
  const moveToPosition = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx || fromIdx < 0 || fromIdx >= queue.length || toIdx < 0 || toIdx >= queue.length) return;
    const copy = [...queue];
    const [item] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, item);
    setQueue(copy);
  };

  // Swap two items directly
  const swapWithNext = (idx: number) => {
    if (idx < 0 || idx >= queue.length - 1) return;
    const copy = [...queue];
    const temp = copy[idx];
    copy[idx] = copy[idx + 1];
    copy[idx + 1] = temp;
    setQueue(copy);
  };

  // Reverse entire queue order
  const handleReverseQueue = () => {
    setQueue(prev => [...prev].reverse());
  };

  // HTML5 Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedClipIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // set drag ghost
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch {}
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverClipIndex !== index) {
      setDragOverClipIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedClipIndex === null || draggedClipIndex === targetIndex) {
      setDraggedClipIndex(null);
      setDragOverClipIndex(null);
      return;
    }
    moveToPosition(draggedClipIndex, targetIndex);
    setDraggedClipIndex(null);
    setDragOverClipIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedClipIndex(null);
    setDragOverClipIndex(null);
  };

  const remove = (id: string) => {
    const nextQueue = queue.filter(q => q.id !== id);
    setQueue(nextQueue);
    if (selectedClipId === id && nextQueue.length > 0) {
      setSelectedClipId(nextQueue[0].id);
    }
  };

  const clear = () => setQueue([]);

  const addSample = () => {
    const s = SAMPLE_VIDEOS[queue.length % SAMPLE_VIDEOS.length];
    const id = 'clip-' + Date.now();
    const newClip: MergeQueueClip = {
      id,
      file: s,
      trimStart: 0,
      trimEnd: Math.min(s.duration, 40),
      trimEnabled: false,
      pathWin: `C:\\Videos\\${s.name}`,
      pathLinux: `/home/user/Videos/${s.name}`,
    };
    setQueue([...queue, newClip]);
    setSelectedClipId(id);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newClips: MergeQueueClip[] = Array.from(files).map((f, i) => {
      const id = 'up-' + Date.now() + i;
      const url = URL.createObjectURL(f);
      return {
        id,
        file: {
          id: 'v-' + id,
          name: f.name,
          size: f.size,
          duration: 60,
          width: 1920,
          height: 1080,
          codec: 'H.264',
          fps: 30,
          url,
          isCustom: true,
        },
        trimStart: 0,
        trimEnd: 30,
        trimEnabled: false,
        pathWin: `C:\\Videos\\${f.name}`,
        pathLinux: `/home/user/Videos/${f.name}`,
      };
    });
    setQueue([...queue, ...newClips]);
    if (newClips.length > 0) setSelectedClipId(newClips[0].id);
  };

  // Calculate total final duration based on trimmed ranges
  const totalDuration = queue.reduce((sum, q) => {
    if (q.trimEnabled) {
      return sum + Math.max(0, q.trimEnd - q.trimStart);
    }
    return sum + q.file.duration;
  }, 0);

  // Script generation logic
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isFileDragging, setIsFileDragging] = useState<boolean>(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const handleDragOverFiles = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      if (!isFileDragging) setIsFileDragging(true);
    }
  };

  const handleDragLeaveFiles = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFileDragging(false);
    }
  };

  const handleDropFilesFromOS = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      setIsFileDragging(false);
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      const newClips: MergeQueueClip[] = Array.from(files).map((f, i) => {
        const id = 'up-' + Date.now() + i;
        const url = URL.createObjectURL(f);
        return {
          id,
          file: {
            id: 'v-' + id,
            name: f.name,
            size: f.size,
            duration: 60,
            width: 1920,
            height: 1080,
            codec: 'H.264',
            fps: 30,
            url,
            isCustom: true,
          },
          trimStart: 0,
          trimEnd: 30,
          trimEnabled: false,
          pathWin: `C:\\Videos\\${f.name}`,
          pathLinux: `/home/user/Videos/${f.name}`,
        };
      });
      setQueue(prev => [...prev, ...newClips]);
      if (newClips.length > 0) setSelectedClipId(newClips[0].id);
    }
  };

  const isWindows = currentOs === 'windows';
  const outFinal = isWindows ? '"C:\\Videos\\merged_cut_final.mp4"' : "'/home/user/Videos/merged_cut_final.mp4'";
  
  let fullScript = '';
  const audioFlags = engineSettings.cameraAudioFix ? '-c:v copy -c:a aac -b:a 128k' : '-c copy';

  if (isWindows) {
    const cutCommands = queue.map((c, idx) => {
      const src = `"${c.pathWin}"`;
      const tempDest = `"temp_part_${idx + 1}.ts"`;
      const partNum = idx + 1;
      if (c.trimEnabled) {
        return `ffmpeg -y -ss ${formatTime(c.trimStart)} -to ${formatTime(c.trimEnd)} -i ${src} ${audioFlags} -f mpegts -avoid_negative_ts make_zero -fflags +genpts ${tempDest}\nif %ERRORLEVEL% NEQ 0 ( echo [LOI] Xu ly phan doan ${partNum} that bai! & pause & exit /b 1 )`;
      }
      return `ffmpeg -y -i ${src} ${audioFlags} -f mpegts -avoid_negative_ts make_zero -fflags +genpts ${tempDest}\nif %ERRORLEVEL% NEQ 0 ( echo [LOI] Xu ly phan doan ${partNum} that bai! & pause & exit /b 1 )`;
    }).join('\n');

    const echoLines = queue.map((_, idx) => {
      const op = idx === 0 ? '>' : '>>';
      return `echo file 'temp_part_${idx + 1}.ts' ${op} list_merge.txt`;
    }).join('\n');

    fullScript = `@echo off
chcp 65001 >nul
echo [1/3] Dang cat loc ${queue.length} phan doan video theo dung thu tu...
${cutCommands}

echo [2/3] Dang chuan bi danh sach ghep noi...
${echoLines}

echo [3/3] Dang ghep noi toan bo ${queue.length} video (Lossless Stream Copy)...
ffmpeg -y -f concat -safe 0 -i list_merge.txt -c copy -bsf:a aac_adtstoasc -avoid_negative_ts make_zero -fflags +genpts ${outFinal}
if %ERRORLEVEL% NEQ 0 ( echo [LOI] Qua trinh ghep noi that bai! & pause & exit /b 1 )

del list_merge.txt temp_part_*.ts 2>nul
echo Hoan tat ghep noi thanh cong toan bo ${queue.length} video vao: ${outFinal}`;
  } else {
    // Linux Bash
    const cutCommands = queue.map((c, idx) => {
      const src = `'${c.pathLinux}'`;
      const tempDest = `'temp_part_${idx + 1}.ts'`;
      if (c.trimEnabled) {
        return `ffmpeg -y -ss ${formatTime(c.trimStart)} -to ${formatTime(c.trimEnd)} -i ${src} ${audioFlags} -f mpegts -avoid_negative_ts make_zero -fflags +genpts ${tempDest}`;
      }
      return `ffmpeg -y -i ${src} ${audioFlags} -f mpegts -avoid_negative_ts make_zero -fflags +genpts ${tempDest}`;
    }).join('\n');

    const listLines = queue.map((_, idx) => `file 'temp_part_${idx + 1}.ts'`).join('\n');

    fullScript = `#!/usr/bin/env bash
set -e
echo "[1/3] Dang cat loc ${queue.length} phan doan video theo dung thu tu..."
${cutCommands}

echo "[2/3] Dang chuan bi danh sach ghep noi..."
cat << 'EOF' > list_merge.txt
${listLines}
EOF

echo "[3/3] Dang ghep noi toan bo ${queue.length} video (Lossless Stream Copy)..."
ffmpeg -y -f concat -safe 0 -i list_merge.txt -c copy -bsf:a aac_adtstoasc -avoid_negative_ts make_zero -fflags +genpts ${outFinal}

rm -f list_merge.txt temp_part_*.ts
echo "Da hoan tat ghep noi thanh cong toan bo ${queue.length} video vao: ${outFinal}"`;
  }

  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunProcessing = () => {
    if (queue.length < 2) return;
    setIsProcessing(true);
    setProgress(0);
    setIsDone(false);

    setCurrentStepText('Đang cắt lọc các phân đoạn theo mốc thời gian đã chọn...');
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev === 40) {
          setCurrentStepText('Đang ghép nối các phân đoạn theo thứ tự đã sắp xếp (Concat Demuxer)...');
        }
        if (prev >= 100) {
          clearInterval(timer);
          setIsProcessing(false);
          setIsDone(true);
          setCurrentStepText('Hoàn tất cắt & ghép chủ động!');
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-indigo-950/30 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Ghép Kèm Cắt Lọc Từng Phân Đoạn
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Kéo chuột chọn đoạn cắt trực tiếp • Kéo thả đổi thứ tự video dễ dàng
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Ghép Video &amp; Cắt Bớt Phân Đoạn Chuẩn Lossless (Windows &amp; Linux)</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition">
            <FolderPlus className="w-4 h-4" />
            <span>Thêm Video Từ Máy...</span>
            <input type="file" multiple accept="video/*" onChange={handleUpload} className="hidden" />
          </label>

          <button
            type="button"
            onClick={addSample}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition"
          >
            + Thêm Video Mẫu
          </button>
        </div>
      </div>

      {/* CCTV Camera & Concat Continuity Notice */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Chế độ tương thích Camera quan sát (CCTV / pcm_mulaw) &amp; Ghép nối thông suốt:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ĐANG BẬT
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Tự động chuẩn hóa âm thanh sang AAC và áp dụng cờ <code>-avoid_negative_ts make_zero -fflags +genpts</code>, đảm bảo xuất đầy đủ 100% video trong danh sách mà không bị dừng sau video đầu tiên.
            </p>
          </div>
        </div>
      </div>

      {/* Drag & Drop Visual Drop Zone Banner for Multiple Videos */}
      <div
        onDragOver={handleDragOverFiles}
        onDragLeave={handleDragLeaveFiles}
        onDrop={handleDropFilesFromOS}
        onClick={() => fileUploadInputRef.current?.click()}
        className={`p-3.5 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isFileDragging
            ? 'border-emerald-400 bg-emerald-500/20 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
            : 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>📂 KÉO THẢ CÁC VIDEO CẦN GHÉP VÀO ĐÂY HOẶC BẤM ĐỂ CHỌN</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">Multi-Drop</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Thả 1 hoặc nhiều video cùng lúc để tự động thêm vào danh sách ghép nối (MP4, MKV, MOV, TS, Camera CCTV...)
            </p>
          </div>
        </div>
        <button
          type="button"
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
        >
          ➕ Thêm Video Từ Máy...
        </button>
        <input ref={fileUploadInputRef} type="file" multiple accept="video/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Main Grid: Preview on Left, Queue & Trim Controls on Right */}
      <div 
        onDragOver={handleDragOverFiles}
        onDragLeave={handleDragLeaveFiles}
        onDrop={handleDropFilesFromOS}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative"
      >
        {/* Full tab drop overlay */}
        {isFileDragging && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm z-50 rounded-2xl flex flex-col items-center justify-center border-4 border-dashed border-emerald-400 text-white p-6 text-center animate-fade-in shadow-2xl">
            <Layers className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
            <h4 className="text-base font-bold">Thả các file video vào đây để thêm vào hàng đợi ghép nối</h4>
            <p className="text-xs text-emerald-200 mt-1">Hệ thống sẽ nạp toàn bộ danh sách và chuẩn bị cắt ghép tức thì</p>
          </div>
        )}

        {/* Left Column: Live Video Player Preview for the Selected Clip */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative group">
            {/* Header of Preview Player */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200 truncate max-w-sm">
                <Film className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">
                  Đang xem &amp; cắt: <strong className="text-white">{activeClip?.file.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                  activeClip?.trimEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeClip?.trimEnabled ? '✂️ Đang áp dụng cắt' : 'Toàn bộ video'}
                </span>
              </div>
            </div>

            {/* Video Screen */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                key={activeClip?.file.url || activeClip?.id}
                ref={videoRef}
                src={activeClip?.file.url}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => {
                  setIsPlaying(false);
                  setIsPlayingSegmentOnly(false);
                }}
                className="w-full h-full object-contain"
                playsInline
              />

              {/* Big Center Play/Pause button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Dừng video" : "Phát video"}
                className={`absolute w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl transition transform group-hover:scale-105 ${
                  isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-90'
                }`}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  {formatTime(currentTime)}
                </span>
                <span className="px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-mono text-slate-300 border border-slate-700">
                  {activeClip?.file.width}x{activeClip?.file.height}
                </span>
              </div>

              {isPlayingSegmentOnly && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md rounded-md text-xs font-bold text-white shadow flex items-center gap-1.5 animate-pulse">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Đang phát thử đoạn cắt [IN ➔ OUT]</span>
                </div>
              )}
            </div>

            {/* Visual Draggable Timeline & Trimming bar with KEY to force clean re-mount per clip */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3.5">
              <InteractiveTimeline
                key={activeClip?.id}
                duration={activeClip?.file.duration || 60}
                currentTime={currentTime}
                startTime={activeClip?.trimStart || 0}
                endTime={activeClip?.trimEnd || 30}
                onSeek={(t) => {
                  setCurrentTime(t);
                  if (videoRef.current) {
                    try {
                      videoRef.current.currentTime = t;
                    } catch {}
                  }
                }}
                onChangeRange={(s, e) => {
                  if (activeClip) {
                    updateClipTrim(activeClip.id, s, e, true);
                    setTrimStartInput(formatTime(s));
                    setTrimEndInput(formatTime(e));
                  }
                }}
                themeColor="emerald"
              />

              {/* Player Controls & Trim In/Out Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                {/* Steppers & Play */}
                <div className="flex items-center space-x-1">
                  <button onClick={() => stepTime(-5)} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 transition" title="Lùi 5 giây">
                    <Rewind className="w-4 h-4" />
                  </button>
                  <button onClick={togglePlay} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Dừng' : 'Phát'}</span>
                  </button>
                  <button onClick={() => stepTime(5)} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 transition" title="Tua 5 giây">
                    <FastForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePlaySegmentOnly}
                    className="px-3 py-2 bg-teal-700/80 hover:bg-teal-600 text-white rounded-lg font-semibold border border-teal-500/40 flex items-center gap-1.5 transition ml-1"
                    title="Chỉ phát từ điểm [IN] đến [OUT] để kiểm tra trước kết quả cắt"
                  >
                    <Scissors className="w-3.5 h-3.5 text-teal-200" />
                    <span>Phát Thử Đoạn Cắt</span>
                  </button>
                </div>

                {/* Direct Set IN / OUT buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={setInPoint}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-semibold border border-slate-700 flex items-center gap-1.5 transition shadow"
                    title="Lấy vị trí con trỏ hiện tại làm điểm Bắt Đầu [IN]"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>[ Đặt Đầu Cắt (IN)</span>
                  </button>
                  <button
                    onClick={setOutPoint}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-semibold border border-slate-700 flex items-center gap-1.5 transition shadow"
                    title="Lấy vị trí con trỏ hiện tại làm điểm Kết Thúc [OUT]"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Đặt Cuối Cắt (OUT) ]</span>
                  </button>
                </div>
              </div>

              {/* Quick Cut Preset Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chọn nhanh đoạn:</span>
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPresetTrim('all')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
                  >
                    Toàn bộ video
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTrim('first10')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
                  >
                    10s đầu
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTrim('mid30')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
                  >
                    30s giữa
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTrim('last15')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
                  >
                    15s cuối
                  </button>
                </div>

                {/* Micro Adjusters */}
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <span className="text-slate-400">Chỉnh [IN]:</span>
                  <button onClick={() => adjustTrimStart(-1)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700">-1s</button>
                  <button onClick={() => adjustTrimStart(1)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700">+1s</button>
                  <span className="text-slate-400 ml-1.5">Chỉnh [OUT]:</span>
                  <button onClick={() => adjustTrimEnd(-1)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700">-1s</button>
                  <button onClick={() => adjustTrimEnd(1)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700">+1s</button>
                </div>
              </div>

              {/* Trim status toggle & summary for this clip */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={activeClip?.trimEnabled || false}
                    onChange={() => activeClip && toggleClipTrimEnabled(activeClip.id)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Áp dụng cắt bớt video này trước khi ghép</span>
                </label>

                {activeClip?.trimEnabled ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                    Giữ lại: {formatTime(Math.max(0, activeClip.trimEnd - activeClip.trimStart))} (từ {formatTime(activeClip.trimStart)} ➔ {formatTime(activeClip.trimEnd)})
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">
                    Giữ nguyên toàn bộ thời lượng gốc ({formatTime(activeClip?.file.duration || 0)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Queue of videos with Full Drag-and-Drop, Swap & Direct Position Selectors */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3">
            {/* Header of Queue */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Hàng Đợi Ghép Video ({queue.length} clip)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Kéo thả chuột hoặc dùng nút để <strong>hoán đổi thứ tự ghép</strong> theo ý muốn
                </p>
              </div>

              <div className="flex items-center gap-2">
                {queue.length > 1 && (
                  <button
                    type="button"
                    onClick={handleReverseQueue}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1 transition"
                    title="Đảo ngược toàn bộ thứ tự danh sách video"
                  >
                    <Shuffle className="w-3 h-3 text-cyan-400" />
                    <span>Đảo ngược</span>
                  </button>
                )}

                {queue.length > 0 && (
                  <button onClick={clear} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium">
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                )}
              </div>
            </div>

            {/* List with Drag-and-Drop and Position Selector */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {queue.map((item, index) => {
                const isSelected = item.id === selectedClipId;
                const segDuration = item.trimEnabled ? Math.max(0, item.trimEnd - item.trimStart) : item.file.duration;
                const isDragging = draggedClipIndex === index;
                const isOver = dragOverClipIndex === index;

                return (
                  <div
                    key={item.id}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedClipId(item.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer text-xs flex flex-col gap-2 relative ${
                      isDragging
                        ? 'opacity-40 border-dashed border-emerald-400 bg-emerald-950/20'
                        : isOver
                        ? 'border-t-2 border-t-emerald-400 bg-emerald-900/20 shadow-lg'
                        : isSelected
                        ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Drag Handle, Position Dropdown, Name, and Quick Move Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Drag Handle */}
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition"
                          title="Nhấn giữ và kéo chuột để đổi thứ tự video trong danh sách ghép"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Position Selector Dropdown */}
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={index}
                            onChange={(e) => moveToPosition(index, parseInt(e.target.value, 10))}
                            aria-label={`Vị trí của video ${item.file.name}`}
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold font-mono border cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                            title="Chọn vị trí trực tiếp cho video này"
                          >
                            {queue.map((_, pIdx) => (
                              <option key={pIdx} value={pIdx}>
                                #{pIdx + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title and duration */}
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate text-[12px] flex items-center gap-1.5">
                            <span className="truncate">{item.file.name}</span>
                            {isSelected && (
                              <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] bg-emerald-500 text-slate-950 font-bold">
                                Đang chọn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action Icons: Move Up, Move Down, Swap, Delete */}
                      <div className="flex items-center space-x-1 shrink-0" onClick={e => e.stopPropagation()}>
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-20 rounded-md transition"
                          title="Di chuyển lên trên 1 bậc"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={index === queue.length - 1}
                          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-20 rounded-md transition"
                          title="Di chuyển xuống dưới 1 bậc"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Move to Top */}
                        <button
                          type="button"
                          onClick={() => moveToExtreme(index, 'top')}
                          disabled={index === 0}
                          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 disabled:opacity-20 rounded-md transition hidden sm:inline-block"
                          title="Đưa lên đầu danh sách"
                        >
                          <ChevronsUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move to Bottom */}
                        <button
                          type="button"
                          onClick={() => moveToExtreme(index, 'bottom')}
                          disabled={index === queue.length - 1}
                          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 disabled:opacity-20 rounded-md transition hidden sm:inline-block"
                          title="Đưa xuống cuối danh sách"
                        >
                          <ChevronsDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="p-1.5 bg-slate-800/80 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 rounded-md transition ml-1"
                          title="Xóa clip này khỏi danh sách"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Trim details */}
                    <div className="flex items-center justify-between text-[11px] font-mono pl-7 pr-1">
                      {item.trimEnabled ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          Cắt lọc: {formatTime(item.trimStart)} &rarr; {formatTime(item.trimEnd)} ({formatTime(segDuration)})
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Toàn bộ thời lượng: {formatTime(item.file.duration)}
                        </span>
                      )}

                      <span className="text-slate-500 text-[10px]">
                        {formatBytes(item.file.size)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {queue.length > 0 && (
              <div className="pt-2.5 border-t border-slate-800 flex justify-between text-xs text-slate-300 items-center">
                <span className="text-slate-400">Tổng thời lượng ghép nối sau khi cắt:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-500/30">
                  {formatTime(totalDuration)}
                </span>
              </div>
            )}
          </div>

          {/* Action Box: Script Preview & Run Processing */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Script Cắt &amp; Ghép ({currentOs === 'windows' ? 'Windows Batch' : 'Linux Bash'}):
              </span>

              <button
                type="button"
                onClick={handleCopyScript}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép script'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all border border-slate-800 leading-relaxed max-h-36">
              {fullScript}
            </pre>

            <button
              type="button"
              onClick={handleRunProcessing}
              disabled={isProcessing || queue.length < 2}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'Đang thực hiện cắt & ghép...' : '🚀 Cắt Lọc & Ghép Tất Cả Các Phân Đoạn Theo Thứ Tự'}</span>
            </button>

            {isProcessing && (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{currentStepText}</span>
                  <span className="font-mono font-bold text-emerald-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-300 h-2 transition-all duration-100 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isDone && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đã cắt bỏ các đoạn thừa và ghép nối thành công {queue.length} video theo đúng thứ tự! (Thời lượng: {formatTime(totalDuration)})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
