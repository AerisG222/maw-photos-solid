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

        expect(rows.map(row => row.map(entry => entry.item))).toEqual([
            ["a", "b"],
            ["c", "d"],
            ["e"]
        ]);
    });

    /*
       The index is the position in the whole listing, not in the row. Callers
       decide what to load eagerly by it, and "the first fifty" has to mean the
       first fifty of the listing.
    */
    test("numbers items by where they sit in the listing", () => {
        const rows = chunkIntoRows(["a", "b", "c", "d", "e"], 2);

        expect(rows[2][0]).toEqual({ item: "e", index: 4 });
    });

    test("an empty listing has no rows at all", () => {
        expect(chunkIntoRows([], 4)).toEqual([]);
    });
});
