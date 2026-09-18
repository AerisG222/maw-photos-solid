import { describe, expect, it, test } from "vitest";

import {
    broadestFirst,
    describePlaceAncestry,
    getParentPlaceKinds,
    isLeafPlace,
    Place,
    PlaceKind,
    PlaceKindCity,
    PlaceKindCountry,
    PlaceKindState
} from "./Place";
import { Uuid } from "./Uuid";

const id = (value: string) => value as unknown as Uuid;

const build = (ancestorNames: string[], childCount = 0): Place => ({
    id: id("a"),
    parentId: null,
    kind: PlaceKindCity,
    name: "Boston",
    slug: "boston",
    mediaCount: 3,
    ancestorNames,
    coverUrl: null,
    coverMediaId: null,
    childCount
});

describe("getParentPlaceKinds", () => {
    it("offers every level above a city", () => {
        expect(getParentPlaceKinds(PlaceKindCity)).toEqual([PlaceKindCountry, PlaceKindState]);
    });

    /*
       Not merely the level directly above: Macao and Hong Kong have no state, so
       their cities parent straight to the country and a move has to be able to
       put one back there.
    */
    it("offers only the country above a state", () => {
        expect(getParentPlaceKinds(PlaceKindState)).toEqual([PlaceKindCountry]);
    });

    it("offers nothing above a country, which only the root sits above", () => {
        expect(getParentPlaceKinds(PlaceKindCountry)).toEqual([]);
    });
});

describe("describePlaceAncestry", () => {
    // the API returns the chain root first; an address reads the other way round
    it("names the ancestors nearest first", () => {
        expect(describePlaceAncestry(build(["United States", "Massachusetts"]))).toBe(
            "Massachusetts, United States"
        );
    });

    it("is empty for a place with no ancestors", () => {
        expect(describePlaceAncestry(build([]))).toBe("");
    });

    it("does not reverse the array it was given", () => {
        const place = build(["United States", "Massachusetts"]);

        describePlaceAncestry(place);

        expect(place.ancestorNames).toEqual(["United States", "Massachusetts"]);
    });
});

describe("isLeafPlace", () => {
    it("is a leaf when nothing sits inside it", () => {
        expect(isLeafPlace(build([]))).toBe(true);
    });

    /*
       Kind is not what decides it. A state whose only cities are hidden from this
       caller reports no children and is a leaf *to them*, which is the case a
       client-side rule on kind would get wrong.
    */
    it("is not a leaf when the caller can see something inside it", () => {
        expect(isLeafPlace(build([], 2))).toBe(false);
    });
});

describe("reading a place aloud", () => {
    /*
       A list of the rungs a geocode resolved says nothing about its order, and
       a breadcrumb reading city, country, state would be worse than none.
    */
    test("puts the country first and the city last, whatever order they arrived in", () => {
        const at = (kind: PlaceKind, name: string) => ({ kind, name }) as unknown as Place;

        const ordered = broadestFirst([
            at(PlaceKindCity, "Portland"),
            at(PlaceKindCountry, "United States"),
            at(PlaceKindState, "Oregon")
        ]);

        expect(ordered.map(place => place.name)).toEqual(["United States", "Oregon", "Portland"]);
    });

    // Macao and Hong Kong have no state level
    test("and copes with a rung that is not there", () => {
        const at = (kind: PlaceKind, name: string) => ({ kind, name }) as unknown as Place;

        const ordered = broadestFirst([at(PlaceKindCity, "Macao"), at(PlaceKindCountry, "China")]);

        expect(ordered.map(place => place.name)).toEqual(["China", "Macao"]);
    });
});
