import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";

import ListingToolbar from "./ListingToolbar";
import { tooltipOf } from "../../_testing/tooltip";

afterEach(() => {
    cleanup();
    localStorage.clear();
});

const mount = (ui: () => unknown) =>
    render(() => (
        <AllSettingsProvider>
            <ShortcutProvider>{ui() as never}</ShortcutProvider>
        </AllSettingsProvider>
    ));

const buttons = () => [...document.querySelectorAll("button[aria-label]")];

const controls = () => buttons().map(tooltipOf);

const press = (name: string) =>
    buttons()
        .find(el => tooltipOf(el).startsWith(name))!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));

describe("ListingToolbar", () => {
    test("offers only what the listing asked for", () => {
        mount(() => <ListingToolbar labels faces />);

        expect(controls()).toEqual(["Toggle Labels (T)", "Toggle Face Highlighting (Q)"]);
    });

    test("always in the same order, whichever subset it is", () => {
        mount(() => <ListingToolbar labels sort faces />);

        expect(controls().map(t => t.split(" (")[0])).toEqual([
            "Sorted by Name",
            "Toggle Labels",
            "Toggle Face Highlighting"
        ]);
    });

    // the row is the same everywhere, so the keys have to be too
    test("no two of its controls claim the same key", () => {
        mount(() => <ListingToolbar sort labels faces />);

        const keys = controls().map(title => /\(([^)]+)\)$/.exec(title)?.[1]);

        // three controls, so three keys - an empty list would pass the rest
        expect(keys).toHaveLength(3);
        expect(keys).toEqual([...new Set(keys)]);
        expect(keys.every(Boolean)).toBe(true);
    });

    /*
       The point of the whole step: a preference set while browsing one listing
       is the same preference in the next one. Two toolbars, one store - pressing
       a control in either is visible in both.
    */
    test("a change in one listing is a change in every listing", () => {
        mount(() => (
            <>
                <div id="first">
                    <ListingToolbar labels />
                </div>
                <div id="second">
                    <ListingToolbar labels />
                </div>
            </>
        ));

        /*
           `bg-secondary` marks an active control. Matched on a word boundary
           rather than with `includes`, because the static class list carries
           `hover:bg-secondary` too and a substring match sees that on every
           button whatever its state.
        */
        const lit = () =>
            buttons()
                .filter(el => tooltipOf(el).startsWith("Toggle Labels"))
                .map(el => el.className.split(/\s+/).includes("bg-secondary"));

        const before = lit();

        press("Toggle Labels");

        expect(lit()).not.toEqual(before);
        // both moved, not just the one that was pressed
        expect(new Set(lit()).size).toBe(1);
    });
});
