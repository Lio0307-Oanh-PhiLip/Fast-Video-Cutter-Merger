export type OSTheme = 'windows' | 'linux';

export interface VideoFile {
  id: string;
  name: string;
  size: number;
  duration: number; // seconds
  width: number;
  height: number;
  codec: string;
  fps: number;
  url: string;
  isCustom?: boolean;
}

export interface MergeQueueClip {
  id: string;
  file: VideoFile;
  trimStart: number; // in seconds
  trimEnd: number;   // in seconds
  trimEnabled: boolean;
  pathWin: string;
  pathLinux: string;
}

export interface EngineSettings {
  streamCopy: boolean;
  avoidNegativeTs: boolean;
  fastSeek: boolean;
  audioOnly: boolean;
  cameraAudioFix: boolean;
  gpuAccel: 'none' | 'nvenc' | 'qsv' | 'vaapi';
  outputFormat: 'mp4' | 'mkv' | 'mov' | 'ts';
}
