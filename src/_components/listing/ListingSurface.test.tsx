import { cleanup, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, test } from "vitest";

import { ScrollContainerProvider } from "../layout/ScrollContainerContext";
import ListingSurface from "./ListingSurface";

/*
   Only the rows you can see are in the document.

   Nothing in this application was virtualised: a people listing built every
   person, a category built every photograph, and a phone-width grid of a few
   hundred ran to tens of thousands of pixels of real DOM.

   jsdom lays nothing out - every element reports a zero rect - so the
   measurements a virtualiser depends on have to be supplied. What is stubbed is
   the *environment* (a container with a width, a scroller with a height); the
   arithmetic that turns those into rows, and the decision about what to draw,
   are the component's own and are what these assert.
*/
const items = (count: number) => Array.from({ length: count }, (_, i) => `item-${i}`);

const tiles = () => screen.queryAllByTestId("tile");

const mount = (count: number, scrolled: boolean) => {
    const [scroller, setScroller] = createSignal<HTMLElement>();

    const result = render(() => (
        <div ref={setScroller} style={{ height: "600px", overflow: "auto" }}>
            <ScrollContainerProvider element={scrolled ? scroller : () => undefined}>
                <ListingSurface items={items(count)}>
                    {item => (
                        <div data-testid="tile" style={{ width: "160px", height: "120px" }}>
                            {item}
                        </div>
                    )}
                </ListingSurface>
            </ScrollContainerProvider>
        </div>
    ));

    return result;
};

afterEach(cleanup);

describe("a listing with nothing to scroll inside", () => {
    /*
       No `Layout` above means no scroll container to measure against, which is
       every test that renders a listing on its own and every picker inside a
       dialog. Drawing the lot is what this did before virtualisation and is
       right for a handful of items.

       The windowing itself is not tested here. jsdom lays nothing out, so a
       virtualiser has nothing to measure and would report whatever the stubs
       told it - see `_rows.test.ts` for the part that is decidable, and a
       browser for the part that is not.
    */
    test("draws every item", () => {
        mount(40, false);

        expect(tiles()).toHaveLength(40);
    });
});
