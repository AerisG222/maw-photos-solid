import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import ConfirmDialog from "./ConfirmDialog";

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

describe("ConfirmDialog", () => {
    test("asks its question and offers the named action", () => {
        const { baseElement } = render(() => (
            <ConfirmDialog
                open={true}
                title="Delete Clan"
                confirmLabel="Delete"
                destructive
                onConfirm={() => undefined}
                onCancel={() => undefined}
            >
                Delete the Morano clan?
            </ConfirmDialog>
        ));

        expect(baseElement.textContent).toContain("Delete Clan");
        expect(baseElement.textContent).toContain("Delete the Morano clan?");
    });

    test("confirming and cancelling are told apart", () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(() => (
            <ConfirmDialog
                open={true}
                title="Delete Clan"
                confirmLabel="Delete"
                onConfirm={onConfirm}
                onCancel={onCancel}
            >
                question
            </ConfirmDialog>
        ));

        screen.getByText("Delete").click();
        expect(onConfirm).toHaveBeenCalledOnce();
        expect(onCancel).not.toHaveBeenCalled();

        screen.getByText("Cancel").click();
        expect(onCancel).toHaveBeenCalledOnce();
    });

    test("a pending confirmation cannot be pressed twice", () => {
        const onConfirm = vi.fn();
        render(() => (
            <ConfirmDialog
                open={true}
                title="Delete Clan"
                confirmLabel="Delete"
                pending
                onConfirm={onConfirm}
                onCancel={() => undefined}
            >
                question
            </ConfirmDialog>
        ));

        screen.getByText("Delete").click();

        expect(onConfirm).not.toHaveBeenCalled();
    });

    // an "are you sure" is announced as one, not as an ordinary dialog
    test("is announced as an alert dialog", () => {
        const { baseElement } = render(() => (
            <ConfirmDialog
                open={true}
                title="Delete Clan"
                confirmLabel="Delete"
                onConfirm={() => undefined}
                onCancel={() => undefined}
            >
                question
            </ConfirmDialog>
        ));

        expect(baseElement.querySelector('[role="alertdialog"]')).toBeTruthy();
    });
});
