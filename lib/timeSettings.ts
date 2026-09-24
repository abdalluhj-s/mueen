export interface CountryTimezone {
  id: string;
  name: string;
  flag: string;
  city: string;
  timezone: string; // IANA timezone
}

export interface ColorThemeOption {
  id: string;
  name: string;
  subtitle: string;
  colorHex: string;
  badgeClass: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: 'emerald',
    name: 'الأخضر الزمردي',
    subtitle: 'اللون الافتراضي • رمز السكينة والسلام',
    colorHex: '#059669',
    badgeClass: 'bg-emerald-600',
  },
  {
    id: 'blue',
    name: 'الأزرق النيلي والسماوي',
    subtitle: 'صفاء السماء • نقوش المساجد العريقة',
    colorHex: '#2563eb',
    badgeClass: 'bg-blue-600',
  },
  {
    id: 'purple',
    name: 'البنفسجي الوقور الملكي',
    subtitle: 'هدوء الليل • الفخامة والخشوع',
    colorHex: '#7c3aed',
    badgeClass: 'bg-violet-600',
  },
  {
    id: 'amber',
    name: 'الكهرماني والذهبي',
    subtitle: 'نور الفجر • دفء الأصالة والتراث',
    colorHex: '#d97706',
    badgeClass: 'bg-amber-600',
  },
  {
    id: 'green',
    name: 'الأخضر النبوي الزيتوني',
    subtitle: 'بركة رياض الجنة • النقاء الطبيعي',
    colorHex: '#16a34a',
    badgeClass: 'bg-green-600',
  },
  {
    id: 'rose',
    name: 'الياقوتي والعنابي',
    subtitle: 'الورد الدمشقي • الوقار والجمال',
    colorHex: '#e11d48',
    badgeClass: 'bg-rose-600',
  },
];

export const SUPPORTED_COUNTRIES: CountryTimezone[] = [
  { id: 'auto', name: 'تلقائي (حسب متصفحك)', flag: '🌐', city: 'الجهاز الحالي', timezone: 'auto' },
  { id: 'eg', name: 'مصر', flag: '🇪🇬', city: 'القاهرة', timezone: 'Africa/Cairo' },
  { id: 'sa', name: 'المملكة العربية السعودية', flag: '🇸🇦', city: 'مكة المكرمة / الرياض', timezone: 'Asia/Riyadh' },
  { id: 'ae', name: 'الإمارات العربية المتحدة', flag: '🇦🇪', city: 'أبوظبي / دبي', timezone: 'Asia/Dubai' },
  { id: 'kw', name: 'الكويت', flag: '🇰🇼', city: 'الكويت العاصمة', timezone: 'Asia/Kuwait' },
  { id: 'qa', name: 'قطر', flag: '🇶🇦', city: 'الدوحة', timezone: 'Asia/Qatar' },
  { id: 'bh', name: 'البحرين', flag: '🇧🇭', city: 'المنامة', timezone: 'Asia/Bahrain' },
  { id: 'om', name: 'سلطنة عُمان', flag: '🇴🇲', city: 'مسقط', timezone: 'Asia/Muscat' },
  { id: 'jo', name: 'الأردن', flag: '🇯🇴', city: 'عمّان', timezone: 'Asia/Amman' },
  { id: 'ps', name: 'فلسطين', flag: '🇵🇸', city: 'القدس الشريف', timezone: 'Asia/Jerusalem' },
  { id: 'iq', name: 'العراق', flag: '🇮🇶', city: 'بغداد', timezone: 'Asia/Baghdad' },
  { id: 'sy', name: 'سوريا', flag: '🇸🇾', city: 'دمشق', timezone: 'Asia/Damascus' },
  { id: 'lb', name: 'لبنان', flag: '🇱🇧', city: 'بيروت', timezone: 'Asia/Beirut' },
  { id: 'ye', name: 'اليمن', flag: '🇾🇪', city: 'صنعاء / عدن', timezone: 'Asia/Aden' },
  { id: 'ma', name: 'المغرب', flag: '🇲🇦', city: 'الرباط / الدار البيضاء', timezone: 'Africa/Casablanca' },
  { id: 'dz', name: 'الجزائر', flag: '🇩🇿', city: 'الجزائر العاصمة', timezone: 'Africa/Algiers' },
  { id: 'tn', name: 'تونس', flag: '🇹🇳', city: 'تونس', timezone: 'Africa/Tunis' },
  { id: 'ly', name: 'ليبيا', flag: '🇱🇾', city: 'طرابلس', timezone: 'Africa/Tripoli' },
  { id: 'sd', name: 'السودان', flag: '🇸🇩', city: 'الخرطوم', timezone: 'Africa/Khartoum' },
  { id: 'tr', name: 'تركيا', flag: '🇹🇷', city: 'إسطنبول', timezone: 'Europe/Istanbul' },
  { id: 'gb', name: 'المملكة المتحدة', flag: '🇬🇧', city: 'لندن', timezone: 'Europe/London' },
  { id: 'us', name: 'الولايات المتحدة (شرق)', flag: '🇺🇸', city: 'نيويورك', timezone: 'America/New_York' },
];

export const SETTINGS_KEYS = {
  COLOR_THEME: 'mueen_color_theme',
  COUNTRY_ID: 'mueen_country_id',
  HIJRI_ADJUSTMENT: 'mueen_hijri_adjustment',
  FONT_SIZE: 'mueen_font_size',
  THEME_MODE: 'mueen_theme',
};

export const SETTINGS_CHANGE_EVENT = 'mueen_settings_changed';

export function getSavedCountryId(): string {
  if (typeof window === 'undefined') return 'auto';
  return localStorage.getItem(SETTINGS_KEYS.COUNTRY_ID) || 'auto';
}

export function getSavedHijriAdjustment(): number {
  if (typeof window === 'undefined') return 0;
  const val = localStorage.getItem(SETTINGS_KEYS.HIJRI_ADJUSTMENT);
  return val !== null ? parseInt(val, 10) || 0 : 0;
}

export function getSavedColorTheme(): string {
  if (typeof window === 'undefined') return 'emerald';
  return localStorage.getItem(SETTINGS_KEYS.COLOR_THEME) || 'emerald';
}

export function saveColorTheme(themeId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEYS.COLOR_THEME, themeId);
  document.documentElement.setAttribute('data-color-theme', themeId);
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function saveCountryId(countryId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEYS.COUNTRY_ID, countryId);
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function saveHijriAdjustment(days: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEYS.HIJRI_ADJUSTMENT, days.toString());
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function getCountryDateTime(countryId: string = 'auto', hijriAdjustmentDays: number = 0) {
  const country = SUPPORTED_COUNTRIES.find((c) => c.id === countryId) || SUPPORTED_COUNTRIES[0];
  const now = new Date();
  const tzOption = country.timezone === 'auto' ? undefined : country.timezone;

  // 1. الوقت الرقمي المباشر
  let timeString = '';
  try {
    timeString = new Intl.DateTimeFormat('ar-EG', {
      timeZone: tzOption,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(now);
  } catch {
    timeString = now.toLocaleTimeString('ar-EG');
  }

  // 2. التاريخ الميلادي
  let gregorianDate = '';
  try {
    gregorianDate = new Intl.DateTimeFormat('ar-EG', {
      timeZone: tzOption,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    }).format(now);
  } catch {
    gregorianDate = now.toLocaleDateString('ar-EG');
  }

  // 3. التاريخ الهجري مع تعديل الأيام
  let hijriDate = '';
  try {
    const adjustedDate = new Date(now.getTime() + hijriAdjustmentDays * 86400000);
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      timeZone: tzOption,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    hijriDate = hijriFormatter.format(adjustedDate);
  } catch {
    hijriDate = '13 ربيع الأول 1448 هـ';
  }

  return {
    country,
    timeString,
    gregorianDate: `${gregorianDate} م`,
    hijriDate: `${hijriDate} هـ`,
  };
}
