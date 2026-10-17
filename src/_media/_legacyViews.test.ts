import { describe, expect, test } from "vitest";

import { gridAddressFor } from "./_legacyViews";

/*
   The detail and fullscreen views stopped being places you go; their addresses
   did not. The slug is identical in every view, so each is a substitution - the
   reader lands on the photograph they were sent, in the grid.
*/
describe("an old view's address", () => {
    test("fullscreen lands on the same photograph in the grid", () => {
        expect(gridAddressFor("/c/a-category/fullscreen/a-photo")).toBe(
            "/c/a-category/grid/a-photo"
        );
    });

    test("and with no photograph, on the grid itself", () => {
        expect(gridAddressFor("/c/a-category/fullscreen")).toBe("/c/a-category/grid");
    });

    test("detail does the same, keeping the query string", () => {
        expect(gridAddressFor("/people/p/detail/2019/a-category/a-photo?f=true")).toBe(
            "/people/p/grid/2019/a-category/a-photo?f=true"
        );
    });

    // a category whose slug merely starts with the word is not an old view
    test("leaves a slug that only begins with the word alone", () => {
        expect(gridAddressFor("/categories/2019/details-of-a-trip/grid")).toBe(
            "/categories/2019/details-of-a-trip/grid"
        );
    });
});
