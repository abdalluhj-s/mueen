import { SurahMetaExtended, JuzInfo } from './types';

export const QURAN_SURAHS: SurahMetaExtended[] = [
  {
    "num": 1,
    "name": "ٱلْفَاتِحَةِ",
    "fullName": "سُورَةُ ٱلْفَاتِحَةِ",
    "englishName": "Al-Faatiha",
    "verses": 7,
    "type": "مكية",
    "startPage": 1,
    "endPage": 1
  },
  {
    "num": 2,
    "name": "البَقَرَةِ",
    "fullName": "سُورَةُ البَقَرَةِ",
    "englishName": "Al-Baqara",
    "verses": 286,
    "type": "مدنية",
    "startPage": 2,
    "endPage": 49
  },
  {
    "num": 3,
    "name": "آلِ عِمۡرَانَ",
    "fullName": "سُورَةُ آلِ عِمۡرَانَ",
    "englishName": "Aal-i-Imraan",
    "verses": 200,
    "type": "مدنية",
    "startPage": 50,
    "endPage": 76
  },
  {
    "num": 4,
    "name": "النِّسَاءِ",
    "fullName": "سُورَةُ النِّسَاءِ",
    "englishName": "An-Nisaa",
    "verses": 176,
    "type": "مدنية",
    "startPage": 77,
    "endPage": 106
  },
  {
    "num": 5,
    "name": "المَائـِدَةِ",
    "fullName": "سُورَةُ المَائـِدَةِ",
    "englishName": "Al-Maaida",
    "verses": 120,
    "type": "مدنية",
    "startPage": 106,
    "endPage": 127
  },
  {
    "num": 6,
    "name": "الأَنۡعَامِ",
    "fullName": "سُورَةُ الأَنۡعَامِ",
    "englishName": "Al-An'aam",
    "verses": 165,
    "type": "مكية",
    "startPage": 128,
    "endPage": 150
  },
  {
    "num": 7,
    "name": "الأَعۡرَافِ",
    "fullName": "سُورَةُ الأَعۡرَافِ",
    "englishName": "Al-A'raaf",
    "verses": 206,
    "type": "مكية",
    "startPage": 151,
    "endPage": 176
  },
  {
    "num": 8,
    "name": "الأَنفَالِ",
    "fullName": "سُورَةُ الأَنفَالِ",
    "englishName": "Al-Anfaal",
    "verses": 75,
    "type": "مدنية",
    "startPage": 177,
    "endPage": 186
  },
  {
    "num": 9,
    "name": "التَّوۡبَةِ",
    "fullName": "سُورَةُ التَّوۡبَةِ",
    "englishName": "At-Tawba",
    "verses": 129,
    "type": "مدنية",
    "startPage": 187,
    "endPage": 207
  },
  {
    "num": 10,
    "name": "يُونُسَ",
    "fullName": "سُورَةُ يُونُسَ",
    "englishName": "Yunus",
    "verses": 109,
    "type": "مكية",
    "startPage": 208,
    "endPage": 221
  },
  {
    "num": 11,
    "name": "هُودٍ",
    "fullName": "سُورَةُ هُودٍ",
    "englishName": "Hud",
    "verses": 123,
    "type": "مكية",
    "startPage": 221,
    "endPage": 235
  },
  {
    "num": 12,
    "name": "يُوسُفَ",
    "fullName": "سُورَةُ يُوسُفَ",
    "englishName": "Yusuf",
    "verses": 111,
    "type": "مكية",
    "startPage": 235,
    "endPage": 248
  },
  {
    "num": 13,
    "name": "الرَّعۡدِ",
    "fullName": "سُورَةُ الرَّعۡدِ",
    "englishName": "Ar-Ra'd",
    "verses": 43,
    "type": "مدنية",
    "startPage": 249,
    "endPage": 255
  },
  {
    "num": 14,
    "name": "إِبۡرَاهِيمَ",
    "fullName": "سُورَةُ إِبۡرَاهِيمَ",
    "englishName": "Ibrahim",
    "verses": 52,
    "type": "مكية",
    "startPage": 255,
    "endPage": 261
  },
  {
    "num": 15,
    "name": "الحِجۡرِ",
    "fullName": "سُورَةُ الحِجۡرِ",
    "englishName": "Al-Hijr",
    "verses": 99,
    "type": "مكية",
    "startPage": 262,
    "endPage": 267
  },
  {
    "num": 16,
    "name": "النَّحۡلِ",
    "fullName": "سُورَةُ النَّحۡلِ",
    "englishName": "An-Nahl",
    "verses": 128,
    "type": "مكية",
    "startPage": 267,
    "endPage": 281
  },
  {
    "num": 17,
    "name": "الإِسۡرَاءِ",
    "fullName": "سُورَةُ الإِسۡرَاءِ",
    "englishName": "Al-Israa",
    "verses": 111,
    "type": "مكية",
    "startPage": 282,
    "endPage": 293
  },
  {
    "num": 18,
    "name": "الكَهۡفِ",
    "fullName": "سُورَةُ الكَهۡفِ",
    "englishName": "Al-Kahf",
    "verses": 110,
    "type": "مكية",
    "startPage": 293,
    "endPage": 304
  },
  {
    "num": 19,
    "name": "مَرۡيَمَ",
    "fullName": "سُورَةُ مَرۡيَمَ",
    "englishName": "Maryam",
    "verses": 98,
    "type": "مكية",
    "startPage": 305,
    "endPage": 312
  },
  {
    "num": 20,
    "name": "طه",
    "fullName": "سُورَةُ طه",
    "englishName": "Taa-Haa",
    "verses": 135,
    "type": "مكية",
    "startPage": 312,
    "endPage": 321
  },
  {
    "num": 21,
    "name": "الأَنبِيَاءِ",
    "fullName": "سُورَةُ الأَنبِيَاءِ",
    "englishName": "Al-Anbiyaa",
    "verses": 112,
    "type": "مكية",
    "startPage": 322,
    "endPage": 331
  },
  {
    "num": 22,
    "name": "الحَجِّ",
    "fullName": "سُورَةُ الحَجِّ",
    "englishName": "Al-Hajj",
    "verses": 78,
    "type": "مدنية",
    "startPage": 332,
    "endPage": 341
  },
  {
    "num": 23,
    "name": "المُؤۡمِنُونَ",
    "fullName": "سُورَةُ المُؤۡمِنُونَ",
    "englishName": "Al-Muminoon",
    "verses": 118,
    "type": "مكية",
    "startPage": 342,
    "endPage": 349
  },
  {
    "num": 24,
    "name": "النُّورِ",
    "fullName": "سُورَةُ النُّورِ",
    "englishName": "An-Noor",
    "verses": 64,
    "type": "مدنية",
    "startPage": 350,
    "endPage": 359
  },
  {
    "num": 25,
    "name": "الفُرۡقَانِ",
    "fullName": "سُورَةُ الفُرۡقَانِ",
    "englishName": "Al-Furqaan",
    "verses": 77,
    "type": "مكية",
    "startPage": 359,
    "endPage": 366
  },
  {
    "num": 26,
    "name": "الشُّعَرَاءِ",
    "fullName": "سُورَةُ الشُّعَرَاءِ",
    "englishName": "Ash-Shu'araa",
    "verses": 227,
    "type": "مكية",
    "startPage": 367,
    "endPage": 376
  },
  {
    "num": 27,
    "name": "النَّمۡلِ",
    "fullName": "سُورَةُ النَّمۡلِ",
    "englishName": "An-Naml",
    "verses": 93,
    "type": "مكية",
    "startPage": 377,
    "endPage": 385
  },
  {
    "num": 28,
    "name": "القَصَصِ",
    "fullName": "سُورَةُ القَصَصِ",
    "englishName": "Al-Qasas",
    "verses": 88,
    "type": "مكية",
    "startPage": 385,
    "endPage": 396
  },
  {
    "num": 29,
    "name": "العَنكَبُوتِ",
    "fullName": "سُورَةُ العَنكَبُوتِ",
    "englishName": "Al-Ankaboot",
    "verses": 69,
    "type": "مكية",
    "startPage": 396,
    "endPage": 404
  },
  {
    "num": 30,
    "name": "الرُّومِ",
    "fullName": "سُورَةُ الرُّومِ",
    "englishName": "Ar-Room",
    "verses": 60,
    "type": "مكية",
    "startPage": 404,
    "endPage": 410
  },
  {
    "num": 31,
    "name": "لُقۡمَانَ",
    "fullName": "سُورَةُ لُقۡمَانَ",
    "englishName": "Luqman",
    "verses": 34,
    "type": "مكية",
    "startPage": 411,
    "endPage": 414
  },
  {
    "num": 32,
    "name": "السَّجۡدَةِ",
    "fullName": "سُورَةُ السَّجۡدَةِ",
    "englishName": "As-Sajda",
    "verses": 30,
    "type": "مكية",
    "startPage": 415,
    "endPage": 417
  },
  {
    "num": 33,
    "name": "الأَحۡزَابِ",
    "fullName": "سُورَةُ الأَحۡزَابِ",
    "englishName": "Al-Ahzaab",
    "verses": 73,
    "type": "مدنية",
    "startPage": 418,
    "endPage": 427
  },
  {
    "num": 34,
    "name": "سَبَإٍ",
    "fullName": "سُورَةُ سَبَإٍ",
    "englishName": "Saba",
    "verses": 54,
    "type": "مكية",
    "startPage": 428,
    "endPage": 434
  },
  {
    "num": 35,
    "name": "فَاطِرٍ",
    "fullName": "سُورَةُ فَاطِرٍ",
    "englishName": "Faatir",
    "verses": 45,
    "type": "مكية",
    "startPage": 434,
    "endPage": 440
  },
  {
    "num": 36,
    "name": "يسٓ",
    "fullName": "سُورَةُ يسٓ",
    "englishName": "Yaseen",
    "verses": 83,
    "type": "مكية",
    "startPage": 440,
    "endPage": 445
  },
  {
    "num": 37,
    "name": "الصَّافَّاتِ",
    "fullName": "سُورَةُ الصَّافَّاتِ",
    "englishName": "As-Saaffaat",
    "verses": 182,
    "type": "مكية",
    "startPage": 446,
    "endPage": 452
  },
  {
    "num": 38,
    "name": "صٓ",
    "fullName": "سُورَةُ صٓ",
    "englishName": "Saad",
    "verses": 88,
    "type": "مكية",
    "startPage": 453,
    "endPage": 458
  },
  {
    "num": 39,
    "name": "الزُّمَرِ",
    "fullName": "سُورَةُ الزُّمَرِ",
    "englishName": "Az-Zumar",
    "verses": 75,
    "type": "مكية",
    "startPage": 458,
    "endPage": 467
  },
  {
    "num": 40,
    "name": "غَافِرٍ",
    "fullName": "سُورَةُ غَافِرٍ",
    "englishName": "Ghafir",
    "verses": 85,
    "type": "مكية",
    "startPage": 467,
    "endPage": 476
  },
  {
    "num": 41,
    "name": "فُصِّلَتۡ",
    "fullName": "سُورَةُ فُصِّلَتۡ",
    "englishName": "Fussilat",
    "verses": 54,
    "type": "مكية",
    "startPage": 477,
    "endPage": 482
  },
  {
    "num": 42,
    "name": "الشُّورَىٰ",
    "fullName": "سُورَةُ الشُّورَىٰ",
    "englishName": "Ash-Shura",
    "verses": 53,
    "type": "مكية",
    "startPage": 483,
    "endPage": 489
  },
  {
    "num": 43,
    "name": "الزُّخۡرُفِ",
    "fullName": "سُورَةُ الزُّخۡرُفِ",
    "englishName": "Az-Zukhruf",
    "verses": 89,
    "type": "مكية",
    "startPage": 489,
    "endPage": 495
  },
  {
    "num": 44,
    "name": "الدُّخَانِ",
    "fullName": "سُورَةُ الدُّخَانِ",
    "englishName": "Ad-Dukhaan",
    "verses": 59,
    "type": "مكية",
    "startPage": 496,
    "endPage": 498
  },
  {
    "num": 45,
    "name": "الجَاثِيَةِ",
    "fullName": "سُورَةُ الجَاثِيَةِ",
    "englishName": "Al-Jaathiya",
    "verses": 37,
    "type": "مكية",
    "startPage": 499,
    "endPage": 502
  },
  {
    "num": 46,
    "name": "الأَحۡقَافِ",
    "fullName": "سُورَةُ الأَحۡقَافِ",
    "englishName": "Al-Ahqaf",
    "verses": 35,
    "type": "مكية",
    "startPage": 502,
    "endPage": 506
  },
  {
    "num": 47,
    "name": "مُحَمَّدٍ",
    "fullName": "سُورَةُ مُحَمَّدٍ",
    "englishName": "Muhammad",
    "verses": 38,
    "type": "مدنية",
    "startPage": 507,
    "endPage": 510
  },
  {
    "num": 48,
    "name": "الفَتۡحِ",
    "fullName": "سُورَةُ الفَتۡحِ",
    "englishName": "Al-Fath",
    "verses": 29,
    "type": "مدنية",
    "startPage": 511,
    "endPage": 515
  },
  {
    "num": 49,
    "name": "الحُجُرَاتِ",
    "fullName": "سُورَةُ الحُجُرَاتِ",
    "englishName": "Al-Hujuraat",
    "verses": 18,
    "type": "مدنية",
    "startPage": 515,
    "endPage": 517
  },
  {
    "num": 50,
    "name": "قٓ",
    "fullName": "سُورَةُ قٓ",
    "englishName": "Qaaf",
    "verses": 45,
    "type": "مكية",
    "startPage": 518,
    "endPage": 520
  },
  {
    "num": 51,
    "name": "الذَّارِيَاتِ",
    "fullName": "سُورَةُ الذَّارِيَاتِ",
    "englishName": "Adh-Dhaariyat",
    "verses": 60,
    "type": "مكية",
    "startPage": 520,
    "endPage": 523
  },
  {
    "num": 52,
    "name": "الطُّورِ",
    "fullName": "سُورَةُ الطُّورِ",
    "englishName": "At-Tur",
    "verses": 49,
    "type": "مكية",
    "startPage": 523,
    "endPage": 525
  },
  {
    "num": 53,
    "name": "النَّجۡمِ",
    "fullName": "سُورَةُ النَّجۡمِ",
    "englishName": "An-Najm",
    "verses": 62,
    "type": "مكية",
    "startPage": 526,
    "endPage": 528
  },
  {
    "num": 54,
    "name": "القَمَرِ",
    "fullName": "سُورَةُ القَمَرِ",
    "englishName": "Al-Qamar",
    "verses": 55,
    "type": "مكية",
    "startPage": 528,
    "endPage": 531
  },
  {
    "num": 55,
    "name": "الرَّحۡمَٰن",
    "fullName": "سُورَةُ الرَّحۡمَٰن",
    "englishName": "Ar-Rahmaan",
    "verses": 78,
    "type": "مدنية",
    "startPage": 531,
    "endPage": 534
  },
  {
    "num": 56,
    "name": "الوَاقِعَةِ",
    "fullName": "سُورَةُ الوَاقِعَةِ",
    "englishName": "Al-Waaqia",
    "verses": 96,
    "type": "مكية",
    "startPage": 534,
    "endPage": 537
  },
  {
    "num": 57,
    "name": "الحَدِيدِ",
    "fullName": "سُورَةُ الحَدِيدِ",
    "englishName": "Al-Hadid",
    "verses": 29,
    "type": "مدنية",
    "startPage": 537,
    "endPage": 541
  },
  {
    "num": 58,
    "name": "المُجَادلَةِ",
    "fullName": "سُورَةُ المُجَادلَةِ",
    "englishName": "Al-Mujaadila",
    "verses": 22,
    "type": "مدنية",
    "startPage": 542,
    "endPage": 545
  },
  {
    "num": 59,
    "name": "الحَشۡرِ",
    "fullName": "سُورَةُ الحَشۡرِ",
    "englishName": "Al-Hashr",
    "verses": 24,
    "type": "مدنية",
    "startPage": 545,
    "endPage": 548
  },
  {
    "num": 60,
    "name": "المُمۡتَحنَةِ",
    "fullName": "سُورَةُ المُمۡتَحنَةِ",
    "englishName": "Al-Mumtahana",
    "verses": 13,
    "type": "مدنية",
    "startPage": 549,
    "endPage": 551
  },
  {
    "num": 61,
    "name": "الصَّفِّ",
    "fullName": "سُورَةُ الصَّفِّ",
    "englishName": "As-Saff",
    "verses": 14,
    "type": "مدنية",
    "startPage": 551,
    "endPage": 552
  },
  {
    "num": 62,
    "name": "الجُمُعَةِ",
    "fullName": "سُورَةُ الجُمُعَةِ",
    "englishName": "Al-Jumu'a",
    "verses": 11,
    "type": "مدنية",
    "startPage": 553,
    "endPage": 554
  },
  {
    "num": 63,
    "name": "المُنَافِقُونَ",
    "fullName": "سُورَةُ المُنَافِقُونَ",
    "englishName": "Al-Munaafiqoon",
    "verses": 11,
    "type": "مدنية",
    "startPage": 554,
    "endPage": 555
  },
  {
    "num": 64,
    "name": "التَّغَابُنِ",
    "fullName": "سُورَةُ التَّغَابُنِ",
    "englishName": "At-Taghaabun",
    "verses": 18,
    "type": "مدنية",
    "startPage": 556,
    "endPage": 557
  },
  {
    "num": 65,
    "name": "الطَّلَاقِ",
    "fullName": "سُورَةُ الطَّلَاقِ",
    "englishName": "At-Talaaq",
    "verses": 12,
    "type": "مدنية",
    "startPage": 558,
    "endPage": 559
  },
  {
    "num": 66,
    "name": "التَّحۡرِيمِ",
    "fullName": "سُورَةُ التَّحۡرِيمِ",
    "englishName": "At-Tahrim",
    "verses": 12,
    "type": "مدنية",
    "startPage": 560,
    "endPage": 561
  },
  {
    "num": 67,
    "name": "المُلۡكِ",
    "fullName": "سُورَةُ المُلۡكِ",
    "englishName": "Al-Mulk",
    "verses": 30,
    "type": "مكية",
    "startPage": 562,
    "endPage": 564
  },
  {
    "num": 68,
    "name": "القَلَمِ",
    "fullName": "سُورَةُ القَلَمِ",
    "englishName": "Al-Qalam",
    "verses": 52,
    "type": "مكية",
    "startPage": 564,
    "endPage": 566
  },
  {
    "num": 69,
    "name": "الحَاقَّةِ",
    "fullName": "سُورَةُ الحَاقَّةِ",
    "englishName": "Al-Haaqqa",
    "verses": 52,
    "type": "مكية",
    "startPage": 566,
    "endPage": 568
  },
  {
    "num": 70,
    "name": "المَعَارِجِ",
    "fullName": "سُورَةُ المَعَارِجِ",
    "englishName": "Al-Ma'aarij",
    "verses": 44,
    "type": "مكية",
    "startPage": 568,
    "endPage": 570
  },
  {
    "num": 71,
    "name": "نُوحٍ",
    "fullName": "سُورَةُ نُوحٍ",
    "englishName": "Nooh",
    "verses": 28,
    "type": "مكية",
    "startPage": 570,
    "endPage": 571
  },
  {
    "num": 72,
    "name": "الجِنِّ",
    "fullName": "سُورَةُ الجِنِّ",
    "englishName": "Al-Jinn",
    "verses": 28,
    "type": "مكية",
    "startPage": 572,
    "endPage": 573
  },
  {
    "num": 73,
    "name": "المُزَّمِّلِ",
    "fullName": "سُورَةُ المُزَّمِّلِ",
    "englishName": "Al-Muzzammil",
    "verses": 20,
    "type": "مكية",
    "startPage": 574,
    "endPage": 575
  },
  {
    "num": 74,
    "name": "المُدَّثِّرِ",
    "fullName": "سُورَةُ المُدَّثِّرِ",
    "englishName": "Al-Muddaththir",
    "verses": 56,
    "type": "مكية",
    "startPage": 575,
    "endPage": 577
  },
  {
    "num": 75,
    "name": "القِيَامَةِ",
    "fullName": "سُورَةُ القِيَامَةِ",
    "englishName": "Al-Qiyaama",
    "verses": 40,
    "type": "مكية",
    "startPage": 577,
    "endPage": 578
  },
  {
    "num": 76,
    "name": "الإِنسَانِ",
    "fullName": "سُورَةُ الإِنسَانِ",
    "englishName": "Al-Insaan",
    "verses": 31,
    "type": "مدنية",
    "startPage": 578,
    "endPage": 580
  },
  {
    "num": 77,
    "name": "المُرۡسَلَاتِ",
    "fullName": "سُورَةُ المُرۡسَلَاتِ",
    "englishName": "Al-Mursalaat",
    "verses": 50,
    "type": "مكية",
    "startPage": 580,
    "endPage": 581
  },
  {
    "num": 78,
    "name": "النَّبَإِ",
    "fullName": "سُورَةُ النَّبَإِ",
    "englishName": "An-Naba",
    "verses": 40,
    "type": "مكية",
    "startPage": 582,
    "endPage": 583
  },
  {
    "num": 79,
    "name": "النَّازِعَاتِ",
    "fullName": "سُورَةُ النَّازِعَاتِ",
    "englishName": "An-Naazi'aat",
    "verses": 46,
    "type": "مكية",
    "startPage": 583,
    "endPage": 584
  },
  {
    "num": 80,
    "name": "عَبَسَ",
    "fullName": "سُورَةُ عَبَسَ",
    "englishName": "Abasa",
    "verses": 42,
    "type": "مكية",
    "startPage": 585,
    "endPage": 585
  },
  {
    "num": 81,
    "name": "التَّكۡوِيرِ",
    "fullName": "سُورَةُ التَّكۡوِيرِ",
    "englishName": "At-Takwir",
    "verses": 29,
    "type": "مكية",
    "startPage": 586,
    "endPage": 586
  },
  {
    "num": 82,
    "name": "الانفِطَارِ",
    "fullName": "سُورَةُ الانفِطَارِ",
    "englishName": "Al-Infitaar",
    "verses": 19,
    "type": "مكية",
    "startPage": 587,
    "endPage": 587
  },
  {
    "num": 83,
    "name": "المُطَفِّفِينَ",
    "fullName": "سُورَةُ المُطَفِّفِينَ",
    "englishName": "Al-Mutaffifin",
    "verses": 36,
    "type": "مكية",
    "startPage": 587,
    "endPage": 589
  },
  {
    "num": 84,
    "name": "الانشِقَاقِ",
    "fullName": "سُورَةُ الانشِقَاقِ",
    "englishName": "Al-Inshiqaaq",
    "verses": 25,
    "type": "مكية",
    "startPage": 589,
    "endPage": 589
  },
  {
    "num": 85,
    "name": "البُرُوجِ",
    "fullName": "سُورَةُ البُرُوجِ",
    "englishName": "Al-Burooj",
    "verses": 22,
    "type": "مكية",
    "startPage": 590,
    "endPage": 590
  },
  {
    "num": 86,
    "name": "الطَّارِقِ",
    "fullName": "سُورَةُ الطَّارِقِ",
    "englishName": "At-Taariq",
    "verses": 17,
    "type": "مكية",
    "startPage": 591,
    "endPage": 591
  },
  {
    "num": 87,
    "name": "الأَعۡلَىٰ",
    "fullName": "سُورَةُ الأَعۡلَىٰ",
    "englishName": "Al-A'laa",
    "verses": 19,
    "type": "مكية",
    "startPage": 591,
    "endPage": 592
  },
  {
    "num": 88,
    "name": "الغَاشِيَةِ",
    "fullName": "سُورَةُ الغَاشِيَةِ",
    "englishName": "Al-Ghaashiya",
    "verses": 26,
    "type": "مكية",
    "startPage": 592,
    "endPage": 592
  },
  {
    "num": 89,
    "name": "الفَجۡرِ",
    "fullName": "سُورَةُ الفَجۡرِ",
    "englishName": "Al-Fajr",
    "verses": 30,
    "type": "مكية",
    "startPage": 593,
    "endPage": 594
  },
  {
    "num": 90,
    "name": "البَلَدِ",
    "fullName": "سُورَةُ البَلَدِ",
    "englishName": "Al-Balad",
    "verses": 20,
    "type": "مكية",
    "startPage": 594,
    "endPage": 594
  },
  {
    "num": 91,
    "name": "الشَّمۡسِ",
    "fullName": "سُورَةُ الشَّمۡسِ",
    "englishName": "Ash-Shams",
    "verses": 15,
    "type": "مكية",
    "startPage": 595,
    "endPage": 595
  },
  {
    "num": 92,
    "name": "اللَّيۡلِ",
    "fullName": "سُورَةُ اللَّيۡلِ",
    "englishName": "Al-Lail",
    "verses": 21,
    "type": "مكية",
    "startPage": 595,
    "endPage": 596
  },
  {
    "num": 93,
    "name": "الضُّحَىٰ",
    "fullName": "سُورَةُ الضُّحَىٰ",
    "englishName": "Ad-Dhuhaa",
    "verses": 11,
    "type": "مكية",
    "startPage": 596,
    "endPage": 596
  },
  {
    "num": 94,
    "name": "الشَّرۡحِ",
    "fullName": "سُورَةُ الشَّرۡحِ",
    "englishName": "Ash-Sharh",
    "verses": 8,
    "type": "مكية",
    "startPage": 596,
    "endPage": 596
  },
  {
    "num": 95,
    "name": "التِّينِ",
    "fullName": "سُورَةُ التِّينِ",
    "englishName": "At-Tin",
    "verses": 8,
    "type": "مكية",
    "startPage": 597,
    "endPage": 597
  },
  {
    "num": 96,
    "name": "العَلَقِ",
    "fullName": "سُورَةُ العَلَقِ",
    "englishName": "Al-Alaq",
    "verses": 19,
    "type": "مكية",
    "startPage": 597,
    "endPage": 597
  },
  {
    "num": 97,
    "name": "القَدۡرِ",
    "fullName": "سُورَةُ القَدۡرِ",
    "englishName": "Al-Qadr",
    "verses": 5,
    "type": "مكية",
    "startPage": 598,
    "endPage": 598
  },
  {
    "num": 98,
    "name": "البَيِّنَةِ",
    "fullName": "سُورَةُ البَيِّنَةِ",
    "englishName": "Al-Bayyina",
    "verses": 8,
    "type": "مدنية",
    "startPage": 598,
    "endPage": 599
  },
  {
    "num": 99,
    "name": "الزَّلۡزَلَةِ",
    "fullName": "سُورَةُ الزَّلۡزَلَةِ",
    "englishName": "Az-Zalzala",
    "verses": 8,
    "type": "مدنية",
    "startPage": 599,
    "endPage": 599
  },
  {
    "num": 100,
    "name": "العَادِيَاتِ",
    "fullName": "سُورَةُ العَادِيَاتِ",
    "englishName": "Al-Aadiyaat",
    "verses": 11,
    "type": "مكية",
    "startPage": 599,
    "endPage": 600
  },
  {
    "num": 101,
    "name": "القَارِعَةِ",
    "fullName": "سُورَةُ القَارِعَةِ",
    "englishName": "Al-Qaari'a",
    "verses": 11,
    "type": "مكية",
    "startPage": 600,
    "endPage": 600
  },
  {
    "num": 102,
    "name": "التَّكَاثُرِ",
    "fullName": "سُورَةُ التَّكَاثُرِ",
    "englishName": "At-Takaathur",
    "verses": 8,
    "type": "مكية",
    "startPage": 600,
    "endPage": 600
  },
  {
    "num": 103,
    "name": "العَصۡرِ",
    "fullName": "سُورَةُ العَصۡرِ",
    "englishName": "Al-Asr",
    "verses": 3,
    "type": "مكية",
    "startPage": 601,
    "endPage": 601
  },
  {
    "num": 104,
    "name": "الهُمَزَةِ",
    "fullName": "سُورَةُ الهُمَزَةِ",
    "englishName": "Al-Humaza",
    "verses": 9,
    "type": "مكية",
    "startPage": 601,
    "endPage": 601
  },
  {
    "num": 105,
    "name": "الفِيلِ",
    "fullName": "سُورَةُ الفِيلِ",
    "englishName": "Al-Fil",
    "verses": 5,
    "type": "مكية",
    "startPage": 601,
    "endPage": 601
  },
  {
    "num": 106,
    "name": "قُرَيۡشٍ",
    "fullName": "سُورَةُ قُرَيۡشٍ",
    "englishName": "Quraish",
    "verses": 4,
    "type": "مكية",
    "startPage": 602,
    "endPage": 602
  },
  {
    "num": 107,
    "name": "المَاعُونِ",
    "fullName": "سُورَةُ المَاعُونِ",
    "englishName": "Al-Maa'un",
    "verses": 7,
    "type": "مكية",
    "startPage": 602,
    "endPage": 602
  },
  {
    "num": 108,
    "name": "الكَوۡثَرِ",
    "fullName": "سُورَةُ الكَوۡثَرِ",
    "englishName": "Al-Kawthar",
    "verses": 3,
    "type": "مكية",
    "startPage": 602,
    "endPage": 602
  },
  {
    "num": 109,
    "name": "الكَافِرُونَ",
    "fullName": "سُورَةُ الكَافِرُونَ",
    "englishName": "Al-Kaafiroon",
    "verses": 6,
    "type": "مكية",
    "startPage": 603,
    "endPage": 603
  },
  {
    "num": 110,
    "name": "النَّصۡرِ",
    "fullName": "سُورَةُ النَّصۡرِ",
    "englishName": "An-Nasr",
    "verses": 3,
    "type": "مدنية",
    "startPage": 603,
    "endPage": 603
  },
  {
    "num": 111,
    "name": "المَسَدِ",
    "fullName": "سُورَةُ المَسَدِ",
    "englishName": "Al-Masad",
    "verses": 5,
    "type": "مكية",
    "startPage": 603,
    "endPage": 603
  },
  {
    "num": 112,
    "name": "الإِخۡلَاصِ",
    "fullName": "سُورَةُ الإِخۡلَاصِ",
    "englishName": "Al-Ikhlaas",
    "verses": 4,
    "type": "مكية",
    "startPage": 604,
    "endPage": 604
  },
  {
    "num": 113,
    "name": "الفَلَقِ",
    "fullName": "سُورَةُ الفَلَقِ",
    "englishName": "Al-Falaq",
    "verses": 5,
    "type": "مكية",
    "startPage": 604,
    "endPage": 604
  },
  {
    "num": 114,
    "name": "النَّاسِ",
    "fullName": "سُورَةُ النَّاسِ",
    "englishName": "An-Naas",
    "verses": 6,
    "type": "مكية",
    "startPage": 604,
    "endPage": 604
  }
];

export const QURAN_JUZS: JuzInfo[] = [
  {
    "juzNumber": 1,
    "name": "الجزء الأول",
    "startPage": 1,
    "endPage": 21,
    "startSurahName": "الفاتحة"
  },
  {
    "juzNumber": 2,
    "name": "الجزء الثاني",
    "startPage": 22,
    "endPage": 41,
    "startSurahName": "البقرة"
  },
  {
    "juzNumber": 3,
    "name": "الجزء الثالث",
    "startPage": 42,
    "endPage": 61,
    "startSurahName": "البقرة"
  },
  {
    "juzNumber": 4,
    "name": "الجزء الرابع",
    "startPage": 62,
    "endPage": 81,
    "startSurahName": "آل عمران"
  },
  {
    "juzNumber": 5,
    "name": "الجزء الخامس",
    "startPage": 82,
    "endPage": 101,
    "startSurahName": "النساء"
  },
  {
    "juzNumber": 6,
    "name": "الجزء السادس",
    "startPage": 102,
    "endPage": 120,
    "startSurahName": "النساء"
  },
  {
    "juzNumber": 7,
    "name": "الجزء السابع",
    "startPage": 121,
    "endPage": 141,
    "startSurahName": "المائدة"
  },
  {
    "juzNumber": 8,
    "name": "الجزء الثامن",
    "startPage": 142,
    "endPage": 161,
    "startSurahName": "الأنعام"
  },
  {
    "juzNumber": 9,
    "name": "الجزء التاسع",
    "startPage": 162,
    "endPage": 181,
    "startSurahName": "الأعراف"
  },
  {
    "juzNumber": 10,
    "name": "الجزء العاشر",
    "startPage": 182,
    "endPage": 200,
    "startSurahName": "الأنفال"
  },
  {
    "juzNumber": 11,
    "name": "الجزء الحادي عشر",
    "startPage": 201,
    "endPage": 221,
    "startSurahName": "التوبة"
  },
  {
    "juzNumber": 12,
    "name": "الجزء الثاني عشر",
    "startPage": 222,
    "endPage": 241,
    "startSurahName": "هود"
  },
  {
    "juzNumber": 13,
    "name": "الجزء الثالث عشر",
    "startPage": 242,
    "endPage": 261,
    "startSurahName": "يوسف"
  },
  {
    "juzNumber": 14,
    "name": "الجزء الرابع عشر",
    "startPage": 262,
    "endPage": 281,
    "startSurahName": "الحجر"
  },
  {
    "juzNumber": 15,
    "name": "الجزء الخامس عشر",
    "startPage": 282,
    "endPage": 301,
    "startSurahName": "الإسراء"
  },
  {
    "juzNumber": 16,
    "name": "الجزء السادس عشر",
    "startPage": 302,
    "endPage": 321,
    "startSurahName": "الكهف"
  },
  {
    "juzNumber": 17,
    "name": "الجزء السابع عشر",
    "startPage": 322,
    "endPage": 341,
    "startSurahName": "الأنبياء"
  },
  {
    "juzNumber": 18,
    "name": "الجزء الثامن عشر",
    "startPage": 342,
    "endPage": 361,
    "startSurahName": "المؤمنون"
  },
  {
    "juzNumber": 19,
    "name": "الجزء التاسع عشر",
    "startPage": 362,
    "endPage": 381,
    "startSurahName": "الفرقان"
  },
  {
    "juzNumber": 20,
    "name": "الجزء العشرون",
    "startPage": 382,
    "endPage": 401,
    "startSurahName": "النمل"
  },
  {
    "juzNumber": 21,
    "name": "الجزء الحادي والعشرون",
    "startPage": 402,
    "endPage": 421,
    "startSurahName": "العنكبوت"
  },
  {
    "juzNumber": 22,
    "name": "الجزء الثاني والعشرون",
    "startPage": 422,
    "endPage": 441,
    "startSurahName": "الأحزاب"
  },
  {
    "juzNumber": 23,
    "name": "الجزء الثالث والعشرون",
    "startPage": 442,
    "endPage": 461,
    "startSurahName": "يس"
  },
  {
    "juzNumber": 24,
    "name": "الجزء الرابع والعشرون",
    "startPage": 462,
    "endPage": 481,
    "startSurahName": "الزمر"
  },
  {
    "juzNumber": 25,
    "name": "الجزء الخامس والعشرون",
    "startPage": 482,
    "endPage": 501,
    "startSurahName": "فصلت"
  },
  {
    "juzNumber": 26,
    "name": "الجزء السادس والعشرون",
    "startPage": 502,
    "endPage": 521,
    "startSurahName": "الأحقاف"
  },
  {
    "juzNumber": 27,
    "name": "الجزء السابع والعشرون",
    "startPage": 522,
    "endPage": 541,
    "startSurahName": "الذاريات"
  },
  {
    "juzNumber": 28,
    "name": "الجزء الثامن والعشرون",
    "startPage": 542,
    "endPage": 561,
    "startSurahName": "المجادلة"
  },
  {
    "juzNumber": 29,
    "name": "الجزء التاسع والعشرون",
    "startPage": 562,
    "endPage": 581,
    "startSurahName": "الملك"
  },
  {
    "juzNumber": 30,
    "name": "الجزء الثلاثون",
    "startPage": 582,
    "endPage": 604,
    "startSurahName": "النبأ"
  }
];

export const TOTAL_PAGES = 604;

export const toArabicNumerals = (num: number): string => {
  return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
};

export const getSurahByPage = (pageNum: number): SurahMetaExtended => {
  const found = [...QURAN_SURAHS].reverse().find(s => pageNum >= s.startPage);
  return found || QURAN_SURAHS[0];
};

export const getJuzByPage = (pageNum: number): JuzInfo => {
  const found = QURAN_JUZS.find(j => pageNum >= j.startPage && pageNum <= j.endPage);
  return found || QURAN_JUZS[0];
};
