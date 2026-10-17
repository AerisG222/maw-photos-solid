import { createRouter, getRouteApi, linkOptions } from "@tanstack/solid-router";
import { QueryClient } from "@tanstack/solid-query";
import { expect, test } from "vitest";

import { routeTree } from "./routeTree";
import { statsSummaryRoute } from "../stats/_routeTree";
import { categoryGridRoute } from "../category/_routeTree";
import { placesRoute } from "../places/_routeTree";
import { personFeedGridRoute } from "../_media/feed/_routeTree";

/*
   The router's types, checked by the compiler rather than at runtime.

   Every link here is typed against the whole route tree - but only for as long
   as that tree's type holds together. It has collapsed to `any` without a sound:
   one way of declaring routes, and one helper's loose parameter type, each
   quietly turned every link, param and search in the application into
   something that accepted anything, and nothing failed. `tsc` passed; nothing
   was being checked.

   So each line below is a mistake the compiler must refuse. If the types ever
   collapse again, the `@ts-expect-error` above it has nothing to expect, and
   the typecheck fails here, naming the problem.
*/

// a path that does not exist
// @ts-expect-error - "sumary"
linkOptions({ to: "/stats/sumary" });

// a param the route does not have
// @ts-expect-error - "personIdd"
linkOptions({ to: "/people/$personId", params: { personIdd: "x" } });

// a search value the route's validation does not allow
// @ts-expect-error - not a stat mode
linkOptions({ to: "/stats/summary", search: { mode: "nonsense" } });

// a required param left out
// @ts-expect-error - no categorySlug
linkOptions({ to: "/categories/$categoryYear/$categorySlug", params: { categoryYear: "2026" } });

// and a route's own search, read where it is used, is its validated type rather than `any`
const readMode = (): "category-count" | "count" | "size" | "duration" =>
    getRouteApi("/stats/summary").useSearch()().mode;

test("the route types are checked when the application is compiled", () => {
    // the assertions are the lines above, enforced by `tsc`; this only keeps them in a test file
    expect(typeof readMode).toBe("function");
});

/*
   The other half: a route's `.to` is what links are built from, and it is only
   filled in once a router is built over the tree. The types claim the path
   either way, so this checks the value - built from the same tree the
   application uses, it should be exactly the path the types say.
*/
test("a route's path is the one its type claims, once there is a router", () => {
    createRouter({
        routeTree,
        context: {
            queryClient: new QueryClient(),
            getToken: () => Promise.resolve(undefined),
            isLoggedIn: () => false,
            login: () => Promise.resolve()
        }
    });

    expect(statsSummaryRoute.to).toBe("/stats/summary");
    expect(categoryGridRoute.to).toBe("/categories/$categoryYear/$categorySlug/grid/{-$mediaSlug}");
    expect(placesRoute.to).toBe("/places/{-$placeId}");
    expect(personFeedGridRoute.to).toBe(
        "/people/$personId/grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}"
    );
});
