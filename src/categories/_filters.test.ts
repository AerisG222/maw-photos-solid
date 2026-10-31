import { describe, expect, test } from "vitest";

import { Category } from "../_models/Category";
import { Uuid } from "../_models/Uuid";
import { countCategoryFilters, filterCategories } from "./_filters";

const category = (id: string, isFavorite: boolean, mediaTypes: string[]) =>
    ({ id, isFavorite, mediaTypes }) as unknown as Category;

const photos = category("photos", false, ["photo"]);
const favorite = category("favorite", true, ["photo"]);
const both = category("both", false, ["photo", "video"]);
const all = [photos, favorite, both];

const ids = (list: Category[]) => list.map(c => c.id);
const run = (filters: Parameters<typeof filterCategories>[1], gps?: string[], locked?: string[]) =>
    ids(filterCategories(all, filters, gps as Uuid[], new Set((locked ?? []) as Uuid[])));

describe("narrowing the categories", () => {
    test("to favorites uses the category's own flag", () => {
        expect(run({ f: true })).toEqual(["favorite"]);
    });

    test("to a type keeps any category holding that type", () => {
        expect(run({ t: "video" })).toEqual(["both"]);
        expect(run({ t: "photo" })).toEqual(["photos", "favorite", "both"]);
    });

    test("to those missing a location or restricted", () => {
        expect(run({ noGps: true }, ["both"])).toEqual(["both"]);
        expect(run({ restricted: true }, undefined, ["photos"])).toEqual(["photos"]);
    });

    test("by several means all of them", () => {
        expect(run({ f: true, noGps: true }, ["both"])).toEqual([]);
    });
});

test("each filter on counts once", () => {
    expect(countCategoryFilters({})).toBe(0);
    expect(countCategoryFilters({ f: true, t: "video", noGps: true, restricted: true })).toBe(4);
});
