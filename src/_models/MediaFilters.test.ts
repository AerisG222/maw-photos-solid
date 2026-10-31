import { describe, expect, test } from "vitest";

import { Media } from "./Media";
import { countMediaFilters, filterMedia, validateMediaFilters } from "./MediaFilters";

const media = (type: string, isFavorite: boolean) => ({ type, isFavorite }) as unknown as Media;

const photo = media("photo", false);
const favoritePhoto = media("photo", true);
const video = media("video", false);
const favoriteVideo = media("video", true);
const all = [photo, favoritePhoto, video, favoriteVideo];

describe("what the address may say", () => {
    test("takes a flag as text or as a boolean", () => {
        expect(validateMediaFilters({ f: "true" })).toEqual({ f: true });
        expect(validateMediaFilters({ f: true })).toEqual({ f: true });
    });

    test("drops anything else", () => {
        expect(validateMediaFilters({ f: "no", t: "audio", other: 1 })).toEqual({});
    });
});

describe("narrowing a list", () => {
    test("with no filters is the list itself, so nothing downstream rebuilds", () => {
        expect(filterMedia(all, {})).toBe(all);
    });

    test("to favorites", () => {
        expect(filterMedia(all, { f: true })).toEqual([favoritePhoto, favoriteVideo]);
    });

    test("to one type", () => {
        expect(filterMedia(all, { t: "video" })).toEqual([video, favoriteVideo]);
    });

    test("by both at once", () => {
        expect(filterMedia(all, { f: true, t: "photo" })).toEqual([favoritePhoto]);
    });
});

test("each filter on counts once", () => {
    expect(countMediaFilters({})).toBe(0);
    expect(countMediaFilters({ f: true, t: "photo" })).toBe(2);
});
