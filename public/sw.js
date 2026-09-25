// Service Worker for Mueen (مُعين) PWA & Device Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// التعامل مع إشعارات Push الخارجية
self.addEventListener('push', (event) => {
  let title = 'مُعين | رفيق الالتزام';
  let options = {
    body: 'لا تنسَ وردك اليومي وتثبيت عاداتك في مُعين',
    icon: '/logo.jpg',
    badge: '/icons/icon-192.svg',
    vibrate: [200, 100, 200],
    tag: 'mueen-alert',
    renotify: true,
    data: { url: '/' }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      if (data.title) title = data.title;
      if (data.body) options.body = data.body;
      if (data.icon) options.icon = data.icon;
      if (data.url) options.data.url = data.url;
      if (data.tag) options.tag = data.tag;
    } catch {
      options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// عند نقر المستخدم على الإشعار من شاشة القفل أو درج الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if (client.url !== targetUrl && 'navigate' in client) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
