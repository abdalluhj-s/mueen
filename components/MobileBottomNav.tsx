'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookMarked, BookOpen, Calendar, User, Download, Sparkles, X } from 'lucide-react';
import { createClient } from '../lib/supabase/client';
import { ProfileEditModal } from './ProfileEditModal';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    }).catch(() => {});

    // اكتشاف هل الجهاز آيفون
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    }

    // الاستماع لحدث تثبيت التطبيق للأندرويد
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // إظهار زر التثبيت إذا لم يكن مثبتاً بالفعل
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // إظهار إرشادات الآيفون
      alert(
        isIOS
          ? 'لتثبيت التطبيق على الآيفون:\n1. اضغط على زر المشاركة (Share) أسفل الشاشة 📤\n2. اختار "إضافة إلى الشاشة الرئيسية" (Add to Home Screen) 📲'
          : 'لتثبيت التطبيق: افتح قائمة المتصفح (الثلاث نقط) واضغط على "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
      );
    }
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navItems = [
    {
      label: 'الرئيسية',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'الأذكار',
      href: '/adhkar',
      icon: BookMarked,
      isActive: pathname.startsWith('/adhkar'),
    },
    {
      label: 'المصحف',
      href: '/quran',
      icon: BookOpen,
      isActive: pathname.startsWith('/quran'),
    },
    {
      label: 'السجل',
      href: '/progress',
      icon: Calendar,
      isActive: pathname.startsWith('/progress'),
    },
    {
      label: currentUser ? 'حسابي' : 'دخول',
      href: currentUser ? '#' : '/login',
      icon: User,
      isActive: pathname === '/login' || isProfileModalOpen,
      onClick: currentUser ? (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProfileModalOpen(true);
      } : undefined,
    },
  ];

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mueen_user_avatar');
      if (saved) setLocalAvatar(saved);
    }
  }, []);

  const userAvatar = localAvatar || currentUser?.user_metadata?.avatar_url;

  return (
    <>
      {/* نافذة تعديل الملف الشخصي للهاتف */}
      {currentUser && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentName={currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || ''}
          currentAvatar={userAvatar || ''}
          onProfileUpdated={(updated: { fullName: string; avatarUrl: string }) => {
            setLocalAvatar(updated.avatarUrl);
            setCurrentUser((prev: any) => ({
              ...prev,
              user_metadata: {
                ...prev?.user_metadata,
                full_name: updated.fullName,
                avatar_url: updated.avatarUrl,
              },
            }));
          }}
        />
      )}

      {/* شريط تثبيت التطبيق الذكي للهواتف (PWA Install Banner) */}
      {showInstallPrompt && (
        <aside 
          aria-label="تثبيت التطبيق"
          className="fixed bottom-20 inset-x-3 z-40 sm:hidden bg-gradient-to-l from-emerald-800 to-teal-900 text-white rounded-2xl p-3.5 shadow-xl border border-emerald-500/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm">تثبيت تطبيق مُعين 📲</h3>
              <p className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
                تصفح أسرع وإشعارات بدون متصفح
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-xs hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت</span>
            </button>
            <button
              type="button"
              onClick={() => setShowInstallPrompt(false)}
              aria-label="إغلاق التنبيه"
              className="p-1 rounded-lg text-emerald-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* الشريط السفلي الثابت للهاتف (Native Mobile Bottom Bar) */}
      <nav 
        dir="rtl" 
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 shadow-lg px-2 py-1.5 transition-colors duration-200 safe-area-pb"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                  item.isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all flex items-center justify-center ${
                  item.isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400' 
                    : ''
                }`}>
                  {item.icon === User && userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="حسابي"
                      className="w-5 h-5 rounded-full object-cover border border-emerald-600 shadow-2xs"
                    />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
