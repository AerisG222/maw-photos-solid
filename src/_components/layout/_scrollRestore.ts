import { Accessor, onCleanup, onMount } from "solid-js";
import { useRouter } from "@tanstack/solid-router";

/*
   Where each history entry was scrolled to, so Back lands where you left.

   The page scrolls inside Layout's content area rather than the window, so the
   browser's own restoration never sees it, and every page came back at the
   top - Back from a category to the categories listing meant scrolling all the
   way down again to find your place.

   Keyed by the history entry, not the address: the same listing reached afresh
   is a new entry and starts at the top, as following a link should. Held in
   memory, so a reload starts over.
*/
const positions = new Map<string, number>();

// how long a restore keeps trying while the page fills in, and how long it has to hold
const MAX_FRAMES = 120;
const SETTLED_FRAMES = 10;

// anything the user does with the page, which a restore must stop fighting
const INPUT_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

interface Frames {
    request: (callback: () => void) => number;
    cancel: (handle: number) => void;
}

const animationFrames: Frames = {
    request: callback => requestAnimationFrame(callback),
    cancel: handle => cancelAnimationFrame(handle)
};

/*
   Scroll back to where the entry was, and keep putting it there until it stays.

   Once is not enough. The page is still filling in when it mounts - a query
   answering, a listing learning its width and drawing its rows - so a position
   further down than the page is tall yet is cut short to the bottom of what is
   there. Each frame puts it back until it has held for a few frames running.

   It gives up the moment the user does anything, so a restore still settling
   never drags the page back from under them, and after a couple of seconds
   whatever happens, so a page that never grows that tall is left alone.

   Returns how to stop it early.
*/
export const restoreScroll = (
    scroller: HTMLElement,
    target: number,
    frames: Frames = animationFrames
) => {
    let handle: number | undefined;
    let elapsed = 0;
    let settled = 0;

    const stop = () => {
        if (handle !== undefined) {
            frames.cancel(handle);
            handle = undefined;
        }

        for (const name of INPUT_EVENTS) {
            scroller.removeEventListener(name, stop);
        }
    };

    const tick = () => {
        handle = undefined;

        if (!scroller.isConnected || ++elapsed > MAX_FRAMES) {
            stop();
            return;
        }

        if (Math.abs(scroller.scrollTop - target) > 1) {
            scroller.scrollTop = target;
            settled = 0;
        } else if (++settled >= SETTLED_FRAMES) {
            stop();
            return;
        }

        handle = frames.request(tick);
    };

    for (const name of INPUT_EVENTS) {
        scroller.addEventListener(name, stop, { passive: true });
    }

    tick();

    return stop;
};

/*
   Remember and restore the scroll position of the page's scroller.

   The position is taken as a navigation starts, for the entry being left -
   before anything has changed, so it is the one the user actually saw - and
   whether the page then stays (a photo opening over its grid) or goes. Arriving
   on an entry with a position remembered is a Back or Forward to it, and goes
   back there - whether the page is new, or is the same one stepping back
   through its own entries, as the categories listing does through the years
   it was filtered to.

   Nothing without a router, which is the tests that render a page on its own.
*/
export const createScrollRestoration = (scroller: Accessor<HTMLElement | undefined>) => {
    const router = useRouter({ warn: false });

    if (!router) {
        return;
    }

    const unsubscribe = router.subscribe("onBeforeLoad", event => {
        const element = scroller();
        const key = event.fromLocation?.state.__TSR_key;

        if (key && element?.isConnected) {
            positions.set(key, element.scrollTop);
        }
    });

    let stopRestoring: (() => void) | undefined;

    const restoreFor = (key: string | undefined) => {
        const element = scroller();
        const target = key ? positions.get(key) : undefined;

        if (element && target) {
            stopRestoring?.();
            stopRestoring = restoreScroll(element, target);
        }
    };

    const unsubscribeResolved = router.subscribe("onResolved", event => {
        const key = event.toLocation.state.__TSR_key;

        if (key !== event.fromLocation?.state.__TSR_key) {
            restoreFor(key);
        }
    });

    onMount(() => restoreFor(router.state.location.state.__TSR_key));

    onCleanup(() => {
        unsubscribe();
        unsubscribeResolved();
        stopRestoring?.();
    });
};
