import { SearchSchemaInput } from "@tanstack/solid-router";

import { MediaTypeFilter, validateMediaFilters } from "../../_models/MediaFilters";
import { newMediaSeed } from "../../_models/utils/MediaUtils";

export interface FeedSearch {
    // favorites only
    f?: boolean;
    // one type of media
    t?: MediaTypeFilter;
    // a shuffled order, reproducible from the seed
    seed?: number;
}

/*
   What a feed's address may say. In the address rather than a store: it has to
   survive moving between a feed's listings, which are separate routes, and a
   reload or a shared link should reproduce the same feed. Anything that is not
   a favorites flag or a whole number of a seed is dropped.
*/
/*
   The order for a feed being opened shuffled, new each time. Hovering a link opens
   it too, to load it ahead, so that seed is kept for the click that follows -
   otherwise what was loaded ahead would be a different order, and go unused.
*/
let preloadedSeed: number | undefined;

export const openingSeed = (preload: boolean) => {
    const seed = preloadedSeed ?? newMediaSeed();

    preloadedSeed = preload ? seed : undefined;

    return seed;
};

export const validateFeedSearch = (search: FeedSearch & SearchSchemaInput): FeedSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw = search as unknown as Record<string, unknown>;
    const result: FeedSearch = {};

    if (raw.f === true || raw.f === "true") {
        result.f = true;
    }

    const { t } = validateMediaFilters(raw);

    if (t) {
        result.t = t;
    }

    const seed = typeof raw.seed === "number" ? raw.seed : Number(raw.seed);

    if (raw.seed !== undefined && Number.isSafeInteger(seed)) {
        result.seed = seed;
    }

    return result;
};
