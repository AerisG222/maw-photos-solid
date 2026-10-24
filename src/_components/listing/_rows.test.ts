import { describe, expect, test } from "vitest";

import { DEFAULT_ITEM_WIDTH, chunkIntoRows, columnsFor } from "./_rows";

/*
   The arithmetic behind the virtualised listing.

   Tested here rather than through the component because jsdom lays nothing out:
   every element reports a zero rect, so a virtualiser cannot be exercised
   honestly there - the same limit that made the invisible-dialog bug invisible
   to tests in step 5. What is decidable given a width is decided here; that the
   right rows end up on screen is a browser's business.
*/
describe("how many items fit across", () => {
    /*
       Six items of 160 with five gaps of 8 is exactly 1000 - which is the whole
       point of counting the gaps *between* items rather than after each one. A
       naive `width / (item + gap)` gives five and wastes a column.
    */
    test("counts the gaps between items, not after them", () => {
        expect(columnsFor(1000)).toBe(6);
        expect(columnsFor(999)).toBe(5);
        expect(columnsFor(DEFAULT_ITEM_WIDTH)).toBe(1);
        expect(columnsFor(DEFAULT_ITEM_WIDTH * 2 + 8)).toBe(2);
    });

    // a container narrower than one tile still has to show it
    test("never fewer than one, however narrow", () => {
        expect(columnsFor(0)).toBe(1);
        expect(columnsFor(40)).toBe(1);
    });

    // a place card is wider, so fewer of them fit in the same space
    test("a wider item means fewer across", () => {
        expect(columnsFor(1000, 240)).toBeLessThan(columnsFor(1000));
    });

    /*
       The measurement is the point: a docked Inspector takes 500px, and a
       listing that assumed the window's width would lay its rows out under it.
    */
    test("and a narrower listing means fewer still", () => {
        expect(columnsFor(1440 - 500)).toBeLessThan(columnsFor(1440));
    });
});

describe("dividing a listing into rows", () => {
    test("fills each row before starting the next", () => {
        const rows = chunkIntoRows(["a", "b", "c", "d", "e"], 2);

        expect(rows).toEqual([["a", "b"], ["c", "d"], ["e"]]);
    });

    /*
       The rows are drawn with a reference-keyed <For>, so a row has to hold
       the items themselves. Wrapped in fresh objects, patching one item - a
       favorite - rebuilt every tile on screen, and the whole grid flashed.
    */
    test("holds the items themselves, so an unchanged item keeps its tile", () => {
        const a = { id: "a" };
        const b = { id: "b" };
        const before = chunkIntoRows([a, b], 2);
        const after = chunkIntoRows([a, { ...b, isFavorite: true }], 2);

        expect(after[0]?.[0]).toBe(before[0]?.[0]);
        expect(after[0]?.[1]).not.toBe(before[0]?.[1]);
    });

    test("an empty listing has no rows at all", () => {
        expect(chunkIntoRows([], 4)).toEqual([]);
    });
});
