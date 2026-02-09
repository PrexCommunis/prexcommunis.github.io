export interface LectionaryDay {
  morning: { first: string; second: string };
  evening: { first: string; second: string };
}

export interface LectionaryMonth {
  [day: number]: LectionaryDay;
}

export interface Lectionary {
  [month: number]: LectionaryMonth;
}

export interface PsalmEntry {
    number: number;
    reference: string;
    apiRef: string;
    title: string;
}

export interface Collect {
  text: string;
}

export interface Collects {
    [key: string]: { [key: string]: Collect } | Collect;
}

export interface Sentence {
  text: string;
  citation: string;
}

export interface LiturgicalInfo {
    season: string;
    weekInfo: string;
    saintDay?: string;
}

export interface BibleVerse {
    verse: number;
    text: string;
}

export interface BibleApiResponse {
    reference: string;
    verses: {
        book_id: string;
        book_name: string;
        chapter: number;
        verse: number;
        text: string;
    }[];
    text: string;
    translation_id: string;
    translation_name: string;
    translation_note: string;
}

export interface DialogueLine {
    speaker: string;
    text: string;
}

export interface Canticle {
    title: string;
    citation?: string;
    text: string;
    antiphon?: string;
}

export interface OfficeContent {
    confession: {
        exhortation: string;
        generalConfession: string;
        absolution: string;
    };
    invitatory: {
        preces: DialogueLine[];
        venite: Canticle;
    };
    canticles: Record<string, Canticle>;
    creed: {
        apostles: string;
    };
    prayers: {
        lordsPrayer: string;
        suffrages: DialogueLine[];
        statePrayers: Record<string, string>;
        stChrysostom: string;
        grace: string;
    };
}
