import { KeyValuePair } from "./KeyValuePair";

// the same choices the Android app offers, so the two remember alike
export const allSearchHistoryCounts: KeyValuePair<number>[] = [5, 10, 20, 30, 50].map(count => ({
    id: count,
    name: String(count)
}));

export const defaultSearchHistoryCount = 10;
