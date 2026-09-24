'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranPageContent } from './QuranPageContent';
import { PageData, Ayah, ReadingTheme } from './types';
import { ChevronRight, ChevronLeft, Bookmark, Sparkles } from 'lucide-react';
import { toArabicNumerals } from './quranMetadata';

interface Mushaf3DDesktopProps {
  rightPageNum: number;
  leftPageNum: number | null;
  rightPageData: PageData | null;
  leftPageData: PageData | null;
  isLoadingRight: boolean;
  isLoadingLeft: boolean;
  activeAyahNumber: number | null;
  theme: ReadingTheme;
  fontSize: 'sm' | 'md' | 'lg';
  onAyahClick: (ayah: Ayah) => void;
  onNextSpread: () => void;
  onPrevSpread: () => void;
  canNext: boolean;
  canPrev: boolean;
  bookmarkedPage: number | null;
  onToggleBookmark: (pageNum: number) => void;
}

export const Mushaf3DDesktop: React.FC<Mushaf3DDesktopProps> = ({
  rightPageNum,
  leftPageNum,
  rightPageData,
  leftPageData,
  isLoadingRight,
  isLoadingLeft,
  activeAyahNumber,
  theme,
  fontSize,
  onAyahClick,
  onNextSpread,
  onPrevSpread,
  canNext,
  canPrev,
  bookmarkedPage,
  onToggleBookmark,
}) => {
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNext = () => {
    if (!canNext || isFlipping) return;
    setTurnDirection('next');
    setIsFlipping(true);
    onNextSpread();
    setTimeout(() => {
      setIsFlipping(false);
      setTurnDirection(null);
    }, 600);
  };

  const handlePrev = () => {
    if (!canPrev || isFlipping) return;
    setTurnDirection('prev');
    setIsFlipping(true);
    onPrevSpread();
    setTimeout(() => {
      setIsFlipping(false);
      setTurnDirection(null);
    }, 600);
  };

  const isBookmarkHere = bookmarkedPage === rightPageNum || (leftPageNum !== null && bookmarkedPage === leftPageNum);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-6 px-2 sm:px-4 select-none">
      {/* ======================= مسرح المصحف ثلاثي الأبعاد (3D Stage) ======================= */}
      <div className="relative [perspective:2200px] flex items-center justify-center">
        
        {/* زر التقليب الأيمن (السابق في القراءة العربية) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canPrev}
          className={`absolute -right-3 xl:-right-12 z-40 w-12 h-20 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl border border-[#C5A059]/40 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group ${
            canPrev
              ? 'hover:scale-105 hover:bg-[#FAF7EE] text-[#6B572E] active:scale-95'
              : 'opacity-30 cursor-not-allowed text-gray-400'
          }`}
          title="الصفحة السابقة (السهم الأيمن ➔)"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform text-[#C5A059]" />
          <span className="text-[10px] font-bold font-serif">السابق</span>
        </button>

        {/* زر التقليب الأيسر (التالي في القراءة العربية) */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className={`absolute -left-3 xl:-left-12 z-40 w-12 h-20 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl border border-[#C5A059]/40 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group ${
            canNext
              ? 'hover:scale-105 hover:bg-[#FAF7EE] text-[#6B572E] active:scale-95'
              : 'opacity-30 cursor-not-allowed text-gray-400'
          }`}
          title="الصفحة التالية (السهم الأيسر ⬅)"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform text-[#C5A059]" />
          <span className="text-[10px] font-bold font-serif">التالي</span>
        </button>

        {/* حامل المصحف وغلاف الجلد الملكي (Embossed Royal Book Cover) */}
        <div className="relative w-full rounded-[2.5rem] p-4 sm:p-7 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.45)] border-4 border-[#B68B35]/70 bg-gradient-to-br from-[#064E3B] via-[#043E2F] to-[#022C22] [transform-style:preserve-3d]">
          
          {/* زخارف أركان الغلاف الذهبية */}
          <div className="absolute top-3 right-4 text-[#D4AF37] text-2xl opacity-80 select-none">⚜</div>
          <div className="absolute top-3 left-4 text-[#D4AF37] text-2xl opacity-80 select-none">⚜</div>
          <div className="absolute bottom-3 right-4 text-[#D4AF37] text-2xl opacity-80 select-none">⚜</div>
          <div className="absolute bottom-3 left-4 text-[#D4AF37] text-2xl opacity-80 select-none">⚜</div>

          {/* شريط الفاصل المرجعي الحريري (Silk Bookmark Ribbon) */}
          <div
            onClick={() => onToggleBookmark(rightPageNum)}
            className="absolute top-0 right-1/2 translate-x-1/2 z-30 cursor-pointer group flex flex-col items-center"
            title="انقر لتثبيت أو إلغاء فاصلة القراءة هنا"
          >
            <div
              className={`w-6 sm:w-7 h-28 sm:h-36 shadow-lg transition-all duration-300 rounded-b-md relative flex items-end justify-center pb-2 ${
                isBookmarkHere
                  ? 'bg-gradient-to-b from-amber-600 via-amber-500 to-amber-400 shadow-amber-500/40 translate-y-1'
                  : 'bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-600 opacity-80 group-hover:opacity-100 group-hover:translate-y-2'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-white fill-white" />
              {/* شرابة طرف الفاصل */}
              <div className="absolute -bottom-3 w-4 h-3 bg-amber-300 rounded-b-full shadow-xs" />
            </div>
          </div>

          {/* ======================= صفحتان متقابلتان (Two-Page Spread) ======================= */}
          <div className="relative flex rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-[#C5A059]/40 min-h-[680px] lg:min-h-[740px] [transform-style:preserve-3d]">
            
            {/* سمك الورق في الحافة اليمنى (Stacked Pages Thickness Effect) */}
            <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-l from-[#C5A059]/40 via-[#FAF7EE] to-transparent z-20 pointer-events-none border-r border-[#C5A059]/50 shadow-inner" />

            {/* ================= الصفحة اليمنى (Right Page) ================= */}
            <div className="relative w-1/2 h-full flex flex-col border-l border-[#C5A059]/30 overflow-hidden bg-[#FAF7EE]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-right-${rightPageNum}`}
                  initial={turnDirection === 'prev' ? { rotateY: 30, opacity: 0.8 } : false}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full h-full flex-1"
                >
                  <QuranPageContent
                    pageNumber={rightPageNum}
                    pageData={rightPageData}
                    isLoading={isLoadingRight}
                    activeAyahNumber={activeAyahNumber}
                    theme={theme}
                    fontSize={fontSize}
                    onAyahClick={onAyahClick}
                    isRightPage={true}
                    showOuterFrame={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* خط طي الكعب المركزي (Spine Seam Shadow) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/20 via-black/40 to-black/20 pointer-events-none z-20 shadow-[0_0_12px_rgba(0,0,0,0.5)]" />

            {/* ================= الصفحة اليسرى (Left Page) ================= */}
            <div className="relative w-1/2 h-full flex flex-col border-r border-[#C5A059]/30 overflow-hidden bg-[#FAF7EE]">
              {leftPageNum !== null ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`page-left-${leftPageNum}`}
                    initial={turnDirection === 'next' ? { rotateY: -30, opacity: 0.8 } : false}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-full h-full flex-1"
                  >
                    <QuranPageContent
                      pageNumber={leftPageNum}
                      pageData={leftPageData}
                      isLoading={isLoadingLeft}
                      activeAyahNumber={activeAyahNumber}
                      theme={theme}
                      fontSize={fontSize}
                      onAyahClick={onAyahClick}
                      isLeftPage={true}
                      showOuterFrame={true}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                /* في حالة صفحة مفردة (الغلاف الداخلي) */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#FAF7EE] border-4 border-[#C5A059]/30">
                  <div className="w-24 h-24 rounded-full border-2 border-[#C5A059] flex items-center justify-center mb-4 text-3xl text-[#C5A059]">
                    ⚜
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#6B572E]">المصحف الشريف</h3>
                  <p className="text-xs font-serif text-[#C5A059] mt-2">مجمع الملك فهد لطباعة المصحف الشريف</p>
                </div>
              )}
            </div>

            {/* سمك الورق في الحافة اليسرى (Stacked Pages Thickness Effect) */}
            <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-[#C5A059]/40 via-[#FAF7EE] to-transparent z-20 pointer-events-none border-l border-[#C5A059]/50 shadow-inner" />
          </div>

          {/* شريط معلومات التقليب السفلي الأنيق */}
          <div className="mt-4 flex items-center justify-between text-xs text-[#E2C785] px-2 font-serif select-none">
            <div className="flex items-center gap-2">
              <span className="opacity-80">الصفحات المعروضة:</span>
              <span className="font-bold font-mono text-white bg-black/30 px-2 py-0.5 rounded-lg border border-[#C5A059]/30">
                {toArabicNumerals(rightPageNum)}
                {leftPageNum ? ` - ${toArabicNumerals(leftPageNum)}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] opacity-75">
              <span>يمكنك استخدام مفاتيح الأسهم</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-[#C5A059]/40 text-amber-300 font-mono">◄</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-[#C5A059]/40 text-amber-300 font-mono">►</kbd>
              <span>لتقليب صفحات المصحف</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
