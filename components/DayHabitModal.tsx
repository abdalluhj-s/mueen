'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  X, CheckCircle, Sparkles, Check, 
  RotateCcw, ShieldCheck, Sun, Moon, 
  BookOpen, Heart, Clock
} from 'lucide-react';
import { toggleHabitCompletion, batchToggleDayHabits } from '../app/actions/habits';

export interface HabitDefinition {
  id: string;
  title: string;
  category: string;
  icon: string;
  group: 'prayers' | 'sunan' | 'quran' | 'adhkar' | 'fasting';
}

export const ALL_HABITS: HabitDefinition[] = [
  // الصلوات المفروضة
  { id: 'h1', title: 'صلاة الفجر في وقتها مع الجماعة', category: 'صلاة', icon: '🌅', group: 'prayers' },
  { id: 'h2', title: 'صلاة الظهر في وقتها مع الجماعة', category: 'صلاة', icon: '☀️', group: 'prayers' },
  { id: 'h3', title: 'صلاة العصر في وقتها مع الجماعة', category: 'صلاة', icon: '🌤️', group: 'prayers' },
  { id: 'h4', title: 'صلاة المغرب في وقتها مع الجماعة', category: 'صلاة', icon: '🌇', group: 'prayers' },
  { id: 'h5', title: 'صلاة العشاء في وقتها مع الجماعة', category: 'صلاة', icon: '🌙', group: 'prayers' },
  // السنن والنوافل
  { id: 'h1_sunnah', title: 'سنة الفجر الراتبة (ركعتان قبلهما)', category: 'سنة', icon: '✨', group: 'sunan' },
  { id: 'h2_sunnah', title: 'سنة الظهر الراتبة (4 قبلها و 2 بعدها)', category: 'سنة', icon: '🕌', group: 'sunan' },
  { id: 'h4_sunnah', title: 'سنة المغرب الراتبة (ركعتان بعدها)', category: 'سنة', icon: '✨', group: 'sunan' },
  { id: 'h5_sunnah', title: 'سنة العشاء الراتبة (ركعتان بعدها)', category: 'سنة', icon: '🕌', group: 'sunan' },
  { id: 'h6', title: 'السنن الرواتب العامة', category: 'سنة', icon: '🕌', group: 'sunan' },
  { id: 'h7', title: 'صلاة الوتر وركعتي قيام الليل', category: 'صلاة', icon: '✨', group: 'sunan' },
  // ورد القرآن
  { id: 'h8', title: 'ورد القرآن اليومي (جزء أو نصف حزب أو صفحة)', category: 'قرآن', icon: '📖', group: 'quran' },
  // الأذكار
  { id: 'h9', title: 'أذكار الصباح والتسبيح', category: 'أذكار', icon: '📿', group: 'adhkar' },
  { id: 'h10', title: 'أذكار المساء وحصن المسلم', category: 'أذكار', icon: '🌿', group: 'adhkar' },
  { id: 'h11', title: 'أذكار النوم وسورة الملك', category: 'أذكار', icon: '🤲', group: 'adhkar' },
  // صيام التطوع
  { id: 'h_fast_mon_thu', title: 'صيام الإثنين والخميس', category: 'صيام', icon: '🌙', group: 'fasting' },
  { id: 'h_fast_white_days', title: 'صيام الأيام البيض (13 و 14 و 15)', category: 'صيام', icon: '🌕', group: 'fasting' },
];

interface DayHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateString: string; // 'YYYY-MM-DD'
  initialCompletedHabits?: string[];
  isLoggedIn: boolean;
  onDayUpdated: (date: string, completedIds: string[]) => void;
}

export const DayHabitModal: React.FC<DayHabitModalProps> = ({
  isOpen,
  onClose,
  dateString,
  initialCompletedHabits = [],
  isLoggedIn,
  onDayUpdated,
}) => {
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedHabits);
  const [isPending, startTransition] = useTransition();
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // تحديث القائمة عند فتح النافذة أو تغيير التاريخ
  useEffect(() => {
    if (isOpen) {
      // قراءة من LocalStorage كنسخة احتياطية
      let currentCompleted = [...initialCompletedHabits];
      if (typeof window !== 'undefined') {
        const localDayKey = `mueen_day_logs_${dateString}`;
        const saved = localStorage.getItem(localDayKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              currentCompleted = Array.from(new Set([...currentCompleted, ...parsed]));
            }
          } catch {}
        }
      }
      setCompletedIds(currentCompleted);
      setSaveSuccessNotice(false);
    }
  }, [isOpen, dateString, initialCompletedHabits]);

  if (!isOpen || !dateString) return null;

  // صياغة تفاصيل التاريخ
  const [yearNum, monthNum, dayNum] = dateString.split('-').map(Number);
  const dateObj = new Date(yearNum, monthNum - 1, dayNum);

  const dayName = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(dateObj);
  const gregorianDate = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);

  let hijriDate = '';
  try {
    hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    hijriDate = '';
  }

  // معرفة هل اليوم هو اليوم الحالي أو سابق أو لاحق
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isToday = dateString === todayStr;
  const isPast = dateString < todayStr;
  const isFuture = dateString > todayStr;

  const totalCount = ALL_HABITS.length;
  const completedCount = completedIds.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // حفظ محلي وتحديث الواجهة
  const persistChanges = (newIds: string[]) => {
    setCompletedIds(newIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`mueen_day_logs_${dateString}`, JSON.stringify(newIds));
      
      // إذا كان تاريخ اليوم، نحدث أيضاً قائمة العادات الرئيسية
      if (isToday) {
        try {
          const mainHabitsStr = localStorage.getItem('mueen_habits');
          if (mainHabitsStr) {
            const parsed = JSON.parse(mainHabitsStr);
            if (Array.isArray(parsed)) {
              const updated = parsed.map((h: any) => ({
                ...h,
                completed: newIds.includes(h.id),
              }));
              localStorage.setItem('mueen_habits', JSON.stringify(updated));
            }
          }
        } catch {}
      }
    }

    onDayUpdated(dateString, newIds);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  // تبديل عادة منفردة
  const handleToggleSingle = (habit: HabitDefinition) => {
    const isCompleted = completedIds.includes(habit.id);
    const newIds = isCompleted
      ? completedIds.filter((id) => id !== habit.id)
      : [...completedIds, habit.id];

    persistChanges(newIds);

    if (isLoggedIn) {
      startTransition(async () => {
        try {
          await toggleHabitCompletion(habit.id, dateString, !isCompleted, {
            title: habit.title,
            category: habit.category,
          });
        } catch (e) {
          console.warn('تعذر المزامنة السحابية للعادة:', e);
        }
      });
    }
  };

  // إتمام الصلوات الخمس المفروضة بنقرة واحدة
  const handleCompleteAllPrayers = () => {
    const prayerIds = ['h1', 'h2', 'h3', 'h4', 'h5'];
    const newIds = Array.from(new Set([...completedIds, ...prayerIds]));
    persistChanges(newIds);

    if (isLoggedIn) {
      startTransition(async () => {
        try {
          const updates = ALL_HABITS.filter((h) => prayerIds.includes(h.id)).map((h) => ({
            habitId: h.id,
            completed: true,
            title: h.title,
            category: h.category,
          }));
          await batchToggleDayHabits(dateString, updates);
        } catch (e) {
          console.warn('تعذر حفظ الصلوات جماعياً:', e);
        }
      });
    }
  };

  // إتمام جميع عادات اليوم
  const handleCompleteAllHabits = () => {
    const allIds = ALL_HABITS.map((h) => h.id);
    persistChanges(allIds);

    if (isLoggedIn) {
      startTransition(async () => {
        try {
          const updates = ALL_HABITS.map((h) => ({
            habitId: h.id,
            completed: true,
            title: h.title,
            category: h.category,
          }));
          await batchToggleDayHabits(dateString, updates);
        } catch (e) {
          console.warn('تعذر إتمام عادات اليوم جماعياً:', e);
        }
      });
    }
  };

  // تفريغ اليوم
  const handleClearDay = () => {
    if (!confirm('هل تريد إلغاء تحديد جميع عادات هذا اليوم؟')) return;
    persistChanges([]);

    if (isLoggedIn) {
      startTransition(async () => {
        try {
          const updates = ALL_HABITS.map((h) => ({
            habitId: h.id,
            completed: false,
            title: h.title,
            category: h.category,
          }));
          await batchToggleDayHabits(dateString, updates);
        } catch (e) {
          console.warn('تعذر تفريغ اليوم:', e);
        }
      });
    }
  };

  // تجميع العادات حسب الفئة
  const prayerHabits = ALL_HABITS.filter((h) => h.group === 'prayers');
  const sunanHabits = ALL_HABITS.filter((h) => h.group === 'sunan');
  const quranHabits = ALL_HABITS.filter((h) => h.group === 'quran');
  const adhkarHabits = ALL_HABITS.filter((h) => h.group === 'adhkar');
  const fastingHabits = ALL_HABITS.filter((h) => h.group === 'fasting');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        dir="rtl"
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-200"
      >
        {/* رأس النافذة */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-r from-emerald-50/50 via-transparent to-teal-50/30 dark:from-emerald-950/20 dark:to-transparent">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {isToday ? 'اليوم الحالي 🌟' : isPast ? 'استدراك يوم سابق ⏳' : 'يوم قادم 📅'}
              </span>
              {saveSuccessNotice && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                  تم الحفظ تلقائياً ✨
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{dayName}</span>
              <span className="text-emerald-600 dark:text-emerald-400">({gregorianDate})</span>
            </h2>
            {hijriDate && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                الموافق: {hijriDate}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* شريط التقدم وأزرار الإنجاز السريع */}
        <div className="px-4 sm:px-6 pt-4 pb-3 bg-gray-50/60 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              إنجاز اليوم: <strong className="text-emerald-600 dark:text-emerald-400">{completedCount}</strong> من {totalCount} عادة
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {percentage}%
            </span>
          </div>

          {/* شريط التقدم البصري */}
          <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : percentage >= 50
                  ? 'bg-emerald-500'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* أزرار الإجراءات السريعة */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              type="button"
              onClick={handleCompleteAllPrayers}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🕌 إتمام الصلوات الـ 5</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteAllHabits}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>إتمام كل العادات</span>
            </button>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleClearDay}
                className="text-xs px-2.5 py-1.5 rounded-xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mr-auto cursor-pointer"
                title="تفريغ اليوم"
              >
                <RotateCcw className="w-3.5 h-3.5 inline ml-1" />
                تفريغ
              </button>
            )}
          </div>
        </div>

        {/* محتوى العادات القابل للتمرير */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* قسم الصلوات المفروضة */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🕌 الصلوات المفروضة الخمس</span>
            </h3>
            <div className="space-y-2">
              {prayerHabits.map((habit) => {
                const isChecked = completedIds.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleSingle(habit)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                        : 'bg-white dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{habit.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'line-through opacity-85 text-emerald-900 dark:text-emerald-200' : ''}`}>
                          {habit.title}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* قسم السنن والنوافل */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>✨ السنن والنوافل</span>
            </h3>
            <div className="space-y-2">
              {sunanHabits.map((habit) => {
                const isChecked = completedIds.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleSingle(habit)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                        : 'bg-white dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{habit.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'line-through opacity-85 text-emerald-900 dark:text-emerald-200' : ''}`}>
                          {habit.title}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* قسم ورد القرآن */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📖 القرآن الكريم</span>
            </h3>
            <div className="space-y-2">
              {quranHabits.map((habit) => {
                const isChecked = completedIds.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleSingle(habit)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                        : 'bg-white dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{habit.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'line-through opacity-85 text-emerald-900 dark:text-emerald-200' : ''}`}>
                          {habit.title}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* قسم الأذكار */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📿 الأذكار وحصن المسلم</span>
            </h3>
            <div className="space-y-2">
              {adhkarHabits.map((habit) => {
                const isChecked = completedIds.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleSingle(habit)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                        : 'bg-white dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{habit.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'line-through opacity-85 text-emerald-900 dark:text-emerald-200' : ''}`}>
                          {habit.title}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* قسم صيام التطوع */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🌙 صيام التطوع والأيام البيض</span>
            </h3>
            <div className="space-y-2">
              {fastingHabits.map((habit) => {
                const isChecked = completedIds.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleSingle(habit)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 shadow-2xs'
                        : 'bg-white dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{habit.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'line-through opacity-85 text-indigo-900 dark:text-indigo-200' : ''}`}>
                          {habit.title}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-indigo-600 text-white'
                          : 'border-2 border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* أسفل النافذة */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isPast ? '✨ تم تفعيل الحفظ التلقائي للاستدراك' : '✨ يتم الحفظ وتحديث السجل تلقائياً'}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
          >
            تم وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
