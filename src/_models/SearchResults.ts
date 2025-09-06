export interface SearchResults<T> {
    results: T[];
    hasMoreResults: boolean;
    nextOffset: number;
}
