export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName?: string;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean;
}

export interface SurahOnPage {
  number: number;
  name: string;
  fullName: string;
  type: 'مكية' | 'مدنية';
  startAyahNumberInSurah: number;
}

export interface PageData {
  pageNumber: number;
  ayahs: Ayah[];
  surahsOnPage: SurahOnPage[];
  juzNumber: number;
  hizbQuarter?: number;
}

export interface SurahMetaExtended {
  num: number;
  name: string;
  fullName: string;
  englishName: string;
  verses: number;
  type: 'مكية' | 'مدنية';
  startPage: number;
  endPage: number;
}

export interface JuzInfo {
  juzNumber: number;
  name: string;
  startPage: number;
  endPage: number;
  startSurahName: string;
}

export type ReadingTheme = 'parchment' | 'night' | 'clean';
export type PageFlipDirection = 'next' | 'prev' | null;
