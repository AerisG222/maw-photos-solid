import { expect, test } from "vitest";

import { validateCategoriesSearch } from "./_search";

const validate = (search: Record<string, unknown>) => validateCategoriesSearch(search as never);

test("a year arrives as text and leaves as a number", () => {
    expect(validate({ year: "2026" })).toEqual({ year: 2026 });
    expect(validate({ year: "all" })).toEqual({ year: "all" });
});

test("the filters survive alongside it", () => {
    expect(
        validate({ year: "all", f: "true", t: "video", noGps: "true", restricted: "true" })
    ).toEqual({ year: "all", f: true, t: "video", noGps: true, restricted: true });
});

test("anything else is dropped", () => {
    expect(validate({ year: "soon", f: "maybe", t: "audio", other: "x" })).toEqual({});
});
