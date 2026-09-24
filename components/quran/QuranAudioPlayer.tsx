'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Loader2,
  X,
} from 'lucide-react';
import { toArabicNumerals } from './quranMetadata';

interface QuranAudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  isLoadingAudio: boolean;
  currentSurahName: string;
  currentAyahNumberInSurah?: number | null;
  audioProgress: number;
  duration: number;
  onSeek: (seconds: number) => void;
  onNextAyah?: () => void;
  onPrevAyah?: () => void;
  onClose?: () => void;
  isAyahMode: boolean;
}

export const QuranAudioPlayer: React.FC<QuranAudioPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  isLoadingAudio,
  currentSurahName,
  currentAyahNumberInSurah,
  audioProgress,
  duration,
  onSeek,
  onNextAyah,
  onPrevAyah,
  onClose,
  isAyahMode,
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      dir="rtl"
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-emerald-100 dark:border-slate-800 shadow-xl max-w-xl mx-auto w-full space-y-2 animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={isLoadingAudio}
            className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-700/25 transition-all cursor-pointer shrink-0"
          >
            {isLoadingAudio ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white mr-0.5" />
            )}
          </button>

          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>تلاوة {currentSurahName}</span>
              {isAyahMode && currentAyahNumberInSurah && (
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                  الآية {toArabicNumerals(currentAyahNumberInSurah)}
                </span>
              )}
            </h4>
            <p className="text-[10px] text-gray-400">بصوت الشيخ مشاري راشد العفاسي</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onPrevAyah && (
            <button
              type="button"
              onClick={onPrevAyah}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              title="الآية السابقة"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          {onNextAyah && (
            <button
              type="button"
              onClick={onNextAyah}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              title="الآية التالية"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              title="إغلاق المشغل"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* شريط التمرير الزمني */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
        <span>{formatTime(audioProgress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={audioProgress}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
