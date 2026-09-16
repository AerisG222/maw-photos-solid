import { createRoot, createSignal } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";

import { createPanZoom } from "./_panZoom";

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

vi.mock("@panzoom/panzoom", () => ({
    default: () => ({
        setOptions: () => undefined,
        reset: () => undefined,
        zoomWithWheel: () => undefined,
        destroy: () => undefined
    })
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

describe("a pan or zoom gesture", () => {
    test("does not also click the link the photograph sits in", () => {
        const { dispose } = build();

        fire("panzoompan");

        const click = clickEvent();

        fire("click", click);

        expect(click.preventDefault).toHaveBeenCalled();
        expect(click.stopPropagation).toHaveBeenCalled();
        dispose();
    });

    // a plain click on an unzoomed photograph still closes it, as it always did
    test("but a plain click still reaches it", () => {
        const { dispose } = build();

        const click = clickEvent();

        fire("click", click);

        expect(click.preventDefault).not.toHaveBeenCalled();
        dispose();
    });

    /*
       Wheel zoom takes no modifier. Requiring ctrl is what produced the blocked
       popup: the reader holds it to zoom, and the next click is a ctrl-click on
       the link that closes the photograph.
    */
    test("wheel zoom is wired without a modifier", () => {
        const { dispose } = build();

        expect(listeners.has("wheel")).toBe(true);
        dispose();
    });

    test("and a zoom does not outlive the photograph it was applied to", () => {
        const [subject, setSubject] = createSignal("photo-1");
        // eslint-disable-next-line solid/reactivity -- the accessor is what it wants
        const { api, dispose } = build(subject);

        fire("panzoomzoom", { detail: { scale: 3 } });
        expect(api.isZoomed()).toBe(true);

        setSubject("photo-2");

        expect(api.isZoomed()).toBe(false);
        dispose();
    });
});
