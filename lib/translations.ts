// Mueen (مُعين) Bilingual System: Arabic (العربية) & English (الإنجليزية)

export type Language = 'ar' | 'en';

export const LANGUAGE_STORAGE_KEY = 'mueen_language';
export const LANGUAGE_CHANGE_EVENT = 'mueen_language_changed';

export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

export function saveLanguage(lang: Language) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { lang } }));
  } catch (err) {
    console.warn('Error saving language:', err);
  }
}

export const DICTIONARY = {
  // Common & Branding
  appName: { ar: 'مُعين', en: 'Mueen' },
  appTagline: { ar: 'رفيق الالتزام وتثبيت العادات', en: 'Habit Tracker & Spiritual Companion' },
  home: { ar: 'الرئيسية', en: 'Home' },
  quran: { ar: 'المصحف', en: 'Mushaf' },
  adhkar: { ar: 'الأذكار', en: 'Adhkar' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  progress: { ar: 'السجل', en: 'Progress' },
  today: { ar: 'اليوم', en: 'Today' },
  streak: { ar: 'الالتزام المتواصل', en: 'Real Streak' },
  installApp: { ar: 'تثبيت التطبيق', en: 'Install App' },
  installed: { ar: 'مثبّت', en: 'Installed' },
  notifications: { ar: 'التنبيهات', en: 'Notifications' },
  save: { ar: 'حفظ', en: 'Save' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  close: { ar: 'إغلاق', en: 'Close' },
  delete: { ar: 'حذف', en: 'Delete' },
  add: { ar: 'إضافة', en: 'Add' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  backToHome: { ar: 'العودة للرئيسية', en: 'Back to Home' },
  guestUser: { ar: 'ضيف مُعين', en: 'Guest User' },
  myPartner: { ar: 'رفيق المسير', en: 'Accountability Partner' },
  invitePartner: { ar: 'دعوة شريك', en: 'Invite Partner' },
  signIn: { ar: 'تسجيل الدخول', en: 'Sign In' },
  signOut: { ar: 'تسجيل الخروج', en: 'Sign Out' },

  // Language selection
  selectLanguage: { ar: 'اختر اللغة', en: 'Select Language' },
  arabic: { ar: 'العربية (Arabic)', en: 'Arabic (العربية)' },
  english: { ar: 'الإنجليزية (English)', en: 'English (الإنجليزية)' },
  languageDesc: { ar: 'التبديل بين العربية والإنجليزية للواجهة بالكامل', en: 'Switch between Arabic and English across the entire interface' },

  // 6 Main Hubs
  hubPrayers: { ar: 'الصلوات والسنن', en: 'Prayers & Sunan' },
  hubAwrad: { ar: 'أورادي اليومية', en: 'My Daily Awrad' },
  hubQuran: { ar: 'الورد والقرآن', en: 'Quran & Daily Portion' },
  hubAdhkar: { ar: 'الأذكار والسبحة', en: 'Adhkar & Tasbih' },
  hubFriday: { ar: 'سنن الجمعة', en: 'Friday Sunan' },
  hubFasting: { ar: 'صيام التطوع', en: 'Voluntary Fasting' },

  // Prayers
  fajr: { ar: 'صلاة الفجر', en: 'Fajr Prayer' },
  dhuhr: { ar: 'صلاة الظهر', en: 'Dhuhr Prayer' },
  asr: { ar: 'صلاة العصر', en: 'Asr Prayer' },
  maghrib: { ar: 'صلاة المغرب', en: 'Maghrib Prayer' },
  isha: { ar: 'صلاة العشاء', en: 'Isha Prayer' },
  nightPrayer: { ar: 'صلاة الوتر وقيام الليل', en: 'Witr & Night Prayer' },
  morningAdhkarTime: { ar: 'أذكار الصباح (قبل الشروق بنصف ساعة)', en: 'Morning Adhkar (30 mins before Sunrise)' },
  eveningAdhkarTime: { ar: 'أذكار المساء (قبل الغروب بنصف ساعة)', en: 'Evening Adhkar (30 mins before Sunset)' },

  // Hadith Card
  hadithTitle: { ar: 'حديث اليوم النبوي الشريف', en: 'Hadith of the Day' },
  anotherHadith: { ar: 'حديث آخر', en: 'Next Hadith' },
  copyHadith: { ar: 'نسخ الحديث', en: 'Copy Hadith' },
  copied: { ar: 'تم النسخ!', en: 'Copied!' },
  narratedBy: { ar: 'عن', en: 'Narrated by' },

  // Daily Awrad
  addHabit: { ar: 'إضافة ورد جديد', en: 'Add New Werd' },
  suggestedAwrad: { ar: 'مكتبة الأوراد المقترحة', en: 'Suggested Awrad Library' },
  customHabit: { ar: 'إضافة ورد مخصص', en: 'Custom Werd' },
  confirmDeleteHabit: { ar: 'هل تريد إزالة هذا الورد من قائمتك؟', en: 'Do you want to remove this habit from your list?' },

  // Friday Hub
  fridaySurahKahf: { ar: 'قراءة سورة الكهف', en: 'Read Surah Al-Kahf' },
  fridaySalawatCounter: { ar: 'الصلاة على النبي ﷺ', en: 'Salawat on the Prophet ﷺ' },
  fridayHourAlert: { ar: 'ساعة الاستجابة (آخر ساعة بعد العصر)', en: 'Hour of Response (Last Hour before Maghrib)' },

  // Settings Page
  settingsTitle: { ar: 'إعدادات التطبيق والتخصيص', en: 'App Settings & Customization' },
  settingsSubtitle: { ar: 'خصص مظهر المنصة، واللغة، والتوقيت حسب دولتك، وأدر إشعارات الهاتف', en: 'Customize app appearance, language, timezone, and device notifications' },
  collapseSection: { ar: 'طي القسم', en: 'Collapse' },
  expandSection: { ar: 'فتح القسم', en: 'Expand' },
  colorThemes: { ar: 'ألوان المنصة وتخصيص المظهر', en: 'Platform Colors & Theme' },
  fontSizeHeading: { ar: 'حجم الخط والمظهر الليلي', en: 'Font Size & Dark Mode' },
  countryTimeHeading: { ar: 'الدولة والتوقيت والتاريخ الهجري', en: 'Country, Timezone & Hijri Date' },
  notificationsHeading: { ar: 'إشعارات الهاتف وتنبيهات الأوراد', en: 'Phone Notifications & Alerts' },
  pwaHeading: { ar: 'تثبيت التطبيق على جهازك (PWA)', en: 'Install App on Device (PWA)' },
  accountHeading: { ar: 'إدارة الحساب والمزامنة', en: 'Account Management & Sync' },

  // Notifications
  enablePhoneNotifications: { ar: 'تفعيل إشعارات الهاتف', en: 'Enable Phone Notifications' },
  notificationsActive: { ar: 'مفعلة على الهاتف', en: 'Enabled on Device' },
  testOnPhone: { ar: 'تجربة على الهاتف', en: 'Test on Phone' },
  testSent: { ar: 'تم الإرسال ✓', en: 'Sent ✓' },
  notificationMorningTitle: { ar: 'أذكار الصباح', en: 'Morning Adhkar' },
  notificationMorningDesc: { ar: 'قبل شروق الشمس بنصف ساعة', en: '30 minutes before sunrise' },
  notificationEveningTitle: { ar: 'أذكار المساء', en: 'Evening Adhkar' },
  notificationEveningDesc: { ar: 'قبل غروب الشمس بنصف ساعة', en: '30 minutes before sunset' },
  notificationNightTitle: { ar: 'صلاة الوتر وقيام الليل', en: 'Witr & Night Prayer' },
  notificationNightDesc: { ar: 'تذكير الساعة 10:00 مساءً', en: 'Reminder at 10:00 PM' },
  notificationHadithTitle: { ar: 'حديث اليوم النبوي (إشعار خارجي)', en: 'Hadith of the Day (External Alert)' },
  notificationHadithDesc: { ar: 'يصلك نص الحديث كرسالة على الهاتف صباحاً', en: 'Hadith text arrives on your phone every morning' },
  notificationFridaySalawatTitle: { ar: 'الصلاة على النبي ﷺ (الجمعة)', en: 'Salawat on Prophet ﷺ (Friday)' },
  notificationFridaySalawatDesc: { ar: 'تذكير الصباح بيوم الجمعة المبارك', en: 'Morning Friday blessing reminder' },
  notificationFridayHourTitle: { ar: 'ساعة الاستجابة (عصر الجمعة)', en: 'Hour of Response (Friday Asr)' },
  notificationFridayHourDesc: { ar: 'آخر ساعة قبل مغرب الجمعة', en: 'Last hour before Friday sunset' },
  notificationDailyReviewTitle: { ar: 'ختام اليوم: «هل أنهيت أوراد اليوم؟»', en: 'Daily Review: "Did you complete today\'s awrad?"' },
  notificationDailyReviewDesc: { ar: 'تذكير مسائي لتسجيل إنجازك وتثبيت عاداتك في مُعين قبل النوم', en: 'Evening reminder to log your daily deeds before sleep' },
  notificationDiagnostic: { ar: 'فحص وتشخيص الإشعارات على هذا الجهاز', en: 'Device Notification Diagnostics' },
  notificationFixButton: { ar: 'إصلاح واختبار فوري ⚡', en: 'Fix & Test Now ⚡' },
};

export type TranslationKey = keyof typeof DICTIONARY;

export function t(key: TranslationKey, lang?: Language): string {
  const activeLang = lang || getSavedLanguage();
  const entry = DICTIONARY[key];
  if (!entry) return key;
  return entry[activeLang] || entry['ar'] || key;
}
