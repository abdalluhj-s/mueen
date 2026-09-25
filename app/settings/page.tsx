'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Palette, 
  Clock, 
  Calendar, 
  Type, 
  Moon, 
  Sun, 
  User, 
  LogIn, 
  LogOut, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Globe,
  Sliders,
  Info,
  ChevronDown,
  Languages,
  BellRing,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Link as LinkIcon
} from 'lucide-react';
import { SHARE_CONTENT } from '../../lib/shareContent';
import { Header } from '../../components/Header';
import { createClient } from '../../lib/supabase/client';
import { ProfileEditModal } from '../../components/ProfileEditModal';
import { InstallAppModal } from '../../components/InstallAppModal';
import { NotificationSettingsCard } from '../../components/NotificationSettingsCard';
import { 
  COLOR_THEMES, 
  SUPPORTED_COUNTRIES, 
  getSavedCountryId, 
  getSavedHijriAdjustment, 
  getSavedColorTheme, 
  saveColorTheme, 
  saveCountryId, 
  saveHijriAdjustment, 
  getCountryDateTime 
} from '../../lib/timeSettings';
import { 
  getSavedLanguage, 
  saveLanguage, 
  Language, 
  LANGUAGE_CHANGE_EVENT, 
  t 
} from '../../lib/translations';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  // لغة التطبيق
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());

  // حالات طي وفتح الأقسام (Collapsible Accordions - الأصل في حالة الطي)
  const [openSections, setOpenSections] = useState({
    language: false,
    colors: false,
    fontSize: false,
    country: false,
    notifications: false,
    share: false,
    install: false,
    account: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // إعدادات المظهر واللون
  const [activeTheme, setActiveTheme] = useState<string>('emerald');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // إعدادات الدولة والتوقيت والتاريخ الهجري
  const [selectedCountryId, setSelectedCountryId] = useState<string>('auto');
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(0);
  const [currentTimeData, setCurrentTimeData] = useState<{
    timeString: string;
    gregorianDate: string;
    hijriDate: string;
  }>({
    timeString: '',
    gregorianDate: '',
    hijriDate: '',
  });

  // حالة تثبيت PWA
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  // حالة مشاركة المنصة والتطبيق (Bilingual Share Hub)
  const [selectedShareLang, setSelectedShareLang] = useState<Language>(() => getSavedLanguage());
  const [shareCopiedType, setShareCopiedType] = useState<'none' | 'full' | 'link'>('none');
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);

  const handleCopyShareFull = async () => {
    const text = SHARE_CONTENT[selectedShareLang].text;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareCopiedType('full');
    setTimeout(() => setShareCopiedType('none'), 3000);
  };

  const handleCopyShareLink = async () => {
    const url = SHARE_CONTENT[selectedShareLang].url;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareCopiedType('link');
    setTimeout(() => setShareCopiedType('none'), 3000);
  };

  const handleNativeShare = async () => {
    const item = SHARE_CONTENT[selectedShareLang];
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.shortSummary,
          url: item.url,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyShareFull();
        }
      }
    } else {
      handleCopyShareFull();
    }
  };

  // تحميل الإعدادات عند البدء
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentLang = getSavedLanguage();
      setLang(currentLang);
      document.documentElement.setAttribute('lang', currentLang);
      document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

      // 1. اللون
      const savedTheme = getSavedColorTheme();
      setActiveTheme(savedTheme);

      // 2. حجم الخط
      const savedFont = (localStorage.getItem('mueen_font_size') as 'sm' | 'md' | 'lg') || 'md';
      setFontSize(savedFont);

      // 3. الوضع الليلي
      const isDark = document.documentElement.classList.contains('dark') ||
        localStorage.getItem('mueen_theme') === 'dark';
      setIsDarkMode(isDark);

      // 4. الدولة والتاريخ الهجري
      const countryId = getSavedCountryId();
      const adjustment = getSavedHijriAdjustment();
      setSelectedCountryId(countryId);
      setHijriAdjustment(adjustment);

      // 5. فحص وضع التطبيق
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));
      setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);

      // جلب المستخدم الحالي
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
        setIsAuthLoading(false);
      });

      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      const handleLangChange = (e: any) => {
        setLang(e?.detail?.lang || getSavedLanguage());
      };
      window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
      };
    }
  }, []);

  // تحديث الساعة والتاريخ
  useEffect(() => {
    const updateTime = () => {
      const info = getCountryDateTime(selectedCountryId, hijriAdjustment);
      setCurrentTimeData({
        timeString: info.timeString,
        gregorianDate: info.gregorianDate,
        hijriDate: info.hijriDate,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedCountryId, hijriAdjustment]);

  // تغيير اللغة
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  // تغيير اللون
  const handleColorChange = (themeId: string) => {
    setActiveTheme(themeId);
    saveColorTheme(themeId);
  };

  // تغيير حجم الخط
  const handleFontChange = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mueen_font_size', size);
      document.documentElement.setAttribute('data-font-size', size);
    }
  };

  // تبديل الوضع الليلي
  const handleThemeModeToggle = () => {
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

  // تغيير الدولة والتوقيت
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    saveCountryId(countryId);
  };

  // تعديل التاريخ الهجري
  const handleHijriAdjustmentChange = (days: number) => {
    setHijriAdjustment(days);
    saveHijriAdjustment(days);
  };

  // تسجيل الخروج
  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      window.location.reload();
    } catch (err) {
      console.error('خطأ في تسجيل الخروج:', err);
    }
  };

  const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || t('guestUser', lang);
  const userAvatar = localAvatar || currentUser?.user_metadata?.avatar_url;
  const currentThemeObj = COLOR_THEMES.find((t) => t.id === activeTheme) || COLOR_THEMES[0];
  const currentCountryObj = SUPPORTED_COUNTRIES.find((c) => c.id === selectedCountryId) || SUPPORTED_COUNTRIES[0];

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* ترويسة الصفحة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-1">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <span>{t('home', lang)}</span>
              </Link>
              <span>/</span>
              <span>{t('settings', lang)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                <Settings className="w-6 h-6" />
              </span>
              {t('settingsTitle', lang)}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              {t('settingsSubtitle', lang)}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-center"
          >
            <span>{t('backToHome', lang)}</span>
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* ================= 1. قسم اختيار اللغة (Language Selection) [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('language')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('selectLanguage', lang)}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                    {lang === 'ar' ? 'العربية 🇪🇬' : 'English 🇬🇧'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('languageDesc', lang)}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.language ? 'rotate-180' : ''}`} />
          </div>

          {openSections.language && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-gray-50/70 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇪🇬</span>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">العربية (Arabic)</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">تخطيط أصيل من اليمين لليسار (RTL)</div>
                  </div>
                </div>
                {lang === 'ar' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  lang === 'en'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-gray-50/70 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">English (الإنجليزية)</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Full English Translation & LTR layout</div>
                  </div>
                </div>
                {lang === 'en' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            </div>
          )}
        </section>

        {/* ================= 2. قسم ألوان المنصة (Color Themes) [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('colorThemes', lang)}
                  </h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-bold">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentThemeObj.colorHex }} />
                    <span>{currentThemeObj.name}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {lang === 'en' ? 'Choose the visual palette that brings peace to your eyes.' : 'اختر اللون الذي يريح عينيك ويمنحك الطمأنينة أثناء القراءة والمتابعة'}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.colors ? 'rotate-180' : ''}`} />
          </div>

          {openSections.colors && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in duration-200">
              {COLOR_THEMES.map((theme) => {
                const isSelected = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleColorChange(theme.id)}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-gray-200/70 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-5 h-5 rounded-full shadow-inner border border-white/40 shrink-0"
                          style={{ backgroundColor: theme.colorHex }}
                        />
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                          {theme.name}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('completed', lang)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {theme.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= 3. قسم حجم الخط والوضع الليلي (Font Size & Night Mode) [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('fontSize')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('fontSizeHeading', lang)}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                    {fontSize === 'sm' ? 'خط صغير (أ-)' : fontSize === 'lg' ? 'خط كبير (أ+)' : 'خط قياسي (أ)'} • {isDarkMode ? 'الوضع الليلي 🌙' : 'الوضع النهاري ☀️'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {lang === 'en' ? 'Control app font scale and dark/light mode for eye comfort.' : 'تحكم بحجم نصوص الأوراد والمصحف والأذكار والوضع الليلي لراحة عينيك'}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.fontSize ? 'rotate-180' : ''}`} />
          </div>

          {openSections.fontSize && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-200">
              {/* مقياس حجم الخط */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {lang === 'en' ? 'General Font Scale:' : 'حجم الخط العام:'}
                </span>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200/80 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleFontChange('sm')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      fontSize === 'sm'
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-extrabold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:white'
                    }`}
                  >
                    صغير (A-)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFontChange('md')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      fontSize === 'md'
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-extrabold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:white'
                    }`}
                  >
                    قياسي (A)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFontChange('lg')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      fontSize === 'lg'
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-extrabold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:white'
                    }`}
                  >
                    كبير (A+)
                  </button>
                </div>
              </div>

              {/* تبديل الوضع الليلي والنهاري */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {lang === 'en' ? 'Dark / Light Mode:' : 'الوضع الليلي والنهاري:'}
                </span>
                <button
                  type="button"
                  onClick={handleThemeModeToggle}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 hover:border-emerald-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                      {isDarkMode ? 'الوضع الليلي مفعّل (Dark)' : 'الوضع النهاري مفعّل (Light)'}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                    {lang === 'en' ? 'Switch' : 'تبديل النمط'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ================= 4. قسم الدولة والتوقيت والتاريخ الهجري [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('country')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('countryTimeHeading', lang)}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                    {currentCountryObj.flag} {currentCountryObj.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {lang === 'en' ? 'Set your country time and calibrate Hijri date to match your moon sighting.' : 'حدد دولتك لضبط مواعيد أورادك وساعتك، واضبط التاريخ الهجري ليطابق رؤية الهلال'}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.country ? 'rotate-180' : ''}`} />
          </div>

          {openSections.country && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 space-y-5 animate-in fade-in duration-200">
              {/* لوحة العرض الحية للتوقيت والتاريخ */}
              <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div>
                    <div className="text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>
                        توقيت: {currentCountryObj.flag} {currentCountryObj.name}
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black tracking-tight mt-1 font-mono">
                      {currentTimeData.timeString || '00:00:00'}
                    </div>
                  </div>

                  <div className="text-right sm:text-left bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-center">
                    <div className="text-xs sm:text-sm font-bold text-amber-200 font-serif">
                      {currentTimeData.hijriDate}
                    </div>
                    <div className="text-[11px] text-emerald-100/90 mt-0.5">
                      {currentTimeData.gregorianDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* قائمة اختيار الدولة */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {lang === 'en' ? 'Select Country / City:' : 'اختر دولتك أو مدينتك لتحديد التوقيت:'}
                </label>
                <select
                  value={selectedCountryId}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  {SUPPORTED_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id} className="dark:bg-slate-900">
                      {c.flag} {c.name} — ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* معايرة التاريخ الهجري */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    {lang === 'en' ? 'Calibrate Hijri Date (Local Sighting):' : 'ضبط مطابقة التاريخ الهجري (الرؤية المحلية):'}
                  </label>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                    {hijriAdjustment === 0
                      ? (lang === 'en' ? 'Auto (0)' : 'تطابق تلقائي')
                      : hijriAdjustment > 0
                      ? `+${hijriAdjustment} ${lang === 'en' ? 'day' : 'يوم'}`
                      : `${hijriAdjustment} ${lang === 'en' ? 'day' : 'يوم'}`}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {[-2, -1, 0, 1, 2].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => handleHijriAdjustmentChange(days)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        hijriAdjustment === days
                          ? 'bg-emerald-600 text-white shadow-xs scale-102'
                          : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {days === 0 ? '0' : days > 0 ? `+${days}` : `${days}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================= 5. قسم إشعارات الهاتف وتنبيهات الأوراد [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('notifications')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('notificationsHeading', lang)}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                    {lang === 'en' ? 'Push & Sound' : 'إشعارات خارجية + نغمة 🔔'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {lang === 'en' ? 'Scheduled alerts for prayers, adhkar, and daily hadith.' : 'تنبيهات مجدولة لأذكار الصباح والمساء والوتر وساعة الجمعة وحديث اليوم'}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.notifications ? 'rotate-180' : ''}`} />
          </div>

          {openSections.notifications && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 animate-in fade-in duration-200">
              <NotificationSettingsCard />
            </div>
          )}
        </section>

        {/* ================= 6. قسم مشاركة المنصة والتطبيق (Bilingual Share Hub) [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('share')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('shareAppTitle', lang)}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                    {selectedShareLang === 'ar' ? 'عربي 🇸🇦' : 'English 🇬🇧'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('shareAppSubtitle', lang)}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.share ? 'rotate-180' : ''}`} />
          </div>

          {openSections.share && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
              {/* شريط تبديل لغة المشاركة (عربي / إنجليزي) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span>{lang === 'ar' ? 'اختر لغة الوصف والرابط للمشاركة:' : 'Choose sharing language & link:'}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    {selectedShareLang === 'ar' ? 'Arabic ?lang=ar' : 'English ?lang=en'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 dark:bg-slate-800/80 rounded-2xl border border-gray-200/80 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => { setSelectedShareLang('ar'); setShareCopiedType('none'); }}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedShareLang === 'ar'
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t('shareLangTabAr', lang)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedShareLang('en'); setShareCopiedType('none'); }}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedShareLang === 'en'
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t('shareLangTabEn', lang)}</span>
                  </button>
                </div>
              </div>

              {/* تنبيه نجاح النسخ الإيجابي */}
              {shareCopiedType !== 'none' && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200 shadow-xs">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-semibold">
                    {shareCopiedType === 'full' ? t('copiedSuccessToast', lang) : t('copiedLinkToast', lang)}
                  </span>
                </div>
              )}

              {/* شريط الرابط المباشر السريع */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono" dir="ltr">
                  <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{SHARE_CONTENT[selectedShareLang].url}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  title={t('copyLinkOnly', lang)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                >
                  {shareCopiedType === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{t('copyLinkOnly', lang).replace(' 🔗', '')}</span>
                </button>
              </div>

              {/* معاينة النص الكامل المخصص للمشاركة */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {lang === 'ar' ? 'معاينة نص الرسالة التي ستُرسل:' : 'Message preview:'}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {selectedShareLang === 'ar' ? 'لغة عربية' : 'English'}
                  </span>
                </div>

                <div 
                  dir={selectedShareLang === 'ar' ? 'rtl' : 'ltr'}
                  className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200/80 dark:border-slate-800 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans max-h-56 overflow-y-auto select-all whitespace-pre-line shadow-inner"
                >
                  {SHARE_CONTENT[selectedShareLang].text}
                </div>
              </div>

              {/* أزرار المشاركة المباشرة عبر شبكات التواصل */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {lang === 'ar' ? 'مشاركة فورية عبر:' : 'Quick share via:'}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_CONTENT[selectedShareLang].text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{t('shareWhatsApp', lang)}</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(SHARE_CONTENT[selectedShareLang].url)}&text=${encodeURIComponent(SHARE_CONTENT[selectedShareLang].shortSummary)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
                  >
                    <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{t('shareTelegram', lang)}</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CONTENT[selectedShareLang].shortSummary)}&url=${encodeURIComponent(SHARE_CONTENT[selectedShareLang].url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-2xl bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 border border-gray-400/30 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
                  >
                    <span className="font-mono text-sm group-hover:scale-110 transition-transform">𝕏</span>
                    <span>{t('shareTwitter', lang)}</span>
                  </a>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyShareFull}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-[0.98]"
                >
                  {shareCopiedType === 'full' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('copiedSuccessToast', lang)}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t('copyFullMessage', lang)}</span>
                    </>
                  )}
                </button>

                {canNativeShare && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300/80 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700/80 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('nativeShareBtn', lang)}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ================= 7. قسم تثبيت التطبيق على الجهاز (PWA) [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('install')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('pwaHeading', lang)}
                  </h2>
                  {isStandalone && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('installed', lang)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {lang === 'en' ? 'Fast standalone app experience without browser URL bars.' : 'استخدم مُعين كتطبيق أصلي سريع يفتح بملء الشاشة بدون شريط المتصفح'}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.install ? 'rotate-180' : ''}`} />
          </div>

          {openSections.install && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in duration-200">
              <div className="space-y-1">
                <p className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                  {isStandalone
                    ? (lang === 'en' ? 'You are using Mueen via the installed PWA on your device 📱' : 'أنت تستخدم مُعين حالياً عبر التطبيق المثبت على جهازك 📱')
                    : (lang === 'en' ? 'Install Mueen as a full app on your phone or laptop in 1-click 📲' : 'يمكنك تثبيت مُعين على هاتفك أو كمبيوترك بضغطة زر واحدة 📲')}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'en' ? 'Works offline, supports full notifications, and launches instantly.' : 'يعمل كأي تطبيق أصلي مع فتح فوري وشاشة كاملة'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInstallModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isStandalone ? (lang === 'en' ? 'App Guide' : 'إرشادات التطبيق') : (lang === 'en' ? 'Install Now' : 'تثبيت التطبيق الآن')}</span>
              </button>
            </div>
          )}
        </section>

        {/* ================= 8. قسم الحساب والمزامنة [قابل للطي] ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200/70 dark:border-slate-800 transition-all">
          <div
            onClick={() => toggleSection('account')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {t('accountHeading', lang)}
                  </h2>
                  {currentUser && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {lang === 'en' ? 'Cloud Synced' : 'سحابي نشط'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {userName} {currentUser?.email ? `(${currentUser.email})` : ''}
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections.account ? 'rotate-180' : ''}`} />
          </div>

          {openSections.account && (
            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-slate-800 animate-in fade-in duration-200">
              {!isAuthLoading && (
                currentUser ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-black text-xl overflow-hidden shadow-xs shrink-0">
                        {userAvatar ? (
                          <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          userName.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          {userName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {currentUser.email}
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                          ✓ {lang === 'en' ? 'Your awrad and streaks are securely synced to the cloud' : 'بياناتك وأورادك وسجلك الشهري محفوظة سحابياً'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setIsProfileModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        {lang === 'en' ? 'Edit Profile' : 'تعديل الاسم والصورة'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('signOut', lang)}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/60">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100">
                        {lang === 'en' ? 'Browsing as Guest 📱' : 'أنت تتصفح المنصة حالياً كـ «ضيف» 📱'}
                      </h3>
                      <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed max-w-xl">
                        {lang === 'en' ? 'Sign in to sync your deeds across devices and challenge your partner.' : 'إنجازاتك اليومية تُحفظ على جهازك الحالي فقط. سجّل الدخول مجاناً لحفظ سجلك الشهري ومزامنة عاداتك عبر أجهزتك.'}
                      </p>
                    </div>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t('signIn', lang)}</span>
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ================= تذييل الصفحة ================= */}
        <section className="text-center py-6 border-t border-gray-200/60 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-xl overflow-hidden shadow-2xs border border-emerald-500/30">
              <img src="/logo.jpg" alt="Mueen Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-sm text-gray-900 dark:text-white">
              {t('appName', lang)} • {t('appTagline', lang)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            «مُعين» • جعله الله عملاً خالصاً لوجهه الكريم
          </p>
        </section>
      </main>

      {/* نافذة تعديل الملف الشخصي */}
      {currentUser && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentName={userName}
          currentAvatar={userAvatar}
          onProfileUpdated={({ fullName, avatarUrl }) => {
            setLocalAvatar(avatarUrl);
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
        onNativeInstall={async () => {
          if (deferredPrompt) {
            try {
              deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              if (outcome === 'accepted') setIsStandalone(true);
            } catch {}
          }
        }}
        hasNativePrompt={!!deferredPrompt}
        isIOS={isIOS}
      />
    </div>
  );
}
