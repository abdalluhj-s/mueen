'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, BookOpen, Compass, Sun, Moon, Clock } from 'lucide-react';
import { HabitCategory, HabitItem } from '../types/dashboard';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<HabitItem, 'id' | 'completed'>) => void;
}

const CATEGORIES: { label: HabitCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'صلاة', icon: <Compass className="w-4 h-4" />, color: 'emerald' },
  { label: 'قرآن', icon: <BookOpen className="w-4 h-4" />, color: 'teal' },
  { label: 'أذكار', icon: <Sun className="w-4 h-4" />, color: 'amber' },
  { label: 'صيام', icon: <Moon className="w-4 h-4" />, color: 'indigo' },
  { label: 'عام', icon: <Clock className="w-4 h-4" />, color: 'gray' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('صلاة');
  const [timeHint, setTimeHint] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى كتابة اسم الورد أو العادة');
      return;
    }

    onAddHabit({
      title: title.trim(),
      category,
      timeHint: timeHint.trim() || undefined,
    });

    setTitle('');
    setTimeHint('');
    setError('');
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-l from-emerald-50 via-teal-50 to-white border-b border-emerald-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">إضافة ورد أو عادة جديدة</h3>
              <p className="text-xs text-gray-500">«أحب الأعمال إلى الله أدومها وإن قل»</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* نموذج الإضافة */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* اسم العادة */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              اسم العادة أو الورد: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: صلاة الضحى، قراءة سورة الملك، الاستغفار 100 مرة"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm transition-all placeholder:text-gray-400"
              autoFocus
            />
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>

          {/* التصنيف */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              التصنيف:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`flex flex-col items-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-medium transition-all ${
                    category === cat.label
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* وقت التذكير أو الملاحظة */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              وقت الأداء أو التذكير (اختياري):
            </label>
            <input
              type="text"
              placeholder="مثال: بعد صلاة الفجر، قبل النوم، شروق الشمس"
              value={timeHint}
              onChange={(e) => setTimeHint(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm transition-all placeholder:text-gray-400"
            />
          </div>

          {/* أزرار الإجراء */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>إضافة العادة</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
