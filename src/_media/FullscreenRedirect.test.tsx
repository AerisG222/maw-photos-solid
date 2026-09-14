import { Router } from "@solidjs/router";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import FullscreenRedirect from "./FullscreenRedirect";

/*
   Fullscreen stopped being a place you go.

   It was a route per area rendering the same photograph through the same
   component, with a toolbar and a rail still around it - so what it offered was
   the absence of everything else, which is a state the grid can be in rather
   than a destination. The addresses outlive the view, and the slug is identical
   in both, which makes this a substitution rather than a parse.
*/
const land = () => {
    const Marker = () => <span>grid: {window.location.pathname}</span>;

    render(() => (
        <Router>
            {[
                { path: "/c/:slug/fullscreen/:mediaSlug?", component: FullscreenRedirect as never },
                { path: "/c/:slug/grid/:mediaSlug?", component: Marker as never }
            ]}
        </Router>
    ));
};

afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
});

describe("an old fullscreen address", () => {
    test("lands on the same photograph in the grid", async () => {
        window.history.replaceState({}, "", "/c/a-category/fullscreen/a-photo");
        land();

        expect(await screen.findByText(/grid:/)).toBeTruthy();
        expect(window.location.pathname).toBe("/c/a-category/grid/a-photo");
    });

    test("and with no photograph, on the grid itself", async () => {
        window.history.replaceState({}, "", "/c/a-category/fullscreen");
        land();

        expect(await screen.findByText(/grid:/)).toBeTruthy();
        expect(window.location.pathname).toBe("/c/a-category/grid");
    });
});
