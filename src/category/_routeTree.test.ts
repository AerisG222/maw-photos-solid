import { QueryClient } from "@tanstack/solid-query";
import { createMemoryHistory, createRouter } from "@tanstack/solid-router";
import { afterEach, describe, expect, test } from "vitest";

import { routeTree } from "../_router/routeTree";
import { parseSearch, stringifySearch } from "../_router/search";
import { KEY_SETTINGS_V2_MEDIA, KEY_SETTINGS_V2_MIGRATED } from "../_contexts/settings/_storage";

/*
   A category opens in the view used last, decided before anything renders. It
   was a component that mounted and then navigated, and the blank page that left
   between the listing and the category was what its toolbar faded in from.

   `isLoggedIn: false` would be sent to sign in, so this one is signed in, with
   nothing to answer the queries the routes start - where it lands is the point.
*/
const landingFrom = async (href: string, savedView: string) => {
    localStorage.setItem(KEY_SETTINGS_V2_MIGRATED, "true");
    localStorage.setItem(KEY_SETTINGS_V2_MEDIA, JSON.stringify({ view: savedView }));

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

    return router.state.location.pathname;
};

afterEach(() => localStorage.clear());

describe("opening a category", () => {
    test("lands on the grid, if that was the view used last", async () => {
        expect(await landingFrom("/categories/2019/a-trip", "grid")).toBe(
            "/categories/2019/a-trip/grid"
        );
    });

    test("lands on the map, if that was", async () => {
        expect(await landingFrom("/categories/2019/a-trip", "map")).toBe(
            "/categories/2019/a-trip/map"
        );
    });

    // deleted views can still be sitting in somebody's settings
    test("falls back to the grid for a view that no longer exists", async () => {
        expect(await landingFrom("/categories/2019/a-trip", "detail")).toBe(
            "/categories/2019/a-trip/grid"
        );
    });
});
