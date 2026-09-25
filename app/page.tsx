'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Header } from '../components/Header';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { HabitList } from '../components/HabitList';
import { PartnerCard } from '../components/PartnerCard';
import { PartnerInviteModal } from '../components/PartnerInviteModal';
import { AddHabitModal } from '../components/AddHabitModal';
import { HabitItem, PartnerStatus, PartnerMessage } from '../types/dashboard';
import { toggleHabitCompletion, fetchPartnerProgress, fetchAllPartnersProgress, getUserRealStreak } from './actions/habits';
import { acceptInviteCode, getPartnerMessages } from './actions/partner';
import { createClient } from '../lib/supabase/client';
import { Quote, Sparkles, UserPlus, LogIn, X, CheckCircle, Settings, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { 
  getCountryDateTime, 
  getSavedCountryId, 
  getSavedHijriAdjustment, 
  SETTINGS_CHANGE_EVENT 
} from '../lib/timeSettings';
import { 
  getSavedLanguage, 
  Language, 
  LANGUAGE_CHANGE_EVENT, 
  t 
} from '../lib/translations';
import { getIslamicDayStatus } from '../lib/islamicCalendar';
import Link from 'next/link';

// إصدار العادات الافتراضية — تغييره يؤدي لتحديث القائمة للترتيب الزمني والسنن والصيام
const HABITS_VERSION = 'v5';
const HABITS_KEY = 'mueen_habits';
const VERSION_KEY = 'mueen_habits_version';

const DEFAULT_HABITS: HabitItem[] = [
  // ===== الفجر (الفريضة + السنة + أذكار الصباح) =====
  { id: 'h1', title: 'صلاة الفجر في المسجد مع الجماعة', category: 'صلاة', completed: false, timeSlot: 'fajr', timeHint: 'عند أذان الفجر في المسجد' },
  { id: 'h1_sunnah', title: 'سنة الفجر الراتبة (ركعتان قبلهما)', category: 'سنة', isSunnah: true, completed: false, timeSlot: 'fajr', timeHint: 'قبل الفريضة («خير من الدنيا وما فيها»)' },
  { id: 'h9', title: 'أذكار الصباح والتسبيح', category: 'أذكار', completed: false, timeSlot: 'fajr', timeHint: 'بعد صلاة الفجر حتى الشروق' },

  // ===== الظهر (السنة القبلية + الفريضة + السنة البعدية) =====
  { id: 'h2_sunnah_before', title: 'سنة الظهر القبلية (4 ركعات قبل الفريضة)', category: 'سنة', isSunnah: true, completed: false, timeSlot: 'dhuhr', timeHint: 'أربع ركعات بتسليمتين قبل الظهر' },
  { id: 'h2', title: 'صلاة الظهر في المسجد مع الجماعة', category: 'صلاة', completed: false, timeSlot: 'dhuhr', timeHint: 'عند أذان الظهر في المسجد' },
  { id: 'h2_sunnah_after', title: 'سنة الظهر البعدية (ركعتان بعد الفريضة)', category: 'سنة', isSunnah: true, completed: false, timeSlot: 'dhuhr', timeHint: 'ركعتان بعد صلاة الظهر' },

  // ===== العصر (الفريضة + أذكار المساء) =====
  { id: 'h3', title: 'صلاة العصر في المسجد مع الجماعة', category: 'صلاة', completed: false, timeSlot: 'asr', timeHint: 'عند أذان العصر في المسجد' },
  { id: 'h10', title: 'أذكار المساء وحصن المسلم', category: 'أذكار', completed: false, timeSlot: 'asr', timeHint: 'بعد صلاة العصر حتى غروب الشمس' },

  // ===== المغرب (الفريضة + السنة البعدية) =====
  { id: 'h4', title: 'صلاة المغرب في المسجد مع الجماعة', category: 'صلاة', completed: false, timeSlot: 'maghrib', timeHint: 'عند أذان المغرب في المسجد' },
  { id: 'h4_sunnah', title: 'سنة المغرب البعدية (ركعتان بعد الفريضة)', category: 'سنة', isSunnah: true, completed: false, timeSlot: 'maghrib', timeHint: 'بعد صلاة المغرب مباشرة' },

  // ===== العشاء والليل (الفريضة + السنة البعدية + الشفع والوتر) =====
  { id: 'h5', title: 'صلاة العشاء في المسجد مع الجماعة', category: 'صلاة', completed: false, timeSlot: 'isha', timeHint: 'عند أذان العشاء في المسجد' },
  { id: 'h5_sunnah', title: 'سنة العشاء البعدية (ركعتان بعد الفريضة)', category: 'سنة', isSunnah: true, completed: false, timeSlot: 'isha', timeHint: 'بعد صلاة العشاء مباشرة' },
  { id: 'h7', title: 'صلاة الشفع والوتر وقيام الليل', category: 'صلاة', completed: false, timeSlot: 'night', timeHint: 'في الثلث الأخير أو قبل النوم' },

  // ===== ورد القرآن الكريم =====
  { id: 'h8', title: 'ورد القرآن اليومي (جزء أو نصف حزب أو صفحة)', category: 'قرآن', completed: false, timeSlot: 'quran', timeHint: 'تلاوة وتدبر مع المصحف' },

  // ===== ختام اليوم وأذكار النوم =====
  { id: 'h11', title: 'أذكار النوم وسورة الملك', category: 'أذكار', completed: false, timeSlot: 'night', timeHint: 'عند الإيواء إلى الفراش' },

  // ===== صيام التطوع =====
  { id: 'h_fast_mon_thu', title: 'صيام الإثنين والخميس', category: 'صيام', fastingType: 'mon_thu', completed: false, timeSlot: 'fasting', timeHint: 'سنة مؤكدة تُعرض فيها الأعمال' },
  { id: 'h_fast_white_days', title: 'صيام الأيام البيض (13 و 14 و 15)', category: 'صيام', fastingType: 'white_days', completed: false, timeSlot: 'fasting', timeHint: 'ثلاثة أيام من كل شهر هجري' },
];

// قراءة العادات من LocalStorage مع دعم الإصدار (Versioned)
function loadHabitsFromStorage(): HabitItem[] {
  if (typeof window === 'undefined') return DEFAULT_HABITS;
  try {
    const version = localStorage.getItem(VERSION_KEY);
    const saved = localStorage.getItem(HABITS_KEY);

    if (version !== HABITS_VERSION || !saved) {
      localStorage.setItem(VERSION_KEY, HABITS_VERSION);
      localStorage.setItem(HABITS_KEY, JSON.stringify(DEFAULT_HABITS));
      return DEFAULT_HABITS;
    }

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_HABITS;
  } catch {
    return DEFAULT_HABITS;
  }
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<HabitItem[]>(() => loadHabitsFromStorage());
  const [partner, setPartner] = useState<PartnerStatus | null>(null);
  const [allPartners, setAllPartners] = useState<PartnerStatus[]>([]);
  const [partnerMessages, setPartnerMessages] = useState<PartnerMessage[]>([]);
  const [userStreak, setUserStreak] = useState<number>(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleLang = (e: any) => setLang(e?.detail?.lang || getSavedLanguage());
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  // حساب التواريخ الهجرية والميلادية والوقت حسب الدولة وضبط التاريخ المخصص
  const [dateInfo, setDateInfo] = useState(() => {
    return getCountryDateTime(getSavedCountryId(), getSavedHijriAdjustment());
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setDateInfo(getCountryDateTime(getSavedCountryId(), getSavedHijriAdjustment()));
    };

    handleSettingsUpdate();
    const timer = setInterval(handleSettingsUpdate, 60000);

    if (typeof window !== 'undefined') {
      window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsUpdate);
    }

    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsUpdate);
      }
    };
  }, []);

  // جلب إنجاز ورسائل الشركاء والستريك الحقيقي
  const loadPartnerData = async () => {
    try {
      const partnersList = await fetchAllPartnersProgress();
      setAllPartners(partnersList);
      setPartner(partnersList.length > 0 ? partnersList[0] : null);

      const msgs = await getPartnerMessages();
      setPartnerMessages(msgs || []);

      const realStreak = await getUserRealStreak();
      if (realStreak > 0) setUserStreak(realStreak);
    } catch (err) {
      console.warn('تعذر جلب بيانات الشريك والستريك:', err);
    }
  };

  // 1. التحقق من تسجيل الدخول ومعالجة أي كود دعوة معلق تلقائياً
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'أخي المبارك');
        setUserEmail(user.email ?? null);

        // فحص كود دعوة معلق في LocalStorage وقبوله فورياً
        try {
          const pendingCode = localStorage.getItem('pending_invite_code');
          if (pendingCode) {
            const res = await acceptInviteCode(pendingCode);
            if (res.success) {
              localStorage.removeItem('pending_invite_code');
              setToastMsg(`تم ربطك بنجاح مع رفيقك المبارك (${res.partnerName || ''})! 🌿`);
            }
          }
        } catch (e) {
          console.warn('فحص كود الدعوة المعلق:', e);
        }

        loadPartnerData();
      }
    }).catch(() => {});
  }, []);

  // فحص حالة الصيام المسنون لليوم وفق التقويم الهجري
  const islamicStatus = getIslamicDayStatus(new Date(), getSavedHijriAdjustment(), getSavedCountryId());
  const isFastingDay = islamicStatus.fastingInfo.isFastingDay;

  // استبعاد عادات الصيام من إجمالي ونسبة اليوم إذا لم يكن اليوم يوم صيام شرعي مسنون
  const visibleDailyHabits = habits.filter((h) => {
    if (h.category === 'صيام' || h.timeSlot === 'fasting') {
      return isFastingDay;
    }
    return true;
  });

  const completedCount = visibleDailyHabits.filter((h) => h.completed).length;

  // تبديل حالة العادة مع الحفظ المباشر في LocalStorage و Supabase
  const handleToggleHabit = (id: string) => {
    const targetHabit = habits.find((h) => h.id === id);
    if (!targetHabit) return;

    const newStatus = !targetHabit.completed;

    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, completed: newStatus } : h
    );
    setHabits(updatedHabits);

    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }

    if (isLoggedIn) {
      startTransition(async () => {
        try {
          await toggleHabitCompletion(id, today, newStatus, {
            title: targetHabit.title,
            category: targetHabit.category,
          });
        } catch (error) {
          console.warn('تنبيه المزامنة السحابية:', error);
        }
      });
    }
  };

  // إضافة ورد أو عادة جديدة
  const handleAddHabit = (newHabitData: Omit<HabitItem, 'id' | 'completed'>) => {
    const newHabit: HabitItem = {
      id: `custom_${Date.now()}`,
      title: newHabitData.title,
      category: newHabitData.category,
      timeHint: newHabitData.timeHint,
      completed: false,
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);

    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }
  };

  // حذف عادة
  const handleDeleteHabit = (id: string) => {
    const updatedHabits = habits.filter((h) => h.id !== id);
    setHabits(updatedHabits);

    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Header userStreak={userStreak} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* إشعار عائم بالنجاح أو تأكيد الشريك */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-600/30 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
              <span className="text-sm font-bold">{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* شريط الإنجاز اليومي العام والتاريخ الهجري والميلادي */}
        <DailyProgressCard
          completedCount={completedCount}
          totalCount={visibleDailyHabits.length}
          hijriDate={dateInfo.hijriDate}
          gregorianDate={dateInfo.gregorianDate}
          countryFlag={dateInfo.country?.flag}
          countryName={dateInfo.country?.name}
          timeString={dateInfo.timeString}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* العمود الرئيسي: قائمة أوراد وعادات اليوم */}
          <section className="lg:col-span-2 space-y-6">
            <HabitList
              habits={visibleDailyHabits}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
              onAddHabitClick={() => setIsAddModalOpen(true)}
            />
          </section>

          {/* العمود الجانبي: شريك الالتزام والفوائد */}
          <aside className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {t('myPartner', lang)}
              </span>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('invitePartner', lang)}</span>
              </button>
            </div>

            {/* بطاقة الشريك التفاعلية */}
            <PartnerCard
              partner={partner}
              allPartners={allPartners}
              recentMessages={partnerMessages}
              onOpenInviteModal={() => setIsInviteModalOpen(true)}
              onRefreshPartner={loadPartnerData}
            />

            {/* ومضة إيمانية */}
            <div className="bg-emerald-900/5 dark:bg-emerald-950/30 border border-emerald-800/10 dark:border-emerald-900/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs mb-2">
                <Quote className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{t('dailyQuote', lang)}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
                «من صام يوماً في سبيل الله بعد الله وجهه عن النار سبعين خريفاً»
              </p>
            </div>

            {/* بطاقة الوصول لصفحة الإعدادات والتخصيص */}
            <Link
              href="/settings"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('settingsTitle', lang)}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {lang === 'ar' ? 'الألوان، التوقيت، وإشعارات الهاتف' : 'Colors, timezone & phone alerts'}
                  </p>
                </div>
              </div>
              <ChevronLeft className={`w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-transform ${lang === 'en' ? 'rotate-180' : ''}`} />
            </Link>
          </aside>
        </div>

        {/* تذييل الصفحة الأنيق */}
        <footer className="mt-10 pt-6 border-t border-gray-200/60 dark:border-slate-800/80 text-center text-xs text-gray-400 dark:text-gray-500 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <span>{lang === 'ar' ? 'منصة مُعين © شريك الالتزام بالطاعات' : 'Mueen Platform © Spiritual Habit Partner'}</span>
          <span>•</span>
          <Link href="/settings" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            ⚙️ {t('settings', lang)}
          </Link>
          <span>•</span>
          <Link href="/adhkar" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            📿 {t('adhkar', lang)}
          </Link>
          <span>•</span>
          <Link href="/quran" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            📖 {t('quran', lang)}
          </Link>
        </footer>
      </main>

      {/* نافذة دعوة أو ربط الشريك (Modal) */}
      <PartnerInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onPartnerConnected={() => {
          loadPartnerData();
        }}
      />

      {/* نافذة إضافة ورد أو عادة جديدة (Modal) */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />
    </div>
  );
}
