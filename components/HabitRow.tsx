import React from 'react';
import { Check, BookOpen, Sun, Moon, Compass, Clock, Trash2 } from 'lucide-react';
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
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
        };
      case 'قرآن':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          bg: 'bg-teal-50 text-teal-700 border-teal-200/70',
        };
      case 'أذكار':
        return {
          icon: <Sun className="w-3.5 h-3.5" />,
          bg: 'bg-amber-50 text-amber-700 border-amber-200/70',
        };
      case 'صيام':
        return {
          icon: <Moon className="w-3.5 h-3.5" />,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          bg: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };

  const badge = getCategoryBadge(habit.category);

  return (
    <div
      onClick={() => onToggle(habit.id)}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        habit.completed
          ? 'bg-emerald-50/50 border-emerald-200/80 shadow-xs'
          : 'bg-white border-gray-200/80 hover:border-emerald-300 hover:shadow-sm'
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
              : 'border-gray-300 bg-white group-hover:border-emerald-500'
          }`}
        >
          {habit.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
        </button>

        {/* عنوان العادة والملاحظات */}
        <div className="truncate min-w-0 flex-1">
          <h3
            className={`text-sm sm:text-base font-semibold transition-colors duration-200 truncate ${
              habit.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}
          >
            {habit.title}
          </h3>
          {habit.timeHint && (
            <span className="text-xs text-gray-400 mt-0.5 block truncate">
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
          <span>{habit.category}</span>
        </span>

        {onDelete && (
          <button
            type="button"
            aria-label="حذف العادة"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="p-1 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
