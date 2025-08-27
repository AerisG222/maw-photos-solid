import { MediaTypeStat } from './MediaTypeStat';

export type YearStat = {
    year: number;
    categoryCount: number;
    mediaTypeStats: MediaTypeStat[];
}
