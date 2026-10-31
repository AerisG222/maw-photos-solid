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

describe("a feed", () => {
    test("opens on its media by default", async () => {
        expect(await landingFrom(`/people/${PERSON}`)).toBe(`/people/${PERSON}/grid`);
    });

    test("opens on its categories if they were last chosen", async () => {
        expect(await landingFrom(`/people/${PERSON}`, { feedListing: "categories" })).toBe(
            `/people/${PERSON}/categories`
        );
    });

    // these were settings once, and can still be sitting in somebody's browser
    test("ignores a favorites or shuffle setting left in storage", async () => {
        expect(
            await landingFrom(`/people/${PERSON}`, {
                feedListing: "categories",
                feedFavoritesOnly: true,
                feedShuffle: true
            })
        ).toBe(`/people/${PERSON}/categories`);
    });
});
