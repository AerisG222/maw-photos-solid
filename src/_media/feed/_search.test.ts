import { expect, test, vi } from "vitest";

import { openingSeed, validateFeedSearch } from "./_search";

const validate = (search: Record<string, unknown>) => validateFeedSearch(search as never);

test("takes the filters and the seed as the address says them", () => {
    expect(validate({ f: "true", t: "video", seed: "42" })).toEqual({
        f: true,
        t: "video",
        seed: 42
    });
});

test("drops anything else", () => {
    expect(validate({ f: "maybe", t: "audio", seed: "soon", other: "x" })).toEqual({});
});

test("opening a shuffled feed uses the order that was loaded ahead, then a new one", () => {
    const random = vi.spyOn(Math, "random");

    random.mockReturnValue(0.1);
    openingSeed(false);

    const hovered = openingSeed(true);

    expect(openingSeed(true)).toBe(hovered);
    random.mockReturnValue(0.9);
    expect(openingSeed(false)).toBe(hovered);
    expect(openingSeed(false)).not.toBe(hovered);

    random.mockRestore();
});
