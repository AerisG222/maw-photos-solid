import { describe, expect, test } from "vitest";

import { parseSearch, stringifySearch } from "./search";

describe("the query string", () => {
    // TanStack's default would hand these back as a number and a boolean
    test("reads every value as a string", () => {
        expect(parseSearch("?year=2007&favorites=true")).toEqual({
            year: "2007",
            favorites: "true"
        });
    });

    test("reads a repeated key as a list", () => {
        expect(parseSearch("?type=photo&type=video")).toEqual({ type: ["photo", "video"] });
    });

    test("writes values as they are, dropping the empty ones", () => {
        expect(stringifySearch({ year: 2007, mode: "count", gone: undefined, also: null })).toBe(
            "?year=2007&mode=count"
        );
    });

    test("writes a list as a repeated key", () => {
        expect(stringifySearch({ type: ["photo", "video"] })).toBe("?type=photo&type=video");
    });

    test("writes nothing at all for nothing", () => {
        expect(stringifySearch({})).toBe("");
    });

    test("round trips", () => {
        const search = "?q=hong+kong&type=photo&type=video";

        expect(stringifySearch(parseSearch(search))).toBe(search);
    });
});
