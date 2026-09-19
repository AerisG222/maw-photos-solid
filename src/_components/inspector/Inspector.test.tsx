import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { MediaSettingsProvider } from "../../_contexts/settings/MediaSettingsContext";
import { MediaViewGrid } from "../../_models/MediaView";
import Inspector from "./Inspector";
import { atWidth } from "../../_testing/breakpoints";
import { tooltipOf } from "../../_testing/tooltip";

/*
   The real provider hangs its children off an async Auth0 client, so under test
   it renders nothing at all. All the panel wants from it is whether the reader
   is an administrator - one card is admin-only - so that is what is supplied.
*/
vi.mock("../../_contexts/AuthContext", () => ({
    useAuthContext: () => [{ accountStatus: { isAdmin: false } }]
}));

/*
   Which shape the panel takes, and whether it covers the page.

   Rendered with nothing selected on purpose: the cards each reach into the
   active photograph, so leaving it undefined exercises the frame without
   dragging eight lazy card components and their queries into the test. It also
   pins the state that used to crash - see the "Nothing selected" fallback.
*/

const inspector = (width: number) => {
    atWidth(width);

    return render(() => (
        <ShortcutProvider>
            <MediaSettingsProvider>
                <MediaBreakpointProvider>
                    <Inspector
                        view={MediaViewGrid}
                        activeCategory={undefined}
                        activeMedia={undefined}
                    />
                </MediaBreakpointProvider>
            </MediaSettingsProvider>
        </ShortcutProvider>
    ));
};

const open = () =>
    fireEvent.click(
        screen.getAllByRole("button").find(el => /Show . Hide the Inspector/.test(tooltipOf(el)))!
    );

/*
   Was Escape already marked by the time a listener beneath the panel ran?

   Sampled *inside* the listener, which is the whole point: the event object is
   one object and `preventDefault` mutates it, so reading the flag after the
   dispatch says only that somebody called it - never who went first. The
   listener is also registered before the panel exists, so a panel that merely
   bubbled would lose the race to it, which is the bug the capture prevents.
*/
const markedWhenHandled = (mount: () => void) => {
    const seen: boolean[] = [];
    const beneath = (evt: Event) => seen.push(evt.defaultPrevented);

    window.addEventListener("keydown", beneath);

    try {
        mount();
        fireEvent.keyDown(document.body, { key: "Escape" });
    } finally {
        window.removeEventListener("keydown", beneath);
    }

    return seen;
};

afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.unstubAllGlobals();
});

describe("the inspector at each width", () => {
    // beside the photograph, part of the page rather than over it
    test("a wide screen docks it alongside", () => {
        inspector(1280);
        open();

        expect(screen.getByRole("complementary", { name: "Inspector" })).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test.each([
        ["a tablet", 800],
        ["a phone", 390]
    ])("%s overlays it instead", (_name, width) => {
        inspector(width);
        open();

        expect(screen.getByRole("dialog", { name: "Inspector" })).toBeInTheDocument();
        expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    /*
       Not modal. These describe the photograph you are looking at, so the panel
       dims the page rather than taking it away.
    */
    test("overlaid, it is explicitly not modal", () => {
        inspector(390);
        open();

        expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "false");
    });

    test("escape closes it where it is covering something", () => {
        inspector(390);
        open();

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // docked it is part of the page, and Escape belongs to whatever else wants it
    test("escape leaves it alone where it is docked", () => {
        inspector(1280);
        open();

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    /*
       A grid or a map can be looked at with nothing picked, which the panel has
       to answer rather than crash on - it could only ever be rendered with a
       photograph before, so none of the cards had to check.
    */
    test("it answers having nothing selected", () => {
        inspector(1280);
        open();

        expect(screen.getByText("Nothing selected")).toBeInTheDocument();
    });

    /*
       Overlaid, the panel sits on top of the rail that opened it - on a phone
       that is the whole bottom bar. So the control you would reach for to close
       it is underneath the thing you want to close. Tapping outside worked and
       always did, but nothing said so.
    */
    test("overlaid, it offers a way out of itself", () => {
        inspector(390);
        open();

        fireEvent.click(screen.getByLabelText("Close Inspector"));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // docked it covers nothing, so there is nothing to dismiss
    test("docked, there is nothing to close", () => {
        inspector(1280);
        open();

        expect(screen.queryByLabelText("Close Inspector")).not.toBeInTheDocument();
    });

    /*
       The header and the card chooser stay put while the cards scroll under
       them. They were inside the scrolling area before, so opening a card
       pushed the only way of closing it off the top.
    */
    test("the header is not inside the part that scrolls", () => {
        inspector(390);
        open();

        const panel = screen.getByRole("dialog");
        const header = screen.getByLabelText("Close Inspector");
        const scroller = panel.querySelector(".overflow-y-auto");

        expect(scroller, "the panel has a scrolling region").toBeTruthy();
        expect(scroller!.contains(header)).toBe(false);
    });

    /*
       The mechanism the whole Escape stack rests on.

       A media view listens for Escape too - to leave fullscreen, and to close
       the photograph - so without the panel marking the event, one press would
       dismiss the panel *and* whatever is under it. The panel captures, so it
       answers first; the view checks `defaultPrevented`, so it stands down.
    */
    test("overlaid, it marks escape so the layer beneath stands down", () => {
        /*
           Registered *before* the panel exists, and the key dispatched at a
           real element rather than at `window`. Both matter: listeners on the
           same target fire in registration order, so a panel that merely
           bubbled would lose this race - which is precisely the bug the capture
           is there to prevent, and a test that cannot lose the race cannot
           prove the capture.
        */
        const seen = markedWhenHandled(() => {
            inspector(390);
            open();
        });

        expect(seen, "the listener beneath never saw the key").toHaveLength(1);
        expect(seen[0]).toBe(true);
    });

    // docked it covers nothing, so the key belongs to whatever is beneath
    test("docked, it leaves escape alone entirely", () => {
        const seen = markedWhenHandled(() => {
            inspector(1280);
            open();
        });

        expect(seen).toEqual([false]);
    });
});
