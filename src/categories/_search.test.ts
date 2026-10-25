import { describe, expect, test } from "vitest";

import { validateCategoriesSearch } from "./_search";

const CATEGORY = "11111111-1111-4111-8111-111111111111";

// as the address bar hands it over: every value a string
const parse = (search: Record<string, string>) =>
    validateCategoriesSearch(search as unknown as Parameters<typeof validateCategoriesSearch>[0]);

describe("the categories address", () => {
    test("takes a year, or every year", () => {
        expect(parse({ year: "2024" })).toEqual({ year: 2024 });
        expect(parse({ year: "all" })).toEqual({ year: "all" });
        expect(parse({ year: "soon" })).toEqual({});
    });

    test("keeps the photo open over the listing", () => {
        expect(parse({ year: "2024", category: CATEGORY, photo: "a-photo" })).toEqual({
            year: 2024,
            category: CATEGORY,
            photo: "a-photo"
        });
    });

    // one without the other finds nothing, so neither is kept
    test("drops half of an open photo", () => {
        expect(parse({ category: CATEGORY })).toEqual({});
        expect(parse({ photo: "a-photo" })).toEqual({});
        expect(parse({ category: "not-an-id", photo: "a-photo" })).toEqual({});
    });
});
