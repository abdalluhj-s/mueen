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
} from 'lucide-react';
import { HabitItem } from '../types/dashboard';

interface HabitListProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onDeleteHabit?: (id: string) => void;
  onAddHabitClick?: () => void;
}

type MainHub = 'prayers' | 'quran' | 'adhkar' | 'fasting';

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleHabit,
  onDeleteHabit,
  onAddHabitClick,
}) => {
  // التابة الرئيسية النشطة (الافتراضي: الصلوات والسنن)
  const [activeHub, setActiveHub] = useState<MainHub>('prayers');

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

  // إحصائيات الأقسام الأربعة
  // الصلوات المحددة بالتحديد
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

  const quranHabit = habits.find((h) => h.id === 'h8' || h.category === 'قرآن');
  const isQuranCompleted = !!quranHabit?.completed;

  const adhkarList = habits.filter((h) => h.id === 'h9' || h.id === 'h10' || h.id === 'h11' || h.category === 'أذكار');
  const uniqueAdhkar = Array.from(new Set(adhkarList));
  const completedAdhkarCount = uniqueAdhkar.filter((h) => h.completed).length;

  const fastingList = habits.filter((h) => h.category === 'صيام' || h.timeSlot === 'fasting');
  const completedFastingCount = fastingList.filter((h) => h.completed).length;

  // العادات المخصصة التي أضافها المستخدم بنفسه
  const customHabits = habits.filter(
    (h) =>
      h.id.startsWith('custom_') ||
      (!h.timeSlot && !['صلاة', 'سنة', 'قرآن', 'أذكار', 'صيام'].includes(h.category))
  );

  // تعريف بيانات الصلوات الخمسة وقوائمها المنسدلة
  const prayerSections = [
    {
      id: 'fajr',
      name: 'صلاة الفجر',
      icon: '🌅',
      timeHint: 'عند أذان الفجر في المسجد',
      items: fajrHabits,
    },
    {
      id: 'dhuhr',
      name: 'صلاة الظهر',
      icon: '☀️',
      timeHint: 'عند أذان الظهر في المسجد',
      items: dhuhrHabits,
    },
    {
      id: 'asr',
      name: 'صلاة العصر',
      icon: '🌤️',
      timeHint: 'عند أذان العصر في المسجد',
      items: asrHabits,
    },
    {
      id: 'maghrib',
      name: 'صلاة المغرب',
      icon: '🌇',
      timeHint: 'عند أذان المغرب في المسجد',
      items: maghribHabits,
    },
    {
      id: 'isha',
      name: 'صلاة العشاء والليل',
      icon: '🌙',
      timeHint: 'عند أذان العشاء في المسجد',
      items: ishaHabits,
    },
  ];

  return (
    <div className="space-y-5">
      {/* ======================================================== */}
      {/* 1. الكروت الأربعة الرئيسية (The 4 Main Hubs)             */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* كارت 1: الصلوات والسنن */}
        <button
          type="button"
          onClick={() => setActiveHub('prayers')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'prayers'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'prayers'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {completedPrayersCount}/{totalPrayersCount}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
            الصلوات والسنن
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {completedPrayersCount === totalPrayersCount && totalPrayersCount > 0
              ? 'أتممت الصلوات بفضل الله ✓'
              : 'الفرائض والرواتب'}
          </div>
          {/* شريط تقدم مصغر */}
          <div className="w-full bg-gray-200/80 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalPrayersCount > 0 ? Math.round((completedPrayersCount / totalPrayersCount) * 100) : 0}%`,
              }}
            />
          </div>
        </button>

        {/* كارت 2: ورد القرآن الكريم */}
        <button
          type="button"
          onClick={() => setActiveHub('quran')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'quran'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'quran'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {isQuranCompleted ? '1/1' : '0/1'}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
            الورد والقرآن
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {isQuranCompleted ? 'تم إنجاز الورد اليومي ✨' : 'في انتظار التلاوة'}
          </div>
          <div className="w-full bg-gray-200/80 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: isQuranCompleted ? '100%' : '0%' }}
            />
          </div>
        </button>

        {/* كارت 3: الأذكار وحصن المسلم */}
        <button
          type="button"
          onClick={() => setActiveHub('adhkar')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'adhkar'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'adhkar'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {completedAdhkarCount}/{uniqueAdhkar.length}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
            الأذكار وحصن المسلم
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {completedAdhkarCount === uniqueAdhkar.length && uniqueAdhkar.length > 0
              ? 'أتممت أذكارك اليومية 🌿'
              : 'الصباح، المساء، والنوم'}
          </div>
          <div className="w-full bg-gray-200/80 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${uniqueAdhkar.length > 0 ? Math.round((completedAdhkarCount / uniqueAdhkar.length) * 100) : 0}%`,
              }}
            />
          </div>
        </button>

        {/* كارت 4: صيام التطوع */}
        <button
          type="button"
          onClick={() => setActiveHub('fasting')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
            activeHub === 'fasting'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-101'
              : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeHub === 'fasting'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {isFastDayOfWeek ? `سنة ${dayName}` : isWhiteDay ? 'أيام بيض' : 'تطوع'}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
            صيام التطوع
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {completedFastingCount > 0 ? 'صائم اليوم تقبل الله 🌿' : 'الإثنين والخميس والأيام البيض'}
          </div>
          <div className="w-full bg-gray-200/80 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${fastingList.length > 0 ? Math.round((completedFastingCount / fastingList.length) * 100) : 0}%`,
              }}
            />
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
                الصلوات الخمس والسنن الرواتب
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAllPrayers}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                فتح الكل
              </button>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <button
                type="button"
                onClick={collapseAllPrayers}
                className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                طي الكل
              </button>
            </div>
          </div>

          {/* أكورديون الصلوات الخمسة (تابة جوه تابة) */}
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
                    className="w-full p-3.5 sm:p-4 flex items-center justify-between text-right cursor-pointer select-none hover:bg-gray-100/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl">{prayer.icon}</span>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{prayer.name}</span>
                          {isAllDone && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                              مكتملة ✓
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
                              {/* زر الاختيار Checkbox */}
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
                                      سنة
                                    </span>
                                  )}
                                  {isAdhkar && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                                      أذكار
                                    </span>
                                  )}
                                </div>
                                {item.timeHint && (
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                    {item.timeHint}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* رابط مباشر للأذكار في الفجر والعصر */}
                            {item.id === 'h9' && (
                              <Link
                                href="/adhkar?category=morning"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 text-amber-800 dark:text-amber-200 text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                              >
                                <span>قراءة الأذكار</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}

                            {item.id === 'h10' && (
                              <Link
                                href="/adhkar?category=evening"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 text-amber-800 dark:text-amber-200 text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                              >
                                <span>قراءة الأذكار</span>
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

      {/* ----------------- ب. قسم الورد والقرآن ----------------- */}
      {activeHub === 'quran' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">📖</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  ورد القرآن الكريم اليومي
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  حبل الصلة مع كلام الله وتدبر آياته العظيمة
                </p>
              </div>
            </div>
            {isQuranCompleted && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                تم إنجاز الورد ✓
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
                    تلاوة جزء، نصف حزب، أو صفحة مع التدبر
                  </p>
                </div>
              </div>

              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                {quranHabit.completed ? 'مكتمل' : 'اضغط للتحديد'}
              </span>
            </div>
          )}

          {/* بطاقة الدعوة لفتح المصحف */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="font-quran text-base sm:text-lg text-emerald-100">
                «اقْرَؤُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيامَةِ شَفِيعًا لأَصْحابِهِ»
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                تصفح آيات القرآن الكريم بسهولة مع حفظ مكان وقوفك الأخير
              </p>
            </div>
            <Link
              href="/quran"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <BookOpen className="w-4 h-4" />
              <span>فتح المصحف الشريف للقراءة</span>
            </Link>
          </div>
        </section>
      )}

      {/* ----------------- ج. قسم الأذكار وحصن المسلم ----------------- */}
      {activeHub === 'adhkar' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">☀️</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  الأذكار اليومية وحصن المسلم
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  ألا بذكر الله تطمئن القلوب وتُحفظ النفس من كل مكروه
                </p>
              </div>
            </div>
            <Link
              href="/adhkar"
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>فتح السبحة وحصن المسلم</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
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
                  <span>قراءة الورد</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------- د. قسم صيام التطوع ----------------- */}
      {activeHub === 'fasting' && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">🌙</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  صيام التطوع والسنن المؤكدة
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  صيام الإثنين والخميس، والأيام البيض (13 و 14 و 15)
                </p>
              </div>
            </div>
            {isFastDayOfWeek && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                اليوم سنة {dayName} 🌿
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
                  {fastItem.completed ? 'صائم اليوم ✓' : 'تسجيل الصيام'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed text-center">
            «مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ بَعَّدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا»
          </div>
        </section>
      )}

      {/* ----------------- هـ. العادات المخصصة الإضافية إن وجدت ----------------- */}
      {customHabits.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>✨</span>
              <span>عاداتي الإضافية المخصصة</span>
            </h3>
            {onAddHabitClick && (
              <button
                type="button"
                onClick={onAddHabitClick}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>إضافة عادة</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {customHabits.map((ch) => (
              <div
                key={ch.id}
                onClick={() => onToggleHabit(ch.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  ch.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 text-gray-800 dark:text-gray-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-gray-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={ch.completed}
                    aria-label={ch.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHabit(ch.id);
                    }}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer ${
                      ch.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {ch.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>
                  <span
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      ch.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {ch.title}
                  </span>
                </div>

                {onDeleteHabit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHabit(ch.id);
                    }}
                    className="p-1 rounded-lg text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
