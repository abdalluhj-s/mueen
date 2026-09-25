'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
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
  Flame,
  Volume2
} from 'lucide-react';
import { 
  NotificationScheduleConfig, 
  getSavedNotificationConfig, 
  saveNotificationConfig, 
  requestNotificationPermission, 
  getNotificationPermissionStatus,
  sendTestNotification,
  isNotificationSupported
} from '../lib/notifications';

export const NotificationSettingsCard: React.FC = () => {
  const [config, setConfig] = useState<NotificationScheduleConfig>(() => getSavedNotificationConfig());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSentType, setTestSentType] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    setPermission(getNotificationPermissionStatus());
    const handleConfigChange = () => {
      setConfig(getSavedNotificationConfig());
      setPermission(getNotificationPermissionStatus());
    };
    window.addEventListener('mueen_notification_config_changed', handleConfigChange);
    return () => {
      window.removeEventListener('mueen_notification_config_changed', handleConfigChange);
    };
  }, []);

  const handleEnableMasterToggle = async () => {
    if (permission !== 'granted') {
      setIsRequesting(true);
      const granted = await requestNotificationPermission();
      setIsRequesting(false);
      setPermission(getNotificationPermissionStatus());
      if (granted) {
        const updated = { ...config, enabled: true };
        setConfig(updated);
        saveNotificationConfig(updated);
        setFeedbackMsg('تم تفعيل إشعارات الهاتف بنجاح! سنرسل لك تذكيراً تجريبياً الآن.');
        sendTestNotification('morning');
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        setFeedbackMsg('يرجى السماح بالإشعارات من نافذة المتصفح لتفعيل التنبيهات على هاتفك.');
        setTimeout(() => setFeedbackMsg(null), 5000);
      }
    } else {
      const updated = { ...config, enabled: !config.enabled };
      setConfig(updated);
      saveNotificationConfig(updated);
    }
  };

  const updateSetting = <K extends keyof NotificationScheduleConfig>(key: K, value: NotificationScheduleConfig[K]) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleTestNotification = async (type: Parameters<typeof sendTestNotification>[0]) => {
    if (permission !== 'granted') {
      const granted = await requestNotificationPermission();
      setPermission(getNotificationPermissionStatus());
      if (!granted) {
        alert('يرجى السماح بالإشعارات أولاً لتتمكن من استقبال رسائل التنبيه على هاتفك.');
        return;
      }
    }
    setTestSentType(type);
    await sendTestNotification(type);
    setTimeout(() => setTestSentType(null), 2500);
  };

  const isSupported = isNotificationSupported();

  return (
    <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* رأس القسم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                إشعارات الهاتف وتنبيهات الأوراد
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/40">
                جديد 📲
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              رسائل خارجية تصل إلى شاشة قفل هاتفك ودرج الإشعارات في مواقيتها الدقيقة
            </p>
          </div>
        </div>

        {/* المفتاح الرئيسي العام */}
        <button
          type="button"
          onClick={handleEnableMasterToggle}
          disabled={isRequesting || !isSupported}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
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
              <span>مفعلة على الهاتف</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>تفعيل إشعارات الهاتف</span>
            </>
          )}
        </button>
      </div>

      {/* تنبيه حالة إذن المتصفح */}
      {!isSupported ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>المتصفح الحالي لا يدعم إشعارات الويب، يرجى استخدام متصفح Chrome أو إضافة التطبيق للشاشة الرئيسية (PWA).</span>
        </div>
      ) : permission === 'denied' ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>الإشعارات محظورة في إعدادات المتصفح. اضغط على أيقونة القفل أو الإعدادات بجانب شريط العنوان واختر «السماح بالإشعارات» لتصلك التنبيهات.</span>
        </div>
      ) : permission !== 'granted' ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>اضغط على الزر أعلاه لمنح إذن الإشعارات لتصلك رسائل التذكير على شاشة الموبايل خارج التطبيق.</span>
          </div>
        </div>
      ) : null}

      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* قائمة التنبيهات الـ 7 التفصيلية المطابقة لطلب المستخدم */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          التنبيهات المجدولة ومواقيتها
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
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">أذكار الصباح</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">قبل شروق الشمس بنصف ساعة</p>
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
                <span>{testSentType === 'morning' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
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
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">أذكار المساء</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">قبل غروب الشمس بنصف ساعة</p>
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
                <span>{testSentType === 'evening' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
              </button>
            </div>
          </div>

          {/* 3. قيام الليل والوتر (الساعة 10 مساءً) */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">صلاة الوتر وقيام الليل</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">تذكير الساعة 10:00 مساءً</p>
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
                <span>{testSentType === 'night' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
              </button>
            </div>
          </div>

          {/* 4. حديث اليوم النبوي الشريف كإشعار خارجي */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">حديث اليوم النبوي (إشعار خارجي)</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">يصلك نص الحديث كرسالة على الهاتف صباحاً</p>
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
                <span>{testSentType === 'dailyHadith' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
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
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">الصلاة على النبي ﷺ (الجمعة)</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">تذكير الصباح بيوم الجمعة المبارك</p>
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
                <span>{testSentType === 'fridaySalawat' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
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
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">ساعة الاستجابة (عصر الجمعة)</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">آخر ساعة قبل مغرب الجمعة</p>
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
                <span>{testSentType === 'fridayHour' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
              </button>
            </div>
          </div>

          {/* 7. ختام اليوم: هل أنهيت أوراد اليوم؟ */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between gap-3 md:col-span-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">ختام اليوم: «هل أنهيت أوراد اليوم؟»</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">تذكير مسائي لتسجيل إنجازك وتثبيت عاداتك في مُعين قبل النوم</p>
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
                <span>{testSentType === 'dailyReview' ? 'تم الإرسال ✓' : 'تجربة على الهاتف'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
