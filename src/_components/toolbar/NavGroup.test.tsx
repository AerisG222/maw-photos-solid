import { Router } from "@solidjs/router";
import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { AppSettingsProvider } from "../../_contexts/settings/AppSettingsContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";

import NavGroup, { NavEntry } from "./NavGroup";
import { tooltipOf } from "../../_testing/tooltip";

afterEach(() => {
    cleanup();
    localStorage.clear();
});

const route = (name: string): AppRouteDefinition => ({
    name,
    icon: "icon-[ic--round-apps]",
    path: `/${name.toLowerCase()}`,
    absolutePath: `/${name.toLowerCase()}`
});

const entry = (name: string, over: Partial<NavEntry> = {}): NavEntry => ({
    route: route(name),
    href: `/${name.toLowerCase()}`,
    ...over
});

const mount = (entries: NavEntry[], digitOffset?: number) =>
    render(() => (
        <Router
            root={props => (
                <AppSettingsProvider>
                    <ShortcutProvider>{props.children}</ShortcutProvider>
                </AppSettingsProvider>
            )}
        >
            {[
                {
                    path: "/",
                    component: () => <NavGroup entries={entries} digitOffset={digitOffset} />
                }
            ]}
        </Router>
    ));

// the digit is shown in the tooltip, which is how a reader discovers it
const titles = () => [...document.querySelectorAll("a, span[aria-disabled]")].map(tooltipOf);

describe("NavGroup", () => {
    test("numbers its entries by position", () => {
        mount([entry("Grid"), entry("Detail"), entry("Fullscreen")]);

        expect(titles()).toEqual(["Grid (1)", "Detail (2)", "Fullscreen (3)"]);
    });

    /*
       A feed's navigation is two groups - the listing switch, then the view
       links - and the digits have to run through both rather than restarting.
    */
    test("carries on from an offset, for a toolbar assembled from two groups", () => {
        mount([entry("Grid"), entry("Fullscreen")], 2);

        expect(titles()).toEqual(["Grid (3)", "Fullscreen (4)"]);
    });

    /*
       A dead entry does not advertise a key, because its key is dead too - a
       control drawn as unavailable should not promise a shortcut that does
       nothing. What matters is that it still occupies its slot, so the entries
       after it keep their digits as the toolbar's subject comes and goes.
    */
    test("a dead entry holds its slot without promising a key", () => {
        mount([entry("Media", { disabled: true }), entry("Categories")]);

        expect(titles()).toEqual(["Media", "Categories (2)"]);
    });

    test("the route's own key is ignored in favour of its position", () => {
        // every view route used to carry a mnemonic: g, w, f, z, /
        mount([entry("Grid", { route: { ...route("Grid"), shortcutKeys: ["g"] } }), entry("Map")]);

        expect(titles()).toEqual(["Grid (1)", "Map (2)"]);
    });

    test("a tooltip is preferred over the name, as the label", () => {
        mount([
            entry("Grid", { route: { ...route("Grid"), tooltip: "Browse The Grid" } }),
            entry("Map")
        ]);

        expect(titles()).toEqual(["Browse The Grid (1)", "Map (2)"]);
    });

    /*
       A switch between a single option is not a switch - it is a link to the
       page you are already on, taking a slot in the bar and a digit with it.

       Two areas arrived here the moment fullscreen stopped being a view of its
       own: Random and every feed offer the grid and nothing else now.
    */
    test("a group of one draws nothing", () => {
        mount([entry("Grid")]);

        expect(titles()).toEqual([]);
    });

    test("and a group of none likewise", () => {
        mount([]);

        expect(titles()).toEqual([]);
    });
});
