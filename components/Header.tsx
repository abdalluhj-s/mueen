'use strict';
import React from 'react';
import { Sparkles, Flame, Bell, User } from 'lucide-react';
import { UserStats } from '../types/dashboard';

interface HeaderProps {
  user: UserStats;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* الشعار واسم المنصة */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
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
        </div>

        {/* معلومات المستخدم وسلسلة الالتزام */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* عداد الالتزام المتواصل */}
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200/70 text-xs sm:text-sm font-semibold shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{user.streakDays} أيام التزام</span>
          </div>

          {/* تنبيهات ورسائل الشريك */}
          <button 
            type="button" 
            aria-label="التنبيهات"
            className="p-2 rounded-full text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* الصورة الشخصية */}
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-semibold text-sm">
            {user.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};
