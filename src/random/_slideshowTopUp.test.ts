import { expect, test } from "vitest";

import { SLIDESHOW_LOOKAHEAD, needsTopUp } from "./_slideshowTopUp";

test("nothing is fetched while plenty is still ahead", () => {
    expect(needsTopUp(0, 24)).toBe(false);
    expect(needsTopUp(24 - 1 - SLIDESHOW_LOOKAHEAD, 24)).toBe(false);
});

test("the next page is asked for once the end is within the lookahead", () => {
    expect(needsTopUp(24 - SLIDESHOW_LOOKAHEAD, 24)).toBe(true);
    expect(needsTopUp(23, 24)).toBe(true);
});

test("no active item means nothing to top up for", () => {
    expect(needsTopUp(-1, 24)).toBe(false);
});
