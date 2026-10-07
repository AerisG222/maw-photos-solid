import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import BulkEditSidebar from "./BulkEditSidebar";
import { BulkEditFilter } from "./BulkEditFilterCard";
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

interface SidebarOptions {
    selectedCount?: number;
    onClearOverride?: () => void;
    onRestrict?: (roles: string[]) => void;
    onClearRestriction?: () => void;
    restrictionMessages?: string[];
    hiddenCount?: number;
    filter?: BulkEditFilter;
}

const sidebar = ({
    selectedCount = 0,
    onClearOverride = () => undefined,
    onRestrict = () => undefined,
    onClearRestriction = () => undefined,
    restrictionMessages = [],
    hiddenCount = 0,
    filter = "all"
}: SidebarOptions = {}) => {
    atWidth(1280);

    return render(() => (
        <MediaBreakpointProvider>
            <BulkEditSidebar
                onSave={() => undefined}
                onClearOverride={onClearOverride}
                selectedCount={selectedCount}
                filter={filter}
                onFilterChange={() => undefined}
                hiddenCount={hiddenCount}
                onSelectAll={() => undefined}
                onDeselectAll={() => undefined}
                roles={["admin", "demo", "friend"]}
                onRestrict={onRestrict}
                onClearRestriction={onClearRestriction}
                isRestrictionPending={false}
                restrictionMessages={restrictionMessages}
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

    test("offer every filter as one choice", () => {
        sidebar();

        expect(screen.getByLabelText("All Photos")).toBeChecked();
        expect(screen.getByLabelText("Photos without GPS Data")).not.toBeChecked();
        expect(screen.getByLabelText("Photos with a GPS Override")).not.toBeChecked();
        expect(screen.getByLabelText("Restricted Photos")).not.toBeChecked();
    });

    /*
       A photo restricted to roles the admin does not hold is missing from the
       grid they normally see, so without this nothing would say it exists.
    */
    test("point out restricted photos hidden from you", () => {
        sidebar({ hiddenCount: 2 });

        expect(
            screen.getByText(/2 restricted photos here are hidden from you/)
        ).toBeInTheDocument();
    });

    test("stop pointing once they are on screen", () => {
        sidebar({ hiddenCount: 2, filter: "restricted" });

        expect(screen.queryByText(/hidden from you/)).not.toBeInTheDocument();
    });

    // nothing selected, nothing to clear
    test("hold back clearing overrides until something is selected", () => {
        sidebar();

        expect(screen.getByRole("button", { name: "Clear Override" })).toBeDisabled();
    });

    test("ask to clear the overrides of what is selected", () => {
        const onClearOverride = vi.fn();

        sidebar({ selectedCount: 2, onClearOverride });
        screen.getByRole("button", { name: "Clear Override" }).click();

        expect(onClearOverride).toHaveBeenCalledOnce();
    });

    test("hold back restricting and unrestricting until something is selected", () => {
        sidebar();

        expect(screen.getByRole("button", { name: "Restrict" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Unrestrict" })).toBeDisabled();
    });

    /*
       A restriction applies to admins too, so one that leaves the admin role
       off can hide the photos from the person setting it. Ticked by default,
       so that takes a deliberate choice.
    */
    test("start a restriction with the admin role chosen", () => {
        const onRestrict = vi.fn();

        sidebar({ selectedCount: 2, onRestrict });

        expect(screen.getByLabelText("admin")).toBeChecked();
        expect(screen.getByLabelText("friend")).not.toBeChecked();

        screen.getByLabelText("friend").click();
        screen.getByRole("button", { name: "Restrict" }).click();

        expect(onRestrict).toHaveBeenCalledWith(["admin", "friend"]);
    });

    test("cannot restrict to no roles at all", () => {
        sidebar({ selectedCount: 2 });

        screen.getByLabelText("admin").click();

        expect(screen.getByRole("button", { name: "Restrict" })).toBeDisabled();
    });

    test("ask to unrestrict what is selected", () => {
        const onClearRestriction = vi.fn();

        sidebar({ selectedCount: 2, onClearRestriction });
        screen.getByRole("button", { name: "Unrestrict" }).click();

        expect(onClearRestriction).toHaveBeenCalledOnce();
    });

    test("say why a restriction was refused", () => {
        sidebar({ restrictionMessages: ["There is no role named nope."] });

        expect(screen.getByText("There is no role named nope.")).toBeInTheDocument();
    });
});
