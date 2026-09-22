'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Search,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Check,
  Sparkles,
  Loader2,
  Bookmark,
  Target,
  FileText,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { ALL_SURAHS, SurahMeta } from '../../data/surahs';
import { toggleHabitCompletion } from '../actions/habits';

// السور الأكثر قراءة للوصول السريع
const POPULAR_SURAHS = [1, 2, 18, 36, 55, 56, 67, 78, 112, 113, 114];

// خيارات نوع الورد اليومي
type WardType = 'half_hizb' | 'full_hizb' | 'juz' | 'pages' | 'surah';

const WARD_OPTIONS = [
  { id: 'half_hizb', label: 'نصف حزب', sub: 'نحو ٥ صفحات' },
  { id: 'full_hizb', label: 'حزب كامل', sub: 'نحو ١٠ صفحات' },
  { id: 'juz', label: 'جزء كامل', sub: '٢٠ صفحة (جزء)' },
  { id: 'pages', label: 'صفحات محددة', sub: 'اختر عدد الصفحات' },
  { id: 'surah', label: 'سورة معينة', sub: 'اختر من الفهرس' },
];

// تحويل الأرقام إلى أرقام عربية مشرقية ﴿١﴾
const toArabicNumerals = (num: number): string => {
  return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
};

// بديل أوفلاين فوري لسورة الفاتحة والإخلاص والملك والمعوذات
const OFFLINE_FALLBACKS: Record<number, { text: string; numberInSurah: number }[]> = {
  1: [
    { numberInSurah: 1, text: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ' },
    { numberInSurah: 2, text: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِینَ' },
    { numberInSurah: 3, text: 'ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ' },
    { numberInSurah: 4, text: 'مَـٰلِكِ یَوۡمِ ٱلدِّینِ' },
    { numberInSurah: 5, text: 'إِیَّاكَ نَعۡبُدُ وَإِیَّاكَ نَسۡتَعِینُ' },
    { numberInSurah: 6, text: 'ٱهۡدِنَا ٱلصِّرَ ٰ⁠طَ ٱلۡمُسۡتَقِیمَ' },
    { numberInSurah: 7, text: 'صِرَ ٰ⁠طَ ٱلَّذِینَ أَنۡعَمۡتَ عَلَیۡهِمۡ غَیۡرِ ٱلۡمَغۡضُوبِ عَلَیۡهِمۡ وَلَا ٱلضَّاۤلِّینَ' },
  ],
  112: [
    { numberInSurah: 1, text: 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ' },
    { numberInSurah: 2, text: 'ٱللَّهُ ٱلصَّمَدُ' },
    { numberInSurah: 3, text: 'لَمۡ یَلِدۡ وَلَمۡ یُوۡلَدۡ' },
    { numberInSurah: 4, text: 'وَلَمۡ یَكُن لَّهُۥ كُفُوًا أَحَدُۢ' },
  ],
  113: [
    { numberInSurah: 1, text: 'قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ' },
    { numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ' },
    { numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ' },
    { numberInSurah: 4, text: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِی ٱلۡعُقَدِ' },
    { numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ' },
  ],
  114: [
    { numberInSurah: 1, text: 'قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ' },
    { numberInSurah: 2, text: 'مَلِكِ ٱلنَّاسِ' },
    { numberInSurah: 3, text: 'إِلَـٰهِ ٱلنَّاسِ' },
    { numberInSurah: 4, text: 'مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ' },
    { numberInSurah: 5, text: 'ٱلَّذِی یُوَسۡوِسُ فِی صُدُورِ ٱلنَّاسِ' },
    { numberInSurah: 6, text: 'مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ' },
  ],
};

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
}

export default function QuranWardPage() {
  // إعدادات الورد اليومي
  const [wardType, setWardType] = useState<WardType>('half_hizb');
  const [wardTargetJuz, setWardTargetJuz] = useState<number>(1);
  const [wardTargetHizb, setWardTargetHizb] = useState<number>(1);
  const [wardPageCount, setWardPageCount] = useState<number>(4);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);

  // حالة إنجاز ورد اليوم
  const [isWardDone, setIsWardDone] = useState<boolean>(false);
  const [showWardToast, setShowWardToast] = useState<boolean>(false);

  // الآيات والقارئ
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // الخط والعرض
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [viewMode, setViewMode] = useState<'mushaf' | 'cards'>('mushaf');

  // فهرس السور
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // مشغل الصوت
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const surahsCache = useRef<Record<number, Ayah[]>>({});

  const currentSurahMeta = useMemo(() => {
    return ALL_SURAHS.find((s) => s.num === selectedSurah) ?? ALL_SURAHS[0];
  }, [selectedSurah]);

  // قراءة تفضيلات وحالة الورد لليوم الحالي
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `mueen_ward_${today}`;
    setIsWardDone(localStorage.getItem(todayKey) === 'true');

    const savedType = localStorage.getItem('mueen_ward_type') as WardType | null;
    if (savedType) setWardType(savedType);

    const savedJuz = localStorage.getItem('mueen_ward_juz');
    if (savedJuz) setWardTargetJuz(parseInt(savedJuz, 10));

    const savedPages = localStorage.getItem('mueen_ward_pages');
    if (savedPages) setWardPageCount(parseInt(savedPages, 10));
  }, []);

  // جلب آيات السورة الحالية
  useEffect(() => {
    let isCancelled = false;

    const fetchSurah = async () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(0);
      }

      if (surahsCache.current[selectedSurah]) {
        setAyahs(surahsCache.current[selectedSurah]);
        setIsLoading(false);
        setLoadError(null);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}`);
        if (!response.ok) throw new Error('فشل جلب آيات السورة');
        const data = await response.json();

        if (data && data.data && data.data.ayahs) {
          const loadedAyahs: Ayah[] = data.data.ayahs.map((a: any) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text.trim(),
          }));

          if (!isCancelled) {
            surahsCache.current[selectedSurah] = loadedAyahs;
            setAyahs(loadedAyahs);
            setIsLoading(false);
          }
        } else {
          throw new Error('بيانات غير صحيحة');
        }
      } catch {
        if (!isCancelled) {
          if (OFFLINE_FALLBACKS[selectedSurah]) {
            setAyahs(
              OFFLINE_FALLBACKS[selectedSurah].map((a, idx) => ({
                number: idx + 1,
                numberInSurah: a.numberInSurah,
                text: a.text,
              }))
            );
            setIsLoading(false);
          } else {
            setLoadError('تعذر تحميل نص السورة حالياً، يرجى المحاولة بعد قليل.');
            setIsLoading(false);
          }
        }
      }
    };

    fetchSurah();

    return () => {
      isCancelled = true;
    };
  }, [selectedSurah]);

  // تلاوة السورة بصوت الشيخ مشاري العفاسي
  const audioUrl = useMemo(() => {
    const padded = String(selectedSurah).padStart(3, '0');
    return `https://server8.mp3quran.net/afs/${padded}.mp3`;
  }, [selectedSurah]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioLoading(false);
        })
        .catch(() => {
          setAudioLoading(false);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // تسجيل إتمام ورد اليوم ومزامنته مع العادات ولوحة التحكم
  const handleMarkWardDone = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `mueen_ward_${today}`;
    const nextState = !isWardDone;
    setIsWardDone(nextState);

    if (nextState) {
      localStorage.setItem(todayKey, 'true');
      setShowWardToast(true);
      setTimeout(() => setShowWardToast(false), 5000);

      // تحديث العادات محلياً لظهور الورد منجزاً في الصفحة الرئيسية
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

      // المزامنة السحابية في الخلفية
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

  // تصفية السور
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return ALL_SURAHS;
    const q = searchQuery.trim().toLowerCase();
    return ALL_SURAHS.filter(
      (s) =>
        s.name.includes(q) ||
        s.fullName.includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        String(s.num) === q
    );
  }, [searchQuery]);

  // إزالة البسملة المكررة
  const cleanAyahText = (ayah: Ayah): string => {
    if (selectedSurah !== 1 && ayah.numberInSurah === 1) {
      const bismillah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
      const bismillahAlt = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ';
      if (ayah.text.startsWith(bismillah)) {
        return ayah.text.replace(bismillah, '').trim();
      }
      if (ayah.text.startsWith(bismillahAlt)) {
        return ayah.text.replace(bismillahAlt, '').trim();
      }
    }
    return ayah.text;
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-xl sm:text-2xl leading-[2.6rem]';
      case 'huge':
        return 'text-3xl sm:text-4xl leading-[3.8rem]';
      case 'large':
      default:
        return 'text-2xl sm:text-3xl leading-[3.2rem]';
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-24 sm:pb-12"
    >
      {/* شريط الرأس */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-base sm:text-lg">ورد القرآن الكريم</h1>
          </div>

          <button
            type="button"
            onClick={() => setIsIndexOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>فهرس السور</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ======================= بطاقة تحديد نوع ورد اليوم ======================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-emerald-100/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-sm sm:text-base">تحديد هدف ورد اليوم</h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/70">
              «خير الأعمال أدومها»
            </span>
          </div>

          {/* تبويبات خيارات نوع الورد */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {WARD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setWardType(opt.id as WardType);
                  try {
                    localStorage.setItem('mueen_ward_type', opt.id);
                  } catch {
                    // ignore
                  }
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  wardType === opt.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                    : 'bg-gray-50/70 dark:bg-slate-800/60 border-gray-200/80 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-emerald-300'
                }`}
              >
                <span className="font-bold text-xs">{opt.label}</span>
                <span className={`text-[10px] ${wardType === opt.id ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>

          {/* محددات إضافية بناء على النوع المختار */}
          {wardType === 'juz' && (
            <div className="flex items-center gap-3 pt-1 text-xs">
              <label className="font-semibold text-gray-600 dark:text-gray-300 shrink-0">
                اختر الجزء المحدد:
              </label>
              <select
                value={wardTargetJuz}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setWardTargetJuz(val);
                  try {
                    localStorage.setItem('mueen_ward_juz', String(val));
                  } catch {
                    // ignore
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-800 dark:text-emerald-300 outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                  <option key={juzNum} value={juzNum}>
                    الجزء {toArabicNumerals(juzNum)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {wardType === 'pages' && (
            <div className="flex items-center gap-3 pt-1 text-xs">
              <label className="font-semibold text-gray-600 dark:text-gray-300 shrink-0">
                عدد الصفحات المستهدفة اليوم:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setWardPageCount(num);
                      try {
                        localStorage.setItem('mueen_ward_pages', String(num));
                      } catch {
                        // ignore
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      wardPageCount === num
                        ? 'bg-emerald-700 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {toArabicNumerals(num)} {num === 1 ? 'صفحة' : num === 2 ? 'صفحتان' : 'صفحات'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* زر تسجيل إتمام ورد اليوم المباشر */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleMarkWardDone}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                isWardDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/25 active:scale-[0.98]'
              }`}
            >
              {isWardDone ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>تم إنجاز ورد اليوم بحمد الله 🌿 (اضغط للإلغاء)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>تسجيل إتمام ورد اليوم في عاداتي ✨</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* إشعار تأكيد إتمام الورد */}
        {showWardToast && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg shadow-emerald-600/30 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-200" />
              <span>هنيئاً لك! تم تسجيل ورد القرآن في سجل إنجازاتك اليومية ونسبتك مع رفيقك 🌿</span>
            </div>
            <button type="button" onClick={() => setShowWardToast(false)}>
              <X className="w-4 h-4 text-emerald-200" />
            </button>
          </div>
        )}

        {/* ======================= شريط السور السريعة ======================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold">السور الكريمة للقراءة السريعة:</span>
            <button
              type="button"
              onClick={() => setIsIndexOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              عرض كل السور (١١٤)
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {POPULAR_SURAHS.map((surahNum) => {
              const surah = ALL_SURAHS.find((s) => s.num === surahNum);
              if (!surah) return null;
              const isSelected = selectedSurah === surahNum;
              return (
                <button
                  key={surahNum}
                  type="button"
                  onClick={() => setSelectedSurah(surahNum)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <span>{surah.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================= مشغل التلاوة الصوتية ======================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-emerald-100/80 dark:border-slate-800 shadow-xs space-y-3">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={() => {
              if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (audioRef.current) setDuration(audioRef.current.duration);
            }}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={togglePlayAudio}
                disabled={audioLoading}
                aria-label={isPlaying ? 'إيقاف التلاوة' : 'تشغيل التلاوة'}
                className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 transition-all cursor-pointer shrink-0"
              >
                {audioLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white mr-0.5" />
                )}
              </button>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  تلاوة {currentSurahMeta.fullName}
                </h3>
                <p className="text-[11px] text-gray-400">بصوت الشيخ مشاري راشد العفاسي</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* شريط التمرير */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* ======================= أدوات راحة القراءة والخط ======================= */}
        <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 rounded-2xl p-3 border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold">حجم الخط:</span>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-xl">
              {(['normal', 'large', 'huge'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    fontSize === sz
                      ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-gray-500'
                  }`}
                >
                  {sz === 'normal' ? 'عادي' : sz === 'large' ? 'كبير' : 'جلي'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={selectedSurah <= 1}
              onClick={() => setSelectedSurah((prev) => Math.max(1, prev - 1))}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-800 disabled:opacity-30 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="السورة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs px-2">{currentSurahMeta.name}</span>
            <button
              type="button"
              disabled={selectedSurah >= 114}
              onClick={() => setSelectedSurah((prev) => Math.min(114, prev + 1))}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-800 disabled:opacity-30 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="السورة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================= نصوص الآيات الكريمة ======================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          {/* عنوان السورة في إطار إسلامي مزخرف */}
          <div className="text-center mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-300 font-serif mb-2">
              {currentSurahMeta.fullName}
            </h2>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
              <span>{currentSurahMeta.type}</span>
              <span>•</span>
              <span>{toArabicNumerals(currentSurahMeta.verses)} آيات</span>
            </div>

            {/* البسملة الشريفة */}
            {selectedSurah !== 1 && selectedSurah !== 9 && (
              <div className="mt-6 text-xl sm:text-2xl text-emerald-800 dark:text-emerald-400 font-serif">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs text-gray-400">جارٍ تحميل آيات السورة الكريمة...</p>
            </div>
          ) : loadError ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-xs text-rose-500">{loadError}</p>
              <button
                type="button"
                onClick={() => setSelectedSurah(selectedSurah)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <div className={`font-serif text-justify text-gray-900 dark:text-slate-100 ${getFontSizeClass()}`}>
              {ayahs.map((ayah) => {
                const text = cleanAyahText(ayah);
                return (
                  <span key={ayah.number} className="inline">
                    <span>{text} </span>
                    <span className="inline-block text-emerald-700 dark:text-emerald-400 font-sans text-sm sm:text-base font-bold px-1 select-none">
                      ﴿{toArabicNumerals(ayah.numberInSurah)}﴾
                    </span>{' '}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ======================= نافذة فهرس السور والبحث ======================= */}
      {isIndexOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            dir="rtl"
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-slate-800 max-h-[85vh] flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-base">فهرس سور القرآن الكريم (١١٤)</h3>
              <button
                type="button"
                onClick={() => setIsIndexOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* حقل البحث */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              <input
                type="text"
                placeholder="ابحث برقم السورة أو اسمها (مثال: الكهف، 18)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* قائمة السور */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.num}
                  type="button"
                  onClick={() => {
                    setSelectedSurah(surah.num);
                    setIsIndexOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between text-xs transition-all cursor-pointer ${
                    selectedSurah === surah.num
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px] text-gray-500">
                      {surah.num}
                    </span>
                    <div>
                      <div className="font-bold text-sm">{surah.name}</div>
                      <div className="text-[10px] text-gray-400">{surah.englishName}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    <span>{surah.type}</span> • <span>{surah.verses} آية</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
