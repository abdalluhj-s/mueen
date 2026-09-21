import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مُعين | رفيق الالتزام وتثبيت العادات',
    short_name: 'مُعين',
    description: 'منصة لتثبيت العادات الدينية اليومية والصلوات والأوراد بنظام شريك الالتزام',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#065f46',
    orientation: 'portrait',
    dir: 'rtl',
    lang: 'ar',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
