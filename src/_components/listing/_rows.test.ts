import { describe, expect, test } from "vitest";

import {
    DEFAULT_ITEM_WIDTH,
    categoryRowHeight,
    chunkIntoRows,
    columnsFor,
    mediaRowHeight,
    personRowHeight,
    placeRowHeight
} from "./_rows";

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
       Six tiles of 162 with five gaps of 8 is exactly 1012 - which is the whole
       point of counting the gaps *between* items rather than after each one. A
       naive `width / (item + gap)` gives five and wastes a column.
    */
    test("counts the gaps between items, not after them", () => {
        expect(columnsFor(1012)).toBe(6);
        expect(columnsFor(1011)).toBe(5);
        expect(columnsFor(DEFAULT_ITEM_WIDTH)).toBe(1);
        expect(columnsFor(DEFAULT_ITEM_WIDTH * 2 + 8)).toBe(2);
    });

    /*
       A tile is its 160px picture and a 1px border either side. Counted as 160,
       nine fit in 1504px on paper and needed 1522 - the ninth wrapped onto a
       line of its own under every row.
    */
    test("counts each tile's border as part of its width", () => {
        expect(columnsFor(1504)).toBe(8);
        expect(columnsFor(9 * 162 + 8 * 8)).toBe(9);
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

/*
   Exact, so a page restored to where it was scrolled lands on the same tiles:
   the picture, a one-pixel border top and bottom, 24px per line of text, and
   the 8px gap under the row.
*/
describe("how tall a row of tiles is", () => {
    test("a photograph is the thumbnail alone", () => {
        expect(mediaRowHeight(120)).toBe(130);
    });

    test("a category adds its year and its name, when labels are shown", () => {
        expect(categoryRowHeight(120, true)).toBe(178);
        expect(categoryRowHeight(120, false)).toBe(130);
        expect(categoryRowHeight(120, true, false)).toBe(154);
    });

    test("a person is a square face and a name", () => {
        expect(personRowHeight(160, true)).toBe(194);
        expect(personRowHeight(160, false)).toBe(170);
    });

    test("a place is its cover, and its name with padding", () => {
        expect(placeRowHeight(true)).toBe(220.5);
        expect(placeRowHeight(false)).toBe(188.5);
    });
});
