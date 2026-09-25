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
  appTagline: { ar: 'شريك الالتزام', en: 'Spiritual Partner' },
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
  editProfile: { ar: 'تعديل الملف الشخصي', en: 'Edit Profile' },
  markAllRead: { ar: 'قراءة الكل', en: 'Mark all as read' },
  noNotifications: { ar: 'لا توجد تنبيهات جديدة', en: 'No new notifications' },
  newBadge: { ar: 'جديدة', en: 'new' },
  adjustNotifications: { ar: 'ضبط إشعارات الهاتف ومواقيتها 📲', en: 'Adjust Phone Notifications & Timers 📲' },
  daysStreak: { ar: 'أيام', en: 'days' },
  dayStreakSingle: { ar: 'يوم', en: 'day' },
  fontSizeLabel: { ar: 'حجم الخط', en: 'Font Size' },
  themeModeLabel: { ar: 'تبديل الوضع الليلي', en: 'Toggle Dark Mode' },

  // Language selection
  selectLanguage: { ar: 'اختر اللغة', en: 'Select Language' },
  arabic: { ar: 'العربية (Arabic)', en: 'Arabic (العربية)' },
  english: { ar: 'الإنجليزية (English)', en: 'English (الإنجليزية)' },
  languageDesc: { ar: 'التبديل بين العربية والإنجليزية للواجهة بالكامل', en: 'Switch between Arabic and English across the entire interface' },

  // 6 Main Hubs
  hubPrayers: { ar: 'الصلوات والسنن', en: 'Prayers & Sunan' },
  hubPrayersSub: { ar: 'الفرائض والرواتب', en: 'Obligatory & Sunan' },
  hubAwrad: { ar: 'أورادي اليومية', en: 'My Daily Awrad' },
  hubAwradSub: { ar: 'الصلة والبر والعلم', en: 'Kinship & Deeds' },
  hubQuran: { ar: 'الورد والقرآن', en: 'Quran & Portion' },
  hubQuranSub: { ar: 'المصحف الشريف', en: 'Holy Quran' },
  hubAdhkar: { ar: 'الأذكار والسبحة', en: 'Adhkar & Tasbih' },
  hubAdhkarSub: { ar: 'الصباح والمساء', en: 'Morning & Evening' },
  hubFriday: { ar: 'سنن الجمعة', en: 'Friday Sunan' },
  hubFridaySub: { ar: 'الكهف وساعة الإجابة', en: 'Al-Kahf & Dua Hour' },
  hubFasting: { ar: 'صيام التطوع', en: 'Voluntary Fasting' },
  hubFastingSub: { ar: 'الإثنين والخميس', en: 'Mondays & Thursdays' },

  // Prayers Hub
  fivePrayersHeading: { ar: 'الصلوات الخمس والسنن الرواتب', en: 'The Five Prayers & Confirmed Sunan' },
  openAll: { ar: 'فتح الكل', en: 'Expand All' },
  collapseAll: { ar: 'طي الكل', en: 'Collapse All' },
  fajr: { ar: 'صلاة الفجر', en: 'Fajr Prayer' },
  dhuhr: { ar: 'صلاة الظهر', en: 'Dhuhr Prayer' },
  asr: { ar: 'صلاة العصر', en: 'Asr Prayer' },
  maghrib: { ar: 'صلاة المغرب', en: 'Maghrib Prayer' },
  isha: { ar: 'صلاة العشاء والليل', en: 'Isha & Night Prayer' },
  sunnahBadge: { ar: 'سنة', en: 'Sunnah' },
  adhkarBadge: { ar: 'أذكار', en: 'Adhkar' },
  completedBadge: { ar: 'مكتملة ✓', en: 'Completed ✓' },
  readAdhkar: { ar: 'قراءة الأذكار', en: 'Read Adhkar' },
  readPortion: { ar: 'قراءة الورد', en: 'Read Portion' },
  fajrTimeHint: { ar: 'عند أذان الفجر في المسجد', en: 'At Fajr call to prayer' },
  dhuhrTimeHint: { ar: 'عند أذان الظهر في المسجد', en: 'At Dhuhr call to prayer' },
  asrTimeHint: { ar: 'عند أذان العصر في المسجد', en: 'At Asr call to prayer' },
  maghribTimeHint: { ar: 'عند أذان المغرب في المسجد', en: 'At Maghrib call to prayer' },
  ishaTimeHint: { ar: 'عند أذان العشاء في المسجد', en: 'At Isha call to prayer' },
  morningAdhkarTimeText: { ar: '🌅 الوقت الأفضل: بعد الفجر وقبل شروق الشمس بنصف ساعة', en: '🌅 Best time: After Fajr and 30 mins before sunrise' },
  eveningAdhkarTimeText: { ar: '🌇 الوقت الأفضل: بعد العصر وقبل غروب الشمس (المغرب) بنصف ساعة', en: '🌇 Best time: After Asr and 30 mins before sunset' },

  // Daily Awrad
  dailyAwradHeading: { ar: 'أورادي اليومية وأعمال البر والعلم', en: 'Daily Awrad, Good Deeds & Knowledge' },
  dailyAwradSub: { ar: 'صلة الرحم، بر الوالدين، زيارة المريض، طلب العلم، إتقان العمل، وقراءة الكتب', en: 'Kinship, parents, visiting the sick, seeking knowledge, diligent work & books' },
  addNewWerdBtn: { ar: 'إضافة ورد جديد 📚', en: 'Add New Habit 📚' },
  noAwradYet: { ar: 'لم تقم بإضافة أي أوراد يومية مخصصة بعد', en: 'No custom daily awrad added yet' },
  browseSuggested: { ar: 'تصفح مكتبة الأوراد المقترحة واختر ما يناسبك', en: 'Browse suggested awrad and pick what suits you' },
  removeWerdTooltip: { ar: 'إزالة هذا الورد من جدولك اليومي', en: 'Remove this habit from your daily list' },

  // Quran Hub
  quranDailyHeading: { ar: 'ورد القرآن الكريم اليومي', en: 'Daily Quran Portion' },
  quranDailySub: { ar: 'تلاوة وتدبر مع المصحف العادي النظيف أو المصحف ثلاثي الأبعاد', en: 'Recitation and reflection with clean mushaf or 3D view' },
  quranDoneBadge: { ar: 'تم إنجاز الورد ✓', en: 'Portion Completed ✓' },
  clickToMark: { ar: 'اضغط للتحديد', en: 'Click to complete' },
  openMushaf: { ar: 'فتح المصحف الشريف للقراءة', en: 'Open Holy Quran to Read' },
  quranHadithQuote: { ar: '«اقْرَؤُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيامَةِ شَفِيعًا لأَصْحابِهِ»', en: '«Read the Quran, for it will come as an intercessor for its companions on the Day of Resurrection»' },
  quranHadithDesc: { ar: 'تصفح آيات القرآن الكريم بسهولة في المصحف العادي النظيف مع حفظ مكان وقوفك الأخير', en: 'Easily browse Quran pages with your last reading position saved automatically' },

  // Adhkar & Sebha Hub
  adhkarDailyHeading: { ar: 'الأذكار اليومية وحصن المسلم', en: 'Daily Adhkar & Muslim Fortress' },
  adhkarDailySub: { ar: 'ألا بذكر الله تطمئن القلوب وتُحفظ النفس من كل مكروه', en: 'Verily in the remembrance of Allah do hearts find rest' },
  openSebha: { ar: '📿 فتح السبحة', en: '📿 Digital Sebha' },
  eidSunan: { ar: '🎉 الأعياد', en: '🎉 Eid Sunan' },
  morningAdhkarCardTitle: { ar: 'أذكار الصباح:', en: 'Morning Adhkar:' },
  morningAdhkarCardDesc: { ar: 'يُستحب قراءتها بعد الفجر وقبل شروق الشمس بنصف ساعة', en: 'Recommended after Fajr and 30 mins before sunrise' },
  eveningAdhkarCardTitle: { ar: 'أذكار المساء:', en: 'Evening Adhkar:' },
  eveningAdhkarCardDesc: { ar: 'يُستحب قراءتها بعد العصر وقبل غروب الشمس (المغرب) بنصف ساعة', en: 'Recommended after Asr and 30 mins before sunset' },

  // Friday Hub
  fridaySunanTitle: { ar: 'سنن وبركات يوم الجمعة', en: 'Friday Sunan & Blessings' },
  todayIsFriday: { ar: 'اليوم جمعة مباركة', en: 'Blessed Friday Today' },
  masterOfDays: { ar: 'سيد الأيام', en: 'Master of Days' },
  hourOfResponseTitle: { ar: 'تذكير: ساعة الاستجابة في يوم الجمعة 🤲', en: 'Reminder: Friday Hour of Acceptance 🤲' },
  hourOfResponseDesc: { ar: '«فيهِ سَاعَةٌ لَا يُوَافِقُهَا عَبْدٌ مُسْلِمٌ وَهُوَ قَائِمٌ يُصَلِّي يَسْأَلُ اللَّهَ شَيْئًا إِلَّا أَعْطَاهُ إِيَّاهُ» — أكثروا من الدعاء في آخر ساعة بعد العصر وقبل غروب الشمس.', en: '«There is an hour on Friday when no Muslim asks Allah for good except that He grants it» — Make abundant supplication in the last hour before sunset.' },
  readSurahKahf: { ar: 'قراءة سورة الكهف', en: 'Read Surah Al-Kahf' },
  kahfBadge: { ar: 'نور ما بين الجمعتين', en: 'Light between the two Fridays' },
  kahfHadith: { ar: '«من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين».', en: '«Whoever reads Surah Al-Kahf on Friday will have light shining for him between two Fridays»' },
  kahfQuranBtn: { ar: 'اقرأ سورة الكهف في المصحف', en: 'Read Surah Al-Kahf in Quran' },
  salawatCounterTitle: { ar: 'الصلاة على النبي ﷺ', en: 'Salawat on Prophet ﷺ' },
  salawatCounterCount: { ar: 'صلاة', en: 'Salawat' },
  salawatHadith: { ar: '«فَأَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ فِيهِ فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ».', en: '«Send abundant blessings upon me on Friday, for your blessings are presented to me»' },
  salawatBtn: { ar: '+ صلِّ عليه الآن', en: '+ Send Salawat' },
  fridaySunanListHeading: { ar: 'سنن وآداب حضور الجمعة:', en: 'Sunan & Etiquette of Friday:' },

  // Fasting Hub
  fastingVoluntaryTitle: { ar: 'صيام التطوع والسنن المؤكدة', en: 'Voluntary Fasting & Confirmed Sunan' },
  fastingVoluntarySub: { ar: 'صيام الإثنين والخميس، والأيام البيض (13 و 14 و 15)', en: 'Fasting Mondays, Thursdays, and White Days (13, 14, 15)' },
  fastingTodaySunnah: { ar: 'اليوم سنة', en: 'Today is Sunnah' },
  fastingWhiteDays: { ar: 'البيض', en: 'White Days' },
  fastingVoluntaryShort: { ar: 'تطوع', en: 'Voluntary' },
  fastingAccepted: { ar: 'صائم تقبل الله', en: 'Fasting, may Allah accept' },
  fastingTodayDone: { ar: 'صائم اليوم ✓', en: 'Fasting Today ✓' },
  recordFasting: { ar: 'تسجيل الصيام', en: 'Log Fasting' },

  // Hadith Card
  hadithTitle: { ar: 'حديث اليوم النبوي الشريف', en: 'Hadith of the Day' },
  anotherHadith: { ar: 'حديث آخر', en: 'Next Hadith' },
  copyHadith: { ar: 'نسخ الحديث', en: 'Copy Hadith' },
  copied: { ar: 'تم النسخ!', en: 'Copied!' },
  narratedBy: { ar: 'عن', en: 'Narrated by' },

  // Daily Progress Card
  todayPortionHeading: { ar: 'ورد اليوم وعهده', en: "Today's Portion & Commitment" },
  motivational100: { ar: 'ما شاء الله! أتممت جميع أورادك اليومية مبارك التزامك 🌟', en: 'Mashallah! You completed all daily portions. Blessed dedication! 🌟' },
  motivational60: { ar: 'أحسنت! قطعت شوطاً رائعاً، قارب على الإتمام 🌿', en: "Great work! You made solid progress, almost done 🌿" },
  motivationalStart: { ar: 'بداية طيبة، استعن بالله وأتمم بقية وردك 📖', en: "Good start! Rely upon Allah and finish your portion 📖" },
  motivationalZero: { ar: '«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» 🕊️', en: '«The most beloved deeds to Allah are the most consistent, even if small» 🕊️' },
  habitsCompletedOf: { ar: 'عادات', en: 'habits' },
  progressDone100: { ar: '100% تم الإنجاز', en: '100% Completed' },

  // Partner Card
  partnerTitle: { ar: 'رفيق الالتزام', en: 'Accountability Partner' },
  noPartnerTitle: { ar: 'لا يوجد رفيق التزام حالياً', en: 'No partner connected yet' },
  noPartnerDesc: { ar: '«المؤمن للمؤمن كالبنيان يشد بعضه بعضاً». شارك رابطك مع صديقك المقرب ليعينك وتُعينه على الطاعة اليومية.', en: '«A believer to another believer is like a building, supporting each other». Share your link to help each other in daily worship.' },
  invitePartnerBtn: { ar: 'دعوة أو ربط شريك التزام 🤝', en: 'Invite or Connect Partner 🤝' },
  sendEncouragement: { ar: 'أرسل تشجيعاً أو دعاءً لرفيقك:', en: 'Send encouragement or prayer to your partner:' },
  presetPhrases: { ar: 'عبارات جاهزة', en: 'Quick phrases' },
  customPrayer: { ar: 'كتابة دعاء خاص', en: 'Write custom message' },
  send: { ar: 'إرسال', en: 'Send' },
  disconnect: { ar: 'فك الارتباط', en: 'Disconnect' },
  todayActivity: { ar: 'نشاط اليوم:', en: "Today's activity:" },
  partnerPortionToday: { ar: 'إنجاز ورد اليوم', en: "Today's portion progress" },
  partnerCompletedOf: { ar: 'أنجز {completed} من {total} أوراد', en: 'Completed {completed} of {total} habits' },
  fullPrivacy: { ar: 'خصوصية تامة', en: 'Full privacy' },
  dailyQuote: { ar: 'قبس اليوم', en: 'Daily Reflection' },

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

