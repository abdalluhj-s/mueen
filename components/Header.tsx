'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Flame, Bell, User, LogIn, LogOut, CheckCheck, ShieldCheck, HeartHandshake, Calendar } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../lib/supabase/client';

interface HeaderProps {
  userStreak?: number;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'partner' | 'reminder' | 'streak';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'تذكير الورد المسائي',
    desc: 'لا تنسَ أذكار المساء وسورة الملك قبل النوم 🌿',
    time: 'منذ ساعة',
    unread: true,
    type: 'reminder',
  },
  {
    id: 'n2',
    title: 'تحفيز الشريك',
    desc: '«المؤمن للمؤمن كالبنيان يشد بعضه بعضاً» - واصل التزامك اليومي!',
    time: 'منذ 3 ساعات',
    unread: true,
    type: 'partner',
  },
  {
    id: 'n3',
    title: 'إنجاز متواصل',
    desc: 'مبارك مواصلتك لليوم التاسع على التوالي في أداء الصلوات 🌟',
    time: 'أمس',
    unread: false,
    type: 'streak',
  },
];

export const Header: React.FC<HeaderProps> = ({ userStreak = 9 }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // جلب الجلسة الحالية
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    }).catch(() => {
      setIsAuthLoading(false);
    });

    // الاستماع لتغييرات حالة تسجيل الدخول
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsProfileOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('خطأ في تسجيل الخروج:', err);
    }
  };

  const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'ضيف مُعين';
  const userAvatar = currentUser?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* الشعار واسم المنصة */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
              مُعين
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
                شريك الالتزام
              </span>
            </h1>
          </div>
        </Link>

        {/* معلومات المستخدم وسلسلة الالتزام والأدوات */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر السجل الشهري */}
          {currentUser && (
            <Link 
              href="/progress"
              className="hidden sm:flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200/70 text-xs sm:text-sm font-semibold hover:bg-gray-100 hover:text-emerald-700 transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>السجل</span>
            </Link>
          )}

          {/* عداد الالتزام المتواصل */}
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200/70 text-xs sm:text-sm font-semibold shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{userStreak} أيام التزام</span>
          </div>

          {/* قائمة التنبيهات (Notification Dropdown) */}
          <div className="relative" ref={bellRef}>
            <button
              type="button"
              aria-label="التنبيهات"
              onClick={() => {
                setIsBellOpen(!isBellOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-full text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* نافذة التنبيهات المنبثقة */}
            {isBellOpen && (
              <div
                dir="rtl"
                className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 text-sm">التنبيهات</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                        {unreadCount} جديدة
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>قراءة الكل</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border text-xs transition-colors ${
                          notif.unread
                            ? 'bg-emerald-50/40 border-emerald-100 text-gray-800'
                            : 'bg-gray-50/60 border-gray-100 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-1 text-gray-900">
                          <span className="flex items-center gap-1">
                            {notif.type === 'partner' && <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />}
                            {notif.type === 'reminder' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                            {notif.type === 'streak' && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal">{notif.time}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-[11px]">{notif.desc}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-xs text-gray-400">لا توجد تنبيهات جديدة</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* حساب المستخدم أو زر تسجيل الدخول */}
          {!isAuthLoading && (
            currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsBellOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-semibold text-sm hover:ring-2 hover:ring-emerald-400/50 transition-all cursor-pointer overflow-hidden"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0)
                  )}
                </button>

                {/* قائمة الملف الشخصي المنبثقة */}
                {isProfileOpen && (
                  <div
                    dir="rtl"
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                      <div className="font-bold text-gray-900 text-sm truncate">{userName}</div>
                      <div className="text-[11px] text-gray-400 truncate">{currentUser.email}</div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تسجيل الدخول</span>
                <span className="sm:hidden">دخول</span>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};
