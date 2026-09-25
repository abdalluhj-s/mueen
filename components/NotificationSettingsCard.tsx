'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Check, 
  Clock, 
  Send, 
  Sparkles, 
  Sun, 
  Moon, 
  HeartHandshake, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Volume2,
  Wrench,
  Smartphone,
  Info
} from 'lucide-react';
import { 
  NotificationScheduleConfig, 
  getSavedNotificationConfig, 
  saveNotificationConfig, 
  requestNotificationPermission, 
  getNotificationPermissionStatus,
  sendTestNotification,
  isNotificationSupported,
  registerServiceWorker,
  playNotificationChime
} from '../lib/notifications';
import { getSavedLanguage, t, Language, LANGUAGE_CHANGE_EVENT } from '../lib/translations';

export const NotificationSettingsCard: React.FC = () => {
  const [config, setConfig] = useState<NotificationScheduleConfig>(() => getSavedNotificationConfig());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSentType, setTestSentType] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [isIOS, setIsIOS] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermissionStatus());
    const handleConfigChange = () => {
      setConfig(getSavedNotificationConfig());
      setPermission(getNotificationPermissionStatus());
    };
    const handleLangChange = (e: any) => {
      setLang(e?.detail?.lang || getSavedLanguage());
    };

    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));
    }

    window.addEventListener('mueen_notification_config_changed', handleConfigChange);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
    return () => {
      window.removeEventListener('mueen_notification_config_changed', handleConfigChange);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
    };
  }, []);

  const handleEnableMasterToggle = async () => {
    setIsRequesting(true);
    const { granted, status } = await requestNotificationPermission();
    setIsRequesting(false);
    setPermission(getNotificationPermissionStatus());

    if (granted) {
      const updated = { ...config, enabled: true };
      setConfig(updated);
      saveNotificationConfig(updated);
      playNotificationChime();
      setFeedbackMsg({
        type: 'success',
        text: lang === 'en' 
          ? 'Phone notifications enabled! Sending a test alert now.' 
          : 'تم تفعيل إشعارات الهاتف بنجاح! جاري إرسال إشعار تجريبي لهاتفك الآن.',
      });
      await sendTestNotification('morning');
    } else {
      setFeedbackMsg({
        type: 'error',
        text: status === 'denied'
          ? (lang === 'en' 
              ? 'Notifications are blocked in your browser settings. Please click the lock icon in the address bar and select "Allow".' 
              : 'الإشعارات محظورة في إعدادات متصفحك. يرجى الضغط على علامة القفل بجانب الرابط واختيار «السماح بالإشعارات».')
          : (lang === 'en'
              ? 'Please grant notification permission when prompted by your browser.'
              : 'يرجى الموافقة على طلب إذن الإشعارات من نافذة المتصفح لتفعيل التنبيهات.'),
      });
    }
  };

  const handleQuickFixAndTest = async () => {
    setIsFixing(true);
    playNotificationChime();

    try {
      await registerServiceWorker();
      const { granted, status } = await requestNotificationPermission();
      setPermission(getNotificationPermissionStatus());

      const result = await sendTestNotification('dailyHadith');

      if (result.deliveredToOS) {
        setFeedbackMsg({
          type: 'success',
          text: lang === 'en'
            ? 'Success! External alert sent directly to your phone screen and notification tray.'
            : 'تم بنجاح! خرج الإشعار كرسالة خارجية على شاشة هاتفك وشريط التنبيهات العلوي الآن 🔔',
        });
      } else {
        setFeedbackMsg({
          type: 'info',
          text: result.message,
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: `خطأ أثناء الفحص: ${err?.message || 'تعذر الإرسال'}`,
      });
    } finally {
      setIsFixing(false);
    }
  };

  const updateSetting = <K extends keyof NotificationScheduleConfig>(key: K, value: NotificationScheduleConfig[K]) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleTestNotification = async (type: Parameters<typeof sendTestNotification>[0]) => {
    setTestSentType(type);
    const result = await sendTestNotification(type);

    if (result.deliveredToOS) {
      setFeedbackMsg({
        type: 'success',
        text: lang === 'en'
          ? 'Alert dispatched to your device lockscreen and notification tray! 🔔'
          : 'خرج الإشعار بنجاح الآن كرسالة خارجية على شاشة هاتفك ودرج الإشعارات 🔔',
      });
    } else {
      setFeedbackMsg({
        type: 'info',
        text: result.message,
      });
    }

    setTimeout(() => setTestSentType(null), 2500);
  };

  const isSupported = isNotificationSupported();

  return (
    <div className="space-y-6">
      {/* رأس القسم والتحكم الرئيسي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {t('notificationsHeading', lang)}
            </h3>
            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/40">
              {lang === 'en' ? 'Live System Push' : 'إشعارات خارجية 📲'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lang === 'en'
              ? 'External alerts arrive on your phone lock screen and notification bar at exact prayer times.'
              : 'رسائل خارجية تصل إلى شاشة قفل هاتفك ودرج الإشعارات في مواقيتها الدقيقة حتى والتطبيق مقفول.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleQuickFixAndTest}
            disabled={isFixing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            title="فحص وإرسال إشعار فوري للتأكد"
          >
            <Wrench className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin' : ''}`} />
            <span>{isFixing ? (lang === 'en' ? 'Testing...' : 'جاري الفحص...') : t('notificationFixButton', lang)}</span>
          </button>

          <button
            type="button"
            onClick={handleEnableMasterToggle}
            disabled={isRequesting || !isSupported}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
              config.enabled && permission === 'granted'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {isRequesting ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : config.enabled && permission === 'granted' ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t('notificationsActive', lang)}</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>{t('enablePhoneNotifications', lang)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* لوحة التشخيص وحالة الجهاز */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {lang === 'en' ? 'Status:' : 'حالة الإذن:'}
            </span>
            <span className={`font-bold px-2 py-0.5 rounded-md ${
              permission === 'granted'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : permission === 'denied'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
            }`}>
              {permission === 'granted'
                ? (lang === 'en' ? 'Allowed ✓' : 'مسموح بها ✓')
                : permission === 'denied'
                ? (lang === 'en' ? 'Blocked 🚫' : 'محظورة 🚫')
                : (lang === 'en' ? 'Pending Permission ⚠️' : 'بانتظار موافقتك ⚠️')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleTestNotification('dailyHadith')}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Test Notification Now' : 'إرسال إشعار تجريبي فوري'}</span>
        </button>
      </div>

      {/* تنبيه أجهزة الآيفون (iOS Safari) */}
      {isIOS && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">
              {lang === 'en' ? 'Note for iPhone/iPad users:' : 'تنبيه لمستخدمي الآيفون (iOS):'}
            </span>
            <p className="leading-relaxed">
              {lang === 'en'
                ? 'Apple iOS requires adding the app to your Home Screen first to enable external push notifications. Tap Share 📤 then "Add to Home Screen".'
                : 'شركة آبل تشترط إضافة التطبيق إلى «الشاشة الرئيسية» أولاً لتفعيل إشعارات الهاتف الخارجية. اضغط على زر المشاركة 📤 ثم «إضافة إلى الشاشة الرئيسية».'}
            </p>
          </div>
        </div>
      )}

      {/* رسالة النتيجة أو الخطأ */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-900 dark:text-emerald-200'
            : feedbackMsg.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 text-rose-900 dark:text-rose-200'
            : 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 text-blue-900 dark:text-blue-200'
        }`}>
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* قائمة التنبيهات الـ 7 التفصيلية */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {lang === 'en' ? 'Scheduled Alerts & Times' : 'التنبيهات المجدولة ومواقيتها'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 1. أذكار الصباح */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationMorningTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationMorningDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.morningAdhkar}
                onChange={(e) => updateSetting('morningAdhkar', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.morningTime}
                  onChange={(e) => updateSetting('morningTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('morning')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'morning' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>

          {/* 2. أذكار المساء */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4 opacity-75" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationEveningTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationEveningDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.eveningAdhkar}
                onChange={(e) => updateSetting('eveningAdhkar', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.eveningTime}
                  onChange={(e) => updateSetting('eveningTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('evening')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'evening' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>

          {/* 3. قيام الليل والوتر */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationNightTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationNightDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.nightPrayer}
                onChange={(e) => updateSetting('nightPrayer', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.nightTime}
                  onChange={(e) => updateSetting('nightTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('night')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'night' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>

          {/* 4. حديث اليوم النبوي الشريف (إشعار خارجي) */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationHadithTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationHadithDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.dailyHadith}
                onChange={(e) => updateSetting('dailyHadith', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.dailyHadithTime}
                  onChange={(e) => updateSetting('dailyHadithTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('dailyHadith')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'dailyHadith' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>

          {/* 5. الصلاة على النبي ﷺ يوم الجمعة */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationFridaySalawatTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationFridaySalawatDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.fridaySalawat}
                onChange={(e) => updateSetting('fridaySalawat', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.fridaySalawatTime}
                  onChange={(e) => updateSetting('fridaySalawatTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('fridaySalawat')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'fridaySalawat' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>

          {/* 6. ساعة الاستجابة يوم الجمعة */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationFridayHourTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationFridayHourDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.fridayHour}
                onChange={(e) => updateSetting('fridayHour', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.fridayHourTime}
                  onChange={(e) => updateSetting('fridayHourTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('fridayHour')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'fridayHour' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>

          {/* 7. ختام اليوم */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3 md:col-span-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                    {t('notificationDailyReviewTitle', lang)}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t('notificationDailyReviewDesc', lang)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.dailyReview}
                onChange={(e) => updateSetting('dailyReview', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="time"
                  value={config.dailyReviewTime}
                  onChange={(e) => updateSetting('dailyReviewTime', e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleTestNotification('dailyReview')}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{testSentType === 'dailyReview' ? t('testSent', lang) : t('testOnPhone', lang)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
