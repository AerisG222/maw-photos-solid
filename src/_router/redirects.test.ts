import { QueryClient } from "@tanstack/solid-query";
import { createMemoryHistory, createRouter } from "@tanstack/solid-router";
import { afterEach, describe, expect, test } from "vitest";

import { KEY_SETTINGS_V2_AREA, KEY_SETTINGS_V2_MIGRATED } from "../_contexts/settings/_storage";
import { routeTree } from "./routeTree";
import { parseSearch, stringifySearch } from "./search";

/*
   A section opens on the view used last, decided before anything renders. These
   were components that mounted and then navigated, which put a blank page on the
   way through. Nothing renders here at all, so landing is the redirect's doing.
*/
const PERSON = "01910000-0000-7000-8000-000000000001";

const landingFrom = async (href: string, area: object = {}) => {
    localStorage.setItem(KEY_SETTINGS_V2_MIGRATED, "true");
    localStorage.setItem(KEY_SETTINGS_V2_AREA, JSON.stringify(area));

    const router = createRouter({
        routeTree,
        context: {
            queryClient: new QueryClient({ defaultOptions: { queries: { retry: false } } }),
            getToken: () => Promise.resolve("a-token"),
            isLoggedIn: () => true,
            login: () => Promise.resolve()
        },
        history: createMemoryHistory({ initialEntries: [href] }),
        parseSearch,
        stringifySearch
    });

    await router.load();

    return router.state.location.href;
};

afterEach(() => localStorage.clear());

describe("categories", () => {
    test("opens on the view and year last used", async () => {
        expect(
            await landingFrom("/categories", { categoriesView: "list", categoryYearFilter: 2019 })
        ).toBe("/categories/list?year=2019");
    });

    test("keeps the year and filters the address asked for", async () => {
        expect(
            await landingFrom("/categories?year=2007&f=true", { categoryYearFilter: 2019 })
        ).toBe("/categories/grid?year=2007&f=true");
    });
});

test("search opens on the view last used", async () => {
    expect(await landingFrom("/search", { searchView: "list" })).toBe("/search/list");
});

describe("the filters last chosen", () => {
    const area = {
        categoryYearFilter: 2019,
        categoriesFilters: { f: true, noGps: true },
        categoryMediaFilters: { t: "video" },
        peopleFavoritesOnly: true,
        personFeedFilters: { f: true, t: "photo" },
        placeFeedFilters: { t: "video" },
        searchFilters: { t: "video" }
    };

    test("come back when opening categories", async () => {
        expect(await landingFrom("/categories", area)).toBe(
            "/categories/grid?f=true&noGps=true&year=2019"
        );
    });

    test("add to a year the address asked for", async () => {
        expect(await landingFrom("/categories?year=2007", area)).toBe(
            "/categories/grid?f=true&noGps=true&year=2007"
        );
    });

    test("come back when opening a category", async () => {
        expect(await landingFrom("/categories/2019/a-trip", area)).toBe(
            "/categories/2019/a-trip/grid?t=video"
        );
    });

    test("come back when opening search", async () => {
        expect(await landingFrom("/search", area)).toBe("/search/grid?t=video");
    });

    test("come back when opening people, and settle there", async () => {
        expect(await landingFrom("/people", area)).toBe("/people?f=true");
    });

    test("come back when opening a feed", async () => {
        expect(await landingFrom(`/people/${PERSON}`, area)).toBe(
            `/people/${PERSON}/grid?f=true&t=photo`
        );
        expect(
            await landingFrom(`/people/${PERSON}`, { ...area, personFeedListing: "categories" })
        ).toBe(`/people/${PERSON}/categories?f=true&t=photo`);
    });

    test("are a place's own, apart from a person's", async () => {
        expect(await landingFrom(`/places/${PERSON}/media`, area)).toBe(
            `/places/${PERSON}/media/grid?t=video`
        );
        expect(
            await landingFrom(`/places/${PERSON}/media`, { placeFeedListing: "categories" })
        ).toBe(`/places/${PERSON}/media/categories`);
        expect(await landingFrom(`/people/${PERSON}`, { placeFeedListing: "categories" })).toBe(
            `/people/${PERSON}/grid`
        );
    });

    test("start from one listing choice saved before people and places were separate", async () => {
        const old = { feedListing: "categories" };

        expect(await landingFrom(`/people/${PERSON}`, old)).toBe(`/people/${PERSON}/categories`);
        expect(await landingFrom(`/places/${PERSON}/media`, old)).toBe(
            `/places/${PERSON}/media/categories`
        );
    });

    test("give way to what the address says", async () => {
        expect(await landingFrom("/categories/2019/a-trip?t=photo", area)).toBe(
            "/categories/2019/a-trip/grid?t=photo"
        );
    });

    // a shared link has to open on the photo, not on a list that has filtered it away
    test("stay out of a link straight to a photo", async () => {
        expect(await landingFrom("/categories/2019/a-trip/grid/a-photo.jpg", area)).toBe(
            "/categories/2019/a-trip/grid/a-photo.jpg"
        );
    });
});

describe("a feed", () => {
    test("opens on its media by default", async () => {
        expect(await landingFrom(`/people/${PERSON}`)).toBe(`/people/${PERSON}/grid`);
    });

    test("opens on its categories if they were last chosen", async () => {
        expect(await landingFrom(`/people/${PERSON}`, { personFeedListing: "categories" })).toBe(
            `/people/${PERSON}/categories`
        );
    });

    // these were settings once, and can still be sitting in somebody's browser
    test("ignores a favorites or shuffle setting left in storage", async () => {
        expect(
            await landingFrom(`/people/${PERSON}`, {
                personFeedListing: "categories",
                feedFavoritesOnly: true,
                feedShuffle: true
            })
        ).toBe(`/people/${PERSON}/categories`);
    });
});
