'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { QuranPageContent } from './QuranPageContent';
import { PageData, Ayah, ReadingTheme } from './types';
import {
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Layers,
  Search,
  Volume2,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { toArabicNumerals, getSurahByPage, getJuzByPage } from './quranMetadata';

interface MushafMobileProps {
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
  onOpenIndex: () => void;
  onOpenAudio: () => void;
  onOpenSettings: () => void;
  onOpenPageJump: () => void;
}

export const MushafMobile: React.FC<MushafMobileProps> = ({
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
  onOpenIndex,
  onOpenAudio,
  onOpenSettings,
  onOpenPageJump,
}) => {
  const [slideDirection, setSlideDirection] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);

  const surahMeta = getSurahByPage(pageNumber);
  const juzMeta = getJuzByPage(pageNumber);
  const isBookmarked = bookmarkedPage === pageNumber;

  // إيماءات السحب واللمس (Touch Swipe Gestures)
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && canNext) {
      // سحب لليسار = الانتقال للصفحة التالية في المصحف
      setSlideDirection(1);
      onNextPage();
    } else if (info.offset.x > swipeThreshold && canPrev) {
      // سحب لليمين = الرجوع للصفحة السابقة
      setSlideDirection(-1);
      onPrevPage();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden select-none">
      {/* ======================= شريط الرأس المتحرك ======================= */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenIndex}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{surahMeta.name}</span>
              </button>
              <span className="text-[11px] text-gray-500 font-serif">
                {juzMeta.name}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onToggleBookmark(pageNumber)}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="حفظ فاصلة القراءة"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onOpenPageJump}
                className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-mono font-bold text-gray-700 dark:text-gray-300"
              >
                صـ {toArabicNumerals(pageNumber)}
              </button>

              <button
                type="button"
                onClick={() => setShowControls(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600"
                title="وضع القراءة الكاملة بدون تشتيت"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================= سطح صفحة المصحف المتجاوب ======================= */}
      <div
        className="flex-1 w-full max-w-lg mx-auto py-2 px-1 relative flex flex-col justify-center cursor-default"
        onClick={() => {
          // النقر على هامش الصفحة يبدل إظهار/إخفاء شريط الأدوات
          setShowControls((prev) => !prev);
        }}
      >
        <AnimatePresence custom={slideDirection} mode="wait">
          <motion.div
            key={`mobile-page-${pageNumber}`}
            custom={slideDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full h-full min-h-[580px] rounded-2xl shadow-md border border-[#C5A059]/40 overflow-hidden"
          >
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
          </motion.div>
        </AnimatePresence>

        {/* أزرار تقليب طافية وسريعة على الجانبين */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canPrev) {
              setSlideDirection(-1);
              onPrevPage();
            }
          }}
          disabled={!canPrev}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-14 rounded-l-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs shadow-md border-y border-l border-emerald-200/50 flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-20"
        >
          <ChevronRight className="w-5 h-5 text-[#C5A059]" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canNext) {
              setSlideDirection(1);
              onNextPage();
            }
          }}
          disabled={!canNext}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-14 rounded-r-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs shadow-md border-y border-r border-emerald-200/50 flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-20"
        >
          <ChevronLeft className="w-5 h-5 text-[#C5A059]" />
        </button>
      </div>

      {/* ======================= شريط الأدوات السفلي العائم للجوال ======================= */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg safe-area-pb"
          >
            <button
              type="button"
              onClick={onOpenIndex}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-emerald-700"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold">الفهرس</span>
            </button>

            <button
              type="button"
              onClick={onOpenPageJump}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-emerald-700"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold">انتقال</span>
            </button>

            <button
              type="button"
              onClick={onOpenAudio}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-emerald-700"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold">التلاوة</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(pageNumber)}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-emerald-700"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-gray-500'
                }`}
              />
              <span className="text-[10px] font-bold">فاصلة</span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-emerald-700"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold">المظهر</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
