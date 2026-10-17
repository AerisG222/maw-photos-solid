import { SearchSchemaInput } from "@tanstack/solid-router";

export interface FeedSearch {
    // favorites only
    f?: boolean;
    // a shuffled order, reproducible from the seed
    seed?: number;
}

/*
   What a feed's address may say. In the address rather than a store: it has to
   survive moving between a feed's listings, which are separate routes, and a
   reload or a shared link should reproduce the same feed. Anything that is not
   a favorites flag or a whole number of a seed is dropped.
*/
export const validateFeedSearch = (search: FeedSearch & SearchSchemaInput): FeedSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw = search as unknown as Record<string, unknown>;
    const result: FeedSearch = {};

    if (raw.f === true || raw.f === "true") {
        result.f = true;
    }

    const seed = typeof raw.seed === "number" ? raw.seed : Number(raw.seed);

    if (raw.seed !== undefined && Number.isSafeInteger(seed)) {
        result.seed = seed;
    }

    return result;
};
