'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  Flame,
  ArrowRight,
  Clock,
  Trash2,
  Heart,
  GraduationCap,
  Plus,
} from 'lucide-react';
import { HabitItem } from '../types/dashboard';
import { FridayHubCard } from './FridayHubCard';
import { SebhaModal } from './SebhaModal';
import { EidSunanModal } from './EidSunanModal';
import { HadithDailyCard } from './HadithDailyCard';
import { getSavedLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../lib/translations';

interface HabitListProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onDeleteHabit?: (id: string) => void;
  onAddHabitClick?: () => void;
}

type MainHub = 'prayers' | 'awrad' | 'quran' | 'adhkar' | 'friday' | 'fasting';

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleHabit,
  onDeleteHabit,
  onAddHabitClick,
}) => {
  // لغة التطبيق الحالية
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());

  React.useEffect(() => {
    const handleLang = (e: any) => setLang(e?.detail?.lang || getSavedLanguage());
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
  }, []);

  // التابة الرئيسية النشطة (الافتراضي: الصلوات والسنن)
  const [activeHub, setActiveHub] = useState<MainHub>('prayers');

  // النوافذ المنبثقة للسبحة والأعياد
  const [isSebhaOpen, setIsSebhaOpen] = useState(false);
  const [isEidModalOpen, setIsEidModalOpen] = useState(false);
  const [sebhaInitialIndex, setSebhaInitialIndex] = useState(0);

  // حالة فتح/طي كل صلاة في قائمة الصلوات والسنن (الأكورديون)
  const [openPrayers, setOpenPrayers] = useState<Record<string, boolean>>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  const togglePrayerAccordion = (prayerId: string) => {
    setOpenPrayers((prev) => ({
      ...prev,
      [prayerId]: !prev[prayerId],
    }));
  };

  const expandAllPrayers = () => {
    setOpenPrayers({ fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true });
  };

  const collapseAllPrayers = () => {
    setOpenPrayers({ fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false });
  };

  // فحص حالة اليوم لصيام الإثنين والخميس والأيام البيض
  const getFastingInfo = () => {
    try {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 1 = Mon, 4 = Thu
      const isMon = dayOfWeek === 1;
      const isThu = dayOfWeek === 4;
      const isFastDayOfWeek = isMon || isThu;
      const dayName = isMon ? 'الإثنين' : isThu ? 'الخميس' : '';

      const hijriStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
      }).format(now);
      const hijriDay = parseInt(hijriStr, 10) || 13;
      const isWhiteDay = hijriDay >= 13 && hijriDay <= 15;

      return { isFastDayOfWeek, dayName, hijriDay, isWhiteDay };
    } catch {
      return { isFastDayOfWeek: false, dayName: '', hijriDay: 13, isWhiteDay: false };
    }
  };

  const { isFastDayOfWeek, dayName, hijriDay, isWhiteDay } = getFastingInfo();
  const isFriday = new Date().getDay() === 5;

  // إحصائيات الصلوات الخمس وسننها
  const fajrHabits = habits.filter((h) => h.id === 'h1' || h.id === 'h1_sunnah' || h.id === 'h9');
  const dhuhrHabits = habits.filter(
    (h) => h.id === 'h2_sunnah_before' || h.id === 'h2' || h.id === 'h2_sunnah_after' || h.id === 'h2_sunnah'
  );
  const asrHabits = habits.filter((h) => h.id === 'h3' || h.id === 'h10');
  const maghribHabits = habits.filter((h) => h.id === 'h4' || h.id === 'h4_sunnah');
  const ishaHabits = habits.filter((h) => h.id === 'h5' || h.id === 'h5_sunnah' || h.id === 'h7');

  const allPrayerHabits = [
    ...fajrHabits,
    ...dhuhrHabits,
    ...asrHabits,
    ...maghribHabits,
    ...ishaHabits,
  ];
  const uniquePrayerHabits = Array.from(new Set(allPrayerHabits));
  const totalPrayersCount = uniquePrayerHabits.length;
  const completedPrayersCount = uniquePrayerHabits.filter((h) => h.completed).length;

  // الورد القرآني
  const quranHabit = habits.find((h) => h.id === 'h8' || h.category === 'قرآن');
  const isQuranCompleted = !!quranHabit?.completed;

  // الأذكار
  const adhkarList = habits.filter((h) => h.id === 'h9' || h.id === 'h10' || h.id === 'h11' || h.category === 'أذكار');
  const uniqueAdhkar = Array.from(new Set(adhkarList));
  const completedAdhkarCount = uniqueAdhkar.filter((h) => h.completed).length;

  // الصيام
  const fastingList = habits.filter((h) => h.category === 'صيام' || h.timeSlot === 'fasting');
  const completedFastingCount = fastingList.filter((h) => h.completed).length;

  // الأوراد اليومية المخصصة والبر والعلم (صله الرحم، بر الوالدين، زيارة المريض، قراءة كتاب، إلخ)
  const awradHabits = habits.filter(
    (h) =>
      h.category === 'أوراد' ||
      h.category === 'بر' ||
      h.category === 'علم' ||
      h.timeSlot === 'awrad' ||
      h.id.startsWith('custom_') ||
      h.id.startsWith('sug_') ||
      (!h.timeSlot && !['صلاة', 'سنة', 'قرآن', 'أذكار', 'صيام'].includes(h.category))
  );
  const completedAwradCount = awradHabits.filter((h) => h.completed).length;

  // تعريف بيانات الصلوات الخمسة وقوائمها المنسدلة مع مواقيت الأذكار الدقيقة
  const prayerSections = [
    {
      id: 'fajr',
      name: t('fajr', lang),
      icon: '🌅',
      timeHint: t('fajrTimeHint', lang),
      items: fajrHabits,
    },
    {
      id: 'dhuhr',
      name: t('dhuhr', lang),
      icon: '☀️',
      timeHint: t('dhuhrTimeHint', lang),
      items: dhuhrHabits,
    },
    {
      id: 'asr',
      name: t('asr', lang),
      icon: '🌤️',
      timeHint: t('asrTimeHint', lang),
      items: asrHabits,
    },
    {
      id: 'maghrib',
      name: t('maghrib', lang),
      icon: '🌇',
      timeHint: t('maghribTimeHint', lang),
      items: maghribHabits,
    },
    {
      id: 'isha',
      name: t('isha', lang),
      icon: '🌙',
      timeHint: t('ishaTimeHint', lang),
      items: ishaHabits,
    },
  ];

  return (
    <div className="space-y-5">
      {/* ======================================================== */}
      {/* 1. الكروت الرئيسية الذكية (The Smart Navigation Hubs)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* كارت 1: الصلوات والسنن */}
        <button
          type="button"
          onClick={() => setActiveHub('prayers')}
          className={`p-3 sm:p-3.5 rounded-2xl border ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'prayers'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'prayers'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
              {completedPrayersCount}/{totalPrayersCount}
            </span>
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {t('hubPrayers', lang)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {t('hubPrayersSub', lang)}
          </div>
        </button>

        {/* كارت 2: أورادي اليومية والبر */}
        <button
          type="button"
          onClick={() => setActiveHub('awrad')}
          className={`p-3 sm:p-3.5 rounded-2xl border ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'awrad'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'awrad'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
              {completedAwradCount}/{awradHabits.length}
            </span>
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {t('hubAwrad', lang)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {t('hubAwradSub', lang)}
          </div>
        </button>

        {/* كارت 3: ورد القرآن الكريم */}
        <button
          type="button"
          onClick={() => setActiveHub('quran')}
          className={`p-3 sm:p-3.5 rounded-2xl border ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'quran'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'quran'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
              {isQuranCompleted ? '1/1' : '0/1'}
            </span>
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {t('hubQuran', lang)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {isQuranCompleted ? (lang === 'ar' ? 'تم إنجاز الورد ✓' : 'Portion Done ✓') : t('hubQuranSub', lang)}
          </div>
        </button>

        {/* كارت 4: الأذكار والسبحة */}
        <button
          type="button"
          onClick={() => setActiveHub('adhkar')}
          className={`p-3 sm:p-3.5 rounded-2xl border ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'adhkar'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'adhkar'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
              {completedAdhkarCount}/{uniqueAdhkar.length}
            </span>
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {t('hubAdhkar', lang)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {t('hubAdhkarSub', lang)}
          </div>
        </button>

        {/* كارت 5: سنن الجمعة */}
        <button
          type="button"
          onClick={() => setActiveHub('friday')}
          className={`p-3 sm:p-3.5 rounded-2xl border ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'friday'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'friday'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <span className="text-xs">🕌</span>
            </div>
            {isFriday && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-600 text-white animate-pulse">
                {lang === 'ar' ? 'اليوم' : 'Today'}
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {t('hubFriday', lang)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {t('hubFridaySub', lang)}
          </div>
        </button>

        {/* كارت 6: صيام التطوع */}
        <button
          type="button"
          onClick={() => setActiveHub('fasting')}
          className={`p-3 sm:p-3.5 rounded-2xl border ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'fasting'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'fasting'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold px-1 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {isFastDayOfWeek ? dayName : isWhiteDay ? (lang === 'ar' ? 'البيض' : 'White') : (lang === 'ar' ? 'تطوع' : 'Voluntary')}
            </span>
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {t('hubFasting', lang)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {completedFastingCount > 0 ? (lang === 'ar' ? 'صائم تقبل الله' : 'Fasting, Accepted') : t('hubFastingSub', lang)}
          </div>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. المحتوى التفاعلي للتابة المختارة                       */}
      {/* ======================================================== */}

      {/* ----------------- أ. قسم الصلوات والسنن (قوائم منسدلة لكل صلاة) ----------------- */}
      {activeHub === 'prayers' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">🕌</span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {t('fivePrayersHeading', lang)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAllPrayers}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                {t('openAll', lang)}
              </button>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <button
                type="button"
                onClick={collapseAllPrayers}
                className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                {t('collapseAll', lang)}
              </button>
            </div>
          </div>

          {/* أكورديون الصلوات الخمسة */}
          <div className="space-y-3">
            {prayerSections.map((prayer) => {
              const isOpen = !!openPrayers[prayer.id];
              const totalItems = prayer.items.length;
              const completedInPrayer = prayer.items.filter((i) => i.completed).length;
              const isAllDone = totalItems > 0 && completedInPrayer === totalItems;

              return (
                <div
                  key={prayer.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isAllDone
                      ? 'border-emerald-200/90 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-gray-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
                  }`}
                >
                  {/* شريط عنوان الصلاة (القائمة المنسدلة) */}
                  <button
                    type="button"
                    onClick={() => togglePrayerAccordion(prayer.id)}
                    className={`w-full p-3.5 sm:p-4 flex items-center justify-between ${lang === 'ar' ? 'text-right' : 'text-left'} cursor-pointer select-none hover:bg-gray-100/60 dark:hover:bg-slate-800/60 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl">{prayer.icon}</span>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{prayer.name}</span>
                          {isAllDone && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                              {t('completedBadge', lang)}
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {prayer.timeHint}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          isAllDone
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : completedInPrayer > 0
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {completedInPrayer}/{totalItems}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* قائمة بنود الصلاة المنسدلة */}
                  {isOpen && (
                    <div className="p-3 sm:p-4 pt-1 sm:pt-1 space-y-2 border-t border-gray-100 dark:border-slate-800/80 animate-in fade-in slide-in-from-top-1 duration-150">
                      {prayer.items.map((item) => {
                        const isSunnah = item.isSunnah || item.category === 'سنة';
                        const isAdhkar = item.category === 'أذكار';

                        return (
                          <div
                            key={item.id}
                            onClick={() => onToggleHabit(item.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer select-none ${
                              item.completed
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-gray-800 dark:text-gray-200'
                                : 'bg-white dark:bg-slate-900 border-gray-200/70 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-700/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <button
                                type="button"
                                role="checkbox"
                                aria-checked={item.completed}
                                aria-label={item.title}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleHabit(item.id);
                                }}
                                className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
                                  item.completed
                                    ? 'bg-emerald-600 border-emerald-600 text-white scale-105 shadow-2xs'
                                    : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                                }`}
                              >
                                {item.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`text-xs sm:text-sm font-semibold truncate ${
                                      item.completed
                                        ? 'text-gray-400 dark:text-gray-500 line-through'
                                        : 'text-gray-900 dark:text-white'
                                    }`}
                                  >
                                    {item.title}
                                  </span>

                                  {isSunnah && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                                      {t('sunnahBadge', lang)}
                                    </span>
                                  )}
                                  {isAdhkar && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                                      {t('adhkarBadge', lang)}
                                    </span>
                                  )}
                                </div>
                                
                                {/* إظهار المواقيت الدقيقة للأذكار بناء على طلب المستخدم */}
                                {item.id === 'h9' ? (
                                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 font-bold flex items-center gap-1">
                                    <span>{t('morningAdhkarTimeText', lang)}</span>
                                  </p>
                                ) : item.id === 'h10' ? (
                                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 font-bold flex items-center gap-1">
                                    <span>{t('eveningAdhkarTimeText', lang)}</span>
                                  </p>
                                ) : item.timeHint ? (
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                    {item.timeHint}
                                  </p>
                                ) : null}
                              </div>
                            </div>

                            {/* رابط مباشر للأذكار في الفجر والعصر */}
                            {item.id === 'h9' && (
                              <Link
                                href="/adhkar?category=morning"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 text-amber-800 dark:text-amber-200 text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                              >
                                <span>{t('readAdhkar', lang)}</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}

                            {item.id === 'h10' && (
                              <Link
                                href="/adhkar?category=evening"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 text-amber-800 dark:text-amber-200 text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                              >
                                <span>{t('readAdhkar', lang)}</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ----------------- ب. قسم أورادي اليومية والبر والعلم ----------------- */}
      {activeHub === 'awrad' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                🌟
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {t('dailyAwradHeading', lang)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('dailyAwradSub', lang)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onAddHabitClick && (
                <button
                  type="button"
                  onClick={onAddHabitClick}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t('addNewWerdBtn', lang)}</span>
                </button>
              )}
            </div>
          </div>

          {/* قائمة الأوراد المضافة */}
          {awradHabits.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
              <span className="text-3xl">🌿</span>
              <p className="text-xs text-gray-500 font-semibold">{t('noAwradYet', lang)}</p>
              <button
                type="button"
                onClick={onAddHabitClick}
                className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {t('browseSuggested', lang)}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {awradHabits.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleHabit(item.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/40 text-gray-800 dark:text-gray-200'
                      : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={item.completed}
                      aria-label={item.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleHabit(item.id);
                      }}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
                        item.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white scale-105'
                          : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            item.completed
                              ? 'text-gray-400 dark:text-gray-500 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {item.title}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {item.category}
                        </span>
                      </div>
                      {item.timeHint && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {item.timeHint}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* زر حذف / إزالة الورد بناء على طلب المستخدم */}
                  {onDeleteHabit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHabit(item.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={t('removeWerdTooltip', lang)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ----------------- ج. قسم الورد والقرآن ----------------- */}
      {activeHub === 'quran' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">📖</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {t('quranDailyHeading', lang)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('quranDailySub', lang)}
                </p>
              </div>
            </div>
            {isQuranCompleted && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {t('quranDoneBadge', lang)}
              </span>
            )}
          </div>

          {/* بطاقة متابعة الورد التفاعلية */}
          {quranHabit && (
            <div
              onClick={() => onToggleHabit(quranHabit.id)}
              className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all cursor-pointer ${
                quranHabit.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-gray-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={quranHabit.completed}
                  aria-label={quranHabit.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHabit(quranHabit.id);
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
                    quranHabit.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white scale-105'
                      : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  {quranHabit.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
                </button>
                <div>
                  <h3
                    className={`font-bold text-xs sm:text-sm ${
                      quranHabit.completed
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {quranHabit.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {lang === 'ar' ? 'تلاوة جزء، نصف حزب، أو صفحة مع التدبر' : 'Reciting a portion, hizb, or page with reflection'}
                  </p>
                </div>
              </div>

              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                {quranHabit.completed ? t('completed', lang) : t('clickToMark', lang)}
              </span>
            </div>
          )}

          {/* بطاقة الدعوة لفتح المصحف */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div dir="rtl" className="font-quran text-base sm:text-lg text-emerald-100">
                «اقْرَؤُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيامَةِ شَفِيعًا لأَصْحابِهِ»
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                {t('quranHadithDesc', lang)}
              </p>
            </div>
            <Link
              href="/quran"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('openMushaf', lang)}</span>
            </Link>
          </div>
        </section>
      )}

      {/* ----------------- د. قسم الأذكار وحصن المسلم والسبحة ----------------- */}
      {activeHub === 'adhkar' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">☀️</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {t('adhkarDailyHeading', lang)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('adhkarDailySub', lang)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* زر السبحة الإلكترونية السريع */}
              <button
                type="button"
                onClick={() => {
                  setSebhaInitialIndex(0);
                  setIsSebhaOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/80 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{t('openSebha', lang)}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEidModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                title="سنن وآداب الأعياد"
              >
                <span>{t('eidSunan', lang)}</span>
              </button>
            </div>
          </div>

          {/* بطاقة حديث اليوم النبوي الشريف داخل قسم الأذكار */}
          <HadithDailyCard />

          {/* تنبيهات مواقيت الأذكار المستحبة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 flex items-center gap-2.5">
              <span className="text-lg">🌅</span>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block">{t('morningAdhkarCardTitle', lang)}</span>
                <span className="text-[11px] text-amber-800 dark:text-amber-300">{t('morningAdhkarCardDesc', lang)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 flex items-center gap-2.5">
              <span className="text-lg">🌇</span>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block">{t('eveningAdhkarCardTitle', lang)}</span>
                <span className="text-[11px] text-amber-800 dark:text-amber-300">{t('eveningAdhkarCardDesc', lang)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {uniqueAdhkar.map((adhkarItem) => (
              <div
                key={adhkarItem.id}
                onClick={() => onToggleHabit(adhkarItem.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  adhkarItem.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/40 text-gray-800 dark:text-gray-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-gray-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={adhkarItem.completed}
                    aria-label={adhkarItem.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHabit(adhkarItem.id);
                    }}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
                      adhkarItem.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white scale-105'
                        : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {adhkarItem.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        adhkarItem.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {adhkarItem.title}
                    </h3>
                    {adhkarItem.timeHint && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {adhkarItem.timeHint}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={
                    adhkarItem.id === 'h9'
                      ? '/adhkar?category=morning'
                      : adhkarItem.id === 'h10'
                      ? '/adhkar?category=evening'
                      : '/adhkar'
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>{t('readPortion', lang)}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------- هـ. قسم سنن وبركات يوم الجمعة ----------------- */}
      {activeHub === 'friday' && (
        <FridayHubCard
          onOpenSebhaWithSalawat={() => {
            setSebhaInitialIndex(0);
            setIsSebhaOpen(true);
          }}
        />
      )}

      {/* ----------------- و. قسم صيام التطوع ----------------- */}
      {activeHub === 'fasting' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">🌙</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {t('fastingVoluntaryTitle', lang)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('fastingVoluntarySub', lang)}
                </p>
              </div>
            </div>
            {isFastDayOfWeek && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {lang === 'ar' ? `اليوم سنة ${dayName} 🌿` : `Today is Sunnah ${dayName} 🌿`}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {fastingList.map((fastItem) => (
              <div
                key={fastItem.id}
                onClick={() => onToggleHabit(fastItem.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  fastItem.completed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-gray-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={fastItem.completed}
                    aria-label={fastItem.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHabit(fastItem.id);
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
                      fastItem.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white scale-105'
                        : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {fastItem.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold ${
                        fastItem.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {fastItem.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {fastItem.timeHint}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                  {fastItem.completed ? t('fastingTodayDone', lang) : t('recordFasting', lang)}
                </span>
              </div>
            ))}
          </div>

          <div dir="rtl" className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed text-center font-serif">
            «مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ بَعَّدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا»
          </div>
        </section>
      )}

      {/* نافذة السبحة الإلكترونية المتطورة */}
      <SebhaModal
        isOpen={isSebhaOpen}
        onClose={() => setIsSebhaOpen(false)}
        initialDhikrIndex={sebhaInitialIndex}
      />

      {/* نافذة سنن الأعياد والمناسبات */}
      <EidSunanModal
        isOpen={isEidModalOpen}
        onClose={() => setIsEidModalOpen(false)}
      />
    </div>
  );
};
