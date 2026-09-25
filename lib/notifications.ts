import { getTodayHadith } from '../data/hadiths';

export interface NotificationScheduleConfig {
  enabled: boolean;
  morningAdhkar: boolean;     // أذكار الصباح (قبل الشروق بنصف ساعة)
  morningTime: string;        // الافتراضي 05:30
  eveningAdhkar: boolean;     // أذكار المساء (قبل الغروب بنصف ساعة)
  eveningTime: string;        // الافتراضي 17:00
  nightPrayer: boolean;       // قيام الليل والوتر (الساعة 10:00 مساءً)
  nightTime: string;          // الافتراضي 22:00
  fridaySalawat: boolean;     // الصلاة على النبي ﷺ يوم الجمعة
  fridaySalawatTime: string;  // الافتراضي 09:00
  fridayHour: boolean;        // ساعة الاستجابة يوم الجمعة (آخر ساعة بعد العصر)
  fridayHourTime: string;     // الافتراضي 16:30
  dailyReview: boolean;       // هل أنهيت أوراد اليوم؟ (ختام اليوم)
  dailyReviewTime: string;    // الافتراضي 22:30
  dailyHadith: boolean;       // حديث اليوم النبوي الشريف
  dailyHadithTime: string;    // الافتراضي 08:30
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationScheduleConfig = {
  enabled: false,
  morningAdhkar: true,
  morningTime: '05:30',
  eveningAdhkar: true,
  eveningTime: '17:00',
  nightPrayer: true,
  nightTime: '22:00',
  fridaySalawat: true,
  fridaySalawatTime: '09:00',
  fridayHour: true,
  fridayHourTime: '16:30',
  dailyReview: true,
  dailyReviewTime: '22:30',
  dailyHadith: true,
  dailyHadithTime: '08:30',
};

const STORAGE_KEY = 'mueen_notifications_config';
const LAST_SENT_PREFIX = 'mueen_notif_last_sent_';

/**
 * جلب إعدادات الإشعارات المحفوظة
 */
export function getSavedNotificationConfig(): NotificationScheduleConfig {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_CONFIG;
    return { ...DEFAULT_NOTIFICATION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_CONFIG;
  }
}

/**
 * حفظ إعدادات الإشعارات
 */
export function saveNotificationConfig(config: NotificationScheduleConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('mueen_notification_config_changed'));
}

/**
 * التحقق من دعم المتصفح للإشعارات
 */
export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * جلب حالة إذن الإشعارات الحالية
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * تسجيل Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch (err) {
    console.warn('تعذر تسجيل Service Worker:', err);
    return null;
  }
}

/**
 * طلب الإذن الرسمي من المتصفح / الهاتف لإرسال إشعارات
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      await registerServiceWorker();
      const current = getSavedNotificationConfig();
      saveNotificationConfig({ ...current, enabled: true });
      return true;
    }
    return false;
  } catch (err) {
    console.error('خطأ في طلب إذن الإشعارات:', err);
    return false;
  }
}

/**
 * إرسال إشعار فوري للجهاز عبر Service Worker (يظهر على شاشة القفل ودرج الإشعارات)
 */
export async function sendDeviceNotification(
  title: string,
  options: {
    body: string;
    url?: string;
    tag?: string;
    icon?: string;
  }
): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const notificationOptions = {
    body: options.body,
    icon: options.icon || '/logo.jpg',
    badge: '/icons/icon-192.svg',
    vibrate: [200, 100, 200],
    tag: options.tag || `mueen-notif-${Date.now()}`,
    renotify: true,
    data: {
      url: options.url || '/',
    },
  };

  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, notificationOptions);
      return true;
    }
  } catch (swErr) {
    console.warn('تعذر الإرسال عبر SW، استخدام Notification المباشر كبديل:', swErr);
  }

  // كبديل احتياطي (Fallback)
  try {
    new Notification(title, notificationOptions);
    return true;
  } catch (directErr) {
    console.error('تعذر إظهار الإشعار المباشر:', directErr);
    return false;
  }
}

/**
 * التحقق مما إذا كان الإشعار تم إرساله اليوم مسبقاً لتجنب التكرار
 */
function hasBeenSentToday(type: string): boolean {
  if (typeof window === 'undefined') return false;
  const today = new Date().toISOString().split('T')[0];
  const lastSent = localStorage.getItem(`${LAST_SENT_PREFIX}${type}`);
  return lastSent === today;
}

function markSentToday(type: string) {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(`${LAST_SENT_PREFIX}${type}`, today);
}

/**
 * إرسال إشعار تجريبي فوري لمطابقة طلب المستخدم ورؤيته على هاتفه
 */
export async function sendTestNotification(type: 
  | 'morning' 
  | 'evening' 
  | 'night' 
  | 'fridaySalawat' 
  | 'fridayHour' 
  | 'dailyReview' 
  | 'dailyHadith'
): Promise<boolean> {
  switch (type) {
    case 'morning':
      return sendDeviceNotification('☀️ تذكير أذكار الصباح | مُعين', {
        body: 'لا تنسَ أذكار الصباح وحصن المسلم قبل شروق الشمس بنصف ساعة لتنال بركة يومك وحفظه.',
        url: '/adhkar',
        tag: 'mueen-morning',
      });

    case 'evening':
      return sendDeviceNotification('🌙 تذكير أذكار المساء | مُعين', {
        body: 'أقبل وقت أذكار المساء قبل غروب الشمس بنصف ساعة.. حصّن نفسك وأهلك بأذكار المساء.',
        url: '/adhkar',
        tag: 'mueen-evening',
      });

    case 'night':
      return sendDeviceNotification('🌌 قيام الليل والوتر | مُعين', {
        body: 'ركعات في جوف الليل وسجدة تُناجي فيها ربك.. لا تنسَ صلاة الشفع والوتر قبل نومك.',
        url: '/',
        tag: 'mueen-night',
      });

    case 'fridaySalawat':
      return sendDeviceNotification('🕌 الصلاة على النبي ﷺ | الجمعة المباركة', {
        body: '«إن من أفضل أيامكم يوم الجمعة، فأكثروا عليّ من الصلاة فيه».. صلِّ وسلم على حبيبك ﷺ.',
        url: '/',
        tag: 'mueen-friday-salawat',
      });

    case 'fridayHour':
      return sendDeviceNotification('🤲 ساعة الاستجابة المباركة | مُعين', {
        body: 'الآن آخر ساعة من نهار يوم الجمعة المبارك.. تحرَّ ساعة الإجابة ولا تنسَ نفسك وإخوانك من صالح الدعاء.',
        url: '/',
        tag: 'mueen-friday-hour',
      });

    case 'dailyReview':
      return sendDeviceNotification('📋 ختام اليوم وتثبيت الأوراد | مُعين', {
        body: 'هل أنهيت أورادك وسننك اليوم؟ افتح مُعين وسجّل إنجازك لتواصل سلسلة ثباتك الإيماني.',
        url: '/',
        tag: 'mueen-daily-review',
      });

    case 'dailyHadith': {
      const hadith = getTodayHadith();
      return sendDeviceNotification(`📜 حديث اليوم النبوي الشريف | ${hadith.topic}`, {
        body: `${hadith.text} — عن ${hadith.narrator} (${hadith.source})`,
        url: '/',
        tag: 'mueen-daily-hadith',
      });
    }

    default:
      return false;
  }
}

/**
 * فاحص الجدولة اليومية التلقائية (Notification Scheduler Tick)
 * يتم استدعاؤه كل دقيقة لمقارنة الوقت المحلي بالوقت المضبوط
 */
export function checkAndTriggerScheduledNotifications() {
  if (typeof window === 'undefined') return;
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const config = getSavedNotificationConfig();
  if (!config.enabled) return;

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const dayOfWeek = now.getDay(); // 5 = الجمعة (Sunday = 0, Friday = 5)

  // 1. أذكار الصباح
  if (config.morningAdhkar && currentTimeStr === config.morningTime && !hasBeenSentToday('morning')) {
    sendTestNotification('morning');
    markSentToday('morning');
  }

  // 2. أذكار المساء
  if (config.eveningAdhkar && currentTimeStr === config.eveningTime && !hasBeenSentToday('evening')) {
    sendTestNotification('evening');
    markSentToday('evening');
  }

  // 3. قيام الليل والوتر (الساعة 10 مساءً أو الوقت المحدد)
  if (config.nightPrayer && currentTimeStr === config.nightTime && !hasBeenSentToday('night')) {
    sendTestNotification('night');
    markSentToday('night');
  }

  // 4. ختام اليوم: هل أنهيت أورادك اليوم؟
  if (config.dailyReview && currentTimeStr === config.dailyReviewTime && !hasBeenSentToday('dailyReview')) {
    sendTestNotification('dailyReview');
    markSentToday('dailyReview');
  }

  // 5. حديث اليوم النبوي الشريف كإشعار خارجي صباحي
  if (config.dailyHadith && currentTimeStr === config.dailyHadithTime && !hasBeenSentToday('dailyHadith')) {
    sendTestNotification('dailyHadith');
    markSentToday('dailyHadith');
  }

  // 6. سنن وصلاة الجمعة (يوم الجمعة فقط)
  if (dayOfWeek === 5) {
    if (config.fridaySalawat && currentTimeStr === config.fridaySalawatTime && !hasBeenSentToday('fridaySalawat')) {
      sendTestNotification('fridaySalawat');
      markSentToday('fridaySalawat');
    }

    if (config.fridayHour && currentTimeStr === config.fridayHourTime && !hasBeenSentToday('fridayHour')) {
      sendTestNotification('fridayHour');
      markSentToday('fridayHour');
    }
  }
}
