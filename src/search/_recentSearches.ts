/*
   Most recent first, each term once, at most `limit` of them.

   A repeat moves to the front rather than appearing twice, and "Paris" and
   "paris" count as one - the search itself does not tell them apart, so the
   list should not either. The spelling kept is the latest one typed.
*/
export const rememberSearch = (recent: readonly string[], term: string, limit: number) => {
    const trimmed = term.trim();

    if (!trimmed) {
        return recent.slice(0, limit);
    }

    const key = trimmed.toLocaleLowerCase();

    return [trimmed, ...recent.filter(other => other.toLocaleLowerCase() !== key)].slice(0, limit);
};
