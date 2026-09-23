'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ListFilter,
  PlusCircle,
  Compass,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react';
import { HabitItem, HabitCategory } from '../types/dashboard';
import { HabitRow } from './HabitRow';

interface HabitListProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onDeleteHabit?: (id: string) => void;
  onAddHabitClick?: () => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleHabit,
  onDeleteHabit,
  onAddHabitClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // حساب حالة اليوم الهجري لجدول الصيام والأيام البيض
  const getHijriDayInfo = () => {
    try {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, 4 = Thu
      const isMon = dayOfWeek === 1;
      const isThu = dayOfWeek === 4;
      const isFastDayOfWeek = isMon || isThu;
      const dayName = isMon ? 'الإثنين' : isThu ? 'الخميس' : '';

      // استخراج اليوم الهجري
      const hijriStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
      }).format(now);
      const hijriDay = parseInt(hijriStr, 10) || 10;
      const isWhiteDay = hijriDay >= 13 && hijriDay <= 15;

      return {
        isFastDayOfWeek,
        dayName,
        hijriDay,
        isWhiteDay,
      };
    } catch {
      return {
        isFastDayOfWeek: false,
        dayName: '',
        hijriDay: 10,
        isWhiteDay: false,
      };
    }
  };

  const { isFastDayOfWeek, dayName, hijriDay, isWhiteDay } = getHijriDayInfo();

  // إحصائيات الأقسام الأربعة للداشبورد المبدئي
  const prayersAndSunan = habits.filter((h) => h.category === 'صلاة' || h.category === 'سنة');
  const prayersCompleted = prayersAndSunan.filter((h) => h.completed).length;

  const quranHabits = habits.filter((h) => h.category === 'قرآن');
  const quranCompleted = quranHabits.filter((h) => h.completed).length;

  const adhkarHabits = habits.filter((h) => h.category === 'أذكار');
  const adhkarCompleted = adhkarHabits.filter((h) => h.completed).length;

  const fastingHabits = habits.filter((h) => h.category === 'صيام');
  const fastingCompleted = fastingHabits.filter((h) => h.completed).length;

  // التبويبات المتاحة
  const tabs = [
    { id: 'الكل', label: 'الكل (المسار اليومي)', icon: <ListFilter className="w-3.5 h-3.5" /> },
    { id: 'صلاة', label: 'الصلوات والسنن', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'قرآن', label: 'ورد القرآن', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'أذكار', label: 'الأذكار', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'صيام', label: 'الصيام', icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  // تصفية العادات حسب التبويب
  const filteredHabits =
    selectedCategory === 'الكل'
      ? habits
      : selectedCategory === 'صلاة'
      ? habits.filter((h) => h.category === 'صلاة' || h.category === 'سنة')
      : habits.filter((h) => h.category === selectedCategory);

  const completedCount = filteredHabits.filter((h) => h.completed).length;

  // تقسيم المسار الزمني لتبويب "الكل"
  const timeSections = [
    {
      id: 'fajr',
      title: 'وقت الفجر 🌅',
      desc: 'صلاة الفجر، سنتها الراتبة، وأذكار الصباح المباركة',
      items: habits.filter((h) => h.timeSlot === 'fajr'),
    },
    {
      id: 'dhuhr',
      title: 'وقت الظهر ☀️',
      desc: 'صلاة الظهر وسنتها الراتبة (4 قبلها و 2 بعدها)',
      items: habits.filter((h) => h.timeSlot === 'dhuhr'),
    },
    {
      id: 'asr',
      title: 'وقت العصر 🌤️',
      desc: 'صلاة العصر وأذكار المساء وحصن المسلم',
      items: habits.filter((h) => h.timeSlot === 'asr'),
    },
    {
      id: 'maghrib',
      title: 'وقت المغرب 🌇',
      desc: 'صلاة المغرب وسنتها الراتبة (ركعتان بعدها)',
      items: habits.filter((h) => h.timeSlot === 'maghrib'),
    },
    {
      id: 'isha_night',
      title: 'وقت العشاء والليل 🌙',
      desc: 'صلاة العشاء، سنتها الراتبة، الشفع والوتر وقيام الليل',
      items: habits.filter((h) => h.timeSlot === 'isha' || h.timeSlot === 'night'),
    },
    {
      id: 'quran_section',
      title: 'ورد القرآن الكريم اليومي 📖',
      desc: 'حبل الصلة مع كلام الله وتدبر آياته',
      items: habits.filter((h) => h.timeSlot === 'quran'),
    },
    {
      id: 'fasting_section',
      title: 'صيام التطوع 🌿',
      desc: 'صيام الإثنين والخميس، والأيام البيض (13 و 14 و 15)',
      items: habits.filter((h) => h.timeSlot === 'fasting' || h.category === 'صيام'),
    },
    {
      id: 'other_section',
      title: 'عادات وأوراد أخرى ✨',
      desc: 'عاداتك الإضافية المخصصة',
      items: habits.filter(
        (h) =>
          !h.timeSlot &&
          h.category !== 'صلاة' &&
          h.category !== 'سنة' &&
          h.category !== 'قرآن' &&
          h.category !== 'أذكار' &&
          h.category !== 'صيام'
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* ======================================================== */}
      {/* 1. داشبورد ملخص اليوم الإيماني (Interactive Summary Cards) */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              ملخص الأوراد اليومية
            </h3>
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            انقر على أي كارت للتنقل المباشر
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* كارت الصلوات والسنن */}
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'صلاة' ? 'الكل' : 'صلاة')}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'صلاة'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-gray-50/80 dark:bg-slate-800/60 border-gray-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                {prayersCompleted}/{prayersAndSunan.length}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
              الصلوات والسنن
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {prayersCompleted === prayersAndSunan.length && prayersAndSunan.length > 0
                ? 'أتممت الصلوات بفضل الله'
                : 'الفرائض والرواتب'}
            </div>
            {/* شريط تقدم مصغر */}
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    prayersAndSunan.length > 0
                      ? Math.round((prayersCompleted / prayersAndSunan.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </button>

          {/* كارت ورد القرآن */}
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'قرآن' ? 'الكل' : 'قرآن')}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'قرآن'
                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                : 'bg-gray-50/80 dark:bg-slate-800/60 border-gray-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-teal-700 dark:text-teal-400">
                {quranCompleted}/{quranHabits.length}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
              ورد القرآن الكريم
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {quranCompleted > 0 ? 'تم إنجاز الورد ✨' : 'في انتظار التلاوة'}
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    quranHabits.length > 0
                      ? Math.round((quranCompleted / quranHabits.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </button>

          {/* كارت الأذكار */}
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'أذكار' ? 'الكل' : 'أذكار')}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'أذكار'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                : 'bg-gray-50/80 dark:bg-slate-800/60 border-gray-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                {adhkarCompleted}/{adhkarHabits.length}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
              الأذكار وحصن المسلم
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {adhkarCompleted >= 2 ? 'أذكار الصباح والمساء' : 'الصباح والمساء والنوم'}
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    adhkarHabits.length > 0
                      ? Math.round((adhkarCompleted / adhkarHabits.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </button>

          {/* كارت الصيام والتطوع */}
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'صيام' ? 'الكل' : 'صيام')}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'صيام'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                : 'bg-gray-50/80 dark:bg-slate-800/60 border-gray-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                {isFastDayOfWeek ? `سنة ${dayName}` : isWhiteDay ? 'أيام بيض' : 'تطوع'}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
              صيام التطوع
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {fastingCompleted > 0 ? 'صائم اليوم 🌿' : 'إثنين/خميس و 13، 14، 15'}
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    fastingHabits.length > 0
                      ? Math.round((fastingCompleted / fastingHabits.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. شريط التبويبات الرئيسي (Tabs Selector)                */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs transition-colors duration-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>
                {selectedCategory === 'الكل'
                  ? 'المسار الإيماني اليومي'
                  : selectedCategory === 'صلاة'
                  ? 'الصلوات المفروضة والسنن الرواتب'
                  : selectedCategory === 'قرآن'
                  ? 'ورد القرآن الكريم'
                  : selectedCategory === 'أذكار'
                  ? 'أذكار الصباح والمساء وحصن المسلم'
                  : 'صيام التطوع والأيام البيض'}
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {completedCount} / {filteredHabits.length}
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {selectedCategory === 'الكل'
                ? 'مرتبة زمنياً: الفجر مع سنته وأذكار الصباح، الظهر، العصر مع أذكار المساء، والمغرب والعشاء والليل'
                : 'حدّد ما أتممته بتوفيق الله لتثبيت وردك وسجلك'}
            </p>
          </div>

          {/* أزرار التبويبات الأنيقة */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/60 dark:border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. العرض التفاعلي الخاص بكل تبويب                      */}
        {/* ======================================================== */}

        {/* 3.أ. في حالة تبويب "الصيام": بطاقة توجيهية وإرشادية ذكية */}
        {selectedCategory === 'صيام' && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-indigo-900 dark:text-indigo-200">
              <span className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>فضل صيام التطوع وسنة النبي ﷺ</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                اليوم الهجري: {hijriDay}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
              {isFastDayOfWeek ? (
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  🌿 اليوم هو يوم {dayName}، وهو يوم تُعرض فيه الأعمال على الله، وتستحب فيه سنة الصيام!
                </span>
              ) : isWhiteDay ? (
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  🌕 أنت في الأيام البيض المباركة (13، 14، 15) من هذا الشهر الهجري!
                </span>
              ) : (
                <span>
                  «صيام ثلاثة أيام من كل شهر صيام الدهر وأيام البيض صبيحة ثلاث عشرة وأربع عشرة وخمس عشرة».
                  {hijriDay < 13 && ` (متبقي ${13 - hijriDay} أيام على بدء الأيام البيض)`}
                </span>
              )}
            </p>
          </div>
        )}

        {/* 3.ب. في حالة تبويب "قرآن": بطاقة الانتقال للمصحف الشريف */}
        {selectedCategory === 'قرآن' && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/30 border border-teal-200/80 dark:border-teal-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                  المصحف الشريف وتلاوة الورد
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                  افتح صفحة القرآن لتحديد الحزب، الجزء، أو الصفحات ومتابعة ختمتك
                </p>
              </div>
            </div>
            <Link
              href="/quran"
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              <span>فتح صفحة القرآن</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 3.ج. في حالة تبويب "أذكار": روابط سريعة لأذكار الصباح والمساء */}
        {selectedCategory === 'أذكار' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in">
            <Link
              href="/adhkar?category=morning"
              className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-amber-200 text-xs sm:text-sm">
                    أذكار الصباح والتسبيح
                  </h4>
                  <p className="text-amber-800/70 dark:text-amber-400/80 text-[11px]">
                    من بعد الفجر حتى طلوع الشمس
                  </p>
                </div>
              </div>
              <span className="text-xs text-amber-700 dark:text-amber-300 font-bold group-hover:translate-x-[-2px] transition-transform">
                قراءة ←
              </span>
            </Link>

            <Link
              href="/adhkar?category=evening"
              className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 hover:border-indigo-400 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-5 h-5 text-indigo-500" />
                <div>
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-xs sm:text-sm">
                    أذكار المساء وحصن المسلم
                  </h4>
                  <p className="text-indigo-800/70 dark:text-indigo-400/80 text-[11px]">
                    من بعد صلاة العصر حتى الغروب
                  </p>
                </div>
              </div>
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold group-hover:translate-x-[-2px] transition-transform">
                قراءة ←
              </span>
            </Link>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. قائمة العادات (حسب المسار الزمني أو التصفية)           */}
        {/* ======================================================== */}
        {selectedCategory === 'الكل' ? (
          /* المسار الزمني المتكامل لليوم */
          <div className="space-y-5 divide-y divide-gray-100 dark:divide-slate-800">
            {timeSections.map((sec) => {
              if (sec.items.length === 0) return null;
              return (
                <div key={sec.id} className="pt-4 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{sec.title}</span>
                      </h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {sec.desc}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50">
                      {sec.items.filter((i) => i.completed).length} / {sec.items.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sec.items.map((habit) => (
                      <HabitRow
                        key={habit.id}
                        habit={habit}
                        onToggle={onToggleHabit}
                        onDelete={onDeleteHabit}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* قائمة العادات العادية المصفاة حسب التبويب */
          <div className="space-y-2.5">
            {filteredHabits.length > 0 ? (
              filteredHabits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  onToggle={onToggleHabit}
                  onDelete={onDeleteHabit}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <ListFilter className="w-10 h-10 mx-auto stroke-1 text-gray-300 mb-2" />
                <p className="text-sm font-medium">لا توجد أوراد مسجلة في هذا التصنيف</p>
                {onAddHabitClick && (
                  <button
                    type="button"
                    onClick={onAddHabitClick}
                    className="mt-3 text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>أضف ورداً أو عادة جديدة</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* زر إضافة ورد جديد في الأسفل */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onAddHabitClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all group cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            <span>إضافة ورد أو عادة خاصة بك</span>
          </button>
        </div>
      </div>
    </div>
  );
};
