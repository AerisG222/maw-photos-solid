import { Router } from "@solidjs/router";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import { AppSettingsProvider } from "../../_contexts/settings/AppSettingsContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";

import IconButton from "../icon/IconButton";
import ToolbarButton from "../toolbar/ToolbarButton";
import ToolbarLink from "../toolbar/ToolbarLink";

/*
   Every icon-only control says what it is, and what state it is in.

   All of these draw an icon and, at most, a label that is `hidden` until `md`
   *and* until toolbar labels are switched on - so for a phone reader they are
   an icon and a `title`.

   Worth being precise about what that was worth fixing. `title` *is* the
   last-resort fallback in the accessible-name algorithm, so the toolbar
   controls did have a name; these two tests passed before `aria-label` was
   added and are kept as regression guards rather than as proof of a fix. The
   case for the attribute is that `title` support varies across assistive
   technology and it is invisible on touch.

   The two that were genuinely broken are the ones that fail without the
   change: `IconButton` had no name of any kind - no title, no text, an icon
   and nothing else, drawing the favourite heart on every tile - and no toolbar
   toggle said whether it was switched on.
*/
const frame = (body: () => unknown) =>
    render(() => (
        <Router
            root={props => (
                <AppSettingsProvider>
                    <ShortcutProvider>
                        <MediaBreakpointProvider>{props.children}</MediaBreakpointProvider>
                    </ShortcutProvider>
                </AppSettingsProvider>
            )}
        >
            {[{ path: "/", component: body as never }]}
        </Router>
    ));

const route: AppRouteDefinition = {
    icon: "icon-[ic--round-image]",
    name: "Grid",
    tooltip: "Show the Grid",
    path: "/",
    absolutePath: "/"
};

afterEach(() => {
    cleanup();
    localStorage.clear();
});

describe("icon-only controls", () => {
    // passed before the change: `title` is the accname fallback. A guard, not a fix.
    test("a toolbar button is named", () => {
        frame(() => (
            <ToolbarButton
                icon="icon-[ic--round-filter-alt]"
                name="Favorites"
                tooltip="Show Favorites Only"
                clickHandler={() => undefined}
            />
        ));

        expect(screen.getByRole("button", { name: "Favorites" })).toBeInTheDocument();
    });

    // `active` on a toolbar button always means "switched on", never "selected"
    test("and states whether it is switched on", () => {
        frame(() => (
            <ToolbarButton
                icon="icon-[ic--round-filter-alt]"
                name="Favorites"
                tooltip="Show Favorites Only"
                active={true}
                clickHandler={() => undefined}
            />
        ));

        expect(screen.getByRole("button", { name: "Favorites" }).getAttribute("aria-pressed")).toBe(
            "true"
        );
    });

    test("a toolbar link is named, and says when it is the current page", () => {
        frame(() => <ToolbarLink href="/" route={route} active={true} />);

        const link = screen.getByRole("link", { name: "Show the Grid" });

        expect(link).toHaveAttribute("aria-current", "page");
    });

    /*
       The one that had no name at all. It draws the favourite heart on every
       tile in the application, so a listing announced a row of bare "button"s.
    */
    test("an icon button is named, and says which way it will go", () => {
        frame(() => <IconButton label="Add to favourites" onClick={() => undefined} />);

        expect(screen.getByRole("button", { name: "Add to favourites" })).toBeInTheDocument();
    });

    /*
       The key is in the tooltip and not in the accessible name.

       A screen reader announces the action and reads the binding from its own
       list; repeating it in the name makes every heart announce as "add to
       favourites h". A pointer user has no other way to find out there is a
       key at all.
    */
    test("an icon button names its key to the pointer, not to the reader", () => {
        frame(() => (
            <IconButton label="Add to favourites" shortcutKeys={["h"]} onClick={() => undefined} />
        ));

        const button = screen.getByRole("button", { name: "Add to favourites" });

        expect(button).toHaveAttribute("title", "Add to favourites (H)");
    });

    /*
       And says nothing where nothing is bound. `h` acts on the photograph that
       is open; the hearts on a listing's tiles have no key behind them, so a
       tooltip claiming one would be a lie.
    */
    test("and claims no key where none is bound", () => {
        frame(() => <IconButton label="Add to favourites" onClick={() => undefined} />);

        expect(screen.getByRole("button")).toHaveAttribute("title", "Add to favourites");
    });
});
