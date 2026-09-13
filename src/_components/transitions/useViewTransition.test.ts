import { afterEach, describe, expect, test, vi } from "vitest";

import { shouldAnimate } from "./useViewTransition";

const withSupport = (supported: boolean) => {
    if (supported) {
        document.startViewTransition = vi.fn() as never;
    } else {
        delete (document as Partial<Document>).startViewTransition;
    }
};

const withReducedMotion = (reduced: boolean) => {
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: reduced && query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined
    }));
};

afterEach(() => {
    vi.unstubAllGlobals();
    delete (document as Partial<Document>).startViewTransition;
});

describe("whether a navigation is animated", () => {
    test("yes, when the browser can and the reader has not asked otherwise", () => {
        withSupport(true);
        withReducedMotion(false);

        expect(shouldAnimate({ defaultPrevented: false })).toBe(true);
    });

    /*
       Somebody else claimed this navigation - a guard redirecting to the login
       page. Animating it would mean calling `retry(true)` on a decision that was
       deliberately stopped.
    */
    test("no, when something has already claimed the navigation", () => {
        withSupport(true);
        withReducedMotion(false);

        expect(shouldAnimate({ defaultPrevented: true })).toBe(false);
    });

    test("no, when the reader has asked for reduced motion", () => {
        withSupport(true);
        withReducedMotion(true);

        expect(shouldAnimate({ defaultPrevented: false })).toBe(false);
    });

    // where the api is absent the navigation simply happens, as it always did
    test("no, where the browser has no view transitions", () => {
        withSupport(false);
        withReducedMotion(false);

        expect(shouldAnimate({ defaultPrevented: false })).toBe(false);
    });
});
