// Mueen Islamic Calendar & Sunnah Detection Engine
// حساب التقويم الهجري ومواقيت سنن الجمعة وأيام الصيام الشرعية بدقة

import { getSavedCountryId, getSavedHijriAdjustment, SUPPORTED_COUNTRIES } from './timeSettings';

export interface FastingDayInfo {
  isFastingDay: boolean;
  fastingType: 'mon_thu' | 'white_days' | 'ashura' | 'tasua' | 'dhul_hijjah' | 'arafah' | 'shawwal' | 'shaban' | 'ramadan' | null;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
  hadithQuoteAr: string;
  hadithQuoteEn: string;
}

export interface IslamicDayStatus {
  isFriday: boolean;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthNameAr: string;
  hijriMonthNameEn: string;
  hijriYear: number;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday
  fastingInfo: FastingDayInfo;
}

export const HIJRI_MONTHS = [
  { id: 1, nameAr: 'المحرم', nameEn: 'Muharram' },
  { id: 2, nameAr: 'صفر', nameEn: 'Safar' },
  { id: 3, nameAr: 'ربيع الأول', nameEn: "Rabi' al-Awwal" },
  { id: 4, nameAr: 'ربيع الثاني', nameEn: "Rabi' al-Thani" },
  { id: 5, nameAr: 'جمادى الأولى', nameEn: 'Jumada al-Ula' },
  { id: 6, nameAr: 'جمادى الآخرة', nameEn: 'Jumada al-Akhirah' },
  { id: 7, nameAr: 'رجب', nameEn: 'Rajab' },
  { id: 8, nameAr: "شعبان", nameEn: "Sha'ban" },
  { id: 9, nameAr: 'رمضان', nameEn: 'Ramadan' },
  { id: 10, nameAr: 'شوال', nameEn: 'Shawwal' },
  { id: 11, nameAr: 'ذو القعدة', nameEn: "Dhu al-Qi'dah" },
  { id: 12, nameAr: 'ذو الحجة', nameEn: 'Dhu al-Hijjah' },
];

/**
 * فحص الأيام الهجرية بدقة باستخدام Intl.DateTimeFormat مع مراعاة فارق الأيام والدولة
 */
export function getIslamicDayStatus(
  date: Date = new Date(),
  hijriAdjustmentDays?: number,
  countryId?: string
): IslamicDayStatus {
  const adjustment = typeof hijriAdjustmentDays === 'number' ? hijriAdjustmentDays : getSavedHijriAdjustment();
  const cId = countryId || getSavedCountryId();
  const country = SUPPORTED_COUNTRIES.find((c) => c.id === cId) || SUPPORTED_COUNTRIES[0];
  const tzOption = country.timezone === 'auto' ? undefined : country.timezone;

  const adjustedDate = new Date(date.getTime() + adjustment * 86400000);
  const dayOfWeek = date.getDay(); // 0 = Sunday ... 5 = Friday
  const isFriday = dayOfWeek === 5;

  let hijriDay = 15;
  let hijriMonth = 4;
  let hijriYear = 1448;

  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: tzOption,
    });
    const parts = formatter.formatToParts(adjustedDate);
    for (const part of parts) {
      if (part.type === 'day') hijriDay = parseInt(part.value, 10);
      if (part.type === 'month') hijriMonth = parseInt(part.value, 10);
      if (part.type === 'year') hijriYear = parseInt(part.value, 10);
    }
  } catch (err) {
    console.warn('تعذر قراءة أجزاء التاريخ الهجري:', err);
  }

  const monthObj = HIJRI_MONTHS.find((m) => m.id === hijriMonth) || HIJRI_MONTHS[0];

  // ========================================================
  // فحص أسباب الصيام المسنونة وفق الترتيب الشرعي والأهمية
  // ========================================================
  const fastingInfo = determineFastingInfo(dayOfWeek, hijriMonth, hijriDay);

  return {
    isFriday,
    hijriDay,
    hijriMonth,
    hijriMonthNameAr: monthObj.nameAr,
    hijriMonthNameEn: monthObj.nameEn,
    hijriYear,
    dayOfWeek,
    fastingInfo,
  };
}

function determineFastingInfo(dayOfWeek: number, month: number, day: number): FastingDayInfo {
  // 1. شهر رمضان المبارك (الفريضة)
  if (month === 9) {
    return {
      isFastingDay: true,
      fastingType: 'ramadan',
      titleAr: 'صيام شهر رمضان المبارك',
      titleEn: 'Holy Ramadan Fasting',
      descAr: 'ركن الإسلام العظيم، شهر المغفرة والعتق من النيران',
      descEn: 'The blessed pillar of Islam, month of mercy & forgiveness',
      badgeAr: 'رمضان مبارك',
      badgeEn: 'Ramadan',
      hadithQuoteAr: '«من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه»',
      hadithQuoteEn: '«Whoever fasts Ramadan out of faith and hope of reward, his previous sins will be forgiven»',
    };
  }

  // 2. يوم عرفة (9 ذو الحجة لغير الحاج)
  if (month === 12 && day === 9) {
    return {
      isFastingDay: true,
      fastingType: 'arafah',
      titleAr: 'صيام يوم عرفة المبارك (سنة مؤكدة)',
      titleEn: 'Day of Arafah Fasting',
      descAr: 'خير أيام الدنيا، صيامه يكفر ذنوب سنتين ماضية ومستقبلة',
      descEn: 'Best day of the year, expiates sins of past and coming year',
      badgeAr: 'يوم عرفة 🕋',
      badgeEn: 'Arafah Day 🕋',
      hadithQuoteAr: '«صيام يوم عرفة أحتسب على الله أن يكفر السنة التي قبله والسنة التي بعده»',
      hadithQuoteEn: '«Fasting on the Day of Arafah expiates sins of the previous year and the coming year»',
    };
  }

  // 3. تسع ذي الحجة (1 إلى 8 ذو الحجة)
  if (month === 12 && day >= 1 && day <= 8) {
    return {
      isFastingDay: true,
      fastingType: 'dhul_hijjah',
      titleAr: 'صيام عشر ذي الحجة المباركة',
      titleEn: 'Ten Days of Dhu al-Hijjah',
      descAr: 'ما من أيام العمل الصالح فيها أحب إلى الله تعالى من هذه الأيام',
      descEn: 'No days in which righteous deeds are more beloved to Allah than these',
      badgeAr: 'عشر ذي الحجة',
      badgeEn: 'Dhu al-Hijjah',
      hadithQuoteAr: '«ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام» يعني أيام العشر',
      hadithQuoteEn: '«There are no days on which good deeds are greater or more beloved to Allah than these ten days»',
    };
  }

  // 4. يوم عاشوراء (10 محرم)
  if (month === 1 && day === 10) {
    return {
      isFastingDay: true,
      fastingType: 'ashura',
      titleAr: 'صيام يوم عاشوراء (سنة مؤكدة)',
      titleEn: 'Day of Ashura Fasting',
      descAr: 'اليوم الذي نجى الله فيه موسى وقومه، صيامه يكفر سنة ماضية',
      descEn: 'The day Allah saved Moses, expiates sins of the preceding year',
      badgeAr: 'عاشوراء',
      badgeEn: 'Ashura',
      hadithQuoteAr: '«صيام يوم عاشوراء أحتسب على الله أن يكفر السنة التي قبله»',
      hadithQuoteEn: '«Fasting on the Day of Ashura expiates the sins of the preceding year»',
    };
  }

  // 5. يوم تاسوعاء (9 محرم)
  if (month === 1 && day === 9) {
    return {
      isFastingDay: true,
      fastingType: 'tasua',
      titleAr: 'صيام يوم تاسوعاء (سنة مستحبة)',
      titleEn: "Day of Tasu'a Fasting",
      descAr: 'يُستحب صيامه مع العاشر لمخالفة أهل الكتاب',
      descEn: 'Recommended with Ashura to follow the prophetic tradition',
      badgeAr: 'تاسوعاء',
      badgeEn: "Tasu'a",
      hadithQuoteAr: '«لئن بقيت إلى قابل لأصومن التاسع»',
      hadithQuoteEn: '«If I remain until next year, I will surely fast the ninth»',
    };
  }

  // 6. الأيام البيض (13 و 14 و 15 من كل شهر هجري ما عدا 13 ذي الحجة لأنه من أيام التشريق المحرم صيامها)
  const isWhiteDay = (day === 13 || day === 14 || day === 15) && !(month === 12 && day === 13);
  if (isWhiteDay) {
    return {
      isFastingDay: true,
      fastingType: 'white_days',
      titleAr: `صيام الأيام البيض (اليوم ${day} من الشهر الهجري)`,
      titleEn: `White Days Fasting (Day ${day})`,
      descAr: 'صيام ثلاثة أيام من كل شهر يعدل صيام الدهر كله بركة وثواباً',
      descEn: 'Fasting 3 days of every month equals fasting an entire lifetime',
      badgeAr: `البيض (${day})`,
      badgeEn: `White Day (${day})`,
      hadithQuoteAr: '«صيام ثلاثة أيام من كل شهر صيام الدهر: صبيحة ثلاث عشرة وأربع عشرة وخمس عشرة»',
      hadithQuoteEn: '«Fasting three days of every month is like fasting a lifetime: the 13th, 14th, and 15th»',
    };
  }

  // 7. الست من شوال (من 2 إلى 30 شوال — يوم 1 عيد الفطر محرم)
  if (month === 10 && day >= 2 && day <= 30) {
    return {
      isFastingDay: true,
      fastingType: 'shawwal',
      titleAr: 'صيام الست من شوال',
      titleEn: 'Six Days of Shawwal',
      descAr: 'من صام رمضان ثم أتبعه بست من شوال كان كصيام الدهر',
      descEn: 'Whoever fasts Ramadan and follows it with six of Shawwal, it is like fasting perpetually',
      badgeAr: 'ست شوال',
      badgeEn: 'Shawwal Six',
      hadithQuoteAr: '«من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر»',
      hadithQuoteEn: '«Whoever fasts Ramadan followed by six days of Shawwal, it is as if he fasted all year»',
    };
  }

  // 8. صيام شهر شعبان (النصف الأول 1 إلى 15)
  if (month === 8 && day <= 15) {
    return {
      isFastingDay: true,
      fastingType: 'shaban',
      titleAr: 'صيام تطوع في شهر شعبان المبارك',
      titleEn: "Sha'ban Voluntary Fasting",
      descAr: 'كان النبي ﷺ يكثر الصيام في شعبان استعداداً لشهر رمضان',
      descEn: "The Prophet ﷺ used to fast abundantly in Sha'ban preparing for Ramadan",
      badgeAr: 'شعبان',
      badgeEn: "Sha'ban",
      hadithQuoteAr: '«ذاك شهر يغفل الناس عنه بين رجب ورمضان وهو شهر ترفع فيه الأعمال إلى رب العالمين»',
      hadithQuoteEn: '«That is a month people neglect between Rajab and Ramadan, where deeds are raised to Allah»',
    };
  }

  // 9. صيام الإثنين والخميس الأسبوعي
  if (dayOfWeek === 1) {
    return {
      isFastingDay: true,
      fastingType: 'mon_thu',
      titleAr: 'صيام يوم الإثنين سنة مؤكدة',
      titleEn: 'Monday Sunnah Fasting',
      descAr: 'تُعرض الأعمال على الله يومي الإثنين والخميس، ويوم وُلد فيه النبي ﷺ',
      descEn: 'Deeds are presented on Monday & Thursday; the day the Prophet ﷺ was born',
      badgeAr: 'سنة الإثنين',
      badgeEn: 'Monday Sunnah',
      hadithQuoteAr: '«تُعرض الأعمال يوم الإثنين والخميس، فأحب أن يُعرض عملي وأنا صائم»',
      hadithQuoteEn: '«Deeds are presented on Monday and Thursday, and I love for my deeds to be presented while fasting»',
    };
  }

  if (dayOfWeek === 4) {
    return {
      isFastingDay: true,
      fastingType: 'mon_thu',
      titleAr: 'صيام يوم الخميس سنة مؤكدة',
      titleEn: 'Thursday Sunnah Fasting',
      descAr: 'تُعرض فيه الأعمال الصالحة على الله تعالى فأحب أن يُعرض عملي وأنا صائم',
      descEn: 'Righteous deeds are presented to Allah; beloved to be presented fasting',
      badgeAr: 'سنة الخميس',
      badgeEn: 'Thursday Sunnah',
      hadithQuoteAr: '«تُعرض الأعمال يوم الإثنين والخميس، فأحب أن يُعرض عملي وأنا صائم»',
      hadithQuoteEn: '«Deeds are presented on Monday and Thursday, and I love for my deeds to be presented while fasting»',
    };
  }

  // غير ذلك: اليوم ليس يوم صيام مسنون
  return {
    isFastingDay: false,
    fastingType: null,
    titleAr: '',
    titleEn: '',
    descAr: '',
    descEn: '',
    badgeAr: '',
    badgeEn: '',
    hadithQuoteAr: '',
    hadithQuoteEn: '',
  };
}
