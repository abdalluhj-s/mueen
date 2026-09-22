'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, User, Image, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar?: string;
  onProfileUpdated: (updated: { fullName: string; avatarUrl: string }) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentAvatar = '',
  onProfileUpdated,
}) => {
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setAvatar(currentAvatar);
      setError(null);
    }
  }, [isOpen, currentName, currentAvatar]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة الاسم');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const supabase = createClient();

      const finalAvatar = customAvatarUrl.trim() || avatar;

      // 1. تحديث بيانات المستخدم في Supabase Auth
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          avatar_url: finalAvatar,
        },
      });

      if (updateError) throw updateError;

      // 2. تحديث جدول profiles
      if (data?.user?.id) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name.trim(),
          avatar_url: finalAvatar,
        });
      }

      onProfileUpdated({
        fullName: name.trim(),
        avatarUrl: finalAvatar,
      });

      onClose();
    } catch (err: any) {
      console.error('خطأ في حفظ الملف الشخصي:', err);
      setError(err?.message || 'تعذر حفظ التغييرات. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        dir="rtl"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-5 text-gray-900 dark:text-slate-100"
      >
        {/* الترويسة */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base sm:text-lg">تعديل الملف الشخصي</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* حقل الاسم */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              الاسم المعروض
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك أو كنيتك"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* اختيار الصورة الشخصية */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              اختر صورة شخصية
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_AVATARS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAvatar(imgUrl);
                    setCustomAvatarUrl('');
                  }}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer relative group ${
                    avatar === imgUrl && !customAvatarUrl
                      ? 'border-emerald-600 scale-105 shadow-md shadow-emerald-600/30'
                      : 'border-transparent hover:border-emerald-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                  {avatar === imgUrl && !customAvatarUrl && (
                    <div className="absolute inset-0 bg-emerald-700/30 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* أو رابط صورة مخصص */}
            <div className="space-y-1">
              <label className="block text-[11px] text-gray-500 dark:text-gray-400">
                أو ضع رابط صورة خارجية (اختياري):
              </label>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
              {error}
            </p>
          )}

          {/* أزرار الإجراء */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ الحفظ...</span>
                </>
              ) : (
                <span>حفظ التعديلات</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
