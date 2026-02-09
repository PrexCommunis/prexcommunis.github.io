import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { getLiturgicalInfo } from '../utils/liturgicalCalendar';
import { getTodaysReadings } from '../utils/lectionary';
import { getPsalmReferences } from '../utils/psalms';
import { getTodaysCollect } from '../utils/collects';
import { getRandomSentence } from '../utils/sentences';
import { LiturgicalInfo, LectionaryDay, PsalmEntry, Sentence } from '../types';

export interface LiturgicalData {
    liturgicalInfo: LiturgicalInfo;
    readings: LectionaryDay | null;
    psalms: PsalmEntry[];
    collect: string | null;
    sentence: Sentence;
    loading: boolean;
}

export function useLiturgicalData(): LiturgicalData {
    const { currentOffice } = useApp();

    const data = useMemo(() => {
        const now = new Date();
        
        // Handle office mapping for resources that only have morning/evening
        const officeForPsalms = (currentOffice === 'morning' || currentOffice === 'evening') ? currentOffice : null;
        const officeForSentence = (currentOffice === 'morning' || currentOffice === 'evening') ? currentOffice : 'morning'; // Fallback to morning for sentences

        return {
            liturgicalInfo: getLiturgicalInfo(now),
            readings: getTodaysReadings(),
            psalms: officeForPsalms ? getPsalmReferences(officeForPsalms) : [],
            collect: getTodaysCollect(),
            sentence: getRandomSentence(officeForSentence),
            loading: false
        };
    }, [currentOffice]);

    return data;
}

