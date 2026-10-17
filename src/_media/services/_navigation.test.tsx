import { createEffect } from "solid-js";
import { createRoute, useLocation } from "@tanstack/solid-router";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import { TestRouter } from "../../_router/testing";
import { useGoTo } from "./_navigation";

afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
});

const settle = () => new Promise(resolve => setTimeout(resolve, 200));

/*
   Going where you already are does nothing.

   TanStack Router reloads the whole match instead, handing every reader a new
   location - so an effect that keeps the address where it belongs, reading the
   location and navigating when it is wrong, ran again on its own navigation and
   never stopped. The browser locked up hard enough that its devtools would not
   open.
*/
describe("navigating to the current address", () => {
    test("is a no-op, so an effect that does it settles", async () => {
        let runs = 0;

        const KeepsItself = () => {
            const location = useLocation();
            const goTo = useGoTo();

            createEffect(() => {
                runs++;
                goTo({ href: location().href }, { replace: true });
            });

            return <span>here</span>;
        };

        window.history.replaceState({}, "", "/here?x=1");
        render(() => (
            <TestRouter
                routes={root => [
                    createRoute({
                        getParentRoute: () => root,
                        path: "here",
                        component: KeepsItself
                    })
                ]}
            />
        ));

        await screen.findByText("here");
        await settle();

        expect(runs).toBeLessThan(5);
    });

    test("and so is setting the query string to what it already is", async () => {
        let runs = 0;

        const KeepsItsSearch = () => {
            const location = useLocation();
            const goTo = useGoTo();

            createEffect(() => {
                runs++;
                // the same query string, rebuilt - no route here declares `x`, so as an href
                goTo({ href: `${location().pathname}${location().searchStr}` }, { replace: true });
            });

            return <span>search</span>;
        };

        window.history.replaceState({}, "", "/search?x=1");
        render(() => (
            <TestRouter
                routes={root => [
                    createRoute({
                        getParentRoute: () => root,
                        path: "search",
                        component: KeepsItsSearch
                    })
                ]}
            />
        ));

        await screen.findByText("search");
        await settle();

        expect(runs).toBeLessThan(5);
    });
});
