import { expect, test } from "vitest";

import { rememberSearch } from "./_recentSearches";

test("a new term goes to the front", () => {
    expect(rememberSearch(["beach", "snow"], "paris", 10)).toEqual(["paris", "beach", "snow"]);
});

test("a repeat moves to the front rather than appearing twice", () => {
    expect(rememberSearch(["beach", "paris", "snow"], "paris", 10)).toEqual([
        "paris",
        "beach",
        "snow"
    ]);
});

test("case does not make a different search, and the latest spelling is kept", () => {
    expect(rememberSearch(["beach", "paris"], "Paris", 10)).toEqual(["Paris", "beach"]);
});

test("whitespace is trimmed, and a blank term is not remembered", () => {
    expect(rememberSearch(["beach"], "  paris  ", 10)).toEqual(["paris", "beach"]);
    expect(rememberSearch(["beach"], "   ", 10)).toEqual(["beach"]);
});

test("the oldest fall off past the limit", () => {
    expect(rememberSearch(["b", "c", "d"], "a", 3)).toEqual(["a", "b", "c"]);
});
