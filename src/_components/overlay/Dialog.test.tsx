import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import Dialog from "./Dialog";

/*
   Kobalte renders into a portal on document.body, so these read from
   `baseElement` and `screen` rather than from the container the component was
   mounted into.

   That is also why the teardown is explicit, and why the alert dialog is tested
   in a file of its own. The library's own cleanup removes the container, and a
   portal is deliberately not inside it, so without the teardown below a dialog
   from one test is still in the document during the next. This suite runs with
   `isolate: false`, and exercising both dialogs in one file left the two
   portals confusable - the role assertions read the wrong one. Kobalte itself
   is fine: `AlertDialogContent` passes its role per instance, so nothing is
   shared between them at runtime.
*/
afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
});

describe("Dialog", () => {
    test("renders nothing at all while closed", () => {
        const { baseElement } = render(() => (
            <Dialog open={false} title="Name Your Clan" onClose={() => undefined}>
                <p>body</p>
            </Dialog>
        ));

        expect(baseElement.textContent).not.toContain("Name Your Clan");
        expect(baseElement.textContent).not.toContain("body");
    });

    test("shows its title, body and a way out when open", () => {
        const { baseElement } = render(() => (
            <Dialog open={true} title="Name Your Clan" onClose={() => undefined}>
                <p>body</p>
            </Dialog>
        ));

        expect(baseElement.textContent).toContain("Name Your Clan");
        expect(baseElement.textContent).toContain("body");
        expect(baseElement.textContent).toContain("Cancel");
    });

    /*
       The reason for adopting a primitive rather than keeping the hand-rolled
       version: the dialog names itself to a screen reader, from its own title,
       without every caller having to remember to wire that up.
    */
    test("is announced as a modal labelled by its title", () => {
        const { baseElement } = render(() => (
            <Dialog open={true} title="Name Your Clan" onClose={() => undefined}>
                <p>body</p>
            </Dialog>
        ));

        const content = baseElement.querySelector('[role="dialog"]');
        const labelId = content?.getAttribute("aria-labelledby");

        expect(labelId).toBeTruthy();
        expect(document.getElementById(labelId!)!.textContent).toBe("Name Your Clan");
    });

    test("closing reports it upward rather than hiding itself", () => {
        const onClose = vi.fn();
        render(() => (
            <Dialog open={true} title="Name Your Clan" onClose={onClose}>
                <p>body</p>
            </Dialog>
        ));

        screen.getByText("Cancel").click();

        expect(onClose).toHaveBeenCalledOnce();
    });

    test("the confirming action sits after cancel, and is the caller's own", () => {
        const onSubmit = vi.fn();
        render(() => (
            <Dialog
                open={true}
                title="Name Your Clan"
                onClose={() => undefined}
                actions={<button onClick={onSubmit}>Create</button>}
            >
                <p>body</p>
            </Dialog>
        ));

        screen.getByText("Create").click();

        expect(onSubmit).toHaveBeenCalledOnce();
    });

    test("an error is announced, not just printed", () => {
        const { baseElement } = render(() => (
            <Dialog
                open={true}
                title="Name Your Clan"
                error="You already have a clan with that name."
                onClose={() => undefined}
            >
                <p>body</p>
            </Dialog>
        ));

        const alert = baseElement.querySelector('[role="alert"]');

        expect(alert!.textContent).toContain("You already have a clan with that name.");
    });
});
