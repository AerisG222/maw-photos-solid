import { describe, expect, it } from "vitest";

import { Uuid } from "../../_models/Uuid";
import { patchById } from "./_cacheUtils";

const id = (value: string) => value as unknown as Uuid;

interface Item {
    id: Uuid;
    isFavorite: boolean;
    name: string;
}

const build = (): Item[] => [
    { id: id("a"), isFavorite: false, name: "first" },
    { id: id("b"), isFavorite: false, name: "second" },
    { id: id("c"), isFavorite: false, name: "third" }
];

describe("patchById", () => {
    it("applies the change to the matching entry", () => {
        const result = patchById(build(), id("b"), { isFavorite: true });

        expect(result[1].isFavorite).toBe(true);
        // unrelated fields survive the merge
        expect(result[1].name).toBe("second");
    });

    it("leaves every other entry reference-identical", () => {
        const items = build();
        const result = patchById(items, id("b"), { isFavorite: true });

        // this is the whole point: <For> keys on reference, so untouched items
        // must come back as the same objects or their DOM is rebuilt
        expect(result[0]).toBe(items[0]);
        expect(result[2]).toBe(items[2]);
        expect(result[1]).not.toBe(items[1]);
    });

    it("does not mutate the array it was given", () => {
        const items = build();

        patchById(items, id("b"), { isFavorite: true });

        expect(items[1].isFavorite).toBe(false);
    });

    it("returns the identical array when nothing matches", () => {
        const items = build();

        // callers compare by reference to skip writing to unaffected caches
        expect(patchById(items, id("missing"), { isFavorite: true })).toBe(items);
    });

    it("returns the identical array when empty", () => {
        const items: Item[] = [];

        expect(patchById(items, id("a"), { isFavorite: true })).toBe(items);
    });
});
