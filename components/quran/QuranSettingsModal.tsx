'use client';

import React from 'react';
import { ReadingTheme } from './types';
import { X, SlidersHorizontal, Moon, Sun, BookOpen } from 'lucide-react';

interface QuranSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ReadingTheme;
  onChangeTheme: (theme: ReadingTheme) => void;
  fontSize: 'sm' | 'md' | 'lg';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg') => void;
  is3DMode: boolean;
  onToggle3DMode: () => void;
}

export const QuranSettingsModal: React.FC<QuranSettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onChangeTheme,
  fontSize,
  onChangeFontSize,
  is3DMode,
  onToggle3DMode,
}) => {
  if (!isOpen) return null;

  const THEMES: { id: ReadingTheme; label: string; desc: string; bg: string; border: string }[] = [
    {
      id: 'parchment',
      label: 'ورق المصحف الأصيل',
      desc: 'لون عاجي دافئ مريح للعين يحاكي ورق مصحف المدينة',
      bg: 'bg-[#FAF7EE] text-[#1F1D1A]',
      border: 'border-[#C5A059]',
    },
    {
      id: 'night',
      label: 'القراءة الليلية الفاخرة',
      desc: 'خلفية داكنة فخمة مع حواف مذهبة للقراءة في الظلام',
      bg: 'bg-[#0F172A] text-slate-100',
      border: 'border-[#94783E]',
    },
    {
      id: 'clean',
      label: 'الصفاء الناصع',
      desc: 'خلفية بيضاء نقية مع لمسات إسلامية زمردية',
      bg: 'bg-white text-slate-900',
      border: 'border-emerald-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">إعدادات راحة القراءة</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= ثيم ولون الورق ================= */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
            لون ومظهر ورق المصحف:
          </label>
          <div className="space-y-2">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => onChangeTheme(th.id)}
                className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  th.bg
                } ${
                  theme === th.id
                    ? `${th.border} border-2 shadow-md scale-[1.01]`
                    : 'border-gray-200/80 dark:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm font-serif">{th.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{th.desc}</div>
                </div>
                {theme === th.id && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    مفعّل
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= حجم الخط العثماني ================= */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
            حجم الخط القرآني:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'sm', label: 'عادي' },
                { id: 'md', label: 'كبير' },
                { id: 'lg', label: 'جلي' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeFontSize(item.id)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  fontSize === item.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-emerald-300'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= وضع المصحف ثلاثي الأبعاد (للكمبيوتر) ================= */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 hidden lg:block">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                المصحف ثلاثي الأبعاد (صفحتان متقابلتان)
              </span>
              <span className="text-[10px] text-gray-400">
                عرض تجربة المصحف المفتوح مع أنيميشن تقليب الصفحات
              </span>
            </div>

            <button
              type="button"
              onClick={onToggle3DMode}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                is3DMode ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  is3DMode ? 'right-6' : 'right-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 transition-colors"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
};
