import { describe, expect, test } from "vitest";

import { GpsDetail } from "../_models/GpsDetail";
import { Media } from "../_models/Media";
import { RestrictedMedia } from "../_models/RestrictedMedia";
import { Uuid } from "../_models/Uuid";
import { filterBrowsedMedia } from "./_browsedMedia";

const photo = (id: string) => ({ id: id as Uuid, slug: id }) as Media;
const media = [photo("a"), photo("b"), photo("c")];
const here = { latitude: 1, longitude: 2 };

const gps = (id: string, detail: Partial<GpsDetail>): GpsDetail => ({
    mediaId: id as Uuid,
    recorded: undefined,
    override: undefined,
    ...detail
});

const restricted = (id: string) => ({ mediaId: id as Uuid }) as RestrictedMedia;

const none = { missingGps: false, restrictedOnly: false };

describe("the photos shown under a category while browsing", () => {
    test("are all of them with no filter on", () => {
        expect(filterBrowsedMedia(media, none)).toEqual(media);
    });

    test("are those without a location when that filter is on", () => {
        const shown = filterBrowsedMedia(media, {
            ...none,
            missingGps: true,
            gps: [gps("a", { recorded: here }), gps("b", { override: here }), gps("c", {})]
        });

        // an entry holding neither coordinate is not a location
        expect(shown?.map(m => m.id)).toEqual(["c"]);
    });

    test("are the restricted ones when that filter is on", () => {
        const shown = filterBrowsedMedia(media, {
            ...none,
            restrictedOnly: true,
            restricted: [restricted("b"), restricted("elsewhere")]
        });

        expect(shown?.map(m => m.id)).toEqual(["b"]);
    });

    test("satisfy both filters together", () => {
        const shown = filterBrowsedMedia(media, {
            missingGps: true,
            restrictedOnly: true,
            gps: [gps("a", { recorded: here })],
            restricted: [restricted("a"), restricted("b")]
        });

        expect(shown?.map(m => m.id)).toEqual(["b"]);
    });

    // shown in full and then shrinking would be worse than waiting
    test("wait for whatever a filter needs", () => {
        expect(filterBrowsedMedia(undefined, none)).toBeUndefined();
        expect(filterBrowsedMedia(media, { ...none, missingGps: true })).toBeUndefined();
        expect(filterBrowsedMedia(media, { ...none, restrictedOnly: true })).toBeUndefined();
    });
});
