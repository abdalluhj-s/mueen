'use client';

import React from 'react';
import { Ayah, PageData, ReadingTheme } from './types';
import { toArabicNumerals, getSurahByPage, getJuzByPage } from './quranMetadata';
import { Loader2 } from 'lucide-react';

interface QuranPageContentProps {
  pageNumber: number;
  pageData: PageData | null;
  isLoading: boolean;
  activeAyahNumber: number | null;
  theme: ReadingTheme;
  fontSize?: 'sm' | 'md' | 'lg';
  onAyahClick?: (ayah: Ayah) => void;
  isRightPage?: boolean;
  isLeftPage?: boolean;
  showOuterFrame?: boolean;
}

export const QuranPageContent: React.FC<QuranPageContentProps> = ({
  pageNumber,
  pageData,
  isLoading,
  activeAyahNumber,
  theme,
  fontSize = 'md',
  onAyahClick,
  isRightPage,
  isLeftPage,
  showOuterFrame = true,
}) => {
  const surahMeta = getSurahByPage(pageNumber);
  const juzMeta = getJuzByPage(pageNumber);

  // أنماط الألوان بناء على الثيم
  const themeStyles = {
    parchment: {
      bg: 'bg-[#FAF7EE]',
      text: 'text-[#1F1D1A]',
      frameBorder: 'border-[#C5A059]/70',
      innerBorder: 'border-[#D4AF37]/50',
      headerText: 'text-[#6B572E]',
      surahHeaderBg: 'bg-gradient-to-r from-[#DFC07B]/20 via-[#DFC07B]/40 to-[#DFC07B]/20 border-[#C5A059]',
      surahTitle: 'text-[#4A3B18]',
      bismillah: 'text-[#4A3B18]',
      ayahNum: 'text-[#A07828]',
      ayahActive: 'bg-amber-200/50 text-[#1F1D1A] ring-2 ring-[#C5A059]/60 rounded-md',
      spineShadowRight: 'shadow-[inset_-12px_0_15px_-8px_rgba(40,30,10,0.18)]',
      spineShadowLeft: 'shadow-[inset_12px_0_15px_-8px_rgba(40,30,10,0.18)]',
    },
    night: {
      bg: 'bg-[#0F172A]',
      text: 'text-[#F1F5F9]',
      frameBorder: 'border-[#94783E]/60',
      innerBorder: 'border-[#94783E]/40',
      headerText: 'text-[#E2C785]',
      surahHeaderBg: 'bg-gradient-to-r from-[#94783E]/20 via-[#94783E]/35 to-[#94783E]/20 border-[#94783E]/70',
      surahTitle: 'text-[#FCD34D]',
      bismillah: 'text-[#FCD34D]',
      ayahNum: 'text-[#FCD34D]',
      ayahActive: 'bg-amber-500/25 text-[#FFF] ring-2 ring-amber-400/70 rounded-md',
      spineShadowRight: 'shadow-[inset_-14px_0_18px_-8px_rgba(0,0,0,0.45)]',
      spineShadowLeft: 'shadow-[inset_14px_0_18px_-8px_rgba(0,0,0,0.45)]',
    },
    clean: {
      bg: 'bg-white',
      text: 'text-slate-900',
      frameBorder: 'border-emerald-700/60',
      innerBorder: 'border-emerald-600/30',
      headerText: 'text-emerald-900',
      surahHeaderBg: 'bg-emerald-50/80 border-emerald-300',
      surahTitle: 'text-emerald-900',
      bismillah: 'text-emerald-950',
      ayahNum: 'text-emerald-700',
      ayahActive: 'bg-emerald-100 text-slate-950 ring-2 ring-emerald-500/60 rounded-md',
      spineShadowRight: 'shadow-[inset_-10px_0_12px_-8px_rgba(0,0,0,0.12)]',
      spineShadowLeft: 'shadow-[inset_10px_0_12px_-8px_rgba(0,0,0,0.12)]',
    },
  }[theme];

  // حجم الخط للنصوص العثمانية
  const fontClass = {
    sm: 'text-lg sm:text-xl leading-[2.6rem] sm:leading-[3.1rem]',
    md: 'text-xl sm:text-2xl leading-[3rem] sm:leading-[3.6rem]',
    lg: 'text-2xl sm:text-3xl leading-[3.6rem] sm:leading-[4.2rem]',
  }[fontSize];

  // صفحات الفاتحة وأول البقرة (1 و 2) لها طابع زخرفي مذهب استثنائي
  const isIntroPage = pageNumber === 1 || pageNumber === 2;

  // إزالة البسملة إذا كانت موجودة في بداية نص الآية 1 (لغير الفاتحة)
  const cleanAyahText = (ayah: Ayah): string => {
    if (ayah.surahNumber !== 1 && ayah.numberInSurah === 1) {
      const bismillah1 = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
      const bismillah2 = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ';
      let t = ayah.text;
      if (t.startsWith(bismillah1)) t = t.replace(bismillah1, '').trim();
      if (t.startsWith(bismillah2)) t = t.replace(bismillah2, '').trim();
      return t;
    }
    return ayah.text;
  };

  const spineShadow = isRightPage
    ? themeStyles.spineShadowRight
    : isLeftPage
    ? themeStyles.spineShadowLeft
    : '';

  return (
    <div
      dir="rtl"
      className={`relative w-full h-full flex flex-col justify-between select-none ${themeStyles.bg} ${themeStyles.text} ${spineShadow} transition-colors duration-200 overflow-hidden ${
        showOuterFrame ? 'p-3 sm:p-5' : 'p-2'
      }`}
    >
      {/* الإطار الإسلامي الزخرفي للصفحة */}
      {showOuterFrame && (
        <div
          className={`absolute inset-2 sm:inset-3 border-2 ${themeStyles.frameBorder} rounded-lg pointer-events-none ${
            isIntroPage ? 'border-4 ring-2 ring-[#C5A059]/40' : ''
          }`}
        >
          {/* إطار داخلي رفيع */}
          <div className={`absolute inset-1 sm:inset-1.5 border ${themeStyles.innerBorder} rounded`} />

          {/* زخارف أركان الإطار */}
          <div className="absolute top-1 right-1 text-[#C5A059] text-[10px] leading-none select-none">⚜</div>
          <div className="absolute top-1 left-1 text-[#C5A059] text-[10px] leading-none select-none">⚜</div>
          <div className="absolute bottom-1 right-1 text-[#C5A059] text-[10px] leading-none select-none">⚜</div>
          <div className="absolute bottom-1 left-1 text-[#C5A059] text-[10px] leading-none select-none">⚜</div>
        </div>
      )}

      {/* ===================== ترويسة الصفحة (Header) ===================== */}
      <div className="relative z-10 pt-1 px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm font-semibold select-none border-b border-black/5 dark:border-white/5 pb-2">
        <span className={`${themeStyles.headerText} font-bold font-serif`}>
          {surahMeta.fullName}
        </span>
        <span className={`text-[11px] sm:text-xs font-mono px-2 py-0.5 rounded-full ${themeStyles.headerText} opacity-80`}>
          {juzMeta.name}
        </span>
      </div>

      {/* ===================== المحتوى والنصوص العثمانية ===================== */}
      <div className="relative z-10 flex-1 px-3 sm:px-8 py-3 sm:py-5 flex flex-col justify-center overflow-y-auto scrollbar-none">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
            <p className="text-xs text-[#C5A059] font-serif">جارٍ فتح الصفحة المباركة...</p>
          </div>
        ) : !pageData || pageData.ayahs.length === 0 ? (
          <div className="py-20 text-center text-xs opacity-60 font-serif">
            تعذر تحميل آيات الصفحة {toArabicNumerals(pageNumber)}
          </div>
        ) : (
          <div className="space-y-4">
            {pageData.ayahs.map((ayah, idx) => {
              const isStartOfSurah = ayah.numberInSurah === 1;
              const text = cleanAyahText(ayah);
              const isActive = activeAyahNumber === ayah.number;

              return (
                <React.Fragment key={ayah.number}>
                  {/* ترويسة السورة إذا كانت تبدأ في هذه الصفحة */}
                  {isStartOfSurah && (
                    <div className="my-4 text-center select-none animate-in fade-in duration-300">
                      {/* صندوق عنوان السورة المزخرف */}
                      <div
                        className={`mx-auto max-w-sm sm:max-w-md py-2.5 px-4 rounded-xl border-2 ${themeStyles.surahHeaderBg} shadow-xs relative overflow-hidden`}
                      >
                        <div className="absolute top-1 left-2 text-[#C5A059] text-[9px] select-none">✦</div>
                        <div className="absolute top-1 right-2 text-[#C5A059] text-[9px] select-none">✦</div>
                        <h2 className={`font-serif text-lg sm:text-2xl font-bold tracking-wide ${themeStyles.surahTitle}`}>
                          {ayah.surahName || surahMeta.fullName}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs opacity-75 font-serif mt-0.5">
                          <span>{surahMeta.type}</span>
                          <span>•</span>
                          <span>آياتها {toArabicNumerals(surahMeta.verses)}</span>
                        </div>
                      </div>

                      {/* البسملة الشريفة */}
                      {ayah.surahNumber !== 1 && ayah.surahNumber !== 9 && (
                        <div
                          className={`mt-4 mb-2 font-quran text-xl sm:text-2xl font-bold tracking-wide ${themeStyles.bismillah}`}
                        >
                          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
                        </div>
                      )}
                    </div>
                  )}

                  {/* نص الآية مع رقمها المزخرف */}
                  <span
                    onClick={() => onAyahClick && onAyahClick(ayah)}
                    className={`font-quran text-justify inline cursor-pointer transition-all duration-200 hover:opacity-85 ${fontClass} ${
                      isActive ? themeStyles.ayahActive : ''
                    }`}
                    title={`انقر لعرض تفسير وسماع الآية ${toArabicNumerals(ayah.numberInSurah)}`}
                  >
                    <span>{text}</span>
                    <span
                      className={`inline-block mx-1 font-serif text-sm sm:text-base font-bold select-none ${themeStyles.ayahNum}`}
                    >
                      ﴿{toArabicNumerals(ayah.numberInSurah)}﴾
                    </span>{' '}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== تذييل الصفحة (Footer) ===================== */}
      <div className="relative z-10 pb-1 px-4 sm:px-6 flex items-center justify-between text-xs font-serif select-none border-t border-black/5 dark:border-white/5 pt-2">
        <span className="text-[10px] sm:text-xs opacity-60">
          {pageData?.hizbQuarter ? `حزب ${toArabicNumerals(Math.ceil(pageData.hizbQuarter / 4))}` : ''}
        </span>

        {/* رقم الصفحة محاط بالزخرفة */}
        <div className="flex items-center gap-1.5 font-bold font-serif text-xs sm:text-sm">
          <span className="text-[#C5A059] opacity-70">ـ</span>
          <span className="px-2 py-0.5 rounded-md text-[#C5A059]">
            {toArabicNumerals(pageNumber)}
          </span>
          <span className="text-[#C5A059] opacity-70">ـ</span>
        </div>

        <span className="text-[10px] sm:text-xs opacity-60">
          مصحف المدينة
        </span>
      </div>
    </div>
  );
};
