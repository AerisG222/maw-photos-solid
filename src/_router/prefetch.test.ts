import { QueryClient } from "@tanstack/solid-query";
import { createMemoryHistory, createRouter } from "@tanstack/solid-router";
import { afterEach, describe, expect, test, vi } from "vitest";

import { routeTree } from "./routeTree";
import { parseSearch, stringifySearch } from "./search";
import { statsByYearQueryOptions } from "../_contexts/api/_statsQueries";
import { peopleQueryOptions, personMediaQueryOptions } from "../_contexts/api/_peopleQueries";
import { clansQueryOptions } from "../_contexts/api/_clansQueries";
import { scalesQueryOptions } from "../_contexts/api/_configQueries";
import { placeAncestorsQueryOptions, placeQueryOptions } from "../_contexts/api/_placesQueries";
import { Uuid } from "../_models/Uuid";

/*
   A loader is only worth anything if it warms the very cache entry its screen
   then reads. Nothing would fail if it did not - the screen would simply fetch
   again, as if there were no loader - so this checks the entries directly: a
   route is preloaded the way hovering a link preloads it, and the answer has to
   be sitting under the key the screen's own query uses.
*/

const PERSON = "11111111-1111-4111-8111-111111111111" as Uuid;
const PLACE = "22222222-2222-4222-8222-222222222222" as Uuid;
const PARENT = "33333333-3333-4333-8333-333333333333" as Uuid;

const answers: [RegExp, unknown][] = [
    [/auth\/account-status$/, { status: "active", isAdmin: false }],
    [/config\/scales$/, []],
    [/stats$/, []],
    [/persons$/, [{ id: PERSON, name: "A Person" }]],
    [/clans$/, []],
    [/persons\/[^/]+\/media/, { results: [], hasMoreResults: false, nextOffset: 0 }],
    [/places\/[^/]+\/ancestors$/, [{ id: PARENT, name: "A Country", kind: "country" }]],
    [/places\/[^/?]+$/, { id: PLACE, name: "A City" }],
    [/places(\?.*)?$/, []]
];

const fetched: string[] = [];

const router = () => {
    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
        const url =
            typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        fetched.push(url);

        const answer = answers.find(
            ([pattern]) => pattern.test(url.split("?")[0] ?? url) || pattern.test(url)
        );

        return Promise.resolve(
            new Response(JSON.stringify(answer?.[1] ?? {}), {
                status: answer ? 200 : 404,
                headers: { "content-type": "application/json" }
            })
        );
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const getToken = () => Promise.resolve("token");

    const instance = createRouter({
        routeTree,
        history: createMemoryHistory(),
        context: {
            queryClient,
            getToken,
            isLoggedIn: () => true,
            login: () => Promise.resolve()
        },
        parseSearch,
        stringifySearch
    });

    return { router: instance, queryClient, getToken };
};

afterEach(() => {
    vi.unstubAllGlobals();
    fetched.length = 0;
});

describe("hovering a link starts its screen's queries", () => {
    test("every route: the image sizes the shell needs", async () => {
        const { router: r, queryClient, getToken } = router();

        await r.preloadRoute({ to: "/stats/summary" });

        await vi.waitFor(() =>
            expect(queryClient.getQueryData(scalesQueryOptions(getToken).queryKey)).toBeDefined()
        );
    });

    test("stats: the summary", async () => {
        const { router: r, queryClient, getToken } = router();

        await r.preloadRoute({ to: "/stats/summary" });

        await vi.waitFor(() =>
            expect(
                queryClient.getQueryData(statsByYearQueryOptions(getToken).queryKey)
            ).toBeDefined()
        );
    });

    test("people: the people and the clans", async () => {
        const { router: r, queryClient, getToken } = router();

        await r.preloadRoute({ to: "/people" });

        await vi.waitFor(() => {
            expect(queryClient.getQueryData(peopleQueryOptions(getToken).queryKey)).toBeDefined();
            expect(queryClient.getQueryData(clansQueryOptions(getToken).queryKey)).toBeDefined();
        });
    });

    // the filter as the feed itself builds it from the address, so the keys must match exactly
    test("a person's feed: the first page under the address's filter, and the name", async () => {
        const { router: r, queryClient, getToken } = router();

        await r.preloadRoute({
            to: "/people/$personId/grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
            params: { personId: PERSON },
            search: { f: true }
        });

        await vi.waitFor(() => {
            const key = personMediaQueryOptions(getToken, PERSON, {
                favoritesOnly: true,
                seed: undefined
            }).queryKey;

            expect(queryClient.getQueryData(key)).toBeDefined();
            expect(queryClient.getQueryData(peopleQueryOptions(getToken).queryKey)).toBeDefined();
        });
    });

    test("a place: the place, and the chain above it", async () => {
        const { router: r, queryClient, getToken } = router();

        await r.preloadRoute({ to: "/places/{-$placeId}", params: { placeId: PLACE } });

        await vi.waitFor(() => {
            expect(
                queryClient.getQueryData(placeQueryOptions(getToken, PLACE).queryKey)
            ).toBeDefined();
            expect(
                queryClient.getQueryData(placeAncestorsQueryOptions(getToken, PLACE).queryKey)
            ).toBeDefined();
            // the second step of the chain: the ancestor's own details
            expect(
                queryClient.getQueryData(placeQueryOptions(getToken, PARENT).queryKey)
            ).toBeDefined();
        });
    });
});
