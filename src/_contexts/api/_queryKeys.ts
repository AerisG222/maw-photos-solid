import { Uuid } from "../../_models/Uuid";

/*
   Every cache key the app uses, in one place.

   These are built here rather than written inline because several of them are
   also *matched* - the favorite toggles patch every cached list holding the item
   instead of refetching it, and those predicates have to agree with the keys
   exactly. Written out at both ends, a rename in one file silently stops the
   patching in another, and the symptom is a heart that does not update rather
   than an error. Constructing and matching from the same definitions removes
   that class of drift.
*/

// the media feeds are keyed by their filter as well as their subject, so two
// filters never share an entry. Structural rather than imported to keep this
// module free of dependencies on the contexts that use it.
interface FeedFilter {
    readonly favoritesOnly: boolean;
    readonly seed?: number | undefined;
}

// which slice of the place tree a listing asked for. Structural for the same
// reason as FeedFilter above
interface PlaceListFilter {
    readonly parentId?: string | undefined;
    readonly kind?: string | undefined;
    readonly search?: string | undefined;
}

export const queryKeys = {
    auth: {
        accountStatus: () => ["auth", "account-status"] as const
    },
    config: {
        scales: () => ["config", "scales"] as const
    },
    stats: {
        all: () => ["stats"] as const,
        year: (year: number) => ["stats", year] as const
    },
    categories: {
        all: () => ["categories"] as const,
        years: () => ["categories", "years"] as const,
        forYear: (year: number) => ["categories", "year", year] as const,
        withoutGpsForYear: (year: number) => ["categories", "year", year, "no-gps"] as const,
        detail: (id: Uuid | undefined) => ["categories", id] as const,
        media: (id: Uuid | undefined) => ["categories", id, "media"] as const,
        gps: (id: Uuid | undefined) => ["categories", id, "gps"] as const,
        searchRoot: () => ["categories", "search"] as const,
        search: (term: string) => ["categories", "search", term] as const
    },
    media: {
        all: () => ["media"] as const,
        random: () => ["media", "random"] as const,
        detail: (id: Uuid | undefined) => ["media", id] as const,
        metadata: (id: Uuid | undefined) => ["media", id, "metadata"] as const,
        comments: (id: Uuid | undefined) => ["media", id, "comments"] as const,
        gps: (id: Uuid | undefined) => ["media", id, "gps"] as const,
        faces: (id: Uuid | undefined) => ["media", id, "faces"] as const,
        // the chain of places one media was taken at. Keyed under the media
        // rather than under places because it is asked with a media id in hand -
        // it is the one read that runs the tree backwards
        places: (id: Uuid | undefined) => ["media", id, "places"] as const
    },
    people: {
        all: () => ["people"] as const,
        media: (id: Uuid | undefined, filter: FeedFilter) =>
            ["people", id, "media", filter] as const,
        categories: (id: Uuid | undefined, filter: FeedFilter) =>
            ["people", id, "categories", filter] as const
    },
    /*
       The place tree. `list` is keyed by the whole request rather than by parent
       alone because a search ignores the parent and answers from anywhere in the
       tree - two listings that must never share an entry.
    */
    places: {
        all: () => ["places"] as const,
        list: (filter: PlaceListFilter) => ["places", "list", filter] as const,
        detail: (id: Uuid | undefined) => ["places", id] as const,
        ancestors: (id: Uuid | undefined) => ["places", id, "ancestors"] as const,
        media: (id: Uuid | undefined) => ["places", id, "media"] as const,
        categories: (id: Uuid | undefined, filter: FeedFilter) =>
            ["places", id, "categories", filter] as const
    },
    clans: {
        all: () => ["clans"] as const,
        media: (id: Uuid | undefined, filter: FeedFilter) =>
            ["clans", id, "media", filter] as const,
        categories: (id: Uuid | undefined, filter: FeedFilter) =>
            ["clans", id, "categories", filter] as const
    }
};

/*
   The shapes the cache patchers match on. Each names the group of entries it
   covers rather than restating a key, so a caller reads what it is looking for
   instead of an index into an array.
*/
export const queryKeyMatches = {
    // the per-year category lists behind the grid and list views. Length pins it
    // to the lists themselves, leaving the no-gps variant alone
    categoriesForAnyYear: (key: readonly unknown[]) =>
        key[0] === "categories" && key[1] === "year" && key.length === 3,

    categorySearch: (key: readonly unknown[]) => key[0] === "categories" && key[1] === "search",

    // the media held for each category
    categoryMedia: (key: readonly unknown[]) => key[0] === "categories" && key[2] === "media",

    // every person and clan feed, whatever filter it was fetched under
    faceFeedMedia: (key: readonly unknown[]) =>
        (key[0] === "people" || key[0] === "clans") && key[2] === "media",

    // the place listings, whichever level or search term produced them. Pinned
    // to the lists so the single-place and ancestor entries - which hold a
    // different shape - are left alone
    placeList: (key: readonly unknown[]) => key[0] === "places" && key[1] === "list",

    // the place chains held against a media. They carry the same Place objects as
    // the listings above, so a cover published from anywhere has to reach both
    mediaPlaces: (key: readonly unknown[]) => key[0] === "media" && key[2] === "places"
};
