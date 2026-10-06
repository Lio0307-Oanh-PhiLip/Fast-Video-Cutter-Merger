import React, { useRef, useState, useEffect, useCallback } from 'react';
import { formatTime } from '../data/sampleVideos';

interface InteractiveTimelineProps {
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  onSeek: (t: number) => void;
  onChangeRange: (start: number, end: number) => void;
  themeColor?: 'indigo' | 'emerald';
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  duration,
  currentTime,
  startTime,
  endTime,
  onSeek,
  onChangeRange,
  themeColor = 'indigo',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag states: 'start' | 'end' | 'playhead' | 'segment' | 'create-range' | null
  const [activeDrag, setActiveDrag] = useState<'start' | 'end' | 'playhead' | 'segment' | 'create-range' | null>(null);
  
  // Hover & mouse coordinates for tooltip and creation
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  
  // Drag refs to avoid stale closure during rapid mouse movements
  const dragAnchorRef = useRef<{
    time: number;
    startX: number;
    initialStart: number;
    initialEnd: number;
    hasMoved: boolean;
  }>({
    time: 0,
    startX: 0,
    initialStart: 0,
    initialEnd: 0,
    hasMoved: false,
  });

  const dur = Math.max(1, duration || 60);

  const getRatioFromX = useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(x / rect.width, 1));
  }, []);

  // Handle mousedown on Start Handle [
  const handleStartHandleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDrag('start');
  };

  // Handle mousedown on End Handle ]
  const handleEndHandleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDrag('end');
  };

  // Handle mousedown on Playhead
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDrag('playhead');
  };

  // Handle mousedown on the Center Slide Grip to slide the entire segment
  const handleSegmentMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const ratio = getRatioFromX(e.clientX);
    dragAnchorRef.current = {
      time: ratio * dur,
      startX: e.clientX,
      initialStart: startTime,
      initialEnd: endTime,
      hasMoved: false,
    };
    setActiveDrag('segment');
  };

  // Handle mousedown on the track to drag-select a cut range directly
  const handleTrackMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const ratio = getRatioFromX(e.clientX);
    const clickTime = ratio * dur;

    dragAnchorRef.current = {
      time: clickTime,
      startX: e.clientX,
      initialStart: startTime,
      initialEnd: endTime,
      hasMoved: false,
    };
    setActiveDrag('create-range');
  };

  // Global mousemove and mouseup
  useEffect(() => {
    if (!activeDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      const ratio = getRatioFromX(e.clientX);
      const t = Math.max(0, Math.min(ratio * dur, dur));
      const dist = Math.abs(e.clientX - dragAnchorRef.current.startX);

      if (dist > 4) {
        dragAnchorRef.current.hasMoved = true;
      }

      if (activeDrag === 'start') {
        // Dragging the left [IN] handle
        const safeStart = Math.min(t, endTime - 0.1);
        onChangeRange(Math.max(0, safeStart), endTime);
        onSeek(Math.max(0, safeStart));
      } else if (activeDrag === 'end') {
        // Dragging the right [OUT] handle
        const safeEnd = Math.max(t, startTime + 0.1);
        onChangeRange(startTime, Math.min(dur, safeEnd));
        onSeek(Math.min(dur, safeEnd));
      } else if (activeDrag === 'playhead') {
        onSeek(t);
      } else if (activeDrag === 'segment') {
        // Sliding the entire selected cut window
        const anchor = dragAnchorRef.current;
        const delta = (ratio * dur) - anchor.time;
        const segLen = Math.max(0.2, anchor.initialEnd - anchor.initialStart);

        let newStart = anchor.initialStart + delta;
        let newEnd = anchor.initialEnd + delta;

        if (newStart < 0) {
          newStart = 0;
          newEnd = Math.min(dur, segLen);
        } else if (newEnd > dur) {
          newEnd = dur;
          newStart = Math.max(0, dur - segLen);
        }

        onChangeRange(newStart, newEnd);
        onSeek(newStart);
      } else if (activeDrag === 'create-range') {
        // Dragging across track from anchor point to current position
        const anchorTime = dragAnchorRef.current.time;
        const newStart = Math.max(0, Math.min(anchorTime, t));
        const newEnd = Math.min(dur, Math.max(anchorTime, t));
        
        if (dragAnchorRef.current.hasMoved) {
          onChangeRange(newStart, Math.max(newStart + 0.1, newEnd));
          onSeek(t);
        }
      }
    };

    const handleMouseUp = () => {
      if (activeDrag === 'create-range' && !dragAnchorRef.current.hasMoved) {
        // Just a simple click without dragging: seek to this position
        onSeek(dragAnchorRef.current.time);
      }
      setActiveDrag(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDrag, dur, startTime, endTime, getRatioFromX, onChangeRange, onSeek]);

  // Track hover coordinates for tooltip
  const handleTrackMouseMove = (e: React.MouseEvent) => {
    if (activeDrag) return;
    const ratio = getRatioFromX(e.clientX);
    setHoverTime(ratio * dur);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHoverX(e.clientX - rect.left);
    }
  };

  const handleTrackMouseLeave = () => {
    if (!activeDrag) {
      setHoverTime(null);
    }
  };

  const leftPercent = Math.max(0, Math.min((startTime / dur) * 100, 100));
  const rightPercent = Math.max(0, Math.min((endTime / dur) * 100, 100));
  const curPercent = Math.max(0, Math.min((currentTime / dur) * 100, 100));
  const cutDuration = Math.max(0, endTime - startTime);

  const activeZoneClass = themeColor === 'emerald'
    ? 'bg-emerald-500/30 border-emerald-400/80 shadow-[inset_0_0_12px_rgba(16,185,129,0.3)]'
    : 'bg-indigo-500/30 border-indigo-400/80 shadow-[inset_0_0_12px_rgba(99,102,241,0.3)]';

  const handleStartClass = themeColor === 'emerald'
    ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-300 ring-emerald-400/50'
    : 'bg-indigo-500 hover:bg-indigo-400 border-indigo-300 ring-indigo-400/50';

  const handleEndClass = themeColor === 'emerald'
    ? 'bg-amber-500 hover:bg-amber-400 border-amber-300 ring-amber-400/50'
    : 'bg-amber-500 hover:bg-amber-400 border-amber-300 ring-amber-400/50';

  return (
    <div className="space-y-2 select-none">
      {/* Top Status & Timestamp Labels */}
      <div className="flex flex-wrap justify-between items-center text-[11px] font-mono px-1 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Đầu [IN]: {formatTime(startTime)}
          </span>
          <span className="text-teal-300 font-semibold px-2 py-0.5 rounded bg-teal-950/50 border border-teal-500/30">
            Thời lượng cắt: <strong>{formatTime(cutDuration)}</strong>
          </span>
        </div>

        <div className="text-slate-300 flex items-center gap-1.5">
          <span className="text-slate-400">Vị trí phát:</span>
          <span className="font-bold text-white px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
            {formatTime(currentTime)}
          </span>
          <span className="text-slate-500">/ {formatTime(dur)}</span>
        </div>

        <span className="text-amber-400 font-bold flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
          Cuối [OUT]: {formatTime(endTime)}
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </span>
      </div>

      {/* Main Interactive Track */}
      <div
        ref={containerRef}
        onMouseDown={handleTrackMouseDown}
        onMouseMove={handleTrackMouseMove}
        onMouseLeave={handleTrackMouseLeave}
        className="relative h-14 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden cursor-crosshair shadow-inner flex items-center group transition"
        title="Nhấn giữ chuột và kéo từ điểm cắt đến điểm kết thúc để chọn vùng [IN ➔ OUT]"
      >
        {/* Timeline Grid Background Ticks */}
        <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-25">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex flex-col justify-between py-1">
              <div className={`w-px bg-slate-400 ${i % 5 === 0 ? 'h-3 opacity-80' : 'h-1.5 opacity-40'}`} />
              <div className={`w-px bg-slate-400 ${i % 5 === 0 ? 'h-3 opacity-80' : 'h-1.5 opacity-40'}`} />
            </div>
          ))}
        </div>

        {/* Hover Indicator Line & Floating Tooltip */}
        {hoverTime !== null && !activeDrag && (
          <div
            className="absolute top-0 bottom-0 w-px bg-cyan-400/80 pointer-events-none z-20"
            style={{ left: `${hoverX}px` }}
          >
            <div className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 bg-slate-900 border border-cyan-500/50 rounded text-[10px] font-mono text-cyan-300 shadow-lg pointer-events-none whitespace-nowrap">
              {formatTime(hoverTime)}
            </div>
          </div>
        )}

        {/* Active Selected Cut Range (Visual Highlight + Draggable Center Slide Grip) */}
        <div
          className={`absolute top-0 bottom-0 border-y-2 pointer-events-none z-25 transition-colors shadow-lg flex items-center justify-center overflow-hidden ${activeZoneClass}`}
          style={{
            left: `${leftPercent}%`,
            width: `${Math.max(0, rightPercent - leftPercent)}%`,
          }}
        >
          {/* Draggable center slide grip pill - Only this captures click to slide */}
          <div
            onMouseDown={handleSegmentMouseDown}
            className="pointer-events-auto cursor-grab active:cursor-grabbing px-2 py-0.5 rounded bg-slate-900/90 hover:bg-slate-900 border border-white/20 text-[10px] font-mono text-white font-bold shadow-md flex items-center gap-1 select-none transition hover:scale-105"
            title="Nhấn giữ chuột vào đây để trượt cả đoạn cắt sang trái/phải"
          >
            <span className="hidden sm:inline">↔ Trượt</span>
            <span>({formatTime(cutDuration)})</span>
          </div>
        </div>

        {/* Left [IN] Handle */}
        <div
          onMouseDown={handleStartHandleMouseDown}
          className={`absolute top-0 bottom-0 w-6 -ml-3 cursor-ew-resize z-40 flex items-center justify-center rounded-l-md border shadow-2xl transition-transform hover:scale-110 active:scale-125 focus:outline-none ring-2 ${handleStartClass}`}
          style={{ left: `${leftPercent}%` }}
          title="Kéo chuột để chỉnh mốc Bắt Đầu [IN]"
        >
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-extrabold text-white leading-none">[</span>
            <div className="w-1 h-3 bg-white/70 rounded-full mt-0.5" />
          </div>
        </div>

        {/* Right [OUT] Handle */}
        <div
          onMouseDown={handleEndHandleMouseDown}
          className={`absolute top-0 bottom-0 w-6 -ml-3 cursor-ew-resize z-40 flex items-center justify-center rounded-r-md border shadow-2xl transition-transform hover:scale-110 active:scale-125 focus:outline-none ring-2 ${handleEndClass}`}
          style={{ left: `${rightPercent}%` }}
          title="Kéo chuột để chỉnh mốc Kết Thúc [OUT]"
        >
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-extrabold text-white leading-none">]</span>
            <div className="w-1 h-3 bg-white/70 rounded-full mt-0.5" />
          </div>
        </div>

        {/* Playhead Needle (Current Playing Position) */}
        <div
          onMouseDown={handlePlayheadMouseDown}
          className="absolute top-0 bottom-0 w-1 -ml-0.5 bg-rose-500 z-50 cursor-ew-resize pointer-events-auto"
          style={{ left: `${curPercent}%` }}
          title="Con trỏ thời gian - Kéo chuột để tua video"
        >
          {/* Top handle pin */}
          <div className="w-4 h-4 bg-rose-500 border-2 border-white rounded-full -ml-1.5 -mt-1 shadow-lg flex items-center justify-center hover:scale-125 transition-transform">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick Help Sub-hint */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
        <span className="flex items-center gap-1">
          💡 <strong className="text-slate-300">Cách thao tác:</strong> Nhấn giữ chuột và kéo trên thanh để đánh dấu đoạn cắt; kéo <span className="text-emerald-400 font-bold">[</span> hoặc <span className="text-amber-400 font-bold">]</span> để chỉnh điểm; kéo nút <span className="text-cyan-300 font-bold">↔ Trượt</span> để dịch chuyển.
        </span>
        <span className="font-mono text-slate-500 hidden sm:inline">Tổng video: {formatTime(dur)}</span>
      </div>
    </div>
  );
};
