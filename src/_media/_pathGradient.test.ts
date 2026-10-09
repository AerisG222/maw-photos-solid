import { describe, expect, it } from "vitest";

import {
    pathColorAt,
    pathEndColor,
    pathSegmentColors,
    pathStartColor,
    pathStops
} from "./_pathGradient";

describe("pathGradient", () => {
    it("starts and ends on the end stops", () => {
        expect(pathColorAt(0)).toBe(pathStartColor);
        expect(pathColorAt(1)).toBe(pathEndColor);
    });

    it("passes through each stop", () => {
        pathStops.forEach((stop, i) => {
            expect(pathColorAt(i / (pathStops.length - 1))).toBe(stop);
        });
    });

    it("blends between stops", () => {
        // halfway between #2f6fde and #21a6a6
        expect(pathColorAt(1 / 6)).toBe("#288bc2");
    });

    it("keeps to the ends outside 0 to 1", () => {
        expect(pathColorAt(-1)).toBe(pathStartColor);
        expect(pathColorAt(2)).toBe(pathEndColor);
    });

    it("gives the first hop the start color and the last the end color", () => {
        const colors = pathSegmentColors(5);

        expect(colors).toHaveLength(5);
        expect(colors[0]).toBe(pathStartColor);
        expect(colors[4]).toBe(pathEndColor);
    });

    it("gives a lone hop the middle color", () => {
        expect(pathSegmentColors(1)).toEqual([pathColorAt(0.5)]);
    });

    it("has nothing to color without hops", () => {
        expect(pathSegmentColors(0)).toEqual([]);
    });
});
