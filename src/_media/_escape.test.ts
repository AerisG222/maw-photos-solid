import { describe, expect, test } from "vitest";

import { EscapeContext, escapeAction } from "./_escape";

/*
   Escape backs out of one layer, and which one is the whole question.

   A media view can have an Inspector over it, be filling the screen, and have a
   photograph open, all at the same time. Before this, two components listened
   for the key independently and would both have answered it - which reads as
   Escape doing two things at once and landing the reader two steps back.
*/
const context = (over: Partial<EscapeContext> = {}): EscapeContext => ({
    handled: false,
    typing: false,
    isFullscreen: false,
    hasActiveMedia: true,
    ...over
});

describe("what escape backs out of", () => {
    test("fullscreen before the photograph it is showing", () => {
        expect(escapeAction(context({ isFullscreen: true }))).toBe("exitFullscreen");
    });

    // the second press, once the chrome is back
    test("then the photograph, leaving the grid it was opened from", () => {
        expect(escapeAction(context())).toBe("closeMedia");
    });

    test("and nothing on a listing with nothing open", () => {
        expect(escapeAction(context({ hasActiveMedia: false }))).toBe("none");
    });

    /*
       The Inspector sits above both and claims the key on the capture phase, so
       by the time this is asked the event is already marked. Without this the
       panel would close *and* the photograph, on one press.
    */
    test("nothing at all once something above has answered", () => {
        expect(escapeAction(context({ handled: true, isFullscreen: true }))).toBe("none");
        expect(escapeAction(context({ handled: true }))).toBe("none");
    });

    // clearing a filter box is not backing out of anything
    test("and nothing while somebody is typing", () => {
        expect(escapeAction(context({ typing: true, isFullscreen: true }))).toBe("none");
        expect(escapeAction(context({ typing: true }))).toBe("none");
    });
});
