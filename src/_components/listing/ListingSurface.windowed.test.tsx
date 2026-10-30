import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import Layout from "../layout/Layout";
import ListingSurface from "./ListingSurface";

/*
   A listing inside a page draws only the rows near the screen.

   Its own file because jsdom lays nothing out: the sizes a virtualiser measures
   are faked below, for every element, which no other test should inherit.

   Two separate faults kept every listing in the application drawing all of its
   items. Layout made its content before providing the scroller, so no listing
   could find one; and once they could, the scroller was handed over before it
   was in the page - while it still belonged to a template's document, with no
   window to measure in - and the virtualiser gave up for good, drawing nothing.
*/
class FakeResizeObserver {
    constructor(private callback: ResizeObserverCallback) {}

    observe(target: Element) {
        queueMicrotask(() =>
            this.callback(
                [
                    {
                        target,
                        contentRect: { width: 700, height: 600 },
                        borderBoxSize: [{ inlineSize: 700, blockSize: 130 }]
                    } as unknown as ResizeObserverEntry
                ],
                this
            )
        );
    }

    unobserve() {
        /* nothing to stop */
    }

    disconnect() {
        /* nothing to stop */
    }
}

beforeAll(() => {
    globalThis.ResizeObserver = FakeResizeObserver;

    for (const [property, value] of [
        ["clientWidth", 700],
        ["clientHeight", 600],
        ["offsetWidth", 700],
        ["offsetHeight", 600]
    ] as const) {
        Object.defineProperty(HTMLElement.prototype, property, {
            get: () => value,
            configurable: true
        });
    }
});

afterEach(cleanup);

const settle = () => new Promise(resolve => setTimeout(resolve, 50));

describe("a listing on a page", () => {
    test("draws the rows near the screen, and not the rest", async () => {
        const items = Array.from({ length: 200 }, (_, i) => `item-${i}`);

        render(() => (
            <FullscreenProvider>
                <Layout>
                    <ListingSurface items={items}>
                        {item => <div data-testid="tile">{item}</div>}
                    </ListingSurface>
                </Layout>
            </FullscreenProvider>
        ));

        await settle();

        const drawn = screen.queryAllByTestId("tile").length;

        expect(drawn).toBeGreaterThan(0);
        expect(drawn).toBeLessThan(items.length);
    });

    /*
       Before its width is measured a listing cannot know how many fit across.
       It used to draw everything for that first frame and window it after -
       every photo of a large category made, and its image requested, only to
       be thrown away.
    */
    test("draws nothing until it knows its width, rather than everything", () => {
        const items = Array.from({ length: 200 }, (_, i) => `item-${i}`);

        render(() => (
            <FullscreenProvider>
                <Layout>
                    <ListingSurface items={items}>
                        {item => <div data-testid="tile">{item}</div>}
                    </ListingSurface>
                </Layout>
            </FullscreenProvider>
        ));

        // the fake observer reports sizes a microtask from now
        expect(screen.queryAllByTestId("tile")).toHaveLength(0);
    });

    /*
       Nor until it knows where on the page it sits. Taken as the top before the
       first measurement, every year's grid on the categories page drew a
       screenful of cards it was nowhere near - and on a return to a position
       far down the page, each drew and measured rows around an offset it had
       wrong.
    */
    test("draws nothing until it knows where it sits, then the rows near the screen", async () => {
        const items = Array.from({ length: 200 }, (_, i) => `item-${i}`);
        const measure = vi
            .spyOn(HTMLElement.prototype, "getBoundingClientRect")
            .mockReturnValue({ width: 700, height: 600, top: 0, left: 0 } as DOMRect);

        render(() => (
            <FullscreenProvider>
                <Layout>
                    <ListingSurface items={items}>
                        {item => <div data-testid="tile">{item}</div>}
                    </ListingSurface>
                </Layout>
            </FullscreenProvider>
        ));

        // the width is read at once, but the margin only comes with the observer
        const before = screen.queryAllByTestId("tile").length;

        await settle();

        const after = screen.queryAllByTestId("tile").length;

        measure.mockRestore();

        expect(before).toBe(0);
        expect(after).toBeGreaterThan(0);
        expect(after).toBeLessThan(items.length);
    });
});
