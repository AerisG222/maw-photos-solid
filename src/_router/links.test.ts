import { QueryClient } from "@tanstack/solid-query";
import { createMemoryHistory, createRouter, LinkOptions } from "@tanstack/solid-router";
import { describe, expect, test } from "vitest";

import { routeTree } from "./routeTree";
import { parseSearch, stringifySearch } from "./search";
import { randomGridLink } from "../random/_routes";
import { feedGridLink } from "../_media/feed/_routes";
import { categoryViewLink } from "../category/_routes";
import { getAreas } from "../areas";
import { Uuid } from "../_models/Uuid";

/*
   A link that leaves out one of its route's params does not mean "without it":
   TanStack Router fills it in from the address it is followed from. So a link
   back to a listing, built with nothing for the photo, led straight back to the
   photo being looked at - in the random stack and in every feed, a photo could
   not be closed - and the Places link in the nav, followed from inside a place,
   stayed in that place.

   Each of these is built from an address with something open, the way the app
   builds it there, and has to lead out of it.
*/
const PERSON = "11111111-1111-4111-8111-111111111111" as Uuid;
const PLACE = "22222222-2222-4222-8222-222222222222";

const from = (address: string) => {
    const router = createRouter({
        routeTree,
        history: createMemoryHistory({ initialEntries: [address] }),
        context: {
            queryClient: new QueryClient(),
            getToken: () => Promise.resolve(undefined),
            isLoggedIn: () => false,
            login: () => Promise.resolve()
        },
        parseSearch,
        stringifySearch
    });

    return (link: LinkOptions) =>
        router.buildLocation(link as Parameters<typeof router.buildLocation>[0]).href;
};

describe("a link out of what is open", () => {
    test("the random stack's grid, from a photo in it", () => {
        expect(from("/random/grid/2019/a-trip/a-photo")(randomGridLink())).toBe("/random/grid");
    });

    test("a feed's grid, from a photo in it", () => {
        const href = from(`/people/${PERSON}/grid/2019/a-trip/a-photo`)(
            feedGridLink({ kind: "person", id: PERSON })
        );

        expect(href).toBe(`/people/${PERSON}/grid`);
    });

    test("a category's grid, from a photo in it", () => {
        expect(
            from("/categories/2019/a-trip/grid/a-photo")(categoryViewLink("grid", "2019", "a-trip"))
        ).toBe("/categories/2019/a-trip/grid");
    });

    test("the top of the place tree, from inside a place", () => {
        expect(from(`/places/${PLACE}`)(getAreas().places.link)).toBe("/places");
    });
});
