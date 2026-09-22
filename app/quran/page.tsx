'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  ExternalLink,
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
  ListFilter,
  Type,
  AlignJustify,
  Layers,
  Sparkles,
  Loader2,
  Headphones,
} from 'lucide-react';
import { ALL_SURAHS, SurahMeta } from '../../data/surahs';

// السور الأكثر قراءة للوصول السريع
const POPULAR_SURAHS = [1, 2, 18, 36, 55, 56, 67, 78, 112, 113, 114];

// تحويل الأرقام إلى أرقام عربية مشرقية ﴿١﴾
const toArabicNumerals = (num: number): string => {
  return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
};

// بديل أوفلاين لسورة الفاتحة والإخلاص
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
};

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
}

export default function QuranPage() {
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // إعدادات العرض وتخصيص الخط
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [viewMode, setViewMode] = useState<'mushaf' | 'cards'>('mushaf');

  // فهرس السور والبحث
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // مشغل الصوت
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // تسجيل ورد اليوم
  const [isWardDone, setIsWardDone] = useState<boolean>(false);
  const [showWardToast, setShowWardToast] = useState<boolean>(false);

  // ذاكرة تخزين مؤقت للسور المحملة لتقليل الطلبات
  const surahsCache = useRef<Record<number, Ayah[]>>({});

  const currentSurahMeta = useMemo(() => {
    return ALL_SURAHS.find((s) => s.num === selectedSurah) ?? ALL_SURAHS[0];
  }, [selectedSurah]);

  // التحقق من حالة ورد اليوم
  useEffect(() => {
    const todayKey = `mueen_ward_${new Date().toISOString().split('T')[0]}_${selectedSurah}`;
    setIsWardDone(localStorage.getItem(todayKey) === 'true');
  }, [selectedSurah]);

  // جلب آيات السورة
  useEffect(() => {
    let isCancelled = false;

    const fetchSurah = async () => {
      // إيقاف الصوت مؤقتاً عند تبديل السورة
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(0);
      }

      // إذا كانت مخزنة مؤقتاً
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
      } catch (err) {
        if (!isCancelled) {
          // استخدام البديل إن وجد
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
            setLoadError('تعذر تحميل السورة حالياً. يرجى التحقق من الاتصال بالإنترنت.');
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

  // رابط التلاوة الصوتية
  const audioUrl = useMemo(() => {
    const padded = String(selectedSurah).padStart(3, '0');
    return `https://server8.mp3quran.net/afs/${padded}.mp3`;
  }, [selectedSurah]);

  // إدارة تشغيل الصوت
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

  // تسجيل إتمام الورد
  const handleMarkWardDone = () => {
    const todayKey = `mueen_ward_${new Date().toISOString().split('T')[0]}_${selectedSurah}`;
    const nextState = !isWardDone;
    setIsWardDone(nextState);
    if (nextState) {
      localStorage.setItem(todayKey, 'true');
      setShowWardToast(true);
      setTimeout(() => setShowWardToast(false), 4000);
    } else {
      localStorage.removeItem(todayKey);
    }
  };

  // تصفية السور للبحث
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

  // تنسيق نصوص الآيات وحذف البسملة المكررة في أول آية إذا لم تكن الفاتحة
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

  // حجم الخط
  const fontClass =
    fontSize === 'normal'
      ? 'text-lg sm:text-xl leading-relaxed sm:leading-loose'
      : fontSize === 'large'
      ? 'text-xl sm:text-2xl leading-loose sm:leading-[2.4]'
      : 'text-2xl sm:text-3xl leading-loose sm:leading-[2.7]';

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-x-hidden">
      {/* عنصر الصوت الخفي */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setAudioLoading(false);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setAudioLoading(false);
          setIsPlaying(false);
        }}
      />

      {/* الشريط العلوي المصمم كتطبيق موبايل */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 p-1.5 -mr-1.5 rounded-xl transition-colors active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden xs:inline">الرئيسية</span>
          </Link>

          {/* زر فتح فهرس السور الكامل */}
          <button
            type="button"
            onClick={() => setIsIndexOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200/70 dark:border-emerald-800 text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>سورة {currentSurahMeta.name}</span>
            <span className="text-[11px] opacity-70 font-normal">({toArabicNumerals(currentSurahMeta.verses)} آية)</span>
            <Search className="w-3 h-3 text-emerald-600 mr-1" />
          </button>

          {/* أدوات التحكم في حجم الخط وطريقة العرض */}
          <div className="flex items-center gap-1">
            {/* تبديل طريقة العرض (مصحف / بطاقات) */}
            <button
              type="button"
              onClick={() => setViewMode((m) => (m === 'mushaf' ? 'cards' : 'mushaf'))}
              title={viewMode === 'mushaf' ? 'التبديل إلى بطاقات الآيات' : 'التبديل إلى المصحف المتصل'}
              className="p-1.5 sm:p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {viewMode === 'mushaf' ? (
                <Layers className="w-4 h-4" />
              ) : (
                <AlignJustify className="w-4 h-4" />
              )}
            </button>

            {/* تكبير/تصغير الخط */}
            <button
              type="button"
              onClick={() => {
                if (fontSize === 'normal') setFontSize('large');
                else if (fontSize === 'large') setFontSize('huge');
                else setFontSize('normal');
              }}
              title="تغيير حجم الخط"
              className="px-2 py-1 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200/70 dark:border-slate-700 transition-colors"
            >
              <span className="text-xs">A</span>
              <span className="text-[10px] font-normal mr-0.5">
                {fontSize === 'normal' ? '١' : fontSize === 'large' ? '٢' : '٣'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-3xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* شريط السور السريع (أفقي قابل للتمرير بسلاسة باللمس) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-3 px-3">
          <button
            type="button"
            onClick={() => setIsIndexOpen(true)}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 transition-all cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>كل السور (١١٤)</span>
          </button>
          {POPULAR_SURAHS.map((num) => {
            const s = ALL_SURAHS.find((item) => item.num === num);
            if (!s) return null;
            const isSelected = selectedSurah === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedSurah(num)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm scale-102'
                    : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-800'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* بطاقة مشغل التلاوة الصوتي المدمج للشيخ مشاري العفاسي */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-2xl text-white p-3.5 sm:p-4 shadow-md transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayAudio}
                disabled={audioLoading}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white text-emerald-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-75"
              >
                {audioLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-emerald-800" />
                ) : (
                  <Play className="w-5 h-5 fill-emerald-800 mr-0.5" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base">تلاوة سورة {currentSurahMeta.name}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-700/80 text-emerald-100 font-medium">
                    {currentSurahMeta.type}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 flex items-center gap-1 mt-0.5">
                  <Headphones className="w-3 h-3" />
                  <span>بصوت الشيخ مشاري راشد العفاسي</span>
                </p>
              </div>
            </div>

            {/* وقت التلاوة */}
            <div className="text-left text-xs text-emerald-100/90 tabular-nums shrink-0 font-mono">
              <span>{formatTime(currentTime)}</span>
              {duration > 0 && <span className="opacity-60"> / {formatTime(duration)}</span>}
            </div>
          </div>

          {/* شريط التقدم الصوتي */}
          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-emerald-950/60 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* إشعار إتمام الورد اليومي */}
        {showWardToast && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>تقبل الله طاعتكم! تم تسجيل قراءة سورة {currentSurahMeta.name} في سجلك اليومي.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowWardToast(false)}
              className="p-1 hover:bg-emerald-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* جسم المصحف الشريف لقراءة الآيات */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          {/* ترويسة السورة الإطار الإسلامي */}
          <div className="border-b border-gray-100 dark:border-slate-800/80 bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-slate-800/40 dark:via-slate-900 dark:to-slate-900 p-4 sm:p-6 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              سُورَةُ {currentSurahMeta.name} • {currentSurahMeta.type} • {toArabicNumerals(currentSurahMeta.verses)} آيات
            </div>

            {/* البسملة المزخرفة (تظهر لجميع السور ما عدا سورة التوبة) */}
            {selectedSurah !== 9 && (
              <div className="py-2">
                <p className="font-quran text-2xl sm:text-3xl text-emerald-900 dark:text-emerald-300 tracking-wide select-none">
                  بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
                </p>
              </div>
            )}
          </div>

          {/* محتوى السورة */}
          <div className="p-4 sm:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-emerald-700 dark:text-emerald-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs text-gray-500 dark:text-gray-400">جارٍ تحميل الآيات المباركة...</p>
              </div>
            ) : loadError ? (
              <div className="text-center py-12 px-4 space-y-3">
                <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
                <button
                  type="button"
                  onClick={() => setSelectedSurah((s) => s)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : viewMode === 'mushaf' ? (
              /* العرض المتصل كصفحات المصحف الشريف */
              <div className="text-justify [text-align-last:center] sm:[text-align-last:right] leading-loose">
                <p className={`font-quran ${fontClass} text-gray-800 dark:text-slate-100`}>
                  {ayahs.map((ayah) => (
                    <span key={ayah.numberInSurah} className="inline">
                      <span>{cleanAyahText(ayah)}</span>
                      <span className="inline-flex items-center justify-center mx-1 text-emerald-700 dark:text-emerald-400 font-bold select-none text-base sm:text-xl">
                        ۝{toArabicNumerals(ayah.numberInSurah)}
                      </span>{' '}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              /* عرض الآيات في بطاقات منفصلة لدراسة كل آية */
              <div className="space-y-3">
                {ayahs.map((ayah) => (
                  <div
                    key={ayah.numberInSurah}
                    className="p-3.5 sm:p-4 rounded-xl border border-gray-100 dark:border-slate-800/80 hover:border-emerald-200 dark:hover:border-emerald-800 bg-gray-50/50 dark:bg-slate-800/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                        {toArabicNumerals(ayah.numberInSurah)}
                      </span>
                    </div>
                    <p className={`font-quran ${fontClass} text-gray-800 dark:text-slate-100 text-right`}>
                      {cleanAyahText(ayah)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* تذييل السورة: زر إتمام الورد والتنقل بين السور */}
          <div className="border-t border-gray-100 dark:border-slate-800 p-4 sm:p-6 bg-gray-50/70 dark:bg-slate-900/60 flex flex-col gap-4">
            {/* زر تسجيل إتمام ورد هذه السورة اليوم */}
            <button
              type="button"
              onClick={handleMarkWardDone}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                isWardDone
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isWardDone ? 'text-emerald-600 fill-emerald-100' : ''}`} />
              <span>
                {isWardDone ? 'تم إتمام قراءة هذا الورد بحمد الله 🌿' : 'تسجيل قراءة هذه السورة في ورد اليوم ✨'}
              </span>
            </button>

            {/* أزرار السورة السابقة والتالية */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={selectedSurah <= 1}
                onClick={() => setSelectedSurah((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none p-2 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة</span>
              </button>

              <button
                type="button"
                onClick={() => setIsIndexOpen(true)}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                فهرس السور
              </button>

              <button
                type="button"
                disabled={selectedSurah >= 114}
                onClick={() => setSelectedSurah((prev) => Math.min(114, prev + 1))}
                className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none p-2 rounded-xl transition-colors cursor-pointer"
              >
                <span>السورة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* روابط سريعة للتفاسير والمواقع المعتمدة (في أسفل الصفحة بأزرار نظيفة) */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <a
            href={`https://tafsir.app/${selectedSurah}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-2xs"
          >
            <span>تفسير السورة في tafsir.app</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <a
            href={`https://quran.com/ar/${selectedSurah}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-2xs"
          >
            <span>عرض السورة في Quran.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>
      </main>

      {/* نافذة فهرس السور والبحث الكامل (114 سورة) */}
      {isIndexOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300 overflow-hidden">
            {/* رأس الفهرس */}
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">فهرس سور القرآن الكريم</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsIndexOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* حقل البحث */}
            <div className="p-3 border-b border-gray-100 dark:border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم السورة (مثلاً: الكهف، البقرة) أو رقمها..."
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 border-none text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* قائمة السور الـ 114 */}
            <div className="p-2 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60 flex-1">
              {filteredSurahs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  لم يتم العثور على سورة تطابق بحثك
                </div>
              ) : (
                filteredSurahs.map((surah) => {
                  const isCurrent = selectedSurah === surah.num;
                  return (
                    <button
                      key={surah.num}
                      type="button"
                      onClick={() => {
                        setSelectedSurah(surah.num);
                        setIsIndexOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-right transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {toArabicNumerals(surah.num)}
                        </span>
                        <div>
                          <p className="text-sm font-bold">{surah.fullName}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {surah.englishName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {toArabicNumerals(surah.verses)} آيات
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            surah.type === 'مكية'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60'
                              : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60'
                          }`}
                        >
                          {surah.type}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
