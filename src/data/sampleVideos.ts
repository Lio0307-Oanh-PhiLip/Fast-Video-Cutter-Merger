import { VideoFile } from '../types';

export const SAMPLE_VIDEOS: VideoFile[] = [
  {
    id: 'sample-1',
    name: 'BigBuckBunny_1080p_60fps.mp4',
    size: 45_200_000,
    duration: 180,
    width: 1920,
    height: 1080,
    codec: 'H.264 / AVC',
    fps: 60,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'sample-2',
    name: 'ElephantsDream_1080p_Clip.mp4',
    size: 28_400_000,
    duration: 95,
    width: 1920,
    height: 1080,
    codec: 'H.264 / AVC',
    fps: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'sample-3',
    name: 'ForBiggerBlazes_Action.mp4',
    size: 62_100_000,
    duration: 120,
    width: 1920,
    height: 1080,
    codec: 'H.264 / AVC',
    fps: 60,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'sample-4',
    name: 'TearsOfSteel_SciFi_Clip.mp4',
    size: 34_800_000,
    duration: 140,
    width: 1920,
    height: 1080,
    codec: 'H.264 / AVC',
    fps: 24,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  }
];

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length === 3) {
    return (parseFloat(parts[0]) || 0) * 3600 + (parseFloat(parts[1]) || 0) * 60 + (parseFloat(parts[2]) || 0);
  }
  if (parts.length === 2) {
    return (parseFloat(parts[0]) || 0) * 60 + (parseFloat(parts[1]) || 0);
  }
  return parseFloat(parts[0]) || 0;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
