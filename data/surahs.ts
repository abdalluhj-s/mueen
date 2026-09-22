export interface SurahMeta {
  num: number;
  name: string;
  fullName: string;
  englishName: string;
  verses: number;
  type: 'مكية' | 'مدنية';
}

export const ALL_SURAHS: SurahMeta[] = [
  {
    "num": 1,
    "name": "ٱلْفَاتِحَةِ",
    "fullName": "سُورَةُ ٱلْفَاتِحَةِ",
    "englishName": "Al-Faatiha",
    "verses": 7,
    "type": "مكية"
  },
  {
    "num": 2,
    "name": "البَقَرَةِ",
    "fullName": "سُورَةُ البَقَرَةِ",
    "englishName": "Al-Baqara",
    "verses": 286,
    "type": "مدنية"
  },
  {
    "num": 3,
    "name": "آلِ عِمۡرَانَ",
    "fullName": "سُورَةُ آلِ عِمۡرَانَ",
    "englishName": "Aal-i-Imraan",
    "verses": 200,
    "type": "مدنية"
  },
  {
    "num": 4,
    "name": "النِّسَاءِ",
    "fullName": "سُورَةُ النِّسَاءِ",
    "englishName": "An-Nisaa",
    "verses": 176,
    "type": "مدنية"
  },
  {
    "num": 5,
    "name": "المَائـِدَةِ",
    "fullName": "سُورَةُ المَائـِدَةِ",
    "englishName": "Al-Maaida",
    "verses": 120,
    "type": "مدنية"
  },
  {
    "num": 6,
    "name": "الأَنۡعَامِ",
    "fullName": "سُورَةُ الأَنۡعَامِ",
    "englishName": "Al-An'aam",
    "verses": 165,
    "type": "مكية"
  },
  {
    "num": 7,
    "name": "الأَعۡرَافِ",
    "fullName": "سُورَةُ الأَعۡرَافِ",
    "englishName": "Al-A'raaf",
    "verses": 206,
    "type": "مكية"
  },
  {
    "num": 8,
    "name": "الأَنفَالِ",
    "fullName": "سُورَةُ الأَنفَالِ",
    "englishName": "Al-Anfaal",
    "verses": 75,
    "type": "مدنية"
  },
  {
    "num": 9,
    "name": "التَّوۡبَةِ",
    "fullName": "سُورَةُ التَّوۡبَةِ",
    "englishName": "At-Tawba",
    "verses": 129,
    "type": "مدنية"
  },
  {
    "num": 10,
    "name": "يُونُسَ",
    "fullName": "سُورَةُ يُونُسَ",
    "englishName": "Yunus",
    "verses": 109,
    "type": "مكية"
  },
  {
    "num": 11,
    "name": "هُودٍ",
    "fullName": "سُورَةُ هُودٍ",
    "englishName": "Hud",
    "verses": 123,
    "type": "مكية"
  },
  {
    "num": 12,
    "name": "يُوسُفَ",
    "fullName": "سُورَةُ يُوسُفَ",
    "englishName": "Yusuf",
    "verses": 111,
    "type": "مكية"
  },
  {
    "num": 13,
    "name": "الرَّعۡدِ",
    "fullName": "سُورَةُ الرَّعۡدِ",
    "englishName": "Ar-Ra'd",
    "verses": 43,
    "type": "مدنية"
  },
  {
    "num": 14,
    "name": "إِبۡرَاهِيمَ",
    "fullName": "سُورَةُ إِبۡرَاهِيمَ",
    "englishName": "Ibrahim",
    "verses": 52,
    "type": "مكية"
  },
  {
    "num": 15,
    "name": "الحِجۡرِ",
    "fullName": "سُورَةُ الحِجۡرِ",
    "englishName": "Al-Hijr",
    "verses": 99,
    "type": "مكية"
  },
  {
    "num": 16,
    "name": "النَّحۡلِ",
    "fullName": "سُورَةُ النَّحۡلِ",
    "englishName": "An-Nahl",
    "verses": 128,
    "type": "مكية"
  },
  {
    "num": 17,
    "name": "الإِسۡرَاءِ",
    "fullName": "سُورَةُ الإِسۡرَاءِ",
    "englishName": "Al-Israa",
    "verses": 111,
    "type": "مكية"
  },
  {
    "num": 18,
    "name": "الكَهۡفِ",
    "fullName": "سُورَةُ الكَهۡفِ",
    "englishName": "Al-Kahf",
    "verses": 110,
    "type": "مكية"
  },
  {
    "num": 19,
    "name": "مَرۡيَمَ",
    "fullName": "سُورَةُ مَرۡيَمَ",
    "englishName": "Maryam",
    "verses": 98,
    "type": "مكية"
  },
  {
    "num": 20,
    "name": "طه",
    "fullName": "سُورَةُ طه",
    "englishName": "Taa-Haa",
    "verses": 135,
    "type": "مكية"
  },
  {
    "num": 21,
    "name": "الأَنبِيَاءِ",
    "fullName": "سُورَةُ الأَنبِيَاءِ",
    "englishName": "Al-Anbiyaa",
    "verses": 112,
    "type": "مكية"
  },
  {
    "num": 22,
    "name": "الحَجِّ",
    "fullName": "سُورَةُ الحَجِّ",
    "englishName": "Al-Hajj",
    "verses": 78,
    "type": "مدنية"
  },
  {
    "num": 23,
    "name": "المُؤۡمِنُونَ",
    "fullName": "سُورَةُ المُؤۡمِنُونَ",
    "englishName": "Al-Muminoon",
    "verses": 118,
    "type": "مكية"
  },
  {
    "num": 24,
    "name": "النُّورِ",
    "fullName": "سُورَةُ النُّورِ",
    "englishName": "An-Noor",
    "verses": 64,
    "type": "مدنية"
  },
  {
    "num": 25,
    "name": "الفُرۡقَانِ",
    "fullName": "سُورَةُ الفُرۡقَانِ",
    "englishName": "Al-Furqaan",
    "verses": 77,
    "type": "مكية"
  },
  {
    "num": 26,
    "name": "الشُّعَرَاءِ",
    "fullName": "سُورَةُ الشُّعَرَاءِ",
    "englishName": "Ash-Shu'araa",
    "verses": 227,
    "type": "مكية"
  },
  {
    "num": 27,
    "name": "النَّمۡلِ",
    "fullName": "سُورَةُ النَّمۡلِ",
    "englishName": "An-Naml",
    "verses": 93,
    "type": "مكية"
  },
  {
    "num": 28,
    "name": "القَصَصِ",
    "fullName": "سُورَةُ القَصَصِ",
    "englishName": "Al-Qasas",
    "verses": 88,
    "type": "مكية"
  },
  {
    "num": 29,
    "name": "العَنكَبُوتِ",
    "fullName": "سُورَةُ العَنكَبُوتِ",
    "englishName": "Al-Ankaboot",
    "verses": 69,
    "type": "مكية"
  },
  {
    "num": 30,
    "name": "الرُّومِ",
    "fullName": "سُورَةُ الرُّومِ",
    "englishName": "Ar-Room",
    "verses": 60,
    "type": "مكية"
  },
  {
    "num": 31,
    "name": "لُقۡمَانَ",
    "fullName": "سُورَةُ لُقۡمَانَ",
    "englishName": "Luqman",
    "verses": 34,
    "type": "مكية"
  },
  {
    "num": 32,
    "name": "السَّجۡدَةِ",
    "fullName": "سُورَةُ السَّجۡدَةِ",
    "englishName": "As-Sajda",
    "verses": 30,
    "type": "مكية"
  },
  {
    "num": 33,
    "name": "الأَحۡزَابِ",
    "fullName": "سُورَةُ الأَحۡزَابِ",
    "englishName": "Al-Ahzaab",
    "verses": 73,
    "type": "مدنية"
  },
  {
    "num": 34,
    "name": "سَبَإٍ",
    "fullName": "سُورَةُ سَبَإٍ",
    "englishName": "Saba",
    "verses": 54,
    "type": "مكية"
  },
  {
    "num": 35,
    "name": "فَاطِرٍ",
    "fullName": "سُورَةُ فَاطِرٍ",
    "englishName": "Faatir",
    "verses": 45,
    "type": "مكية"
  },
  {
    "num": 36,
    "name": "يسٓ",
    "fullName": "سُورَةُ يسٓ",
    "englishName": "Yaseen",
    "verses": 83,
    "type": "مكية"
  },
  {
    "num": 37,
    "name": "الصَّافَّاتِ",
    "fullName": "سُورَةُ الصَّافَّاتِ",
    "englishName": "As-Saaffaat",
    "verses": 182,
    "type": "مكية"
  },
  {
    "num": 38,
    "name": "صٓ",
    "fullName": "سُورَةُ صٓ",
    "englishName": "Saad",
    "verses": 88,
    "type": "مكية"
  },
  {
    "num": 39,
    "name": "الزُّمَرِ",
    "fullName": "سُورَةُ الزُّمَرِ",
    "englishName": "Az-Zumar",
    "verses": 75,
    "type": "مكية"
  },
  {
    "num": 40,
    "name": "غَافِرٍ",
    "fullName": "سُورَةُ غَافِرٍ",
    "englishName": "Ghafir",
    "verses": 85,
    "type": "مكية"
  },
  {
    "num": 41,
    "name": "فُصِّلَتۡ",
    "fullName": "سُورَةُ فُصِّلَتۡ",
    "englishName": "Fussilat",
    "verses": 54,
    "type": "مكية"
  },
  {
    "num": 42,
    "name": "الشُّورَىٰ",
    "fullName": "سُورَةُ الشُّورَىٰ",
    "englishName": "Ash-Shura",
    "verses": 53,
    "type": "مكية"
  },
  {
    "num": 43,
    "name": "الزُّخۡرُفِ",
    "fullName": "سُورَةُ الزُّخۡرُفِ",
    "englishName": "Az-Zukhruf",
    "verses": 89,
    "type": "مكية"
  },
  {
    "num": 44,
    "name": "الدُّخَانِ",
    "fullName": "سُورَةُ الدُّخَانِ",
    "englishName": "Ad-Dukhaan",
    "verses": 59,
    "type": "مكية"
  },
  {
    "num": 45,
    "name": "الجَاثِيَةِ",
    "fullName": "سُورَةُ الجَاثِيَةِ",
    "englishName": "Al-Jaathiya",
    "verses": 37,
    "type": "مكية"
  },
  {
    "num": 46,
    "name": "الأَحۡقَافِ",
    "fullName": "سُورَةُ الأَحۡقَافِ",
    "englishName": "Al-Ahqaf",
    "verses": 35,
    "type": "مكية"
  },
  {
    "num": 47,
    "name": "مُحَمَّدٍ",
    "fullName": "سُورَةُ مُحَمَّدٍ",
    "englishName": "Muhammad",
    "verses": 38,
    "type": "مدنية"
  },
  {
    "num": 48,
    "name": "الفَتۡحِ",
    "fullName": "سُورَةُ الفَتۡحِ",
    "englishName": "Al-Fath",
    "verses": 29,
    "type": "مدنية"
  },
  {
    "num": 49,
    "name": "الحُجُرَاتِ",
    "fullName": "سُورَةُ الحُجُرَاتِ",
    "englishName": "Al-Hujuraat",
    "verses": 18,
    "type": "مدنية"
  },
  {
    "num": 50,
    "name": "قٓ",
    "fullName": "سُورَةُ قٓ",
    "englishName": "Qaaf",
    "verses": 45,
    "type": "مكية"
  },
  {
    "num": 51,
    "name": "الذَّارِيَاتِ",
    "fullName": "سُورَةُ الذَّارِيَاتِ",
    "englishName": "Adh-Dhaariyat",
    "verses": 60,
    "type": "مكية"
  },
  {
    "num": 52,
    "name": "الطُّورِ",
    "fullName": "سُورَةُ الطُّورِ",
    "englishName": "At-Tur",
    "verses": 49,
    "type": "مكية"
  },
  {
    "num": 53,
    "name": "النَّجۡمِ",
    "fullName": "سُورَةُ النَّجۡمِ",
    "englishName": "An-Najm",
    "verses": 62,
    "type": "مكية"
  },
  {
    "num": 54,
    "name": "القَمَرِ",
    "fullName": "سُورَةُ القَمَرِ",
    "englishName": "Al-Qamar",
    "verses": 55,
    "type": "مكية"
  },
  {
    "num": 55,
    "name": "الرَّحۡمَٰن",
    "fullName": "سُورَةُ الرَّحۡمَٰن",
    "englishName": "Ar-Rahmaan",
    "verses": 78,
    "type": "مدنية"
  },
  {
    "num": 56,
    "name": "الوَاقِعَةِ",
    "fullName": "سُورَةُ الوَاقِعَةِ",
    "englishName": "Al-Waaqia",
    "verses": 96,
    "type": "مكية"
  },
  {
    "num": 57,
    "name": "الحَدِيدِ",
    "fullName": "سُورَةُ الحَدِيدِ",
    "englishName": "Al-Hadid",
    "verses": 29,
    "type": "مدنية"
  },
  {
    "num": 58,
    "name": "المُجَادلَةِ",
    "fullName": "سُورَةُ المُجَادلَةِ",
    "englishName": "Al-Mujaadila",
    "verses": 22,
    "type": "مدنية"
  },
  {
    "num": 59,
    "name": "الحَشۡرِ",
    "fullName": "سُورَةُ الحَشۡرِ",
    "englishName": "Al-Hashr",
    "verses": 24,
    "type": "مدنية"
  },
  {
    "num": 60,
    "name": "المُمۡتَحنَةِ",
    "fullName": "سُورَةُ المُمۡتَحنَةِ",
    "englishName": "Al-Mumtahana",
    "verses": 13,
    "type": "مدنية"
  },
  {
    "num": 61,
    "name": "الصَّفِّ",
    "fullName": "سُورَةُ الصَّفِّ",
    "englishName": "As-Saff",
    "verses": 14,
    "type": "مدنية"
  },
  {
    "num": 62,
    "name": "الجُمُعَةِ",
    "fullName": "سُورَةُ الجُمُعَةِ",
    "englishName": "Al-Jumu'a",
    "verses": 11,
    "type": "مدنية"
  },
  {
    "num": 63,
    "name": "المُنَافِقُونَ",
    "fullName": "سُورَةُ المُنَافِقُونَ",
    "englishName": "Al-Munaafiqoon",
    "verses": 11,
    "type": "مدنية"
  },
  {
    "num": 64,
    "name": "التَّغَابُنِ",
    "fullName": "سُورَةُ التَّغَابُنِ",
    "englishName": "At-Taghaabun",
    "verses": 18,
    "type": "مدنية"
  },
  {
    "num": 65,
    "name": "الطَّلَاقِ",
    "fullName": "سُورَةُ الطَّلَاقِ",
    "englishName": "At-Talaaq",
    "verses": 12,
    "type": "مدنية"
  },
  {
    "num": 66,
    "name": "التَّحۡرِيمِ",
    "fullName": "سُورَةُ التَّحۡرِيمِ",
    "englishName": "At-Tahrim",
    "verses": 12,
    "type": "مدنية"
  },
  {
    "num": 67,
    "name": "المُلۡكِ",
    "fullName": "سُورَةُ المُلۡكِ",
    "englishName": "Al-Mulk",
    "verses": 30,
    "type": "مكية"
  },
  {
    "num": 68,
    "name": "القَلَمِ",
    "fullName": "سُورَةُ القَلَمِ",
    "englishName": "Al-Qalam",
    "verses": 52,
    "type": "مكية"
  },
  {
    "num": 69,
    "name": "الحَاقَّةِ",
    "fullName": "سُورَةُ الحَاقَّةِ",
    "englishName": "Al-Haaqqa",
    "verses": 52,
    "type": "مكية"
  },
  {
    "num": 70,
    "name": "المَعَارِجِ",
    "fullName": "سُورَةُ المَعَارِجِ",
    "englishName": "Al-Ma'aarij",
    "verses": 44,
    "type": "مكية"
  },
  {
    "num": 71,
    "name": "نُوحٍ",
    "fullName": "سُورَةُ نُوحٍ",
    "englishName": "Nooh",
    "verses": 28,
    "type": "مكية"
  },
  {
    "num": 72,
    "name": "الجِنِّ",
    "fullName": "سُورَةُ الجِنِّ",
    "englishName": "Al-Jinn",
    "verses": 28,
    "type": "مكية"
  },
  {
    "num": 73,
    "name": "المُزَّمِّلِ",
    "fullName": "سُورَةُ المُزَّمِّلِ",
    "englishName": "Al-Muzzammil",
    "verses": 20,
    "type": "مكية"
  },
  {
    "num": 74,
    "name": "المُدَّثِّرِ",
    "fullName": "سُورَةُ المُدَّثِّرِ",
    "englishName": "Al-Muddaththir",
    "verses": 56,
    "type": "مكية"
  },
  {
    "num": 75,
    "name": "القِيَامَةِ",
    "fullName": "سُورَةُ القِيَامَةِ",
    "englishName": "Al-Qiyaama",
    "verses": 40,
    "type": "مكية"
  },
  {
    "num": 76,
    "name": "الإِنسَانِ",
    "fullName": "سُورَةُ الإِنسَانِ",
    "englishName": "Al-Insaan",
    "verses": 31,
    "type": "مدنية"
  },
  {
    "num": 77,
    "name": "المُرۡسَلَاتِ",
    "fullName": "سُورَةُ المُرۡسَلَاتِ",
    "englishName": "Al-Mursalaat",
    "verses": 50,
    "type": "مكية"
  },
  {
    "num": 78,
    "name": "النَّبَإِ",
    "fullName": "سُورَةُ النَّبَإِ",
    "englishName": "An-Naba",
    "verses": 40,
    "type": "مكية"
  },
  {
    "num": 79,
    "name": "النَّازِعَاتِ",
    "fullName": "سُورَةُ النَّازِعَاتِ",
    "englishName": "An-Naazi'aat",
    "verses": 46,
    "type": "مكية"
  },
  {
    "num": 80,
    "name": "عَبَسَ",
    "fullName": "سُورَةُ عَبَسَ",
    "englishName": "Abasa",
    "verses": 42,
    "type": "مكية"
  },
  {
    "num": 81,
    "name": "التَّكۡوِيرِ",
    "fullName": "سُورَةُ التَّكۡوِيرِ",
    "englishName": "At-Takwir",
    "verses": 29,
    "type": "مكية"
  },
  {
    "num": 82,
    "name": "الانفِطَارِ",
    "fullName": "سُورَةُ الانفِطَارِ",
    "englishName": "Al-Infitaar",
    "verses": 19,
    "type": "مكية"
  },
  {
    "num": 83,
    "name": "المُطَفِّفِينَ",
    "fullName": "سُورَةُ المُطَفِّفِينَ",
    "englishName": "Al-Mutaffifin",
    "verses": 36,
    "type": "مكية"
  },
  {
    "num": 84,
    "name": "الانشِقَاقِ",
    "fullName": "سُورَةُ الانشِقَاقِ",
    "englishName": "Al-Inshiqaaq",
    "verses": 25,
    "type": "مكية"
  },
  {
    "num": 85,
    "name": "البُرُوجِ",
    "fullName": "سُورَةُ البُرُوجِ",
    "englishName": "Al-Burooj",
    "verses": 22,
    "type": "مكية"
  },
  {
    "num": 86,
    "name": "الطَّارِقِ",
    "fullName": "سُورَةُ الطَّارِقِ",
    "englishName": "At-Taariq",
    "verses": 17,
    "type": "مكية"
  },
  {
    "num": 87,
    "name": "الأَعۡلَىٰ",
    "fullName": "سُورَةُ الأَعۡلَىٰ",
    "englishName": "Al-A'laa",
    "verses": 19,
    "type": "مكية"
  },
  {
    "num": 88,
    "name": "الغَاشِيَةِ",
    "fullName": "سُورَةُ الغَاشِيَةِ",
    "englishName": "Al-Ghaashiya",
    "verses": 26,
    "type": "مكية"
  },
  {
    "num": 89,
    "name": "الفَجۡرِ",
    "fullName": "سُورَةُ الفَجۡرِ",
    "englishName": "Al-Fajr",
    "verses": 30,
    "type": "مكية"
  },
  {
    "num": 90,
    "name": "البَلَدِ",
    "fullName": "سُورَةُ البَلَدِ",
    "englishName": "Al-Balad",
    "verses": 20,
    "type": "مكية"
  },
  {
    "num": 91,
    "name": "الشَّمۡسِ",
    "fullName": "سُورَةُ الشَّمۡسِ",
    "englishName": "Ash-Shams",
    "verses": 15,
    "type": "مكية"
  },
  {
    "num": 92,
    "name": "اللَّيۡلِ",
    "fullName": "سُورَةُ اللَّيۡلِ",
    "englishName": "Al-Lail",
    "verses": 21,
    "type": "مكية"
  },
  {
    "num": 93,
    "name": "الضُّحَىٰ",
    "fullName": "سُورَةُ الضُّحَىٰ",
    "englishName": "Ad-Dhuhaa",
    "verses": 11,
    "type": "مكية"
  },
  {
    "num": 94,
    "name": "الشَّرۡحِ",
    "fullName": "سُورَةُ الشَّرۡحِ",
    "englishName": "Ash-Sharh",
    "verses": 8,
    "type": "مكية"
  },
  {
    "num": 95,
    "name": "التِّينِ",
    "fullName": "سُورَةُ التِّينِ",
    "englishName": "At-Tin",
    "verses": 8,
    "type": "مكية"
  },
  {
    "num": 96,
    "name": "العَلَقِ",
    "fullName": "سُورَةُ العَلَقِ",
    "englishName": "Al-Alaq",
    "verses": 19,
    "type": "مكية"
  },
  {
    "num": 97,
    "name": "القَدۡرِ",
    "fullName": "سُورَةُ القَدۡرِ",
    "englishName": "Al-Qadr",
    "verses": 5,
    "type": "مكية"
  },
  {
    "num": 98,
    "name": "البَيِّنَةِ",
    "fullName": "سُورَةُ البَيِّنَةِ",
    "englishName": "Al-Bayyina",
    "verses": 8,
    "type": "مدنية"
  },
  {
    "num": 99,
    "name": "الزَّلۡزَلَةِ",
    "fullName": "سُورَةُ الزَّلۡزَلَةِ",
    "englishName": "Az-Zalzala",
    "verses": 8,
    "type": "مدنية"
  },
  {
    "num": 100,
    "name": "العَادِيَاتِ",
    "fullName": "سُورَةُ العَادِيَاتِ",
    "englishName": "Al-Aadiyaat",
    "verses": 11,
    "type": "مكية"
  },
  {
    "num": 101,
    "name": "القَارِعَةِ",
    "fullName": "سُورَةُ القَارِعَةِ",
    "englishName": "Al-Qaari'a",
    "verses": 11,
    "type": "مكية"
  },
  {
    "num": 102,
    "name": "التَّكَاثُرِ",
    "fullName": "سُورَةُ التَّكَاثُرِ",
    "englishName": "At-Takaathur",
    "verses": 8,
    "type": "مكية"
  },
  {
    "num": 103,
    "name": "العَصۡرِ",
    "fullName": "سُورَةُ العَصۡرِ",
    "englishName": "Al-Asr",
    "verses": 3,
    "type": "مكية"
  },
  {
    "num": 104,
    "name": "الهُمَزَةِ",
    "fullName": "سُورَةُ الهُمَزَةِ",
    "englishName": "Al-Humaza",
    "verses": 9,
    "type": "مكية"
  },
  {
    "num": 105,
    "name": "الفِيلِ",
    "fullName": "سُورَةُ الفِيلِ",
    "englishName": "Al-Fil",
    "verses": 5,
    "type": "مكية"
  },
  {
    "num": 106,
    "name": "قُرَيۡشٍ",
    "fullName": "سُورَةُ قُرَيۡشٍ",
    "englishName": "Quraish",
    "verses": 4,
    "type": "مكية"
  },
  {
    "num": 107,
    "name": "المَاعُونِ",
    "fullName": "سُورَةُ المَاعُونِ",
    "englishName": "Al-Maa'un",
    "verses": 7,
    "type": "مكية"
  },
  {
    "num": 108,
    "name": "الكَوۡثَرِ",
    "fullName": "سُورَةُ الكَوۡثَرِ",
    "englishName": "Al-Kawthar",
    "verses": 3,
    "type": "مكية"
  },
  {
    "num": 109,
    "name": "الكَافِرُونَ",
    "fullName": "سُورَةُ الكَافِرُونَ",
    "englishName": "Al-Kaafiroon",
    "verses": 6,
    "type": "مكية"
  },
  {
    "num": 110,
    "name": "النَّصۡرِ",
    "fullName": "سُورَةُ النَّصۡرِ",
    "englishName": "An-Nasr",
    "verses": 3,
    "type": "مدنية"
  },
  {
    "num": 111,
    "name": "المَسَدِ",
    "fullName": "سُورَةُ المَسَدِ",
    "englishName": "Al-Masad",
    "verses": 5,
    "type": "مكية"
  },
  {
    "num": 112,
    "name": "الإِخۡلَاصِ",
    "fullName": "سُورَةُ الإِخۡلَاصِ",
    "englishName": "Al-Ikhlaas",
    "verses": 4,
    "type": "مكية"
  },
  {
    "num": 113,
    "name": "الفَلَقِ",
    "fullName": "سُورَةُ الفَلَقِ",
    "englishName": "Al-Falaq",
    "verses": 5,
    "type": "مكية"
  },
  {
    "num": 114,
    "name": "النَّاسِ",
    "fullName": "سُورَةُ النَّاسِ",
    "englishName": "An-Naas",
    "verses": 6,
    "type": "مكية"
  }
];
