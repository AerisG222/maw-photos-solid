import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import BulkEditSidebar from "./BulkEditSidebar";
import { atWidth } from "../../_testing/breakpoints";

/*
   Bulk edit's tools were a second copy of what the Inspector had been before it
   learned to be three shapes: a hard `w-[500px]` handed to the layout's sidebar
   slot. In flow, on a 390px viewport, that stretched the layout's bottom row to
   the height of the cards and squeezed the chrome beside it to nothing -
   measured in a browser at `h=600` with the toolbar at zero width, and the
   document scrolling sideways to 500px.

   The answer was not to make it a sheet. Picking photographs and typing one set
   of coordinates for all of them needs the selection and the form in view at
   once, so the view is simply not offered where the panel cannot dock. That
   leaves this with one shape, which is what is pinned here.
*/

const sidebar = () => {
    atWidth(1280);

    return render(() => (
        <MediaBreakpointProvider>
            <BulkEditSidebar
                onSave={() => undefined}
                onHideMediaWithGps={() => undefined}
                onSelectAll={() => undefined}
                onDeselectAll={() => undefined}
            />
        </MediaBreakpointProvider>
    ));
};

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("the bulk edit tools", () => {
    // beside the photographs, part of the page - never over them
    test("sit alongside, as part of the page", () => {
        sidebar();

        expect(screen.getByRole("complementary", { name: "Bulk Edit Tools" })).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // nothing is covered, so there is nothing to dismiss
    test("offer no way to dismiss them", () => {
        sidebar();

        expect(screen.queryByLabelText("Close Bulk Edit Tools")).not.toBeInTheDocument();
    });

    test("and still carry the tools", () => {
        sidebar();

        expect(screen.getByText("Select All")).toBeInTheDocument();
        expect(screen.getByText("GPS")).toBeInTheDocument();
    });
});
