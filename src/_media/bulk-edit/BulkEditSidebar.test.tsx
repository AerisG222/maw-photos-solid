import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import BulkEditSidebar from "./BulkEditSidebar";

/*
   Bulk edit's tools were a second copy of what the Inspector had been before it
   learned to be three shapes: a hard `w-[500px]` handed to the layout's sidebar
   slot. In flow, on a 390px viewport, that stretched the layout's bottom row to
   the height of the cards and squeezed the chrome beside it to nothing.

   Measured in a browser before the change: the bottom row ran to 600px tall
   with the toolbar at zero width, and the document scrolled sideways to 500px.
   jsdom cannot see any of that, so what is pinned here is the thing it can - a
   panel that is a dialog rather than part of the page, and a way to close it.
*/
const atWidth = (px: number) => {
    vi.stubGlobal("matchMedia", (query: string) => {
        const min = /min-width:\s*(\d+)px/.exec(query);

        return {
            matches: !!min && px >= Number(min[1]),
            media: query,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            addListener: () => undefined,
            removeListener: () => undefined
        };
    });
};

const sidebar = (width: number) => {
    atWidth(width);

    return render(() => (
        <ShortcutProvider>
            <MediaBreakpointProvider>
                <BulkEditSidebar
                    onSave={() => undefined}
                    onHideMediaWithGps={() => undefined}
                    onSelectAll={() => undefined}
                    onDeselectAll={() => undefined}
                />
            </MediaBreakpointProvider>
        </ShortcutProvider>
    ));
};

const open = () => fireEvent.click(screen.getByTitle(/Show . Hide the Bulk Edit Tools/));

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("the bulk edit tools", () => {
    // as this screen has always behaved on a wide display: simply there
    test("a wide screen keeps them beside the photographs", () => {
        sidebar(1280);

        expect(screen.getByRole("complementary", { name: "Bulk Edit Tools" })).toBeTruthy();
        expect(screen.queryByTitle(/Show . Hide the Bulk Edit Tools/)).toBeNull();
    });

    test("a phone keeps them out of the way until asked", () => {
        sidebar(390);

        expect(screen.queryByRole("dialog")).toBeNull();

        open();

        expect(screen.getByRole("dialog", { name: "Bulk Edit Tools" })).toBeTruthy();
    });

    test("and lets go of them again", () => {
        sidebar(390);
        open();

        fireEvent.click(screen.getByLabelText("Close Bulk Edit Tools"));

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("the tools themselves are still there", () => {
        sidebar(390);
        open();

        expect(screen.getByText("Select All")).toBeTruthy();
        expect(screen.getByText("GPS")).toBeTruthy();
    });
});
