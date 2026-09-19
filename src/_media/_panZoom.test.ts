import { createRoot, createSignal } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";

import { RESTING_SCALE, createPanZoom } from "./_panZoom";

/*
   A gesture on the photograph is not a click on what is underneath it.

   The photograph sits inside the link that closes it, which makes both of the
   faults below the same fault: a drag to pan ended by closing the photograph
   being panned, and holding a modifier to zoom put a ctrl-click on that link -
   which opens a tab, and which the browser reports as a blocked popup. That
   report is what turned this up.

   Panzoom itself is stubbed. What is being tested is the wiring around it -
   which listeners are attached and what they swallow - and a real instance
   would need a laid-out element, which jsdom has not got.
*/
const listeners = new Map<string, EventListener[]>();

let options: { handleStartEvent?: (event: Event) => void } = {};

vi.mock("@panzoom/panzoom", () => ({
    default: (_element: HTMLElement, given: { handleStartEvent?: (event: Event) => void }) => {
        options = given;

        return {
            setOptions: () => undefined,
            reset: () => undefined,
            zoomWithWheel: () => undefined,
            destroy: () => undefined
        };
    }
}));

const element = () => {
    listeners.clear();

    return {
        addEventListener: (type: string, handler: EventListener) =>
            listeners.set(type, [...(listeners.get(type) ?? []), handler]),
        removeEventListener: () => undefined
    } as unknown as HTMLElement;
};

// the handlers read only what they use - a detail, or the two click methods
const fire = (type: string, event: object = {}) =>
    listeners.get(type)?.forEach(handler => handler(event as Event));

const clickEvent = () => ({ preventDefault: vi.fn(), stopPropagation: vi.fn() });

/*
   Built outside the assertions, because Solid runs effects *after* the
   `createRoot` callback returns - asserting inside it sees a component that has
   not wired anything up yet.
*/
const build = (subject: () => unknown = () => "photo-1") => {
    const target = element();

    let api!: ReturnType<typeof createPanZoom>;
    let dispose!: () => void;

    createRoot(d => {
        dispose = d;
        api = createPanZoom(() => target, subject);
    });

    return { api, dispose };
};

afterEach(() => listeners.clear());

const press = (x: number, y: number) => fire("pointerdown", { clientX: x, clientY: y });

const release = (x: number, y: number) => {
    const click = clickEvent();

    fire("click", { ...click, clientX: x, clientY: y });

    return click;
};

describe("a click on the photograph", () => {
    /*
       The photograph is wrapped in the link that closes it, so a drag to pan
       would otherwise end by closing the photograph being panned.
    */
    test("is swallowed when the pointer traveled - that was a drag", () => {
        const { dispose } = build();

        press(100, 100);

        const click = release(160, 130);

        expect(click.preventDefault).toHaveBeenCalled();
        expect(click.stopPropagation).toHaveBeenCalled();
        dispose();
    });

    test("and reaches the link when it did not - that was a click", () => {
        const { dispose } = build();

        press(100, 100);

        const click = release(101, 102);

        expect(click.preventDefault).not.toHaveBeenCalled();
        dispose();
    });

    /*
       The bug this replaced. A flag set from Panzoom's own events was true
       before the reader touched anything, because `reset` fires `panzoomzoom`
       and reset runs on every change of photograph - so the first click on
       every photograph was eaten. Distance does not care what the library does
       internally.
    */
    test("still reaches it after the zoom has been reset", () => {
        const { dispose } = build();

        fire("panzoomzoom", { detail: { scale: RESTING_SCALE } });
        press(100, 100);

        const click = release(100, 100);

        expect(click.preventDefault).not.toHaveBeenCalled();
        dispose();
    });

    // a tap still closes it, zoomed in or not - only travel means panning
    test("and reaches it while zoomed, if it was a tap", () => {
        const { dispose } = build();

        fire("panzoomzoom", { detail: { scale: 3 } });
        press(100, 100);

        const click = release(100, 100);

        expect(click.preventDefault).not.toHaveBeenCalled();
        dispose();
    });
});

describe("the zoom", () => {
    /*
       Wheel zoom takes no modifier. Requiring ctrl put a ctrl-click on the link
       the photograph sits in, which opens a tab - reported as a blocked popup.
    */
    test("is wired to the wheel without a modifier", () => {
        const { dispose } = build();

        expect(listeners.has("wheel")).toBe(true);
        dispose();
    });

    test("does not outlive the photograph it was applied to", () => {
        const [subject, setSubject] = createSignal("photo-1");
        // eslint-disable-next-line solid/reactivity -- the accessor is what it wants
        const { api, dispose } = build(subject);

        fire("panzoomzoom", { detail: { scale: 3 } });
        expect(api.isZoomed()).toBe(true);

        setSubject("photo-2");

        expect(api.isZoomed()).toBe(false);
        dispose();
    });

    /*
       The fault that broke paging between photographs.

       Panzoom's default start handler cancels the event, and canceling a
       pointerdown stops the browser ever beginning a native drag - so the swipe
       directive, which pages on `dragstart`/`dragend`, never heard another
       thing. Measured in a browser: with the default handler the element
       beneath saw nothing at all, with this one it sees the drag again.
    */
    test("leaves the start of a gesture alone at the resting size", () => {
        const { dispose } = build();
        const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() };

        options.handleStartEvent?.(event as unknown as Event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        dispose();
    });

    // zoomed in, a drag means "show me the other corner" and belongs to the pan
    test("and claims it once there is something to pan", () => {
        const { dispose } = build();

        fire("panzoomzoom", { detail: { scale: 3 } });

        const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() };

        options.handleStartEvent?.(event as unknown as Event);

        expect(event.preventDefault).toHaveBeenCalled();
        dispose();
    });
});
