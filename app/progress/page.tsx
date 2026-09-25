'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Header } from '../../components/Header';
import { CalendarManager } from '../../components/CalendarManager';
import { fetchMonthLogs, getUserRealStreak } from '../actions/habits';
import { Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getSavedLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../../lib/translations';

export default function ProgressPage() {
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [user, setUser] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [initialLogs, setInitialLogs] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const handleLang = (e: any) => setLang(e?.detail?.lang || getSavedLanguage());
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        try {
          const logs = await fetchMonthLogs(currentYear, currentMonth);
          const streak = await getUserRealStreak();
          setInitialLogs(logs);
          setCurrentStreak(streak);
        } catch (e) {
          console.warn('Error fetching progress initial logs:', e);
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-28 sm:pb-12">
      <Header userStreak={currentStreak} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* عنوان الصفحة الرئيسي */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span>{t('progressTitle', lang)}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-xs sm:text-sm">
              {t('progressSubtitle', lang)}
            </p>
          </div>

          <Link
            href="/"
            className="self-start sm:self-auto px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            {t('backToHome', lang)}
          </Link>
        </div>

        {/* تنبيه وضع الضيف إذا لم يكن مسجلاً */}
        {!user && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                {t('guestProgressNotice', lang)}
              </p>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shrink-0 text-center shadow-xs"
            >
              {t('signIn', lang)}
            </Link>
          </div>
        )}

        {/* المكون التفاعلي للتقويم الشهري والسنوي والاستدراك */}
        <CalendarManager
          initialLogs={initialLogs}
          initialStreak={currentStreak}
          isLoggedIn={!!user}
        />

      </main>
    </div>
  );
}
