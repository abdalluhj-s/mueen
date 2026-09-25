'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, BookOpen, Compass, Sun, Moon, Clock, Heart, GraduationCap, Check } from 'lucide-react';
import { HabitCategory, HabitItem } from '../types/dashboard';
import { SUGGESTED_AWRAD, SuggestedAwradItem } from '../data/suggestedAwrad';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<HabitItem, 'id' | 'completed'>) => void;
  existingHabitTitles?: string[];
}

const CATEGORIES: { label: HabitCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'أوراد', icon: <Sparkles className="w-4 h-4" />, color: 'emerald' },
  { label: 'بر', icon: <Heart className="w-4 h-4" />, color: 'rose' },
  { label: 'علم', icon: <GraduationCap className="w-4 h-4" />, color: 'indigo' },
  { label: 'صلاة', icon: <Compass className="w-4 h-4" />, color: 'teal' },
  { label: 'قرآن', icon: <BookOpen className="w-4 h-4" />, color: 'amber' },
  { label: 'أذكار', icon: <Sun className="w-4 h-4" />, color: 'amber' },
  { label: 'صيام', icon: <Moon className="w-4 h-4" />, color: 'purple' },
  { label: 'عام', icon: <Clock className="w-4 h-4" />, color: 'gray' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
  existingHabitTitles = [],
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'library'>('library');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('أوراد');
  const [timeHint, setTimeHint] = useState('');
  const [error, setError] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

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
      isCustom: true,
      isDeletable: true,
    });

    setTitle('');
    setTimeHint('');
    setError('');
    onClose();
  };

  const handleAddSuggested = (item: SuggestedAwradItem) => {
    onAddHabit({
      title: item.title,
      category: item.category,
      timeHint: item.timeHint,
      isCustom: true,
      isDeletable: true,
    });
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-l from-emerald-50 via-teal-50 to-white dark:from-emerald-950/60 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">إضافة أوراد وعادات يومية</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">اختر من مكتبة الأوراد المقترحة أو أضف ورداً خاصاً بك</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* التبديل بين مكتبة الأوراد المقترحة وكتابة ورد مخصص */}
        <div className="p-3 bg-gray-50 dark:bg-slate-850 border-b border-gray-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 bg-gray-200/70 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>مكتبة الأوراد المقترحة 📚</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>كتابة ورد مخصص ✍️</span>
            </button>
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-none">
          {activeTab === 'library' ? (
            /* مكتبة الأوراد المقترحة */
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">
                انقر على أي ورد لإضافته فوراً إلى جدول أورادك اليومية:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_AWRAD.map((item) => {
                  const isAdded = addedIds[item.id] || existingHabitTitles.includes(item.title);
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                        isAdded
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800 border-gray-200/80 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                        <div>
                          <div className="font-bold text-xs text-gray-900 dark:text-white leading-snug">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 font-serif">
                            {item.benefit}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-slate-750">
                        <span className="text-[10px] font-mono text-gray-400">
                          {item.timeHint}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddSuggested(item)}
                          disabled={isAdded}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>مُضاف</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>إضافة</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* كتابة ورد مخصص */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  اسم العادة أو الورد: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: قراءة في كتاب، صلة الرحم، درس علم..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm transition-all placeholder:text-gray-400"
                  autoFocus
                />
                {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
              </div>

              {/* اختيار التصنيف */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  التصنيف:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        category === cat.label
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* وقت الإنجاز المقترح */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  وقت الإنجاز المقترح (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: بعد العصر، قبل النوم، نصف ساعة يومياً"
                  value={timeHint}
                  onChange={(e) => setTimeHint(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-emerald-600 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 cursor-pointer transition-all active:scale-[0.98]"
                >
                  إضافة الورد إلى يومي 🌿
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
