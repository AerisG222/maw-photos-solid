import { expect, test } from "vitest";

import { validateFeedSearch } from "./_search";

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
