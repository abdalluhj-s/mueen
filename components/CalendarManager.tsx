'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Calendar as CalendarIcon, ChevronRight, ChevronLeft, 
  Flame, CheckCircle, Target, Sparkles, 
  RotateCcw, ArrowRight, Eye, Grid
} from 'lucide-react';
import { fetchMonthLogs, fetchYearSummary, getUserRealStreak } from '../app/actions/habits';
import { DayHabitModal } from './DayHabitModal';
import Link from 'next/link';
import { getSavedLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../lib/translations';

interface CalendarManagerProps {
  initialLogs?: Record<string, string[]>;
  initialStreak?: number;
  isLoggedIn: boolean;
}

const MONTH_NAMES_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarManager: React.FC<CalendarManagerProps> = ({
  initialLogs = {},
  initialStreak = 0,
  isLoggedIn,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth); // 0-indexed

  // سجلات الشهر المختار: { [dateStr: 'YYYY-MM-DD']: string[] }
  const [monthLogs, setMonthLogs] = useState<Record<string, string[]>>(initialLogs);
  // ملخص السنة: { [dateStr: 'YYYY-MM-DD']: number }
  const [yearSummary, setYearSummary] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState<number>(initialStreak);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // اليوم المفتوح في نافذة الاستدراك
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 1. قراءة بيانات السجل عند تغيير الشهر أو السنة
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);

      // دمج بيانات LocalStorage أولاً لدعم الضيوف واسترجاع التعديلات الأخيرة فورياً
      const mergedMonthLogs: Record<string, string[]> = {};
      if (typeof window !== 'undefined') {
        const daysInSelectedMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        for (let i = 1; i <= daysInSelectedMonth; i++) {
          const ds = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          const localSaved = localStorage.getItem(`mueen_day_logs_${ds}`);
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                mergedMonthLogs[ds] = parsed;
              }
            } catch {}
          }
        }
      }

      if (isLoggedIn) {
        try {
          const serverLogs = await fetchMonthLogs(selectedYear, selectedMonth + 1);
          // دمج السيرفر والمحلي
          Object.keys(serverLogs).forEach((d) => {
            const current = mergedMonthLogs[d] || [];
            mergedMonthLogs[d] = Array.from(new Set([...current, ...serverLogs[d]]));
          });

          if (viewMode === 'yearly') {
            const yrSummary = await fetchYearSummary(selectedYear);
            if (isMounted) setYearSummary(yrSummary);
          }
        } catch (e) {
          console.warn('تعذر جلب السجلات من السيرفر:', e);
        }
      }

      if (isMounted) {
        setMonthLogs(mergedMonthLogs);
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedYear, selectedMonth, viewMode, isLoggedIn]);

  // تحديث الستريك عند التحميل
  useEffect(() => {
    if (isLoggedIn) {
      getUserRealStreak().then((s) => {
        if (s > 0) setStreak(s);
      }).catch(() => {});
    }
  }, [isLoggedIn]);

  // التنقل بين الشهور
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  };

  // التنقل بين السنوات
  const handlePrevYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear((prev) => prev + 1);
  };

  const handleResetToCurrentYear = () => {
    setSelectedYear(currentYear);
  };

  // معالجة تحديث يوم من خلال Modal
  const handleDayUpdated = (date: string, newCompletedIds: string[]) => {
    setMonthLogs((prev) => ({
      ...prev,
      [date]: newCompletedIds,
    }));

    setYearSummary((prev) => ({
      ...prev,
      [date]: newCompletedIds.length,
    }));
  };

  // حساب أيام الشهر الحالي
  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = الأحد، 6 = السبت

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const completedList = monthLogs[dStr] || [];
    days.push({
      dayNumber: i,
      dateString: dStr,
      completedList,
      count: completedList.length,
    });
  }

  // إحصائيات الشهر
  const totalCompletedThisMonth = days.reduce((acc, curr) => acc + curr.count, 0);
  const activeDaysThisMonth = days.filter((d) => d.count > 0).length;
  const maxPossibleHabits = daysInMonth * 11;
  const monthlyCompletionRate = maxPossibleHabits > 0 ? Math.round((totalCompletedThisMonth / maxPossibleHabits) * 100) : 0;

  useEffect(() => {
    const handleLang = (e: any) => setLang(e?.detail?.lang || getSavedLanguage());
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
  }, []);

  // صياغة أسماء الشهور وأيام الأسبوع حسب اللغة
  const monthNames = lang === 'ar' ? MONTH_NAMES_AR : MONTH_NAMES_EN;
  const weekdayNames = lang === 'ar' ? WEEKDAYS_AR : WEEKDAYS_EN;
  const currentMonthTitle = `${monthNames[selectedMonth]} ${selectedYear}`;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="space-y-8">
      {/* نافذة استدراك وتعديل اليوم المحدد */}
      {selectedDateForModal && (
        <DayHabitModal
          isOpen={!!selectedDateForModal}
          onClose={() => setSelectedDateForModal(null)}
          dateString={selectedDateForModal}
          initialCompletedHabits={monthLogs[selectedDateForModal] || []}
          isLoggedIn={isLoggedIn}
          onDayUpdated={handleDayUpdated}
        />
      )}

      {/* شريط التحكم الرئيسي والتبديل بين الشهري والسنوي */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* أزرار التبديل بين العرضين */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-slate-800 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>{t('monthlyCalendar', lang)}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('yearly')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'yearly'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{t('yearlyOverview', lang)}</span>
          </button>
        </div>

        {/* أدوات التنقل واختيار الشهر / السنة */}
        {viewMode === 'monthly' ? (
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer text-xs sm:text-sm"
              title={t('prevMonth', lang)}
            >
              {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span className="hidden sm:inline">{t('prevMonth', lang)}</span>
            </button>

            <span className="px-4 py-2 font-bold text-sm sm:text-base text-gray-900 dark:text-white min-w-[130px] text-center bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800">
              {currentMonthTitle}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer text-xs sm:text-sm"
              title={t('nextMonth', lang)}
            >
              <span className="hidden sm:inline">{t('nextMonth', lang)}</span>
              {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {(selectedYear !== currentYear || selectedMonth !== currentMonth) && (
              <button
                type="button"
                onClick={handleResetToCurrentMonth}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                title={t('currentMonthBtn', lang)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('currentMonthBtn', lang)}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <button
              type="button"
              onClick={handlePrevYear}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer text-xs sm:text-sm"
              title={t('prevYear', lang)}
            >
              {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{t('prevYear', lang)}</span>
            </button>

            <span className="px-5 py-2 font-bold text-sm sm:text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800">
              {lang === 'ar' ? `سنة ${selectedYear}` : `Year ${selectedYear}`}
            </span>

            <button
              type="button"
              onClick={handleNextYear}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer text-xs sm:text-sm"
              title={t('nextYear', lang)}
            >
              <span>{t('nextYear', lang)}</span>
              {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {selectedYear !== currentYear && (
              <button
                type="button"
                onClick={handleResetToCurrentYear}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('currentYearBtn', lang)}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t('currentStreakCard', lang)}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {streak} <span className="text-xs font-normal text-gray-400">{t('daysUnit', lang)}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t('totalCompletedCard', lang)}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {totalCompletedThisMonth} <span className="text-xs font-normal text-gray-400">{t('habitsUnit', lang)}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t('activeDaysCard', lang)}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {activeDaysThisMonth} <span className="text-xs font-normal text-gray-400">{t('ofTotalDays', lang).replace('{total}', String(daysInMonth))}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t('monthRateCard', lang)}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {monthlyCompletionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* ===================== العرض الأول: التقويم الشهري ===================== */}
      {viewMode === 'monthly' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{t('monthLogHeading', lang).replace('{month}', currentMonthTitle)}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {t('clickDayToReview', lang)}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('clickToLogDay', lang)}</span>
            </div>
          </div>

          <div className="p-3 sm:p-6">
            {/* أسماء أيام الأسبوع */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-2">
              {weekdayNames.map((day) => (
                <div key={day} className="text-center text-[11px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 py-1.5">
                  {day}
                </div>
              ))}
            </div>

            {/* شبكة الأيام */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
              {/* أيام البداية الفارغة */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-gray-50/40 dark:bg-slate-800/20 border border-transparent"></div>
              ))}

              {/* بطاقات أيام الشهر */}
              {days.map((day) => {
                const isCurrentToday = day.dateString === todayStr;
                const isPast = day.dateString < todayStr;
                const isFuture = day.dateString > todayStr;

                // درجات التلوين حسب نسبة الإنجاز
                let styleClass = 'bg-gray-50 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800/80 text-gray-700 dark:text-gray-300';
                
                if (day.count > 0) {
                  if (day.count >= 10) {
                    styleClass = 'bg-emerald-600 dark:bg-emerald-600 text-white border-emerald-600 shadow-sm';
                  } else if (day.count >= 6) {
                    styleClass = 'bg-emerald-500/90 dark:bg-emerald-700 text-white border-emerald-500';
                  } else if (day.count >= 3) {
                    styleClass = 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800';
                  } else {
                    styleClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
                  }
                }

                if (isCurrentToday) {
                  styleClass += ' ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 font-bold';
                }

                return (
                  <div
                    key={day.dayNumber}
                    onClick={() => setSelectedDateForModal(day.dateString)}
                    role="button"
                    tabIndex={0}
                    className={`aspect-square rounded-2xl border p-1 sm:p-2 flex flex-col items-center justify-between transition-all duration-150 cursor-pointer hover:scale-[1.03] hover:shadow-md relative group select-none ${styleClass} ${
                      isFuture ? 'opacity-65' : ''
                    }`}
                  >
                    {/* شارة اليوم الحالي */}
                    {isCurrentToday && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white shadow-2xs whitespace-nowrap z-10">
                        {t('today', lang)}
                      </span>
                    )}

                    <span className="text-xs sm:text-base font-bold mt-0.5 sm:mt-1">{day.dayNumber}</span>

                    {/* عدد العادات المكتملة */}
                    <div className="w-full flex items-center justify-center mb-0.5">
                      {day.count > 0 ? (
                        <span className={`text-[10px] sm:text-xs font-semibold px-1 py-0.2 rounded-md ${
                          day.count >= 6 ? 'bg-black/20 text-white' : 'bg-emerald-100/60 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200'
                        }`}>
                          {day.count}/11
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-300 dark:text-slate-600 group-hover:text-gray-500 transition-colors">
                          {isPast ? t('makeUpBadge', lang) : '—'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* دليل الألوان في الأسفل */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800 pt-5">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"></div>
                <span>{t('legendNotLogged', lang)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900"></div>
                <span>{t('legendLow', lang)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-200 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800"></div>
                <span>{t('legendMedium', lang)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500 text-white"></div>
                <span>{t('legendGood', lang)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600 text-white shadow-2xs"></div>
                <span>{t('legendExcellent', lang)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== العرض الثاني: النظرة السنوية (12 شهر) ===================== */}
      {viewMode === 'yearly' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{t('yearlyMonthsHeading', lang).replace('{year}', String(selectedYear))}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {t('yearlyMonthsSubtitle', lang)}
              </p>
            </div>
          </div>

          {/* شبكة شهور السنة الـ 12 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {monthNames.map((monthName, idx) => {
              const mStart = new Date(selectedYear, idx, 1);
              const mDaysCount = new Date(selectedYear, idx + 1, 0).getDate();
              const isCurrent = selectedYear === currentYear && idx === currentMonth;

              // حساب إجمالي عادات هذا الشهر من yearSummary
              let monthCompletedHabits = 0;
              let monthActiveDays = 0;
              const miniDots = [];

              for (let d = 1; d <= mDaysCount; d++) {
                const dateKey = `${selectedYear}-${String(idx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const count = yearSummary[dateKey] || (idx === selectedMonth ? (monthLogs[dateKey]?.length || 0) : 0);
                if (count > 0) {
                  monthCompletedHabits += count;
                  monthActiveDays++;
                }
                miniDots.push(count);
              }

              return (
                <div
                  key={monthName}
                  onClick={() => {
                    setSelectedMonth(idx);
                    setViewMode('monthly');
                  }}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-200 cursor-pointer hover:border-emerald-500 hover:shadow-md group flex flex-col justify-between ${
                    isCurrent
                      ? 'border-emerald-500/80 ring-1 ring-emerald-500/50'
                      : 'border-gray-100 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <span>{monthName}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {t('currentMonthBadge', lang)}
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">
                        {t('activeDaysLabel', lang).replace('{count}', String(monthActiveDays))}
                      </span>
                    </div>

                    {/* خريطة مصغرة لأيام الشهر (Mini Heatmap Grid) */}
                    <div className="grid grid-cols-7 gap-1 p-2 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 mb-4">
                      {miniDots.map((count, dIndex) => {
                        let dotBg = 'bg-gray-200 dark:bg-slate-700/60';
                        if (count > 0) {
                          if (count >= 8) dotBg = 'bg-emerald-600';
                          else if (count >= 4) dotBg = 'bg-emerald-400';
                          else dotBg = 'bg-emerald-200 dark:bg-emerald-800';
                        }
                        return (
                          <div
                            key={dIndex}
                            className={`aspect-square rounded-sm ${dotBg} transition-colors`}
                            title={lang === 'ar' ? `اليوم ${dIndex + 1}: ${count} عادات` : `Day ${dIndex + 1}: ${count} habits`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t('totalCompletedHabitsLabel', lang).replace('{count}', String(monthCompletedHabits))}
                    </span>

                    <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-[-3px] transition-transform flex items-center gap-1">
                      <span>{t('viewAndEdit', lang)}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
