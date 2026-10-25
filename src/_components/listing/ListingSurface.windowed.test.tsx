import { cleanup, render, screen } from "@solidjs/testing-library";
import { createSignal, Show } from "solid-js";
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
       A listing mounting into a page already drawn - a category scrolled back
       into view - can read its width at once. Waiting for the observer meant a
       frame without rows, and a category's height changing under a jump to it.
    */
    test("mounting into a drawn page, has its rows at once", async () => {
        const [shown, setShown] = createSignal(false);
        const items = Array.from({ length: 200 }, (_, i) => `item-${i}`);
        const measure = vi
            .spyOn(HTMLElement.prototype, "getBoundingClientRect")
            .mockReturnValue({ width: 700, height: 600, top: 0, left: 0 } as DOMRect);

        render(() => (
            <FullscreenProvider>
                <Layout>
                    <Show when={shown()}>
                        <ListingSurface items={items}>
                            {item => <div data-testid="tile">{item}</div>}
                        </ListingSurface>
                    </Show>
                </Layout>
            </FullscreenProvider>
        ));

        await settle();
        setShown(true);

        // before the observer has had a chance to report anything
        const drawn = screen.queryAllByTestId("tile").length;

        measure.mockRestore();

        expect(drawn).toBeGreaterThan(0);
        expect(drawn).toBeLessThan(items.length);
    });
});
