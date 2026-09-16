import { Router } from "@solidjs/router";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { AppSettingsProvider } from "../_contexts/settings/AppSettingsContext";
import { MediaBreakpointProvider } from "../_contexts/MediaBreakpointContext";
import { MediaSettingsProvider } from "../_contexts/settings/MediaSettingsContext";
import { ShortcutProvider } from "../_contexts/ShortcutContext";
import { gridRoute, bulkEditRoute, mapRoute } from "../category/_routes";
import { Category } from "../_models/Category";
import { IMediaService } from "./services/IMediaService";
import Toolbar from "./Toolbar";
import { atWidth } from "../_testing/breakpoints";

/*
   Which views a feed offers, and at which widths.

   A phone used to be offered the grid and nothing else. Three of the four
   hidden views were hidden because there was nowhere to put the chrome, which
   is a reason to fix the chrome rather than remove the view - and they are
   offered everywhere now.

   Bulk edit is the exception, and the exception is the point of this file:
   picking photographs and typing one set of coordinates for all of them needs
   the selection and the form in view at the same time, so it is offered only
   where the tools dock beside the grid rather than covering it.
*/

// the route builders ask a category for its year and slug
const category = { year: 2019, slug: "a-category" } as unknown as Category;

const service = {
    getMediaList: () => [],
    getActiveCategory: () => category,
    getActiveMedia: () => undefined,
    navigateToMedia: () => undefined,
    navigateToFirstMediaIfNeeded: () => undefined,
    getAvailableRoutes: () => [gridRoute, mapRoute, bulkEditRoute],
    getEntryPathByView: () => "/",
    getMediaPathByView: () => "/",
    canRequestMore: () => false,
    requestMore: () => undefined,
    canDownloadCategory: () => false,
    moveNext: () => undefined,
    movePrevious: () => undefined,
    isActiveMediaFirst: () => true,
    isActiveMediaLast: () => true
} as unknown as IMediaService;

const toolbar = (width: number) => {
    atWidth(width);

    const bar = () => (
        <Toolbar mediaService={service} activeCategory={category} activeMedia={undefined} />
    );

    render(() => (
        <Router
            root={props => (
                <AppSettingsProvider>
                    <ShortcutProvider>
                        <MediaSettingsProvider>
                            <MediaBreakpointProvider>{props.children}</MediaBreakpointProvider>
                        </MediaSettingsProvider>
                    </ShortcutProvider>
                </AppSettingsProvider>
            )}
        >
            {[{ path: "/", component: bar as never }]}
        </Router>
    ));
};

const offered = () => screen.queryAllByRole("link").map(el => el.getAttribute("title") ?? "");

afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.unstubAllGlobals();
});

describe("which views a feed offers", () => {
    test("a desk gets all four", () => {
        toolbar(1280);

        expect(offered().some(t => /bulk/i.test(t))).toBe(true);
    });

    /*
       The tools would have to come over the grid below `lg`, so entering a
       location would mean covering the very photographs it is being entered
       for.
    */
    test("a phone is not offered bulk edit", () => {
        toolbar(390);

        expect(offered().some(t => /bulk/i.test(t))).toBe(false);
    });

    test("nor is a tablet, where the tools still cannot dock", () => {
        toolbar(820);

        expect(offered().some(t => /bulk/i.test(t))).toBe(false);
    });

    // the three that were only ever hidden for want of somewhere to put the chrome
    test("but a phone keeps every other view", () => {
        toolbar(390);

        const titles = offered().join(" ").toLowerCase();

        expect(titles).toContain("grid");
        expect(titles).toContain("map");
    });
});
