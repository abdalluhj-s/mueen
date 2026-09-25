'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Sparkles,
  MessageCircle,
  Send,
  Link as LinkIcon
} from 'lucide-react';
import { SHARE_CONTENT } from '../lib/shareContent';
import { getSavedLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../lib/translations';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLang?: Language;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  isOpen,
  onClose,
  defaultLang,
}) => {
  const [appLang, setAppLang] = useState<Language>(() => defaultLang || getSavedLanguage());
  // تبويب لغة المشاركة (يبدأ بنفس لغة التطبيق الحالية كافتراضي، مع إمكانية التبديل بنقرة واحدة)
  const [selectedShareLang, setSelectedShareLang] = useState<Language>(() => defaultLang || getSavedLanguage());
  const [copiedType, setCopiedType] = useState<'none' | 'full' | 'link'>('none');
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = defaultLang || getSavedLanguage();
      setAppLang(current);
      setSelectedShareLang(current);
      setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);

      const handleLangChange = (e: any) => {
        const newL = e?.detail?.lang || getSavedLanguage();
        setAppLang(newL);
      };

      window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
      return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangChange);
    }
  }, [defaultLang, isOpen]);

  // تحديث اللغة المختارة عند فتح المودال بناءً على لغة التطبيق الحالية
  useEffect(() => {
    if (isOpen) {
      const current = getSavedLanguage();
      setAppLang(current);
      setSelectedShareLang(current);
      setCopiedType('none');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const content = SHARE_CONTENT[selectedShareLang];
  const isRtlPreview = selectedShareLang === 'ar';

  // نسخ الرسالة الكاملة
  const handleCopyFull = async () => {
    try {
      await navigator.clipboard.writeText(content.text);
      setCopiedType('full');
      setTimeout(() => setCopiedType('none'), 3000);
    } catch {
      // Fallback
      fallbackCopy(content.text);
      setCopiedType('full');
      setTimeout(() => setCopiedType('none'), 3000);
    }
  };

  // نسخ الرابط المباشر فقط
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(content.url);
      setCopiedType('link');
      setTimeout(() => setCopiedType('none'), 3000);
    } catch {
      fallbackCopy(content.url);
      setCopiedType('link');
      setTimeout(() => setCopiedType('none'), 3000);
    }
  };

  // المشاركة عبر واجهة الهاتف الأصلية (Web Share API)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.shortSummary,
          url: content.url,
        });
      } catch (err: any) {
        // إذا قام المستخدم بالإلغاء لا نعرض خطأ
        if (err.name !== 'AbortError') {
          handleCopyFull();
        }
      }
    } else {
      handleCopyFull();
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  // روابط المشاركة المباشرة
  const encodedText = encodeURIComponent(`${content.shortSummary}\n\n${content.url}`);
  const encodedFullText = encodeURIComponent(content.text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedFullText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.shortSummary)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.shortSummary)}&url=${encodeURIComponent(content.url)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-emerald-950/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-1.5">
                {t('shareAppTitle', appLang)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t('shareAppSubtitle', appLang)}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى النافذة القابل للتمرير */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* شريط تبديل لغة المشاركة (عربي / إنجليزي) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span>{appLang === 'ar' ? 'اختر لغة الوصف والرابط للمشاركة:' : 'Choose sharing language & link:'}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                {selectedShareLang === 'ar' ? 'Arabic ?lang=ar' : 'English ?lang=en'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 dark:bg-slate-800/80 rounded-2xl border border-gray-200/80 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => { setSelectedShareLang('ar'); setCopiedType('none'); }}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedShareLang === 'ar'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{t('shareLangTabAr', appLang)}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedShareLang('en'); setCopiedType('none'); }}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedShareLang === 'en'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{t('shareLangTabEn', appLang)}</span>
              </button>
            </div>
          </div>

          {/* تنبيه نجاح النسخ الإيجابي */}
          {copiedType !== 'none' && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200 shadow-xs">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">
                {copiedType === 'full' ? t('copiedSuccessToast', appLang) : t('copiedLinkToast', appLang)}
              </span>
            </div>
          )}

          {/* شريط الرابط المباشر السريع */}
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono" dir="ltr">
              <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{content.url}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              title={t('copyLinkOnly', appLang)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {copiedType === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{t('copyLinkOnly', appLang).replace(' 🔗', '')}</span>
            </button>
          </div>

          {/* معاينة النص الكامل المخصص للمشاركة */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {appLang === 'ar' ? 'معاينة نص الرسالة التي ستُرسل:' : 'Message preview:'}
              </span>
              <span className="text-[11px] text-gray-400">
                {selectedShareLang === 'ar' ? 'لغة عربية' : 'English'}
              </span>
            </div>

            <div 
              dir={isRtlPreview ? 'rtl' : 'ltr'}
              className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200/80 dark:border-slate-800 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans max-h-56 overflow-y-auto select-all whitespace-pre-line shadow-inner"
            >
              {content.text}
            </div>
          </div>

          {/* أزرار المشاركة المباشرة عبر شبكات التواصل */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {appLang === 'ar' ? 'مشاركة فورية عبر:' : 'Quick share via:'}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* واتساب */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('shareWhatsApp', appLang)}</span>
              </a>

              {/* تيليجرام */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
              >
                <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('shareTelegram', appLang)}</span>
              </a>

              {/* إكس / تويتر */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 border border-gray-400/30 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
              >
                <span className="font-mono text-sm group-hover:scale-110 transition-transform">𝕏</span>
                <span>{t('shareTwitter', appLang)}</span>
              </a>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات السفلية */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/70 dark:bg-slate-900/70 flex flex-col sm:flex-row gap-2.5">
          {/* زر نسخ الرسالة كاملة */}
          <button
            type="button"
            onClick={handleCopyFull}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-[0.98]"
          >
            {copiedType === 'full' ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t('copiedSuccessToast', appLang)}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t('copyFullMessage', appLang)}</span>
              </>
            )}
          </button>

          {/* زر مشاركة عبر الهاتف إذا كانت مدعومة */}
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300/80 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700/80 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('nativeShareBtn', appLang)}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
