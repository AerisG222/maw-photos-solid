import { describe, expect, it } from "vitest";

import { ApiError } from "../_contexts/api/ApiError";
import {
    describeCategoryRolesProblem,
    describeRestrictionProblem,
    getRestrictionProblems
} from "./MediaRestrictionProblem";
import { Uuid } from "./Uuid";

const id = (value: string) => value as unknown as Uuid;

describe("getRestrictionProblems", () => {
    it("reads the problems a refused restriction carried", () => {
        const body = [
            { mediaId: "m-1", reason: "teaser", detail: "November" },
            { mediaId: null, reason: "unknown_role", detail: "nope" }
        ];

        expect(getRestrictionProblems(new ApiError(400, "Bad Request", "x", body))).toEqual(body);
    });

    // a 403 or a 500 is a failure of another kind, described elsewhere
    it("finds none in a failure that is not a refusal", () => {
        expect(getRestrictionProblems(new ApiError(403, "Forbidden", "x"))).toEqual([]);
        expect(getRestrictionProblems(new ApiError(400, "Bad Request", "x", "words"))).toEqual([]);
        expect(getRestrictionProblems(new TypeError("Failed to fetch"))).toEqual([]);
    });

    it("skips entries that are not problems", () => {
        const body = [{ mediaId: "m-1", reason: "teaser", detail: "x" }, { nope: true }, null];

        expect(getRestrictionProblems(new ApiError(400, "", "x", body))).toHaveLength(1);
    });
});

describe("describeRestrictionProblem", () => {
    it("names what is in the way", () => {
        expect(
            describeRestrictionProblem({ mediaId: id("m"), reason: "teaser", detail: "November" })
        ).toContain("November");
        expect(
            describeRestrictionProblem({ mediaId: id("m"), reason: "place_cover", detail: "Paris" })
        ).toContain("Paris");
        expect(
            describeRestrictionProblem({
                mediaId: id("m"),
                reason: "role_not_granted",
                detail: "demo"
            })
        ).toContain("demo");
    });

    // a reason added to maw-media later still says something
    it("falls back for a reason it does not know", () => {
        expect(
            describeRestrictionProblem({ mediaId: null, reason: "brand_new", detail: null })
        ).toContain("brand_new");
    });
});

describe("describeCategoryRolesProblem", () => {
    it("names the role a restricted photo still depends on", () => {
        expect(
            describeCategoryRolesProblem({
                mediaId: id("m"),
                reason: "restriction_depends",
                detail: "friend"
            })
        ).toContain("friend");
    });

    it("explains a change that would hide the category from you", () => {
        expect(
            describeCategoryRolesProblem({
                mediaId: null,
                reason: "would_hide_from_you",
                detail: null
            })
        ).toMatch(/hidden from you/);
    });

    it("falls back for a reason it does not know", () => {
        expect(
            describeCategoryRolesProblem({ mediaId: null, reason: "brand_new", detail: null })
        ).toContain("brand_new");
    });
});
