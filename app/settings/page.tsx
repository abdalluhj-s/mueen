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
  Info
} from 'lucide-react';
import { Header } from '../../components/Header';
import { createClient } from '../../lib/supabase/client';
import { ProfileEditModal } from '../../components/ProfileEditModal';
import { InstallAppModal } from '../../components/InstallAppModal';
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

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

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

  // تحميل الإعدادات عند البدء
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      // الصورة المحلية
      const savedAvatar = localStorage.getItem('mueen_user_avatar');
      if (savedAvatar) setLocalAvatar(savedAvatar);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  // تحديث الساعة الرقمية الحية كل ثانية
  useEffect(() => {
    const updateClock = () => {
      const data = getCountryDateTime(selectedCountryId, hijriAdjustment);
      setCurrentTimeData({
        timeString: data.timeString,
        gregorianDate: data.gregorianDate,
        hijriDate: data.hijriDate,
      });
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [selectedCountryId, hijriAdjustment]);

  // جلب المستخدم
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    }).catch(() => {
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'ضيف مُعين';
  const userAvatar = localAvatar || currentUser?.user_metadata?.avatar_url;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* ترويسة الصفحة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-1">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <span>الرئيسية</span>
              </Link>
              <span>/</span>
              <span>الإعدادات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                <Settings className="w-6 h-6 animate-spin-slow" />
              </span>
              إعدادات التطبيق والتخصيص
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              خصص مظهر المنصة، وألوانها، والتوقيت حسب دولتك، وأدر حسابك وسجلك بسهولة
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-center"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

        {/* ================= 1. قسم الحساب وتسجيل الدخول ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-gray-200/70 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                إدارة الحساب والمزامنة
              </h2>
            </div>
            {currentUser && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                سحابي نشط
              </span>
            )}
          </div>

          {!isAuthLoading && (
            currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-black text-xl overflow-hidden shadow-xs">
                      {userAvatar ? (
                        <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                      ) : (
                        userName.charAt(0)
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {userName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {currentUser.email}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
                      <span>✓ بياناتك وأورادك وسجلك الشهري محفوظة سحابياً</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    تعديل الاسم والصورة
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/60">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100">
                    أنت تتصفح المنصة حالياً كـ «ضيف» 📱
                  </h3>
                  <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed max-w-xl">
                    إنجازاتك اليومية تُحفظ على جهازك الحالي فقط. سجّل الدخول مجاناً لحفظ سجلك الشهري ومزامنة عاداتك عبر أجهزتك ومشاركتها مع رفيقك.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول / إنشاء حساب</span>
                </Link>
              </div>
            )
          )}
        </section>

        {/* ================= 2. قسم ألوان مظهر التطبيق (Color Theme) ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-gray-200/70 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  ألوان المنصة والتطبيق
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  اختر اللون الذي يريح عينيك ويمنحك الطمأنينة أثناء القراءة والمتابعة
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                        المفعل
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
        </section>

        {/* ================= 3. قسم الدولة والتوقيت وضبط التاريخ الهجري ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-gray-200/70 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  الدولة والتوقيت والتاريخ الهجري
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  حدد دولتك لضبط مواعيد أورادك وساعتك، واضبط التاريخ الهجري ليطابق رؤية الهلال
                </p>
              </div>
            </div>
          </div>

          {/* لوحة العرض الحية للتوقيت والتاريخ */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div>
                <div className="text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>
                    توقيت: {SUPPORTED_COUNTRIES.find((c) => c.id === selectedCountryId)?.flag}{' '}
                    {SUPPORTED_COUNTRIES.find((c) => c.id === selectedCountryId)?.name}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                  {currentTimeData.timeString || 'جاري حساب الوقت...'}
                </div>
              </div>

              <div className="text-right sm:text-left bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-center">
                <div className="text-xs sm:text-sm font-bold text-amber-200">
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
              اختر دولتك أو مدينتك لتحديد التوقيت:
            </label>
            <div className="relative">
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
          </div>

          {/* ضبط التاريخ الهجري (تقديم أو تأخير) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  ضبط مطابقة التاريخ الهجري (تقويم أم القرى والرؤية المحلية):
                </label>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  نظراً لاختلاف ثبوت رؤية الهلال من دولة لأخرى، يمكنك تقديم أو تأخير التاريخ الهجري ليطابق رؤية الهلال في بلدك:
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                {hijriAdjustment === 0
                  ? 'تطابق تلقائي'
                  : hijriAdjustment > 0
                  ? `+${hijriAdjustment} يوم`
                  : `${hijriAdjustment} يوم`}
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
                  {days === 0 ? 'تلقائي (0)' : days > 0 ? `+${days} يوم` : `${days} يوم`}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. قسم حجم الخط والوضع الليلي ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-gray-200/70 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  حجم الخط ونمط العرض
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  تحكم بحجم نصوص الأوراد والمصحف والأذكار والوضع الليلي لراحة عينيك
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* مقياس حجم الخط */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                حجم الخط العام:
              </span>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleFontChange('sm')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    fontSize === 'sm'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-extrabold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  صغير (أ-)
                </button>
                <button
                  type="button"
                  onClick={() => handleFontChange('md')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    fontSize === 'md'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-extrabold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  قياسي (أ)
                </button>
                <button
                  type="button"
                  onClick={() => handleFontChange('lg')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    fontSize === 'lg'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-extrabold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  كبير (أ+)
                </button>
              </div>

              {/* معاينة حية للنص */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 text-center">
                <span className="font-quran text-gray-800 dark:text-gray-200">
                  «سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ»
                </span>
              </div>
            </div>

            {/* الوضع الليلي / النهاري */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                مظهر الشاشة:
              </span>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    if (isDarkMode) handleThemeModeToggle();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isDarkMode
                      ? 'bg-white text-emerald-800 shadow-2xs font-black'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>الوضع النهاري</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isDarkMode) handleThemeModeToggle();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-900 text-amber-300 shadow-2xs font-black'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>الوضع الليلي</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-gray-400">
                {isDarkMode ? 'الوضع الليلي مفعّل لحماية العين وتقليل استهلاك البطارية 🌙' : 'الوضع النهاري الواضح للنور والقراءة الساطعة ☀️'}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. قسم تثبيت التطبيق على الجهاز ================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-gray-200/70 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  تثبيت التطبيق على جهازك (PWA)
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  استخدم مُعين كتطبيق أصلي سريع يفتح بملء الشاشة بدون شريط المتصفح
                </p>
              </div>
            </div>
            {isStandalone && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                التطبيق مثبت بالفعل
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="space-y-1">
              <p className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                {isStandalone
                  ? 'أنت تستخدم مُعين حالياً عبر التطبيق المثبت على جهازك 📱'
                  : 'يمكنك تثبيت مُعين على هاتفك أو كمبيوترك بضغطة زر واحدة 📲'}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                يعمل التطبيق على شاشتك الرئيسية كأي تطبيق رسمي مع إمكانية الفتح السريع
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isStandalone ? 'إرشادات التطبيق' : 'تثبيت التطبيق الآن'}</span>
            </button>
          </div>
        </section>

        {/* ================= 6. معلومات عن المنصة ================= */}
        <section className="text-center py-6 border-t border-gray-200/60 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-xl overflow-hidden shadow-2xs border border-emerald-500/30">
              <img src="/logo.jpg" alt="شعار مُعين" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-sm text-gray-900 dark:text-white">
              منصة وتطبيق مُعين • الإصدار 1.2.0
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            «مُعين» رفيقك اليومي لتثبيت العادات الدينية ورفيق الالتزام • جعله الله عملاً خالصاً لوجهه الكريم
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
