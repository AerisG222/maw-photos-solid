import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, expect, test } from "vitest";

import { ShortcutProvider, useShortcutContext } from "../../_contexts/ShortcutContext";

import ShortcutDialog from "./ShortcutDialog";

// see the note in overlay/Dialog.test.tsx - portals outlive their container
afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
});

test("pressing ? opens the reference", () => {
    let show!: (doShow: boolean) => void;

    const Opener = () => {
        const [, { setShowDialog }] = useShortcutContext();

        show = setShowDialog;

        return <></>;
    };

    render(() => (
        <ShortcutProvider>
            <Opener />
            <ShortcutDialog />
        </ShortcutProvider>
    ));

    expect(document.body.textContent).not.toContain("Active Shortcuts");

    show(true);

    expect(document.body.textContent).toContain("Active Shortcuts");
});
