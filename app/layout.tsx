import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { NotificationInitializer } from '../components/NotificationInitializer';

export const viewport: Viewport = {
  themeColor: '#065f46',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'مُعين | منصة تثبيت العادات الدينية ورفيق الالتزام',
  description: 'منصة ويب وتطبيق تفاعلي لمتابعة الصلوات، ورد القرآن، والأذكار بنظام شريك الالتزام اليومي',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'مُعين',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('mueen_theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  var fontSize = localStorage.getItem('mueen_font_size') || 'md';
                  document.documentElement.setAttribute('data-font-size', fontSize);

                  var colorTheme = localStorage.getItem('mueen_color_theme') || 'emerald';
                  document.documentElement.setAttribute('data-color-theme', colorTheme);

                  var urlParams = new URLSearchParams(window.location.search);
                  var paramLang = urlParams.get('lang');
                  var lang = (paramLang === 'en' || paramLang === 'ar') ? paramLang : (localStorage.getItem('mueen_language') || 'ar');
                  if (paramLang === 'en' || paramLang === 'ar') {
                    localStorage.setItem('mueen_language', paramLang);
                  }
                  document.documentElement.setAttribute('lang', lang);
                  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased min-h-screen selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100 transition-colors duration-200 pb-20 sm:pb-0">
        <NotificationInitializer />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
