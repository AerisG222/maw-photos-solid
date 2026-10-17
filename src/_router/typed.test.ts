import { getRouteApi, linkOptions } from "@tanstack/solid-router";
import { expect, test } from "vitest";

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
