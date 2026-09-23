'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Share,
  PlusSquare,
  Smartphone,
  Monitor,
  CheckCircle,
  Copy,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  hasNativePrompt: boolean;
  isIOS: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  hasNativePrompt,
  isIOS,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden transition-all duration-200 animate-in zoom-in-95 duration-150"
      >
        {/* رأس النافذة */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 via-transparent to-teal-50/40 dark:from-emerald-950/20 dark:to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                تثبيت مُعين على جهازك
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                كتطبيق سريع بدون متجر وسهل الوصول 📱
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم النافذة */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* زر التثبيت المباشر إن توفر بالمتصفح */}
          {hasNativePrompt && onNativeInstall && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 text-center space-y-2">
              <p className="text-emerald-900 dark:text-emerald-200 font-bold text-xs">
                متصفحك يدعم التثبيت المباشر بنقرة واحدة!
              </p>
              <button
                type="button"
                onClick={() => {
                  onNativeInstall();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق الآن 🚀</span>
              </button>
            </div>
          )}

          {/* خطوات هواتف آيفون وآيباد iOS */}
          {isIOS ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>طريقة التثبيت على أجهزة iPhone و iPad:</span>
              </div>

              <div className="space-y-2 bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    اضغط على زر المشاركة{' '}
                    <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-500" /> في أسفل
                    متصفح Safari.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    مرر لأسفل القائمة واختر{' '}
                    <strong className="text-gray-900 dark:text-white">
                      «إضافة إلى الشاشة الرئيسية (Add to Home Screen)»
                    </strong>
                    <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-emerald-600" />.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    اضغط على كلمة <strong className="text-emerald-700 dark:text-emerald-400">«إضافة»</strong> في الزاوية العلوية، وستظهر أيقونة التطبيق على شاشتك فوراً!
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* خطوات أجهزة أندرويد والكمبيوتر */
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>طريقة التثبيت على أجهزة Android والكمبيوتر:</span>
              </div>

              <div className="space-y-2 bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    انقر على قائمة المتصفح <strong>( الثلاث نقاط ⋮ )</strong> في الزاوية بالأعلى أو الأسفل.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    اختر <strong className="text-gray-900 dark:text-white">«تثبيت التطبيق (Install app)»</strong> أو <strong className="text-gray-900 dark:text-white">«إضافة إلى الشاشة الرئيسية»</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    وافق على التثبيت، وسيفتح معك التطبيق بملء الشاشة وبدون شريط عنوان المتصفح!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ميزات التطبيق المثبت */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>يعمل بدون شريط متصفح كأي تطبيق رسمي</span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>سرعة فائقة وخفة في فتح الأوراد</span>
            </div>
          </div>
        </div>

        {/* أسفل النافذة */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم نسخ الرابط!' : 'نسخ رابط التطبيق'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  );
};
