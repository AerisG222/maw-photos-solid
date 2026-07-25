/*
   Collapsing several queries into one error surface.

   Most screens are backed by more than one query - a year list plus a category
   plus its media, say - and the user does not care which of them failed. These
   pick the first real failure to report and let a retry re-run all of them.

   The shape is declared structurally rather than importing TanStack's result
   types so it accepts `UseQueryResult`, `UseInfiniteQueryResult`, and the
   arrays that `useQueries` hands back without further ceremony.
*/
export interface RetryableQuery {
    isError: boolean;
    error: Error | null;
    refetch: () => unknown;
}

export const findQueryError = (queries: (RetryableQuery | undefined)[]): Error | undefined =>
    queries.find(query => query?.isError)?.error ?? undefined;

export const refetchQueries = (queries: (RetryableQuery | undefined)[]) => {
    for (const query of queries) {
        void query?.refetch();
    }
};
