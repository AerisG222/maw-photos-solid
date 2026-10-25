import { SearchSchemaInput } from "@tanstack/solid-router";

import { isUuid, Uuid } from "../_models/Uuid";

export interface CategoriesSearch {
    // one year, or every year; absent means whatever was chosen last
    year?: number | "all";
    /*
       The photo open over the grid while browsing every category's photos -
       its category, and its slug within it. In the address so a refresh or a
       link reopens it and Back closes it, and on this route rather than a new
       one so opening it leaves the listing, and where it was scrolled to,
       exactly as it was.
    */
    category?: Uuid;
    photo?: string;
}

/*
   The year filter, as the address says it. A year arrives as text - "2026" -
   and leaves as a number; anything that is neither a year nor "all" is dropped
   rather than reaching the listing. An open photo is kept only whole - a real
   category id with a slug - since one without the other finds nothing.
*/
export const validateCategoriesSearch = (
    search: CategoriesSearch & SearchSchemaInput
): CategoriesSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw: unknown = search.year;

    const year = raw === "all" ? "all" : typeof raw === "number" ? raw : parseInt(String(raw), 10);
    const result: CategoriesSearch = year === "all" || Number.isInteger(year) ? { year } : {};

    // the two travel together: a photo is only found within its category
    const category = typeof search.category === "string" ? search.category : undefined;
    const photo = typeof search.photo === "string" ? search.photo : undefined;

    if (isUuid(category) && photo) {
        result.category = category;
        result.photo = photo;
    }

    return result;
};
