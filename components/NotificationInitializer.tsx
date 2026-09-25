'use client';

import React, { useEffect, useState } from 'react';
import { registerServiceWorker, checkAndTriggerScheduledNotifications } from '../lib/notifications';
import { getSavedLanguage, LANGUAGE_CHANGE_EVENT } from '../lib/translations';
import { Bell, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ToastData {
  id: number;
  title: string;
  body: string;
  url: string;
}

export const NotificationInitializer = () => {
  const [activeToast, setActiveToast] = useState<ToastData | null>(null);

  useEffect(() => {
    // 1. تطبيق اللغة والاتجاه المخزن (RTL / LTR)
    const initialLang = getSavedLanguage();
    document.documentElement.setAttribute('lang', initialLang);
    document.documentElement.setAttribute('dir', initialLang === 'ar' ? 'rtl' : 'ltr');

    const handleLangChange = (e: any) => {
      const newLang = e?.detail?.lang || getSavedLanguage();
      document.documentElement.setAttribute('lang', newLang);
      document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);

    // 2. تسجيل الـ Service Worker
    registerServiceWorker();

    // 3. فحص أولي للإشعارات المجدولة
    checkAndTriggerScheduledNotifications();

    // 4. فاحص دوري كل 60 ثانية
    const timer = setInterval(() => {
      checkAndTriggerScheduledNotifications();
    }, 60000);

    // 5. الاستماع لأحداث الإشعار المرئي الفوري داخل التطبيق
    const handleToastEvent = (e: any) => {
      if (e.detail) {
        const toast = {
          id: Date.now(),
          title: e.detail.title,
          body: e.detail.body,
          url: e.detail.url || '/',
        };
        setActiveToast(toast);
        // إخفاء التنبيه تلقائياً بعد 6 ثوانٍ
        setTimeout(() => {
          setActiveToast((current) => (current?.id === toast.id ? null : current));
        }, 6000);
      }
    };
    window.addEventListener('mueen_inapp_toast', handleToastEvent);

    return () => {
      clearInterval(timer);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
      window.removeEventListener('mueen_inapp_toast', handleToastEvent);
    };
  }, []);

  if (!activeToast) return null;

  return (
    <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:left-6 sm:right-6 max-w-md mx-auto z-[9999] animate-in slide-in-from-top-6 duration-300 pointer-events-auto">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500 rounded-3xl p-4 shadow-2xl flex items-start gap-3.5 ring-4 ring-emerald-500/20">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
              {activeToast.title}
            </h4>
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
            {activeToast.body}
          </p>
          {activeToast.url && (
            <Link
              href={activeToast.url}
              onClick={() => setActiveToast(null)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline pt-1"
            >
              <span>فتح القسم</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
