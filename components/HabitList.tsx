import React, { useState } from 'react';
import { ListFilter, PlusCircle } from 'lucide-react';
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

  const categories: (string | HabitCategory)[] = ['الكل', 'صلاة', 'قرآن', 'أذكار', 'صيام', 'عام'];

  const filteredHabits = selectedCategory === 'الكل'
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  const completedCount = filteredHabits.filter((h) => h.completed).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
      {/* الترويسة والفلتر */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>عاداتي اليومية</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {completedCount} / {filteredHabits.length}
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            حدّد العبادات والأوراد التي أتممتها بفضل الله اليوم
          </p>
        </div>

        {/* أزرار التصفية السريعة */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* قائمة العادات */}
      <div className="mt-4 space-y-2.5">
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
            <p className="text-sm font-medium">لا توجد عادات مسجلة في هذا التصنيف</p>
            {onAddHabitClick && (
              <button
                type="button"
                onClick={onAddHabitClick}
                className="mt-3 text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>أضف ورد أو عادة جديدة</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* زر إضافة ورد جديد */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onAddHabitClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-600 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all group cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          <span>إضافة ورد أو عادة جديدة</span>
        </button>
      </div>
    </div>
  );
};
