import { afterEach, describe, expect, test, vi } from "vitest";

import { settleTransition, shouldAnimate } from "./useViewTransition";

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

/*
   A transition that was superseded is not a failure.

   `ready` rejects with an `AbortError` the moment a second transition starts
   before the first has finished - which is what navigating twice quickly *is*.
   Nothing was attached to those promises, so every one surfaced as an unhandled
   rejection in the console: "AbortError: Transition was skipped."
*/
const transition = (rejection: Error) => {
    const settled = Promise.reject(rejection);

    // the three the API hands back; a caller has to answer all of them
    return {
        ready: settled,
        updateCallbackDone: settled,
        finished: settled,
        skipTransition: () => undefined,
        types: new Set<string>()
    } as ViewTransition;
};

const abort = () => Object.assign(new Error("Transition was skipped."), { name: "AbortError" });

/*
   An unattached rejection surfaces on the node process, not on `window` -
   vitest runs jsdom inside node, so the DOM event never fires and a test
   listening for it passes whether or not anything escaped. Which the first
   version of this did.
*/
const unhandled = async (run: () => void) => {
    const seen: unknown[] = [];
    const onUnhandled = (reason: unknown) => seen.push(reason);

    process.on("unhandledRejection", onUnhandled);
    run();

    // let the microtask queue drain, which is when an unattached rejection surfaces
    await new Promise(resolve => setTimeout(resolve, 0));
    process.off("unhandledRejection", onUnhandled);

    return seen;
};

describe("a superseded transition", () => {
    test("does not reach the console as an unhandled rejection", async () => {
        const escaped = await unhandled(() => settleTransition(transition(abort())));

        expect(escaped).toEqual([]);
    });

    test("and is not reported as an error either - it is normal", async () => {
        const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

        settleTransition(transition(abort()));
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(logged).not.toHaveBeenCalled();
        logged.mockRestore();
    });

    /*
       Only the supersession is swallowed. Anything else here means the
       navigation itself failed, which is worth seeing rather than hiding.
    */
    test("but a real failure still is", async () => {
        const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

        settleTransition(transition(new Error("the callback threw")));
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(logged).toHaveBeenCalled();
        logged.mockRestore();
    });
});
