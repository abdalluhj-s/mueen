'use client';

import React from 'react';
import { QuranPageContent } from './QuranPageContent';
import { PageData, Ayah, ReadingTheme } from './types';
import { ChevronRight, ChevronLeft, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';
import { toArabicNumerals, getSurahByPage, getJuzByPage } from './quranMetadata';

interface MushafStandardProps {
  pageNumber: number;
  pageData: PageData | null;
  isLoading: boolean;
  activeAyahNumber: number | null;
  theme: ReadingTheme;
  fontSize: 'sm' | 'md' | 'lg';
  onAyahClick: (ayah: Ayah) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  canNext: boolean;
  canPrev: boolean;
  bookmarkedPage: number | null;
  onToggleBookmark: (pageNum: number) => void;
}

export const MushafStandard: React.FC<MushafStandardProps> = ({
  pageNumber,
  pageData,
  isLoading,
  activeAyahNumber,
  theme,
  fontSize,
  onAyahClick,
  onNextPage,
  onPrevPage,
  canNext,
  canPrev,
  bookmarkedPage,
  onToggleBookmark,
}) => {
  const isBookmarked = bookmarkedPage === pageNumber;
  const surahMeta = getSurahByPage(pageNumber);
  const juzMeta = getJuzByPage(pageNumber);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center select-none py-2 sm:py-4 px-2">
      {/* شريط الإجراءات السريع أعلى المصحف */}
      <div className="w-full mb-3 flex items-center justify-between text-xs px-2 text-gray-600 dark:text-gray-300 font-serif">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300 font-serif">
            {surahMeta.fullName}
          </span>
          <span>•</span>
          <span className="text-gray-500">{juzMeta.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleBookmark(pageNumber)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-amber-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            <span className="font-bold text-[11px]">{isBookmarked ? 'علامة محفوظة' : 'حفظ كفاصلة'}</span>
          </button>
        </div>
      </div>

      {/* إطار صفحة المصحف العادية المريحة */}
      <div className="relative w-full rounded-3xl shadow-xl border-2 border-[#C5A059]/40 overflow-hidden min-h-[640px] sm:min-h-[720px] bg-[#FAF7EE] flex flex-col">
        
        {/* زر التقليب الأيمن (السابق في العربية) */}
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!canPrev}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-16 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs shadow-md border border-[#C5A059]/40 flex flex-col items-center justify-center transition-all cursor-pointer ${
            canPrev
              ? 'hover:scale-105 hover:bg-[#FAF7EE] text-[#6B572E]'
              : 'opacity-20 cursor-not-allowed text-gray-400'
          }`}
          title="الصفحة السابقة"
        >
          <ChevronRight className="w-6 h-6 text-[#C5A059]" />
        </button>

        {/* زر التقليب الأيسر (التالي في العربية) */}
        <button
          type="button"
          onClick={onNextPage}
          disabled={!canNext}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-16 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs shadow-md border border-[#C5A059]/40 flex flex-col items-center justify-center transition-all cursor-pointer ${
            canNext
              ? 'hover:scale-105 hover:bg-[#FAF7EE] text-[#6B572E]'
              : 'opacity-20 cursor-not-allowed text-gray-400'
          }`}
          title="الصفحة التالية"
        >
          <ChevronLeft className="w-6 h-6 text-[#C5A059]" />
        </button>

        {/* محتوى الصفحة العثماني */}
        <div className="flex-1 w-full h-full">
          <QuranPageContent
            pageNumber={pageNumber}
            pageData={pageData}
            isLoading={isLoading}
            activeAyahNumber={activeAyahNumber}
            theme={theme}
            fontSize={fontSize}
            onAyahClick={onAyahClick}
            showOuterFrame={true}
          />
        </div>
      </div>

      {/* شريط معلومات الصفحة السفلي */}
      <div className="w-full mt-3 flex items-center justify-between text-xs px-2 text-gray-500 font-serif">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!canPrev}
          className="flex items-center gap-1 hover:text-emerald-700 disabled:opacity-30 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الصفحة السابقة</span>
        </button>

        <span className="font-mono font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-gray-200 dark:border-slate-700 shadow-2xs">
          صـ {toArabicNumerals(pageNumber)} من ٦٠٤
        </span>

        <button
          type="button"
          onClick={onNextPage}
          disabled={!canNext}
          className="flex items-center gap-1 hover:text-emerald-700 disabled:opacity-30 cursor-pointer"
        >
          <span>الصفحة التالية</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
