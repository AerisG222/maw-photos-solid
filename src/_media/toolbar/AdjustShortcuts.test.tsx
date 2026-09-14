import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import { ShortcutProvider, useShortcutContext } from "../../_contexts/ShortcutContext";
import { VisualEffectsProvider } from "../contexts/VisualEffectsContext";
import AdjustShortcuts from "./AdjustShortcuts";

/*
   Rotate and flip moved into the Inspector's Adjust card, which is where they
   belong - they share a state object and a reset with the sliders there.

   The constraint that came with the move is what this pins: a key that only
   works while the panel holding its button happens to be open is not a key. So
   the registration lives in the toolbar, which is mounted for as long as a
   photograph is, and renders nothing at all.
*/
const mount = () => {
    let shortcuts!: ReturnType<typeof useShortcutContext>;

    const Probe = () => {
        shortcuts = useShortcutContext();

        return <></>;
    };

    const { container } = render(() => (
        <ShortcutProvider>
            <VisualEffectsProvider>
                <AdjustShortcuts />
                <Probe />
            </VisualEffectsProvider>
        </ShortcutProvider>
    ));

    return { container, keys: () => shortcuts[0].shortcuts.flatMap(s => s.shortcut) };
};

afterEach(cleanup);

describe("the adjust keys", () => {
    test("are registered without a button to hang off", () => {
        const { keys } = mount();

        expect(keys()).toContain("a");
        expect(keys()).toContain("d");
    });

    test("and draw nothing", () => {
        const { container } = mount();

        expect(container.textContent).toBe("");
        expect(container.querySelector("button")).toBeNull();
    });
});
