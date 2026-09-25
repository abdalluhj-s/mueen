'use client';

import React from 'react';
import { X, Sparkles, Heart, Compass } from 'lucide-react';

interface EidSunanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EID_SUNAN = [
  {
    icon: '💧',
    title: 'الاغتسال والتطهر',
    desc: 'كان النبي ﷺ يغتسل يوم الفطر ويوم النحر، ويتطيب بأطيب ما يجد.',
  },
  {
    icon: '👔',
    title: 'لبس أحسن وأجمل الثياب',
    desc: 'إظهار الفرح بنعمة الله والتجمل ليوم العيد للصلاة ولقاء الإخوان.',
  },
  {
    icon: '🌴',
    title: 'أكل تمرات وتراً قبل الصلاة (في الفطر)',
    desc: 'السنة أن يفطر على تمرات وتراً (٣ أو ٥) قبل الخروج لمصلى عيد الفطر.',
  },
  {
    icon: '📢',
    title: 'التكبير والجهر به',
    desc: '«الله أكبر، الله أكبر، لا إله إلا الله، والله أكبر، الله أكبر، ولله الحمد».',
  },
  {
    icon: '🚶‍♂️',
    title: 'مخالفة الطريق',
    desc: 'أن يذهب إلى المصلى من طريق ويرجع من طريق آخر ليشهد له الطريقان.',
  },
  {
    icon: '🤝',
    title: 'التهنئة والدعاء بالقبول',
    desc: 'كان أصحاب النبي ﷺ إذا التقوا يوم العيد يقول بعضهم لبعض: «تقبل الله منا ومنكم».',
  },
  {
    icon: '🌸',
    title: 'صلة الأرحام وإدخال السرور',
    desc: 'زيارة الوالدين والأقارب وإكرام الأهل والأولاد والفقراء ونبذ الشحناء.',
  },
];

export const EidSunanModal: React.FC<EidSunanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200 dark:border-slate-800 space-y-4 max-h-[88vh] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">سنن وآداب الأعياد الإسلامية</h3>
              <p className="text-xs text-gray-400 font-serif">عيد الفطر المبارك وعيد الأضحى</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* صيغة التكبيرات */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-center space-y-1">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">صيغة تكبيرات العيد:</span>
          <p className="font-serif text-sm font-bold text-amber-950 dark:text-amber-300">
            «اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ»
          </p>
        </div>

        {/* قائمة السنن */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[50vh] scrollbar-none">
          {EID_SUNAN.map((s, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 flex items-start gap-3"
            >
              <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">{s.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
        >
          تقبل الله منا ومنكم صالح الأعمال ✨
        </button>
      </div>
    </div>
  );
};
