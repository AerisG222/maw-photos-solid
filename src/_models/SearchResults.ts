export type SearchResults<T> = {
    results: T[];
    hasMoreResults: boolean;
    nextOffset: number;
};
