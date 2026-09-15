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
                    <button>Labels</button>
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

        expect(screen.getByText("Grid")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
        expect(screen.getByText("Labels")).toBeInTheDocument();
        expect(screen.queryByLabelText("More controls")).not.toBeInTheDocument();
    });

    /*
       The two that never fold: the view switcher is how you get anywhere, and
       the actions menu is already one button hiding a menu - putting it behind
       a second would be two taps to reach a download.
    */
    test("a phone keeps navigation and actions in the bar", () => {
        toolbar(390);

        expect(screen.getByText("Grid")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("a phone folds the rest away behind one button", () => {
        toolbar(390);

        expect(screen.queryByText("Labels")).not.toBeInTheDocument();
        expect(screen.getByLabelText("More controls")).toBeInTheDocument();
    });

    test("and the button is how they come back", () => {
        toolbar(390);

        fireEvent.click(screen.getByLabelText("More controls"));

        expect(screen.getByText("Labels")).toBeInTheDocument();
        expect(screen.getByRole("dialog", { name: "More controls" })).toBeInTheDocument();
    });

    test("the sheet closes again", () => {
        toolbar(390);

        fireEvent.click(screen.getByLabelText("More controls"));
        fireEvent.click(screen.getByLabelText("Close"));

        expect(screen.queryByText("Labels")).not.toBeInTheDocument();
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

        expect(screen.queryByLabelText("More controls")).not.toBeInTheDocument();
    });
});
