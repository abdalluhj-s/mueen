'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/Header';
import { HadithDailyCard } from '../../components/HadithDailyCard';
import { ADHKAR_CATEGORIES, ADHKAR_DATA, DhikrItem } from '../../data/adhkar';
import { 
  Sun, Moon, Compass, Bed, Sunrise, Sparkles, 
  RotateCcw, Check, CheckCircle2, ChevronRight, Volume2, Share2 
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSavedLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../../lib/translations';

function AdhkarContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'morning';

  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  // مخزن لعدد التكرارات المتبقية لكل ذكر { [id]: remainingCount }
  const [counts, setCounts] = useState<Record<string, number>>({});
  // مخزن الأذكار المكتملة { [id]: boolean }
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleLang = (e: any) => setLang(e?.detail?.lang || getSavedLanguage());
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
  }, []);

  // استرجاع التقدم أو التهيئة عند تغيير القسم
  useEffect(() => {
    const categoryItems = ADHKAR_DATA.filter((item) => item.category === activeCategory);
    
    // محاولة استرجاع التقدم من LocalStorage
    try {
      const saved = localStorage.getItem(`mueen_adhkar_${activeCategory}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCounts(parsed.counts || {});
        setCompleted(parsed.completed || {});
        return;
      }
    } catch {}

    // تهيئة جديدة
    const initialCounts: Record<string, number> = {};
    const initialCompleted: Record<string, boolean> = {};
    categoryItems.forEach((item) => {
      initialCounts[item.id] = item.count;
      initialCompleted[item.id] = false;
    });
    setCounts(initialCounts);
    setCompleted(initialCompleted);
  }, [activeCategory]);

  // حفظ التقدم في LocalStorage
  const saveProgress = (newCounts: Record<string, number>, newCompleted: Record<string, boolean>) => {
    try {
      localStorage.setItem(
        `mueen_adhkar_${activeCategory}`,
        JSON.stringify({ counts: newCounts, completed: newCompleted })
      );
    } catch {}
  };

  // معالجة الضغط والتسبيح
  const handleCountDown = (item: DhikrItem) => {
    const currentRemaining = counts[item.id] ?? item.count;
    if (currentRemaining <= 0) return;

    // اهتزاز الموبايل (Haptic Feedback)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {}
    }

    const nextRemaining = currentRemaining - 1;
    const isDone = nextRemaining === 0;

    const newCounts = { ...counts, [item.id]: nextRemaining };
    const newCompleted = { ...completed, [item.id]: isDone };

    setCounts(newCounts);
    setCompleted(newCompleted);
    saveProgress(newCounts, newCompleted);
  };

  // إعادة تعيين أذكار القسم الحالي
  const handleResetCategory = () => {
    const categoryItems = ADHKAR_DATA.filter((item) => item.category === activeCategory);
    const resetCounts: Record<string, number> = {};
    const resetCompleted: Record<string, boolean> = {};

    categoryItems.forEach((item) => {
      resetCounts[item.id] = item.count;
      resetCompleted[item.id] = false;
    });

    setCounts(resetCounts);
    setCompleted(resetCompleted);
    saveProgress(resetCounts, resetCompleted);
  };

  // قائمة أذكار القسم النشط
  const currentItems = useMemo(
    () => ADHKAR_DATA.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  // حساب نسبة الإنجاز
  const completedCount = currentItems.filter((item) => completed[item.id]).length;
  const totalCount = currentItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCategoryAllDone = totalCount > 0 && completedCount === totalCount;

  // خريطة أيقونات الأقسام
  const getCategoryIcon = (iconName: string, isSelected: boolean) => {
    const className = `w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`;
    switch (iconName) {
      case 'Sun': return <Sun className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Bed': return <Bed className={className} />;
      case 'Sunrise': return <Sunrise className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const currentCategoryInfo = ADHKAR_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-16">
      <Header userStreak={9} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* رأس الصفحة والتنقل */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t('home', lang)}
              </Link>
              <ChevronRight className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
              <span>{t('adhkar', lang)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'أذكار المسلم والورد اليومي' : 'Daily Adhkar & Remembrance'}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {lang === 'ar' ? 'عداد تفاعلي' : 'Interactive'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentCategoryInfo?.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetCategory}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة تعيين الورد' : 'Reset Category'}</span>
          </button>
        </div>

        {/* بطاقة حديث اليوم النبوي الشريف داخل صفحة الأذكار */}
        <HadithDailyCard />

        {/* شريط الأقسام (Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ADHKAR_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                {getCategoryIcon(cat.icon, isSelected)}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* شريط الإنجاز للقسم النشط */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span>نسبة إتمام {currentCategoryInfo?.title}</span>
              {isCategoryAllDone && (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  مكتمل! تقبل الله
                </span>
              )}
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              {completedCount} من {totalCount} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* بطاقات الأذكار */}
        <div className="space-y-4">
          {currentItems.map((item, index) => {
            const remaining = counts[item.id] ?? item.count;
            const isDone = completed[item.id] || remaining === 0;

            return (
              <div
                key={item.id}
                onClick={() => handleCountDown(item)}
                className={`rounded-3xl p-5 sm:p-6 border transition-all duration-200 select-none cursor-pointer relative overflow-hidden group ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 shadow-sm hover:shadow-md'
                }`}
              >
                {/* رأس بطاقة الذكر: الرقم والفضل */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                    {index + 1} / {totalCount}
                  </span>

                  {item.source && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-slate-700">
                      {item.source}
                    </span>
                  )}
                </div>

                {/* نص الذكر الشريف مع التشكيل */}
                <p className="text-base sm:text-lg leading-relaxed text-gray-900 dark:text-slate-100 font-serif font-medium mb-4">
                  {item.text}
                </p>

                {/* فضل الذكر */}
                {item.fadl && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-2.5 text-xs text-emerald-900 dark:text-emerald-200 mb-4 leading-relaxed">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 ml-1">فضل الذكر:</span>
                    {item.fadl}
                  </div>
                )}

                {/* زر العداد التفاعلي أسفل البطاقة */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-800/60">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {isDone ? 'تم إتمام التكرار' : 'اضغط في أي مكان للتسبيح'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountDown(item);
                    }}
                    className={`min-w-[80px] px-4 py-2 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-700 hover:text-white'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم</span>
                      </>
                    ) : (
                      <>
                        <span>{remaining}</span>
                        <span className="text-xs opacity-60">/ {item.count}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

export default function AdhkarPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <AdhkarContent />
    </React.Suspense>
  );
}
