// Mueen (مُعين) Official Share Descriptions and Direct Links (Bilingual: Arabic & English)
// Dynamic Origin: Automatically adopts current browser origin (window.location.origin) or Cloudflare Workers default

export interface ShareData {
  title: string;
  url: string;
  shortSummary: string;
  text: string;
}

export function getShareContent(lang: 'ar' | 'en', baseOrigin?: string): ShareData {
  let origin = baseOrigin;
  if (!origin && typeof window !== 'undefined' && window.location.origin) {
    origin = window.location.origin;
  }
  if (!origin) {
    origin = 'https://mueen.ah4549658.workers.dev';
  }
  const cleanOrigin = origin.replace(/\/$/, '');
  const url = `${cleanOrigin}/?lang=${lang}`;

  if (lang === 'ar') {
    return {
      title: 'منصة وتطبيق مُعين | رفيق الالتزام بالطاعات',
      url,
      shortSummary: 'مُعين — رفيقك اليومي للثبات على الطاعات، الصلوات الخمس وسننها، ورد القرآن، والأذكار بنظام شريك الالتزام.',
      text: `السلام عليكم ورحمة الله وبركاته 🌿

أحببت أن أشارككم منصة وتطبيق «مُعين» (Mueen) — رفيقك اليومي للثبات على الطاعات وبناء العادات الإيمانية 🕌

✨ ما هي فكرة مُعين وإيه اللي بنعمله؟
مُعين مش مجرد تطبيق أذكار عادي، هو منصة تفاعلية صُممت لتكون "شريك التزام" حقيقي يعينك على الاستمرار في طاعة الله:

1️⃣ متابعة الصلوات الخمس والسنن الرواتب: جدول زمني منظم يوضح مواقيت الصلوات وسننها المؤكدة (القبلية والبعدية) وأذكار ما بعد الصلاة.
2️⃣ ورد القرآن الكريم: مصحف نظيف ومريح للقراءة مع حفظ مكان وقوفك الأخير تلقائياً.
3️⃣ الأذكار والسبحة الرقمية: أذكار الصباح والمساء، أذكار النوم، وسبحة رقمية للأوراد.
4️⃣ سنن وبركات يوم الجمعة: تظهر تلقائياً كل جمعة لتذكيرك بقراءة سورة الكهف، الصلاة على النبي ﷺ، وساعة الاستجابة.
5️⃣ صيام التطوع الموسمي: ينبهك لأيام صيام الإثنين والخميس، والأيام البيض (13، 14، 15)، والمناسبات الشرعية (عاشوراء، ذو الحجة).
6️⃣ شريك المسير (Accountability Partner): ميزة فريدة تتيح لك ربط حسابك مع صديق أو رفيق مقرب لمتابعة إنجاز بعضكما اليومي وتشجيعه بالدعاء والرسائل.
7️⃣ إشعارات خارجية على الهاتف: تنبيهات حقيقية على شاشة القفل قبل شروق الشمس، قبل الغروب، قيام الليل، وحديث اليوم النبوي الشريف.
8️⃣ سجل الإنجاز والتقويم: لمراجعة أيام التزامك واستدراك ما فاتك بكل سهولة.

🌐 رابط الدخول المباشر:
${url}

جربوه وشاركوه مع من تحبون، فالدال على الخير كفاعله 🤍`,
    };
  }

  return {
    title: 'Mueen Platform | Spiritual Habit & Accountability Partner',
    url,
    shortSummary: 'Mueen — Your daily spiritual habit & accountability partner for prayers, Quran, adhkar, and fasting.',
    text: `Assalamu Alaikum / Greetings! 🌿

I would like to share with you «Mueen» (مُعين) — a dedicated spiritual habit tracker and daily accountability companion 🕌

✨ What is Mueen & What is our mission?
Staying consistent with daily worship can be challenging in a busy world. Mueen was created to be your friendly, daily spiritual partner to keep you focused, motivated, and consistent without burnout:

1️⃣ Daily 5 Prayers & Confirmed Sunan: A clean timeline tracking obligatory prayers alongside their Sunnah Rawatib and post-prayer adhkar.
2️⃣ Daily Quran Portion: A clean, distraction-free Mushaf that automatically saves your last read position.
3️⃣ Morning & Evening Adhkar: Daily authentic fortress reminders, sleep adhkar, and an interactive digital Sebha (Tasbih).
4️⃣ Blessed Friday Hub: Automatically activates every Friday with reminders for Surah Al-Kahf, abundant Salawat upon the Prophet ﷺ, and the golden hour of Dua (Hour of Response).
5️⃣ Voluntary Fasting Calendar: Smart reminders for fasting Mondays & Thursdays, the White Days (13th, 14th, 15th of the Hijri month), and special seasonal days.
6️⃣ Accountability Partner System: Connect with a close friend or family member to view each other’s daily streak and send encouraging prayers.
7️⃣ External Phone Push Notifications: Real lockscreen reminders before sunrise, before sunset, for Qiyam Al-Layl (Witr), and daily Hadith reflections.
8️⃣ Progress Calendar & Make-up Log: View your monthly consistency and easily make up or log any missed portions.

🌐 Direct Access Link (English Interface):
${url}

Feel free to check it out, install it on your home screen, and share it with friends! 🤍`,
  };
}

export const SHARE_CONTENT: Record<'ar' | 'en', ShareData> = {
  get ar() {
    return getShareContent('ar');
  },
  get en() {
    return getShareContent('en');
  },
};
