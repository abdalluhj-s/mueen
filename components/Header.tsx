'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Flame, Bell, BellRing, User, LogIn, LogOut, CheckCheck, ShieldCheck, HeartHandshake, Calendar, Sun, Moon, BookMarked, Settings, Download, CheckCircle2, Languages } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../lib/supabase/client';
import { ProfileEditModal } from './ProfileEditModal';
import { InstallAppModal } from './InstallAppModal';
import { getSavedLanguage, saveLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../lib/translations';

interface HeaderProps {
  userStreak?: number;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'partner' | 'reminder' | 'streak';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'تذكير الورد المسائي',
    desc: 'لا تنسَ أذكار المساء وسورة الملك قبل النوم 🌿',
    time: 'منذ ساعة',
    unread: true,
    type: 'reminder',
  },
  {
    id: 'n2',
    title: 'تحفيز الشريك',
    desc: '«المؤمن للمؤمن كالبنيان يشد بعضه بعضاً» - واصل التزامك اليومي!',
    time: 'منذ 3 ساعات',
    unread: true,
    type: 'partner',
  },
  {
    id: 'n3',
    title: 'إنجاز متواصل',
    desc: 'مبارك مواصلتك لليوم التاسع على التوالي في أداء الصلوات 🌟',
    time: 'أمس',
    unread: false,
    type: 'streak',
  },
];

export const Header: React.FC<HeaderProps> = ({ userStreak = 9 }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());

  // حالة تثبيت التطبيق PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    saveLanguage(nextLang);
  };

  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // قراءة حالة الثيم الحالي وحجم الخط وتثبيت التطبيق
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') ||
        localStorage.getItem('mueen_theme') === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }

      const savedSize = (localStorage.getItem('mueen_font_size') as 'sm' | 'md' | 'lg') || 'md';
      setFontSize(savedSize);
      document.documentElement.setAttribute('data-font-size', savedSize);

      // فحص هل التطبيق مفتوح مسبقاً كـ PWA مستقل
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      // فحص أجهزة iOS
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));

      // التقاط حدث التثبيت للمتصفحات المدعومة
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      const handleLangChange = (e: any) => {
        setLang(e?.detail?.lang || getSavedLanguage());
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsStandalone(true);
        }
      } catch {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

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

  useEffect(() => {
    const supabase = createClient();

    // جلب الجلسة الحالية
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    }).catch(() => {
      setIsAuthLoading(false);
    });

    // الاستماع لتغييرات حالة تسجيل الدخول
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mueen_user_avatar');
      if (saved) setLocalAvatar(saved);
    }
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsProfileOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('خطأ في تسجيل الخروج:', err);
    }
  };

  const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || t('guestUser', lang);
  const userAvatar = localAvatar || currentUser?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

        {/* معلومات المستخدم وسلسلة الالتزام والأدوات المختصرة الأنيقة */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* زر الأذكار: شكل الكتاب فقط */}
          <Link 
            href="/adhkar"
            title={t('adhkar', lang)}
            aria-label={t('adhkar', lang)}
            className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border border-emerald-200/70 dark:border-emerald-800 shrink-0 shadow-2xs"
          >
            <BookMarked className="w-4 h-4" />
          </Link>

          {/* زر السجل: شكل النتيجة فقط */}
          <Link 
            href="/progress"
            title={t('progress', lang)}
            aria-label={t('progress', lang)}
            className="p-2 rounded-full bg-gray-50 dark:bg-slate-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-200/70 dark:border-slate-700 shrink-0 shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </Link>

          {/* عداد الالتزام: الشعلة مع عدد الأيام مقتضباً (مثل: 3 أيام 🔥) */}
          <div 
            title={t('streak', lang)}
            className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 sm:px-2.5 py-1 rounded-full border border-amber-200/70 dark:border-amber-800/70 text-xs font-bold shadow-2xs shrink-0"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>
              {userStreak} {lang === 'ar' ? (userStreak === 1 ? 'يوم' : userStreak === 2 ? 'يومان' : 'أيام') : (userStreak === 1 ? 'day' : 'days')}
            </span>
          </div>

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

          {/* زر تثبيت التطبيق: سهم الداونلود فقط */}
          {!isStandalone ? (
            <button
              type="button"
              onClick={handleInstallClick}
              title={t('installApp', lang)}
              aria-label={t('installApp', lang)}
              className="p-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
            </button>
          ) : (
            <span
              title={t('installed', lang)}
              className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </span>
          )}

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

          {/* زر الإعدادات والتخصيص */}
          <Link
            href="/settings"
            title={t('settings', lang)}
            aria-label={t('settings', lang)}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* قائمة التنبيهات (Notification Dropdown المتجاوبة والآمنة للشاشات الصغيرة) */}
          <div className="relative" ref={bellRef}>
            <button
              type="button"
              aria-label="التنبيهات"
              onClick={() => {
                setIsBellOpen(!isBellOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* نافذة التنبيهات المنبثقة المحمية من الخروج خارج شاشة الموبايل */}
            {isBellOpen && (
              <>
                {/* خلفية شبه شفافة للموبايل لإغلاق القائمة بسلاسة */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 sm:hidden"
                  onClick={() => setIsBellOpen(false)}
                />
                <div
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  className={`fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto ${
                    lang === 'ar' ? 'sm:left-0 sm:right-auto' : 'sm:right-0 sm:left-auto'
                  } sm:top-full sm:mt-2 w-auto sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{t('notifications', lang)}</span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-md">
                          {unreadCount} {t('newBadge', lang)}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{t('markAllRead', lang)}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-2xl border text-xs transition-colors ${
                            notif.unread
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-gray-800 dark:text-gray-200'
                              : 'bg-gray-50/60 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1 text-gray-900 dark:text-white">
                            <span className="flex items-center gap-1.5">
                              {notif.type === 'partner' && <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />}
                              {notif.type === 'reminder' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                              {notif.type === 'streak' && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                              <span>{notif.title}</span>
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">{notif.time}</span>
                          </div>
                          <p className={`text-gray-600 dark:text-gray-400 leading-relaxed text-[11px] ${lang === 'ar' ? 'pr-5' : 'pl-5'}`}>{notif.desc}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">{t('noNotifications', lang)}</p>
                    )}
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setIsBellOpen(false)}
                    className="mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs"
                  >
                    <BellRing className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('adjustNotifications', lang)}</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* حساب المستخدم أو زر تسجيل الدخول */}
          {!isAuthLoading && (
            currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsBellOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-semibold text-sm hover:ring-2 hover:ring-emerald-400/50 transition-all cursor-pointer overflow-hidden"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0)
                  )}
                </button>

                {/* قائمة الملف الشخصي المنبثقة المحمية من الخروج خارج شاشة الموبايل */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 sm:hidden"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      className={`fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto ${
                        lang === 'ar' ? 'sm:left-0 sm:right-auto' : 'sm:right-0 sm:left-auto'
                      } sm:top-full sm:mt-2 w-auto sm:w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
                    >
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800 mb-2">
                        <div className="font-bold text-gray-900 dark:text-white text-sm truncate">{userName}</div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{currentUser.email}</div>
                      </div>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer mb-1"
                      >
                        <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{t('settings', lang)}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileEditOpen(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer mb-1"
                      >
                        <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{t('editProfile', lang)}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('signOut', lang)}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('signIn', lang)}</span>
                <span className="sm:hidden">{t('signIn', lang)}</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* نافذة تعديل الملف الشخصي */}
      {currentUser && (
        <ProfileEditModal
          isOpen={isProfileEditOpen}
          onClose={() => setIsProfileEditOpen(false)}
          currentName={userName}
          currentAvatar={userAvatar}
          onProfileUpdated={({ fullName, avatarUrl }) => {
            setCurrentUser((prev: any) => ({
              ...prev,
              user_metadata: {
                ...prev?.user_metadata,
                full_name: fullName,
                avatar_url: avatarUrl,
              },
            }));
          }}
        />
      )}

      {/* نافذة إرشادات وخطوات تثبيت التطبيق */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onNativeInstall={handleInstallClick}
        hasNativePrompt={!!deferredPrompt}
        isIOS={isIOS}
      />
    </header>
  );
};
