import { createRoot } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createIdleChrome } from "./_idleChrome";

/*
   The chrome steps back when nothing is happening.

   Worth pinning because the failure mode is silent and annoying: chrome that
   hides while somebody is reading it, or never comes back once it has.
*/
const build = (enabled = true) => {
    let api!: ReturnType<typeof createIdleChrome>;
    let dispose!: () => void;

    createRoot(d => {
        dispose = d;
        api = createIdleChrome(() => enabled);
    });

    return { api, dispose };
};

beforeEach(() => vi.useFakeTimers());

afterEach(() => vi.useRealTimers());

describe("chrome that steps back", () => {
    test("it stays up until the reader goes still", () => {
        const { api, dispose } = build();

        expect(api.hidden()).toBe(false);

        vi.advanceTimersByTime(2600);

        expect(api.hidden()).toBe(true);
        dispose();
    });

    test("any sign of life brings it straight back", () => {
        const { api, dispose } = build();

        vi.advanceTimersByTime(2600);
        expect(api.hidden()).toBe(true);

        window.dispatchEvent(new Event("pointermove"));

        expect(api.hidden()).toBe(false);
        dispose();
    });

    // fading out from under a pointer resting on it would be worse than never hiding
    test("a pointer on the chrome holds it, and lets go", () => {
        const { api, dispose } = build();

        api.hold();
        vi.advanceTimersByTime(2600);

        expect(api.hidden()).toBe(false);

        api.release();

        expect(api.hidden()).toBe(true);
        dispose();
    });

    // every view but fullscreen: chrome that disappears is chrome you go looking for
    test("it never hides where it was not asked for", () => {
        const { api, dispose } = build(false);

        vi.advanceTimersByTime(10_000);

        expect(api.hidden()).toBe(false);
        dispose();
    });

    /*
       The regression this had shipped with: it attached five window listeners
       from `onMount` regardless, so all twenty screens paid for a feature one
       of them uses - a timer cleared and reset on every wheel tick and every
       mouse move, app-wide, to drive chrome that was never going to hide.
    */
    test("listens for nothing where it was not asked for", () => {
        const added: string[] = [];
        const spy = vi
            .spyOn(window, "addEventListener")
            .mockImplementation((type: string) => void added.push(type));

        const { dispose } = build(false);

        expect(added).toEqual([]);

        spy.mockRestore();
        dispose();
    });

    test("and does listen where it was", () => {
        const added: string[] = [];
        const spy = vi
            .spyOn(window, "addEventListener")
            .mockImplementation((type: string) => void added.push(type));

        const { dispose } = build(true);

        expect(added).toContain("pointermove");

        spy.mockRestore();
        dispose();
    });
});
