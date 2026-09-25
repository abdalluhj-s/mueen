'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Bookmark,
  Target,
  Sparkles,
  CheckCircle2,
  Check,
  X,
  Volume2,
  SlidersHorizontal,
  Layers,
  Search,
  RotateCcw,
} from 'lucide-react';
import { toggleHabitCompletion } from '../actions/habits';
import { Ayah, PageData, ReadingTheme } from '../../components/quran/types';
import {
  QURAN_SURAHS,
  TOTAL_PAGES,
  toArabicNumerals,
  getSurahByPage,
  getJuzByPage,
} from '../../components/quran/quranMetadata';
import { QuranPageContent } from '../../components/quran/QuranPageContent';
import { MushafStandard } from '../../components/quran/MushafStandard';
import { Mushaf3DDesktop } from '../../components/quran/Mushaf3DDesktop';
import { MushafMobile } from '../../components/quran/MushafMobile';
import { AyahActionsModal } from '../../components/quran/AyahActionsModal';
import { QuranIndexModal } from '../../components/quran/QuranIndexModal';
import { QuranPageJumpModal } from '../../components/quran/QuranPageJumpModal';
import { QuranSettingsModal } from '../../components/quran/QuranSettingsModal';
import { QuranAudioPlayer } from '../../components/quran/QuranAudioPlayer';

// خيارات نوع الورد اليومي
type WardType = 'half_hizb' | 'full_hizb' | 'juz' | 'pages' | 'surah';

const WARD_OPTIONS = [
  { id: 'half_hizb', label: 'نصف حزب', sub: 'نحو ٥ صفحات' },
  { id: 'full_hizb', label: 'حزب كامل', sub: 'نحو ١٠ صفحات' },
  { id: 'juz', label: 'جزء كامل', sub: '٢٠ صفحة (جزء)' },
  { id: 'pages', label: 'صفحات محددة', sub: 'اختر عدد الصفحات' },
];

export default function QuranMushafPage() {
  // الصفحة الحالية في المصحف (1 إلى 604)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);

  // بيانات الصفحات وذاكرة التخزين المؤقت للتحميل الفوري
  const [pagesData, setPagesData] = useState<Record<number, PageData>>({});
  const [loadingPages, setLoadingPages] = useState<Record<number, boolean>>({});
  const cacheRef = useRef<Record<number, PageData>>({});

  // خيارات العرض والمظهر (المصحف العادي كوضع افتراضي ومريح)
  const [theme, setTheme] = useState<ReadingTheme>('parchment');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  // النوافذ المنبثقة
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);
  const [isJumpOpen, setIsJumpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [isAyahModalOpen, setIsAyahModalOpen] = useState<boolean>(false);

  // الصوت والتلاوة (الشيخ مشاري راشد العفاسي)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAyahNumber, setActiveAyahNumber] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [isAyahAudioMode, setIsAyahAudioMode] = useState<boolean>(false);
  const [showFloatingAudio, setShowFloatingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ورد اليوم والتزامه
  const [showWardBar, setShowWardBar] = useState<boolean>(false);
  const [wardType, setWardType] = useState<WardType>('half_hizb');
  const [wardPageCount, setWardPageCount] = useState<number>(4);
  const [isWardDone, setIsWardDone] = useState<boolean>(false);
  const [showWardToast, setShowWardToast] = useState<boolean>(false);

  // اكتشاف حجم الشاشة (جوال أم شاشة مكتبية)
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // قراءة الإعدادات والصفحة المحفوظة من التخزين المحلي ومعالجة معلمات الرابط
  useEffect(() => {
    try {
      // فحص معلمات الرابط (مثلاً: /quran?page=293 لسورة الكهف أو ?surah=18)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');
        const surahParam = params.get('surah');
        if (pageParam) {
          const p = parseInt(pageParam, 10);
          if (!isNaN(p) && p >= 1 && p <= TOTAL_PAGES) {
            setCurrentPage(p);
            return;
          }
        } else if (surahParam) {
          const sNum = parseInt(surahParam, 10);
          const s = QURAN_SURAHS.find((x) => x.num === sNum);
          if (s) {
            setCurrentPage(s.startPage);
            return;
          }
        }
      }

      const savedPage = localStorage.getItem('mueen_quran_last_page');
      if (savedPage) {
        const p = parseInt(savedPage, 10);
        if (!isNaN(p) && p >= 1 && p <= TOTAL_PAGES) setCurrentPage(p);
      }

      const savedBookmark = localStorage.getItem('mueen_quran_bookmark_page');
      if (savedBookmark) {
        const bp = parseInt(savedBookmark, 10);
        if (!isNaN(bp)) setBookmarkedPage(bp);
      }

      const savedTheme = localStorage.getItem('mueen_quran_theme') as ReadingTheme | null;
      if (savedTheme) setTheme(savedTheme);

      const savedFontSize = localStorage.getItem('mueen_quran_font_size') as 'sm' | 'md' | 'lg' | null;
      if (savedFontSize) setFontSize(savedFontSize);

      const saved3D = localStorage.getItem('mueen_quran_3d_mode');
      if (saved3D !== null) setIs3DMode(saved3D === 'true');

      const today = new Date().toISOString().split('T')[0];
      setIsWardDone(localStorage.getItem(`mueen_ward_${today}`) === 'true');
    } catch {
      // ignore
    }
  }, []);

  // حفظ الصفحة الأخيرة تلقائياً
  useEffect(() => {
    try {
      localStorage.setItem('mueen_quran_last_page', String(currentPage));
    } catch {
      // ignore
    }
  }, [currentPage]);

  // جلب بيانات صفحة محددة مع ذاكرة التخزين المؤقت والتنبؤ بالصفحات المجاورة
  const fetchPage = useCallback(async (pageNum: number) => {
    if (pageNum < 1 || pageNum > TOTAL_PAGES) return;
    if (cacheRef.current[pageNum]) {
      setPagesData((prev) => ({ ...prev, [pageNum]: cacheRef.current[pageNum] }));
      return;
    }

    setLoadingPages((prev) => ({ ...prev, [pageNum]: true }));

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`);
      if (!res.ok) throw new Error('فشل جلب الصفحة');
      const data = await res.json();

      if (data && data.data && data.data.ayahs) {
        const pageAyahs: Ayah[] = data.data.ayahs.map((a: any) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text.trim(),
          surahNumber: a.surah ? a.surah.number : 1,
          surahName: a.surah ? a.surah.name : '',
          juz: a.juz,
          page: a.page,
          hizbQuarter: a.hizbQuarter,
          sajda: Boolean(a.sajda),
        }));

        const pageObj: PageData = {
          pageNumber: pageNum,
          ayahs: pageAyahs,
          surahsOnPage: [],
          juzNumber: pageAyahs[0]?.juz || 1,
          hizbQuarter: pageAyahs[0]?.hizbQuarter,
        };

        cacheRef.current[pageNum] = pageObj;
        setPagesData((prev) => ({ ...prev, [pageNum]: pageObj }));
      }
    } catch {
      // ignore
    } finally {
      setLoadingPages((prev) => ({ ...prev, [pageNum]: false }));
    }
  }, []);

  // جلب الصفحات الحالية والتحميل المسبق للصفحات التالية والسابقة
  useEffect(() => {
    fetchPage(currentPage);
    if (isDesktop && is3DMode) {
      const pair = currentPage % 2 === 1 ? currentPage + 1 : currentPage - 1;
      if (pair >= 1 && pair <= TOTAL_PAGES) fetchPage(pair);
    }

    const nextP = currentPage + 1;
    const nextP2 = currentPage + 2;
    const prevP = currentPage - 1;
    if (nextP <= TOTAL_PAGES) fetchPage(nextP);
    if (nextP2 <= TOTAL_PAGES) fetchPage(nextP2);
    if (prevP >= 1) fetchPage(prevP);
  }, [currentPage, isDesktop, is3DMode, fetchPage]);

  // حساب أرقام الصفحات المعروضة في شاشة سطح المكتب في وضع 3D
  const { desktopRightPage, desktopLeftPage } = useMemo(() => {
    if (currentPage === 1) {
      return { desktopRightPage: 1, desktopLeftPage: 2 };
    }
    if (currentPage % 2 === 0) {
      return { desktopRightPage: currentPage, desktopLeftPage: Math.min(TOTAL_PAGES, currentPage + 1) };
    } else {
      return { desktopRightPage: Math.max(1, currentPage - 1), desktopLeftPage: currentPage };
    }
  }, [currentPage]);

  // تقليب الصفحات
  const handleNextPage = () => {
    if (currentPage >= TOTAL_PAGES) return;
    if (isDesktop && is3DMode) {
      const nextTarget = desktopLeftPage ? desktopLeftPage + 1 : currentPage + 2;
      setCurrentPage(Math.min(TOTAL_PAGES, nextTarget));
    } else {
      setCurrentPage((prev) => Math.min(TOTAL_PAGES, prev + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    if (isDesktop && is3DMode) {
      const prevTarget = Math.max(1, desktopRightPage - 2);
      setCurrentPage(prevTarget);
    } else {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  // التحكم بمفاتيح الأسهم من لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isIndexOpen || isJumpOpen || isSettingsOpen || isAyahModalOpen) return;
      if (e.key === 'ArrowLeft') {
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIndexOpen, isJumpOpen, isSettingsOpen, isAyahModalOpen, desktopRightPage, desktopLeftPage, is3DMode, currentPage]);

  // إدارة الفاصلة
  const handleToggleBookmark = (pageNum: number) => {
    if (bookmarkedPage === pageNum) {
      setBookmarkedPage(null);
      localStorage.removeItem('mueen_quran_bookmark_page');
    } else {
      setBookmarkedPage(pageNum);
      localStorage.setItem('mueen_quran_bookmark_page', String(pageNum));
    }
  };

  // استماع للآية المحددة بصوت الشيخ مشاري العفاسي
  const playAyahAudio = (ayah: Ayah) => {
    setIsAyahAudioMode(true);
    setActiveAyahNumber(ayah.number);
    setShowFloatingAudio(true);

    if (audioRef.current) {
      audioRef.current.pause();
      const ayahAudioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
      audioRef.current.src = ayahAudioUrl;
      setAudioLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          setAudioLoading(false);
        })
        .catch(() => {
          setIsPlayingAudio(false);
          setAudioLoading(false);
        });
    }
  };

  // تشغيل سورة كاملة
  const playFullSurahAudio = (surahNum: number) => {
    setIsAyahAudioMode(false);
    setActiveAyahNumber(null);
    setShowFloatingAudio(true);

    if (audioRef.current) {
      audioRef.current.pause();
      const padded = String(surahNum).padStart(3, '0');
      audioRef.current.src = `https://server8.mp3quran.net/afs/${padded}.mp3`;
      setAudioLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          setAudioLoading(false);
        })
        .catch(() => {
          setIsPlayingAudio(false);
          setAudioLoading(false);
        });
    }
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  // تسجيل إتمام ورد اليوم
  const handleMarkWardDone = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `mueen_ward_${today}`;
    const nextState = !isWardDone;
    setIsWardDone(nextState);

    if (nextState) {
      localStorage.setItem(todayKey, 'true');
      setShowWardToast(true);
      setTimeout(() => setShowWardToast(false), 5000);

      try {
        const savedHabits = localStorage.getItem('mueen_habits');
        if (savedHabits) {
          const parsed = JSON.parse(savedHabits);
          const updated = parsed.map((h: any) =>
            h.id === 'h8' || h.category === 'قرآن' ? { ...h, completed: true } : h
          );
          localStorage.setItem('mueen_habits', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      toggleHabitCompletion('h8', today, true, {
        title: 'ورد القرآن اليومي',
        category: 'قرآن',
      }).catch(() => {});
    } else {
      localStorage.removeItem(todayKey);
      try {
        const savedHabits = localStorage.getItem('mueen_habits');
        if (savedHabits) {
          const parsed = JSON.parse(savedHabits);
          const updated = parsed.map((h: any) =>
            h.id === 'h8' || h.category === 'قرآن' ? { ...h, completed: false } : h
          );
          localStorage.setItem('mueen_habits', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      toggleHabitCompletion('h8', today, false).catch(() => {});
    }
  };

  const toggle3DMode = () => {
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);
    try {
      localStorage.setItem('mueen_quran_3d_mode', String(nextMode));
    } catch {
      // ignore
    }
  };

  const currentSurahMeta = getSurahByPage(currentPage);
  const currentJuzMeta = getJuzByPage(currentPage);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col justify-between"
    >
      {/* مشغل الصوت الخفي */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) setAudioProgress(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setAudioDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlayingAudio(false);
          setActiveAyahNumber(null);
        }}
      />

      {/* ======================= شريط الرأس العلوي ======================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#C5A059]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">العودة للرئيسية</span>
            </Link>

            <div className="h-4 w-px bg-gray-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#064E3B] to-emerald-700 text-[#D4AF37] flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <h1 className="font-bold text-sm sm:text-base font-serif text-gray-900 dark:text-white">
                المصحف الشريف
              </h1>
            </div>
          </div>

          {/* محدد وضع المصحف العادي / ثلاثي الأبعاد والتحكم */}
          <div className="flex items-center gap-2">
            {/* زر التبديل المباشر بين المصحف العادي وثلاثي الأبعاد للكمبيوتر */}
            {isDesktop && (
              <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-xl border border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setIs3DMode(false);
                    try { localStorage.setItem('mueen_quran_3d_mode', 'false'); } catch {}
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    !is3DMode
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                  title="المصحف العادي المريح والمباشر"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>المصحف العادي</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIs3DMode(true);
                    try { localStorage.setItem('mueen_quran_3d_mode', 'true'); } catch {}
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    is3DMode
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                  title="المصحف ثلاثي الأبعاد مع أنيميشن تقليب الصفحات"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مصحف 3D ✨</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsIndexOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{currentSurahMeta.name}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsJumpOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              title="انتقال برقم الصفحة"
            >
              صـ {toArabicNumerals(currentPage)}
            </button>

            <button
              type="button"
              onClick={() => setShowWardBar((prev) => !prev)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isWardDone
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-emerald-700'
              }`}
              title="هدف ورد اليوم"
            >
              <Target className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-emerald-700 transition-colors cursor-pointer"
              title="إعدادات القراءة والمظهر"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* شريط هدف ورد اليوم (قابل للطي) */}
        {showWardBar && (
          <div className="bg-emerald-50/90 dark:bg-slate-900 border-t border-emerald-200/60 dark:border-slate-800 p-3 sm:p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  ورد القرآن اليومي:
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                  {wardType === 'half_hizb' ? 'نصف حزب (٥ صفحات)' : wardType === 'full_hizb' ? 'حزب كامل (١٠ صفحات)' : 'جزء كامل (٢٠ صفحة)'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleMarkWardDone}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isWardDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isWardDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>تم إنجاز ورد اليوم بحمد الله ✓</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>تسجيل إتمام ورد اليوم ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* إشعار إتمام الورد */}
        {showWardToast && (
          <div className="max-w-md mx-auto my-2 p-3 rounded-2xl bg-emerald-700 text-white text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-700/30 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>هنيئاً لك! تم توثيق ورد القرآن اليومي ومزامنته مع عاداتك 🌿</span>
            </div>
            <button type="button" onClick={() => setShowWardToast(false)}>
              <X className="w-4 h-4 text-emerald-200" />
            </button>
          </div>
        )}
      </header>

      {/* ======================= مسرح القراءة الرئيسي ======================= */}
      <main className="flex-1 flex flex-col justify-center items-center py-4 px-2 sm:px-4">
        {isDesktop ? (
          is3DMode ? (
            /* ================= عرض الكمبيوتر 3D المجسم ================= */
            <Mushaf3DDesktop
              rightPageNum={desktopRightPage}
              leftPageNum={desktopLeftPage}
              rightPageData={pagesData[desktopRightPage] || null}
              leftPageData={desktopLeftPage ? pagesData[desktopLeftPage] || null : null}
              isLoadingRight={Boolean(loadingPages[desktopRightPage])}
              isLoadingLeft={desktopLeftPage ? Boolean(loadingPages[desktopLeftPage]) : false}
              activeAyahNumber={activeAyahNumber}
              theme={theme}
              fontSize={fontSize}
              onAyahClick={(ayah) => {
                setSelectedAyah(ayah);
                setIsAyahModalOpen(true);
              }}
              onNextSpread={handleNextPage}
              onPrevSpread={handlePrevPage}
              canNext={currentPage < TOTAL_PAGES}
              canPrev={currentPage > 1}
              bookmarkedPage={bookmarkedPage}
              onToggleBookmark={handleToggleBookmark}
            />
          ) : (
            /* ================= عرض الكمبيوتر: المصحف العادي النظيف والمريح ================= */
            <MushafStandard
              pageNumber={currentPage}
              pageData={pagesData[currentPage] || null}
              isLoading={Boolean(loadingPages[currentPage])}
              activeAyahNumber={activeAyahNumber}
              theme={theme}
              fontSize={fontSize}
              onAyahClick={(ayah) => {
                setSelectedAyah(ayah);
                setIsAyahModalOpen(true);
              }}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              canNext={currentPage < TOTAL_PAGES}
              canPrev={currentPage > 1}
              bookmarkedPage={bookmarkedPage}
              onToggleBookmark={handleToggleBookmark}
            />
          )
        ) : (
          /* ================= عرض الجوال المتجاوب ================= */
          <MushafMobile
            pageNumber={currentPage}
            pageData={pagesData[currentPage] || null}
            isLoading={Boolean(loadingPages[currentPage])}
            activeAyahNumber={activeAyahNumber}
            theme={theme}
            fontSize={fontSize}
            onAyahClick={(ayah) => {
              setSelectedAyah(ayah);
              setIsAyahModalOpen(true);
            }}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            canNext={currentPage < TOTAL_PAGES}
            canPrev={currentPage > 1}
            bookmarkedPage={bookmarkedPage}
            onToggleBookmark={handleToggleBookmark}
            onOpenIndex={() => setIsIndexOpen(true)}
            onOpenAudio={() => {
              playFullSurahAudio(currentSurahMeta.num);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPageJump={() => setIsJumpOpen(true)}
          />
        )}
      </main>

      {/* ======================= مشغل التلاوة العائم ======================= */}
      {showFloatingAudio && (
        <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 z-40">
          <QuranAudioPlayer
            isPlaying={isPlayingAudio}
            onTogglePlay={toggleAudioPlay}
            isLoadingAudio={audioLoading}
            currentSurahName={currentSurahMeta.fullName}
            currentAyahNumberInSurah={
              selectedAyah && isAyahAudioMode ? selectedAyah.numberInSurah : null
            }
            audioProgress={audioProgress}
            duration={audioDuration}
            onSeek={(secs) => {
              if (audioRef.current) audioRef.current.currentTime = secs;
            }}
            onClose={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlayingAudio(false);
              setShowFloatingAudio(false);
              setActiveAyahNumber(null);
            }}
            isAyahMode={isAyahAudioMode}
          />
        </div>
      )}

      {/* ======================= النوافذ المنبثقة ======================= */}
      <QuranIndexModal
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onSelectPage={(pageNum) => {
          setCurrentPage(pageNum);
          setIsIndexOpen(false);
        }}
        currentPage={currentPage}
        bookmarkedPage={bookmarkedPage}
      />

      <QuranPageJumpModal
        isOpen={isJumpOpen}
        onClose={() => setIsJumpOpen(false)}
        currentPage={currentPage}
        onJumpToPage={(pageNum) => setCurrentPage(pageNum)}
      />

      <QuranSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onChangeTheme={(th) => {
          setTheme(th);
          try {
            localStorage.setItem('mueen_quran_theme', th);
          } catch {
            // ignore
          }
        }}
        fontSize={fontSize}
        onChangeFontSize={(sz) => {
          setFontSize(sz);
          try {
            localStorage.setItem('mueen_quran_font_size', sz);
          } catch {
            // ignore
          }
        }}
        is3DMode={is3DMode}
        onToggle3DMode={toggle3DMode}
      />

      <AyahActionsModal
        ayah={selectedAyah}
        isOpen={isAyahModalOpen}
        onClose={() => setIsAyahModalOpen(false)}
        onPlayAyah={(ayah) => playAyahAudio(ayah)}
        isPlayingAyah={isPlayingAudio}
        activeAyahNumber={activeAyahNumber}
        onBookmarkAyah={(pageNum) => handleToggleBookmark(pageNum)}
        isBookmarked={bookmarkedPage === selectedAyah?.page}
      />
    </div>
  );
}
