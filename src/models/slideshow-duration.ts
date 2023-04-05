import { KeyValuePair } from './key-value-pair';

export type SlideshowDurationIdType = number;
export type SlideshowDuration = KeyValuePair<SlideshowDurationIdType>;

export const allSlideshowDurations: SlideshowDuration[] = [
    { id: 1,  name: "1" },
    { id: 2,  name: "2" },
    { id: 3,  name: "3" },
    { id: 4,  name: "4" },
    { id: 5,  name: "5" },
    { id: 10, name: "10" },
    { id: 15, name: "15" },
    { id: 20, name: "20" },
    { id: 25, name: "25" },
    { id: 30, name: "30" },
    { id: 45, name: "45" },
    { id: 60, name: "60" },
];

export const defaultSlideshowDuration: SlideshowDurationIdType = 2;
