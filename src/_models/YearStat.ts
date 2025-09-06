import { MediaTypeStat } from "./MediaTypeStat";

export interface YearStat {
    year: number;
    categoryCount: number;
    mediaTypeStats: MediaTypeStat[];
}
