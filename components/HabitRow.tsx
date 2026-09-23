import React from 'react';
import Link from 'next/link';
import { Check, BookOpen, Sun, Moon, Compass, Clock, Trash2, Sparkles } from 'lucide-react';
import { HabitItem, HabitCategory } from '../types/dashboard';

interface HabitRowProps {
  habit: HabitItem;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit, onToggle, onDelete }) => {
  // أيقونة وتنسيق التصنيف
  const getCategoryBadge = (category: HabitCategory) => {
    switch (category) {
      case 'صلاة':
        return {
          icon: <Compass className="w-3.5 h-3.5" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60',
          label: 'فريضة',
        };
      case 'سنة':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
          bg: 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60',
          label: 'سنة راتبة',
        };
      case 'قرآن':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          bg: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/60',
          label: 'قرآن',
        };
      case 'أذكار':
        return {
          icon: <Sun className="w-3.5 h-3.5" />,
          bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60',
          label: 'أذكار',
        };
      case 'صيام':
        return {
          icon: <Moon className="w-3.5 h-3.5" />,
          bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-800/60',
          label: 'صيام',
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          bg: 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700',
          label: category,
        };
    }
  };

  const badge = getCategoryBadge(habit.category);

  return (
    <div
      onClick={() => onToggle(habit.id)}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        habit.isSunnah ? 'mr-2 sm:mr-4 border-r-4 border-r-teal-500/60 bg-teal-50/20 dark:bg-teal-950/10' : ''
      } ${
        habit.completed
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-sm'
      }`}
    >
      {/* الجانب الأيمن: زر الاختيار والتفاصيل */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* زر الـ Checkbox المخصص التفاعلي */}
        <button
          type="button"
          role="checkbox"
          aria-checked={habit.completed}
          aria-label={habit.title}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(habit.id);
          }}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 shrink-0 cursor-pointer ${
            habit.completed
              ? 'bg-emerald-600 border-emerald-600 text-white scale-105 shadow-xs shadow-emerald-600/30'
              : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-emerald-500'
          }`}
        >
          {habit.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
        </button>

        {/* عنوان العادة والملاحظات */}
        <div className="truncate min-w-0 flex-1">
          {habit.category === 'قرآن' ? (
            <Link
              href="/quran"
              onClick={(e) => e.stopPropagation()}
              className={`text-sm sm:text-base font-semibold transition-colors duration-200 truncate block hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline ${
                habit.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-slate-100'
              }`}
            >
              {habit.title}
            </Link>
          ) : habit.category === 'أذكار' ? (
            <Link
              href={
                habit.title.includes('صباح')
                  ? '/adhkar?category=morning'
                  : habit.title.includes('مساء')
                  ? '/adhkar?category=evening'
                  : '/adhkar'
              }
              onClick={(e) => e.stopPropagation()}
              className={`text-sm sm:text-base font-semibold transition-colors duration-200 truncate block hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline ${
                habit.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-slate-100'
              }`}
            >
              {habit.title}
            </Link>
          ) : (
            <h3
              className={`text-sm sm:text-base font-semibold transition-colors duration-200 truncate ${
                habit.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-slate-100'
              }`}
            >
              {habit.title}
            </h3>
          )}
          {habit.timeHint && (
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block truncate">
              {habit.timeHint}
            </span>
          )}
        </div>
      </div>

      {/* الجانب الأيسر: شارة التصنيف وزر الحذف */}
      <div className="flex items-center gap-2 shrink-0 mr-2">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${badge.bg}`}
        >
          {badge.icon}
          <span>{badge.label || habit.category}</span>
        </span>

        {onDelete && (
          <button
            type="button"
            aria-label="حذف العادة"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="p-1 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
