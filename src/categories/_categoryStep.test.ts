import { describe, expect, test } from "vitest";

import { nextCategory, previousCategory } from "./_categoryStep";

// the third of five categories, which starts 1000px down
const at = (offset: number, index = 2) => ({ index, start: 1000, offset, count: 5 });

describe("stepping between categories", () => {
    test("next is the one after the category at the top", () => {
        expect(nextCategory(at(1000))).toBe(3);
        expect(nextCategory(at(1400))).toBe(3);
    });

    test("there is no next after the last", () => {
        expect(nextCategory(at(1000, 4))).toBeUndefined();
    });

    // the start of the category being read comes before the one above it
    test("previous goes back to the start of this one from part-way down", () => {
        expect(previousCategory(at(1400))).toBe(2);
    });

    test("and to the one before from its start", () => {
        expect(previousCategory(at(1000))).toBe(1);
        // a scroll lands within a pixel or two of where it was sent
        expect(previousCategory(at(1003))).toBe(1);
    });

    test("there is no previous before the first, from its start", () => {
        expect(previousCategory(at(1000, 0))).toBeUndefined();
        expect(previousCategory(at(1400, 0))).toBe(0);
    });

    test("nothing to step from before anything is measured", () => {
        expect(nextCategory(undefined)).toBeUndefined();
        expect(previousCategory(undefined)).toBeUndefined();
    });
});
