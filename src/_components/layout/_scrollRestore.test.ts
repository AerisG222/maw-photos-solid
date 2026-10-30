import { describe, expect, test } from "vitest";

import { restoreScroll } from "./_scrollRestore";

/*
   jsdom lays nothing out and ignores scroll writes, so the scroller here is a
   stand-in: a page `height` tall that clamps its own position, as a browser's
   does, and frames that run only when the test says so.
*/
const fakeScroller = (height: number) => {
    const listeners = new Map<string, () => void>();
    let top = 0;

    const scroller = {
        isConnected: true,
        height,
        get scrollTop() {
            return top;
        },
        set scrollTop(value: number) {
            top = Math.min(value, scroller.height);
        },
        addEventListener: (name: string, listener: () => void) => listeners.set(name, listener),
        removeEventListener: (name: string) => listeners.delete(name),
        fire: (name: string) => listeners.get(name)?.()
    };

    return scroller;
};

const manualFrames = () => {
    let pending: (() => void) | undefined;

    return {
        request: (callback: () => void) => {
            pending = callback;
            return 1;
        },
        cancel: () => {
            pending = undefined;
        },
        run: (count = 1) => {
            for (let i = 0; i < count && pending; i++) {
                const next = pending;
                pending = undefined;
                next();
            }
        },
        get waiting() {
            return !!pending;
        }
    };
};

describe("restoring a scroll position", () => {
    test("goes straight there when the page is already tall enough", () => {
        const scroller = fakeScroller(5000);
        const frames = manualFrames();

        restoreScroll(scroller as unknown as HTMLElement, 2000, frames);

        expect(scroller.scrollTop).toBe(2000);
    });

    test("keeps trying while the page is still filling in", () => {
        const scroller = fakeScroller(500);
        const frames = manualFrames();

        restoreScroll(scroller as unknown as HTMLElement, 2000, frames);
        expect(scroller.scrollTop).toBe(500);

        // the listing draws its rows, and the page grows
        scroller.height = 5000;
        frames.run();

        expect(scroller.scrollTop).toBe(2000);
    });

    test("puts it back when something moves the page before it settles", () => {
        const scroller = fakeScroller(5000);
        const frames = manualFrames();

        restoreScroll(scroller as unknown as HTMLElement, 2000, frames);

        // a listing taking up the scroller writes its own idea of the position
        scroller.scrollTop = 0;
        frames.run();

        expect(scroller.scrollTop).toBe(2000);
    });

    test("stops once the position has held", () => {
        const scroller = fakeScroller(5000);
        const frames = manualFrames();

        restoreScroll(scroller as unknown as HTMLElement, 2000, frames);
        frames.run(20);

        expect(frames.waiting).toBe(false);
    });

    test("stops the moment the user scrolls for themselves", () => {
        const scroller = fakeScroller(500);
        const frames = manualFrames();

        restoreScroll(scroller as unknown as HTMLElement, 2000, frames);
        scroller.fire("wheel");

        scroller.height = 5000;
        frames.run();

        expect(scroller.scrollTop).toBe(500);
        expect(frames.waiting).toBe(false);
    });

    test("gives up on a page that never grows tall enough", () => {
        const scroller = fakeScroller(500);
        const frames = manualFrames();

        restoreScroll(scroller as unknown as HTMLElement, 2000, frames);
        frames.run(1000);

        expect(frames.waiting).toBe(false);
    });
});
