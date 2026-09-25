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
 * تشغيل نغمة تنبيه لطيفة واقعية باستخدام Web Audio API
 */
export function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // نغمة مزدوجة هادئة ورنانة
    const now = ctx.currentTime;
    
    // نغمة 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // نغمة 2: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Ignored in restricted environments
  }
}

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
  return 'Notification' in window || 'serviceWorker' in navigator;
}

/**
 * جلب حالة إذن الإشعارات الحالية
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/**
 * تسجيل Service Worker وضمان تفعيله فوراً
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing && existing.active) {
      return existing;
    }
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
export async function requestNotificationPermission(): Promise<{ granted: boolean; status: string }> {
  if (typeof window === 'undefined') {
    return { granted: false, status: 'unsupported' };
  }

  if (!('Notification' in window)) {
    return { granted: false, status: 'unsupported' };
  }

  try {
    // طلب الإذن الرسمي
    const perm = await Notification.requestPermission();
    const isGranted = perm === 'granted';

    if (isGranted) {
      await registerServiceWorker();
      const current = getSavedNotificationConfig();
      saveNotificationConfig({ ...current, enabled: true });
    }

    return { granted: isGranted, status: perm };
  } catch (err) {
    console.error('خطأ في طلب إذن الإشعارات:', err);
    return { granted: false, status: 'error' };
  }
}

/**
 * إرسال إشعار فوري للجهاز (يظهر على شاشة القفل ودرج الإشعارات)
 * مع تشغيل نغمة وبانر تفاعلي
 */
export async function sendDeviceNotification(
  title: string,
  options: {
    body: string;
    url?: string;
    tag?: string;
    icon?: string;
  }
): Promise<{ success: boolean; deliveredToOS: boolean; message: string }> {
  if (typeof window === 'undefined') {
    return { success: false, deliveredToOS: false, message: 'بيئة غير مدعومة' };
  }

  // 1. تشغيل النغمة الصوتية دائماً لضمان السماع الفوري
  playNotificationChime();

  // 2. إرسال حدث بانر تفاعلي عائم داخل التطبيق
  window.dispatchEvent(
    new CustomEvent('mueen_inapp_toast', {
      detail: {
        title,
        body: options.body,
        url: options.url || '/',
      },
    })
  );

  // 3. التحقق من إذن النظام
  if (!('Notification' in window)) {
    return {
      success: true,
      deliveredToOS: false,
      message: 'تم إظهار التنبيه داخل التطبيق (المتصفح لا يدعم إشعارات النظام الخارجية)',
    };
  }

  let currentPermission = Notification.permission;

  if (currentPermission === 'default') {
    const req = await requestNotificationPermission();
    currentPermission = req.status as NotificationPermission;
  }

  if (currentPermission !== 'granted') {
    return {
      success: false,
      deliveredToOS: false,
      message: currentPermission === 'denied' 
        ? 'تم حظر الإشعارات في إعدادات المتصفح. اضغط على أيقونة القفل بالسماح.'
        : 'يرجى الموافقة على إذن الإشعارات لتصلك على شاشة القفل.',
    };
  }

  const notificationOptions = {
    body: options.body,
    icon: options.icon || '/logo.jpg',
    badge: '/icons/icon-192.svg',
    vibrate: [250, 100, 250],
    tag: options.tag || `mueen-notif-${Date.now()}`,
    renotify: true,
    data: {
      url: options.url || '/',
    },
  };

  let deliveredToOS = false;

  // المحاولة 1: عبر Service Worker Registration المباشر
  try {
    let reg = await navigator.serviceWorker.getRegistration();
    if (!reg) {
      reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    }

    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, notificationOptions);
      deliveredToOS = true;
    }
  } catch (swErr) {
    console.warn('تعذر الإرسال المباشر عبر registration، محاولة عبر controller postMessage:', swErr);
  }

  // المحاولة 2: عبر controller postMessage
  if (!deliveredToOS && navigator.serviceWorker?.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options: notificationOptions,
      });
      deliveredToOS = true;
    } catch (msgErr) {
      console.warn('تعذر الإرسال عبر postMessage:', msgErr);
    }
  }

  // المحاولة 3: عبر new Notification() (Desktop fallback)
  if (!deliveredToOS) {
    try {
      new Notification(title, notificationOptions);
      deliveredToOS = true;
    } catch (directErr) {
      console.warn('new Notification غير متاح على هذا الجهاز:', directErr);
    }
  }

  return {
    success: true,
    deliveredToOS,
    message: deliveredToOS 
      ? 'وصلك الإشعار بنجاح الآن على شاشة هاتفك ودرج التنبيهات! 🔔' 
      : 'تم إظهار التنبيه محلياً بنجاح.',
  };
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
): Promise<{ success: boolean; deliveredToOS: boolean; message: string }> {
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
        url: '/adhkar',
        tag: 'mueen-daily-hadith',
      });
    }

    default:
      return { success: false, deliveredToOS: false, message: 'نوع تنبيه غير معروف' };
  }
}

/**
 * فاحص الجدولة اليومية التلقائية (Notification Scheduler Tick)
 */
export function checkAndTriggerScheduledNotifications() {
  if (typeof window === 'undefined') return;
  if (!isNotificationSupported()) return;

  const config = getSavedNotificationConfig();
  if (!config.enabled) return;

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const dayOfWeek = now.getDay(); // 5 = الجمعة (Friday)

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

  // 3. قيام الليل والوتر
  if (config.nightPrayer && currentTimeStr === config.nightTime && !hasBeenSentToday('night')) {
    sendTestNotification('night');
    markSentToday('night');
  }

  // 4. ختام اليوم
  if (config.dailyReview && currentTimeStr === config.dailyReviewTime && !hasBeenSentToday('dailyReview')) {
    sendTestNotification('dailyReview');
    markSentToday('dailyReview');
  }

  // 5. حديث اليوم النبوي الشريف
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
