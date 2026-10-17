import { SearchSchemaInput } from "@tanstack/solid-router";

export interface CategoriesSearch {
    // one year, or every year; absent means whatever was chosen last
    year?: number | "all";
}

/*
   The year filter, as the address says it. A year arrives as text - "2026" -
   and leaves as a number; anything that is neither a year nor "all" is dropped
   rather than reaching the listing.
*/
export const validateCategoriesSearch = (
    search: CategoriesSearch & SearchSchemaInput
): CategoriesSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw: unknown = search.year;

    if (raw === "all") {
        return { year: "all" };
    }

    const year = typeof raw === "number" ? raw : parseInt(String(raw), 10);

    return Number.isInteger(year) ? { year } : {};
};
