import { describe, expect, test } from "vitest";

import { findMissingGps } from "./_missingGps";

// a and d have a location; b, c and e do not
const shown = ["a", "b", "c", "d", "e"];
const located = new Set(["a", "d"]);
const hasGps = (id: string) => located.has(id);

describe("finding the next photo without a location", () => {
    test("skips the photos that have one", () => {
        expect(findMissingGps(shown, hasGps, "c", 1)).toBe("e");
        expect(findMissingGps(shown, hasGps, "e", -1)).toBe("c");
    });

    // the photo stood on is where the reader already is, so it is never the answer
    test("moves off the photo it starts from", () => {
        expect(findMissingGps(shown, hasGps, "b", 1)).toBe("c");
        expect(findMissingGps(shown, hasGps, "c", -1)).toBe("b");
    });

    test("finds nothing past the last gap", () => {
        expect(findMissingGps(shown, hasGps, "e", 1)).toBeUndefined();
        expect(findMissingGps(shown, hasGps, "b", -1)).toBeUndefined();
    });

    // nothing chosen yet: from the near end, and that end counts
    test("starts from the ends with nowhere to start from", () => {
        expect(findMissingGps(shown, hasGps, undefined, 1)).toBe("b");
        expect(findMissingGps(shown, hasGps, undefined, -1)).toBe("e");
        expect(findMissingGps(["b", "a"], hasGps, undefined, 1)).toBe("b");
    });

    // a filter change can take the last photo off screen
    test("starts from the ends when that photo is no longer shown", () => {
        expect(findMissingGps(shown, hasGps, "gone", 1)).toBe("b");
    });

    test("finds nothing when every photo has one", () => {
        expect(findMissingGps(["a", "d"], hasGps, undefined, 1)).toBeUndefined();
    });
});
