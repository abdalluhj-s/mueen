import { PageData } from '../components/quran/types';

/**
 * بيانات الصفحات الأساسية للمصحف الشريف مخزنة محلياً لضمان الفتح الفوري بدون انتظار شبكة الإنترنت
 * تشمل: الفاتحة (صفحة 1)، بداية البقرة (صفحة 2)، الكهف (صفحة 293)، الملك (صفحة 562)، والمعوذات (صفحة 604)
 */
export const QURAN_FALLBACK_PAGES: Record<number, PageData> = {
  1: {
    pageNumber: 1,
    juzNumber: 1,
    hizbQuarter: 1,
    surahsOnPage: [],
    ayahs: [
      { number: 1, numberInSurah: 1, text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false },
      { number: 2, numberInSurah: 2, text: "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِینَ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false },
      { number: 3, numberInSurah: 3, text: "ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false },
      { number: 4, numberInSurah: 4, text: "مَـٰلِكِ یَوۡمِ ٱلدِّینِ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false },
      { number: 5, numberInSurah: 5, text: "إِیَّاكَ نَعۡبُدُ وَإِیَّاكَ نَسۡتَعِینُ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false },
      { number: 6, numberInSurah: 6, text: "ٱهۡدِنَا ٱلصِّرَ ٰ⁠طَ ٱلۡمُسۡتَقِیمَ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false },
      { number: 7, numberInSurah: 7, text: "صِرَ ٰ⁠طَ ٱلَّذِینَ أَنۡعَمۡتَ عَلَیۡهِمۡ غَیۡرِ ٱلۡمَغۡضُوبِ عَلَیۡهِمۡ وَلَا ٱلضَّاۤلِّینَ", surahNumber: 1, surahName: "الفاتحة", juz: 1, page: 1, hizbQuarter: 1, sajda: false }
    ]
  },
  2: {
    pageNumber: 2,
    juzNumber: 1,
    hizbQuarter: 1,
    surahsOnPage: [],
    ayahs: [
      { number: 8, numberInSurah: 1, text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ الۤمۤ", surahNumber: 2, surahName: "البقرة", juz: 1, page: 2, hizbQuarter: 1, sajda: false },
      { number: 9, numberInSurah: 2, text: "ذَ ٰ⁠لِكَ ٱلۡكِتَـٰبُ لَا رَیۡبَۛ فِیهِۛ هُدࣰى لِّلۡمُتَّقِینَ", surahNumber: 2, surahName: "البقرة", juz: 1, page: 2, hizbQuarter: 1, sajda: false },
      { number: 10, numberInSurah: 3, text: "ٱلَّذِینَ یُؤۡمِنُونَ بِٱلۡغَیۡبِ وَیُقِیمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقۡنَـٰهُمۡ یُنفِقُونَ", surahNumber: 2, surahName: "البقرة", juz: 1, page: 2, hizbQuarter: 1, sajda: false },
      { number: 11, numberInSurah: 4, text: "وَٱلَّذِینَ یُؤۡمِنُونَ بِمَاۤ أُنزِلَ إِلَیۡكَ وَمَاۤ أُنزِلَ مِن قَبۡلِكَ وَبِٱلۡـَٔاخِرَةِ هُمۡ یُوقِنُونَ", surahNumber: 2, surahName: "البقرة", juz: 1, page: 2, hizbQuarter: 1, sajda: false },
      { number: 12, numberInSurah: 5, text: "أُو۟لَـٰۤىِٕكَ عَلَىٰ هُدࣰى مِّن رَّبِّهِمۡۖ وَأُو۟لَـٰۤىِٕكَ هُمُ ٱلۡمُفۡلِحُونَ", surahNumber: 2, surahName: "البقرة", juz: 1, page: 2, hizbQuarter: 1, sajda: false }
    ]
  },
  293: {
    pageNumber: 293,
    juzNumber: 15,
    hizbQuarter: 30,
    surahsOnPage: [],
    ayahs: [
      { number: 2141, numberInSurah: 1, text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ ٱلۡحَمۡدُ لِلَّهِ ٱلَّذِیۤ أَنزَلَ عَلَىٰ عَبۡدِهِ ٱلۡكِتَـٰبَ وَلَمۡ یَجۡعَل لَّهُۥ عِوَجَاۜ", surahNumber: 18, surahName: "الكهف", juz: 15, page: 293, hizbQuarter: 30, sajda: false },
      { number: 2142, numberInSurah: 2, text: "قَیِّمࣰا لِّیُنذِرَ بَأۡسࣰا شَدِیدࣰا مِّن لَّدُنۡهُ وَیُبَشِّرَ ٱلۡمُؤۡمِنِینَ ٱلَّذِینَ یَعۡمَلُونَ ٱلصَّـٰلِحَـٰتِ أَنَّ لَهُمۡ أَجۡرًا حَسَنࣰا", surahNumber: 18, surahName: "الكهف", juz: 15, page: 293, hizbQuarter: 30, sajda: false },
      { number: 2143, numberInSurah: 3, text: "مَّـٰكِثِینَ فِیهِ أَبَدࣰا", surahNumber: 18, surahName: "الكهف", juz: 15, page: 293, hizbQuarter: 30, sajda: false },
      { number: 2144, numberInSurah: 4, text: "وَیُنذِرَ ٱلَّذِینَ قَالُوا۟ ٱتَّخَذَ ٱللَّهُ وَلَدࣰا", surahNumber: 18, surahName: "الكهف", juz: 15, page: 293, hizbQuarter: 30, sajda: false }
    ]
  },
  604: {
    pageNumber: 604,
    juzNumber: 30,
    hizbQuarter: 60,
    surahsOnPage: [],
    ayahs: [
      { number: 6222, numberInSurah: 1, text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ قُلۡ هُوَ ٱللَّهُ أَحَدٌ", surahNumber: 112, surahName: "الإخلاص", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6223, numberInSurah: 2, text: "ٱللَّهُ ٱلصَّمَدُ", surahNumber: 112, surahName: "الإخلاص", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6224, numberInSurah: 3, text: "لَمۡ یَلِدۡ وَلَمۡ یُولَدۡ", surahNumber: 112, surahName: "الإخلاص", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6225, numberInSurah: 4, text: "وَلَمۡ یَكُن لَّهُۥ كُفُوًا أَحَدُۢ", surahNumber: 112, surahName: "الإخلاص", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6226, numberInSurah: 1, text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ", surahNumber: 113, surahName: "الفلق", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6227, numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ", surahNumber: 113, surahName: "الفلق", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6228, numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", surahNumber: 113, surahName: "الفلق", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6229, numberInSurah: 4, text: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِی ٱلۡعُقَدِ", surahNumber: 113, surahName: "الفلق", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6230, numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", surahNumber: 113, surahName: "الفلق", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6231, numberInSurah: 1, text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ", surahNumber: 114, surahName: "الناس", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6232, numberInSurah: 2, text: "مَلِكِ ٱلنَّاسِ", surahNumber: 114, surahName: "الناس", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6233, numberInSurah: 3, text: "إِلَـٰهِ ٱلنَّاسِ", surahNumber: 114, surahName: "الناس", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6234, numberInSurah: 4, text: "مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ", surahNumber: 114, surahName: "الناس", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6235, numberInSurah: 5, text: "ٱلَّذِی یُوَسۡوِسُ فِی صُدُورِ ٱلنَّاسِ", surahNumber: 114, surahName: "الناس", juz: 30, page: 604, hizbQuarter: 60, sajda: false },
      { number: 6236, numberInSurah: 6, text: "مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ", surahNumber: 114, surahName: "الناس", juz: 30, page: 604, hizbQuarter: 60, sajda: false }
    ]
  }
};
