import { expect, test } from "vitest";

import { MEDIA_LOOKAHEAD, needsMoreMedia } from "./_needsMoreMedia";

test("nothing is fetched while plenty is still ahead", () => {
    expect(needsMoreMedia(0, 24)).toBe(false);
    expect(needsMoreMedia(24 - 1 - MEDIA_LOOKAHEAD, 24)).toBe(false);
});

test("the next page is asked for once the end is within the lookahead", () => {
    expect(needsMoreMedia(24 - MEDIA_LOOKAHEAD, 24)).toBe(true);
    expect(needsMoreMedia(23, 24)).toBe(true);
});

test("no active item means nothing to top up for", () => {
    expect(needsMoreMedia(-1, 24)).toBe(false);
});
