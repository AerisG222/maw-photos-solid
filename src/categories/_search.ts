import { SearchSchemaInput } from "@tanstack/solid-router";

import { MediaFilters, isFlagSet, validateMediaFilters } from "../_models/MediaFilters";

export interface CategoriesSearch extends MediaFilters {
    // one year, or every year; absent means whatever was chosen last
    year?: number | "all";
    // admin only: categories with a photo that has no location
    noGps?: boolean;
    // admin only: categories holding a restricted photo
    restricted?: boolean;
}

// everything but the year, which is on the page rather than in the filter menu
export type CategoryFilters = Omit<CategoriesSearch, "year">;

/*
   What the listing is narrowed to, as the address says it. A year arrives as
   text - "2026" - and leaves as a number; anything that is neither a year nor
   "all" is dropped rather than reaching the listing.
*/
export const validateCategoriesSearch = (
    search: CategoriesSearch & SearchSchemaInput
): CategoriesSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw = search as unknown as Record<string, unknown>;
    const result: CategoriesSearch = validateMediaFilters(raw);

    const year = typeof raw.year === "number" ? raw.year : parseInt(String(raw.year), 10);

    if (raw.year === "all") {
        result.year = "all";
    } else if (Number.isInteger(year)) {
        result.year = year;
    }

    if (isFlagSet(raw.noGps)) {
        result.noGps = true;
    }

    if (isFlagSet(raw.restricted)) {
        result.restricted = true;
    }

    return result;
};
