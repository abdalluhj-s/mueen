'use client';

import React, { useState, useEffect } from 'react';
import { Ayah } from './types';
import { toArabicNumerals } from './quranMetadata';
import {
  X,
  Play,
  Pause,
  BookOpen,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  Loader2,
  Volume2,
} from 'lucide-react';

interface AyahActionsModalProps {
  ayah: Ayah | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayAyah: (ayah: Ayah) => void;
  isPlayingAyah: boolean;
  activeAyahNumber: number | null;
  onBookmarkAyah: (page: number, ayahNumber: number) => void;
  isBookmarked: boolean;
}

export const AyahActionsModal: React.FC<AyahActionsModalProps> = ({
  ayah,
  isOpen,
  onClose,
  onPlayAyah,
  isPlayingAyah,
  activeAyahNumber,
  onBookmarkAyah,
  isBookmarked,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState<boolean>(false);
  const [showTafsir, setShowTafsir] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !ayah) {
      setShowTafsir(false);
      setTafsir(null);
      return;
    }

    // جلب التفسير الميسر فور فتح النافذة
    let isCancelled = false;
    setLoadingTafsir(true);

    fetch(`https://api.alquran.cloud/v1/ayah/${ayah.surahNumber}:${ayah.numberInSurah}/ar.muyassar`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data && data.data && data.data.text) {
          setTafsir(data.data.text);
          setLoadingTafsir(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setTafsir('يتعذر جلب التفسير الميسر حالياً.');
          setLoadingTafsir(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, ayah]);

  if (!isOpen || !ayah) return null;

  const isCurrentPlaying = isPlayingAyah && activeAyahNumber === ayah.number;

  const handleCopy = () => {
    const textToCopy = `﴿${ayah.text}﴾ [سورة ${ayah.surahName || ''}: الآية ${toArabicNumerals(ayah.numberInSurah)}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-800 max-h-[85vh] flex flex-col space-y-4 animate-in slide-in-from-bottom-6 duration-300"
      >
        {/* شريط العنوان */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
              {toArabicNumerals(ayah.numberInSurah)}
            </span>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                {ayah.surahName} • الآية {toArabicNumerals(ayah.numberInSurah)}
              </h3>
              <p className="text-[10px] text-gray-400">
                صفحة {toArabicNumerals(ayah.page)} • الجزء {toArabicNumerals(ayah.juz)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* نص الآية الكريمة */}
        <div className="p-4 rounded-2xl bg-[#FAF7EE] dark:bg-slate-800/80 border border-[#C5A059]/30 text-center">
          <p className="font-quran text-xl sm:text-2xl text-[#1F1D1A] dark:text-amber-100 leading-relaxed font-bold">
            {ayah.text}
          </p>
        </div>

        {/* أزرار الإجراءات التفاعلية */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* زر الاستماع */}
          <button
            type="button"
            onClick={() => onPlayAyah(ayah)}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCurrentPlaying
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 hover:bg-emerald-100'
            }`}
          >
            {isCurrentPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            <span>{isCurrentPlaying ? 'إيقاف' : 'استماع'}</span>
          </button>

          {/* زر التفسير */}
          <button
            type="button"
            onClick={() => setShowTafsir((prev) => !prev)}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              showTafsir
                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200/80 hover:bg-amber-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>التفسير</span>
          </button>

          {/* زر النسخ */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-600">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>نسخ الآية</span>
              </>
            )}
          </button>

          {/* زر الفاصلة */}
          <button
            type="button"
            onClick={() => onBookmarkAyah(ayah.page, ayah.number)}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'محفوظة' : 'فاصلة'}</span>
          </button>
        </div>

        {/* عرض التفسير الميسر */}
        {showTafsir && (
          <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200/80 dark:border-amber-900/50 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                التفسير الميسر (مجمع الملك فهد)
              </span>
            </div>
            {loadingTafsir ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-amber-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ استحضار التفسير المبارك...</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans text-justify">
                {tafsir}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
