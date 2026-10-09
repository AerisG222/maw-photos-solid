import { describe, expect, it } from "vitest";

import { formatGps, getGoogleMapsUrl, parseGps } from "./GpsUtils";

describe("GpsUtils", () => {
    const gps = { latitude: 40.4406, longitude: -79.9959 };

    it("formats as latitude,longitude", () => {
        expect(formatGps(gps)).toBe("40.4406,-79.9959");
    });

    // what is copied from one photo has to paste into another's override
    it("parses what it formats", () => {
        expect(parseGps(formatGps(gps))).toEqual(gps);
    });

    it("links to google maps at the spot", () => {
        expect(getGoogleMapsUrl(gps)).toBe(
            "https://www.google.com/maps/search/?api=1&query=40.4406,-79.9959"
        );
    });
});
