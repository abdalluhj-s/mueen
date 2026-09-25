'use client';

import { useEffect } from 'react';
import { registerServiceWorker, checkAndTriggerScheduledNotifications } from '../lib/notifications';

export const NotificationInitializer = () => {
  useEffect(() => {
    // 1. تسجيل الـ Service Worker
    registerServiceWorker();

    // 2. فحص أولي فوري للإشعارات المجدولة
    checkAndTriggerScheduledNotifications();

    // 3. فاحص دوري كل 60 ثانية لمقارنة مواقيت التنبيهات مع ساعة الهاتف المحلية
    const timer = setInterval(() => {
      checkAndTriggerScheduledNotifications();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return null;
};
