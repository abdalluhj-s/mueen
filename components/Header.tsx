'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import Link from 'next/link';
import { getSavedLanguage, saveLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../lib/translations';

interface HeaderProps {
  userStreak?: number;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    saveLanguage(nextLang);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('mueen_theme') === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }

      const savedSize = (localStorage.getItem('mueen_font_size') as 'sm' | 'md' | 'lg') || 'md';
      setFontSize(savedSize);
      document.documentElement.setAttribute('data-font-size', savedSize);

      const handleLangChange = (e: any) => {
        setLang(e?.detail?.lang || getSavedLanguage());
      };

      window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
      return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
    }
  }, []);

  const changeFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mueen_font_size', size);
      document.documentElement.setAttribute('data-font-size', size);
    }
  };

  const cycleFontSize = () => {
    const nextSize = fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'sm';
    changeFontSize(nextSize);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mueen_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mueen_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* الشعار واسم المنصة (مُعين أو Mueen حسب اللغة) */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-500/30 flex items-center justify-center bg-slate-900 shrink-0">
            <img src="/logo.jpg" alt={lang === 'ar' ? 'شعار مُعين' : 'Mueen Logo'} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
              {lang === 'ar' ? 'مُعين' : 'Mueen'}
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-800/60">
                {t('appTagline', lang)}
              </span>
            </h1>
          </div>
        </Link>

        {/* أدوات التحكم العلوية المختصرة المحددة بدقة: التحكم في الخط، الدارك مود، وتبديل اللغة */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* زر حجم الخط الذكي: يتبدل بنقرة واحدة بحلقة ثلاثية (صغير -> قياسي -> كبير) */}
          <button
            type="button"
            onClick={cycleFontSize}
            title={lang === 'ar' ? `حجم الخط: ${fontSize === 'sm' ? 'صغير' : fontSize === 'md' ? 'قياسي' : 'كبير'} (اضغط للتبديل)` : `Font size: ${fontSize.toUpperCase()} (Click to cycle)`}
            aria-label={t('fontSizeLabel', lang)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:border-emerald-400 transition-all font-bold cursor-pointer shadow-2xs shrink-0"
          >
            <span className={fontSize === 'sm' ? 'text-[11px]' : fontSize === 'md' ? 'text-xs font-bold' : 'text-sm font-black text-emerald-600'}>
              A
            </span>
            <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono ml-0.5">
              {fontSize === 'sm' ? '₁' : fontSize === 'md' ? '₂' : '₃'}
            </span>
          </button>

          {/* زر تبديل الوضع الليلي (Dark Mode Toggle) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={t('themeModeLabel', lang)}
            aria-label={t('themeModeLabel', lang)}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 animate-in spin-in-180 duration-200" />
            )}
          </button>

          {/* زر تبديل اللغة السريع (عربي / EN) */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            aria-label="تبديل اللغة"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shrink-0"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
