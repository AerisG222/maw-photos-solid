import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { AppSettingsProvider } from "../../_contexts/settings/AppSettingsContext";
import ToolbarLayout from "./ToolbarLayout";

/*
   Two shapes, and which controls survive each.

   What is checked here is markup, not appearance - jsdom lays nothing out and
   parses almost none of the stylesheet, so "is it at the bottom" and "is it
   500px wide" are not questions it can answer honestly. Whether a control is
   *in the document at all* it can answer, and that is the part that breaks: the
   bar folds its children into a sheet below `md`, and folding away the wrong
   ones is a silent regression.
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

const toolbar = (width: number) => {
    atWidth(width);

    return render(() => (
        <AppSettingsProvider>
            <MediaBreakpointProvider>
                <ToolbarLayout nav={<button>Grid</button>} actions={<button>Actions</button>}>
                    <button>Density</button>
                </ToolbarLayout>
            </MediaBreakpointProvider>
        </AppSettingsProvider>
    ));
};

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("the toolbar at each width", () => {
    test("a wide screen shows every control at once", () => {
        toolbar(1280);

        expect(screen.getByText("Grid")).toBeTruthy();
        expect(screen.getByText("Actions")).toBeTruthy();
        expect(screen.getByText("Density")).toBeTruthy();
        expect(screen.queryByLabelText("More controls")).toBeNull();
    });

    /*
       The two that never fold: the view switcher is how you get anywhere, and
       the actions menu is already one button hiding a menu - putting it behind
       a second would be two taps to reach a download.
    */
    test("a phone keeps navigation and actions in the bar", () => {
        toolbar(390);

        expect(screen.getByText("Grid")).toBeTruthy();
        expect(screen.getByText("Actions")).toBeTruthy();
    });

    test("a phone folds the rest away behind one button", () => {
        toolbar(390);

        expect(screen.queryByText("Density")).toBeNull();
        expect(screen.getByLabelText("More controls")).toBeTruthy();
    });

    test("and the button is how they come back", () => {
        toolbar(390);

        fireEvent.click(screen.getByLabelText("More controls"));

        expect(screen.getByText("Density")).toBeTruthy();
        expect(screen.getByRole("dialog", { name: "More controls" })).toBeTruthy();
    });

    test("the sheet closes again", () => {
        toolbar(390);

        fireEvent.click(screen.getByLabelText("More controls"));
        fireEvent.click(screen.getByLabelText("Close"));

        expect(screen.queryByText("Density")).toBeNull();
    });

    // nothing to fold, so nothing to fold it behind
    test("no overflow button where there is no overflow", () => {
        atWidth(390);

        render(() => (
            <AppSettingsProvider>
                <MediaBreakpointProvider>
                    <ToolbarLayout nav={<button>Grid</button>} />
                </MediaBreakpointProvider>
            </AppSettingsProvider>
        ));

        expect(screen.queryByLabelText("More controls")).toBeNull();
    });

    /*
       A media view's chrome is around fifteen controls, and every one of them
       used to be its own tab stop - so reaching the page from the keyboard
       meant pressing Tab past all of them.
    */
    test("the whole bar is one tab stop", () => {
        toolbar(1280);

        const stops = [...screen.getByRole("toolbar").querySelectorAll("button, a[href]")].map(
            el => (el as HTMLElement).tabIndex
        );

        expect(stops.filter(t => t === 0)).toHaveLength(1);
        expect(stops.length).toBeGreaterThan(1);
    });

    test("and the arrows move along it", () => {
        toolbar(1280);

        const items = [...screen.getByRole("toolbar").querySelectorAll("button, a[href]")];

        (items[0] as HTMLElement).focus();
        fireEvent.keyDown(items[0], { key: "ArrowDown" });

        expect(document.activeElement).toBe(items[1]);
    });

    // a rail down the side from md up, a bar across the bottom below it
    test("it says which way it runs", () => {
        toolbar(390);

        expect(screen.getByRole("toolbar").getAttribute("aria-orientation")).toBe("horizontal");
    });

    /*
       The `⋮` menu is a Kobalte trigger, and a menu button opens on ArrowDown
       by convention. Listening on the bubble meant the trigger saw the key
       first: arrowing along the toolbar reached the ellipsis and opened its
       menu instead of moving past it, which is a dead end you cannot arrow out
       of.

       Stood in for by a button carrying a listener of its own, attached to the
       element rather than through JSX. That distinction is the whole test:
       Solid *delegates* `onKeyDown` to the document, so a JSX handler on the
       child would run after this container's listener whichever phase it used,
       and the test would pass against the bug. A library that binds its own
       handler to its own element - which is what the trigger does - is only
       beaten by capturing.
    */
    test("a control with its own idea about the arrows never sees them", () => {
        atWidth(1280);

        const opened: string[] = [];

        render(() => (
            <AppSettingsProvider>
                <MediaBreakpointProvider>
                    <ToolbarLayout nav={<button>Grid</button>}>
                        <button ref={el => el.addEventListener("keydown", e => opened.push(e.key))}>
                            Actions
                        </button>
                    </ToolbarLayout>
                </MediaBreakpointProvider>
            </AppSettingsProvider>
        ));

        const trigger = screen.getByText("Actions");

        trigger.focus();
        fireEvent.keyDown(trigger, { key: "ArrowDown" });

        expect(opened).toEqual([]);
    });

    // the toolbar claims the arrows; activating is still Enter or Space
    test("but it still receives the keys that activate it", () => {
        atWidth(1280);

        const seen: string[] = [];

        render(() => (
            <AppSettingsProvider>
                <MediaBreakpointProvider>
                    <ToolbarLayout nav={<button>Grid</button>}>
                        <button ref={el => el.addEventListener("keydown", e => seen.push(e.key))}>
                            Actions
                        </button>
                    </ToolbarLayout>
                </MediaBreakpointProvider>
            </AppSettingsProvider>
        ));

        const trigger = screen.getByText("Actions");

        trigger.focus();
        fireEvent.keyDown(trigger, { key: "Enter" });

        expect(seen).toEqual(["Enter"]);
    });

    /*
       Capturing claims the key before anything below sees it, which is the
       right answer for a menu trigger and the wrong one for a text field - the
       filter boxes live in these toolbars, and an arrow there moves the caret.
    */
    test("but a text field keeps its own arrows", () => {
        atWidth(1280);

        const seen: string[] = [];

        render(() => (
            <AppSettingsProvider>
                <MediaBreakpointProvider>
                    <ToolbarLayout nav={<button>Grid</button>}>
                        <input ref={el => el.addEventListener("keydown", e => seen.push(e.key))} />
                    </ToolbarLayout>
                </MediaBreakpointProvider>
            </AppSettingsProvider>
        ));

        const field = screen.getByRole("textbox");

        field.focus();
        fireEvent.keyDown(field, { key: "ArrowLeft" });

        expect(seen).toEqual(["ArrowLeft"]);
    });
});
