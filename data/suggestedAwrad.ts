import { HabitCategory } from '../types/dashboard';

export interface SuggestedAwradItem {
  id: string;
  title: string;
  category: HabitCategory;
  timeHint: string;
  icon: string;
  benefit: string;
}

export const SUGGESTED_AWRAD: SuggestedAwradItem[] = [
  {
    id: 'sug_silat_rahim',
    title: 'صلة الرحم (اتصال، زيارة، أو إحسان)',
    category: 'بر',
    timeHint: 'خلال اليوم',
    icon: '🌸',
    benefit: 'سعة في الرزق وبركة في العمر ورضا من الرحمن.',
  },
  {
    id: 'sug_birr_walidayn',
    title: 'بر الوالدين (خدمة، دعاء، أو مهاتفة)',
    category: 'بر',
    timeHint: 'خلال اليوم',
    icon: '💖',
    benefit: 'أعظم القربات بعد الصلاة ومفتاح أبواب الجنة.',
  },
  {
    id: 'sug_ziyarat_mareed',
    title: 'زيارة مريض أو الاطمئنان عليه',
    category: 'بر',
    timeHint: 'خلال اليوم',
    icon: '🏥',
    benefit: 'في خرفة الجنة حتى يرجع ويصلي عليه سبعون ألف ملك.',
  },
  {
    id: 'sug_ziyarat_akh',
    title: 'زيارة أخ في الله أو سؤاله عن حاله',
    category: 'بر',
    timeHint: 'خلال اليوم',
    icon: '🤝',
    benefit: '«وجبت محبتي للمتزاورين فيَّ» (حديث قدسي).',
  },
  {
    id: 'sug_daroos_ilm',
    title: 'حضور أو استماع لدرس علم نافع',
    category: 'علم',
    timeHint: '١٥ - ٣٠ دقيقة',
    icon: '🎓',
    benefit: 'طريق مسهل إلى الجنة وتحفّه الملائكة وتغشاه الرحمة.',
  },
  {
    id: 'sug_itqan_amal',
    title: 'الاجتهاد والإتقان في العمل الدنيوي',
    category: 'عام',
    timeHint: 'ساعات العمل',
    icon: '💼',
    benefit: '«إن الله يحب إذا عمل أحدكم عملاً أن يتقنه».',
  },
  {
    id: 'sug_hifz_quran',
    title: 'حفظ ومراجعة ورد جديد من القرآن',
    category: 'قرآن',
    timeHint: 'نصف صفحة أو آيات محددة',
    icon: '📖',
    benefit: 'يقال لصاحب القرآن اقرأ وارتقِ ورتل كما كنت ترتل في الدنيا.',
  },
  {
    id: 'sug_qiraat_tafsir',
    title: 'قراءة ورد التفسير الميسر وتدبر الآيات',
    category: 'علم',
    timeHint: 'مع ورد القرآن',
    icon: '📜',
    benefit: 'فهم كلام الله وتحقيق الغاية من إنزاله «ليدبروا آياته».',
  },
  {
    id: 'sug_qiraat_kitab',
    title: 'قراءة في كتاب نافع (١٥ دقيقة)',
    category: 'علم',
    timeHint: 'وقت القراءة اليومي',
    icon: '📚',
    benefit: 'تنمية العقل وبناء الوعي وزكاة الوقت.',
  },
  {
    id: 'sug_salat_duha',
    title: 'صلاة الضحى (ركعتان فأكثر)',
    category: 'سنة',
    timeHint: 'بعد الشروق بربع ساعة حتى قبل الظهر',
    icon: '☀️',
    benefit: 'صدقة عن كل مفصل من مفاصل الجسد (صلاة الأوابين).',
  },
  {
    id: 'sug_sadaqah',
    title: 'صدقة يومية ولو بالقليل أو إطعام طعام',
    category: 'بر',
    timeHint: 'خلال اليوم',
    icon: '🪙',
    benefit: '«والصدقة تطفئ الخطيئة كما يطفئ الماء النار».',
  },
  {
    id: 'sug_istighfar',
    title: 'الاستغفار والتوبة (١٠٠ مرة)',
    category: 'أذكار',
    timeHint: 'خلال اليوم',
    icon: '📿',
    benefit: 'سبب لمغفرة الذنوب وتفريج الهموم وجلب الأرزاق والأمطار.',
  },
];
