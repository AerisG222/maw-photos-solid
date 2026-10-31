import { Media } from "./Media";

export type MediaTypeFilter = "photo" | "video";

/*
   What a listing of photos and videos can be narrowed to, as the address says
   it. In the address rather than a store, like a feed's: a filter hidden in a
   menu and remembered between visits is a shorter list with no explanation.
*/
export interface MediaFilters {
    // favorites only
    f?: boolean;
    // one type of media
    t?: MediaTypeFilter;
}

// a flag arrives from the address as text, and from a link as a boolean
export const isFlagSet = (raw: unknown) => raw === true || raw === "true";

// anything that is not a filter is dropped rather than reaching the listing
export const validateMediaFilters = (search: Record<string, unknown>): MediaFilters => {
    const result: MediaFilters = {};

    if (isFlagSet(search.f)) {
        result.f = true;
    }

    if (search.t === "photo" || search.t === "video") {
        result.t = search.t;
    }

    return result;
};

export const countMediaFilters = (filters: MediaFilters) =>
    (filters.f ? 1 : 0) + (filters.t ? 1 : 0);

export const filterMedia = (media: Media[], filters: MediaFilters) =>
    countMediaFilters(filters) === 0
        ? media
        : media.filter(
              item => (!filters.f || item.isFavorite) && (!filters.t || item.type === filters.t)
          );
