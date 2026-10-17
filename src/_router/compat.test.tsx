import { createEffect } from "solid-js";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

import { TestRouter } from "./testing";
import { useLocation, useNavigate, useSearchParams } from "./compat";

afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
});

const settle = () => new Promise(resolve => setTimeout(resolve, 200));

/*
   Going where you already are does nothing.

   The old router ignored it; TanStack Router reloads the whole match, which
   hands every reader a new location - so an effect that keeps the address
   where it belongs, reading the location and navigating when it is wrong, ran
   again on its own navigation and never stopped. The browser locked up hard
   enough that its devtools would not open.
*/
describe("navigating to the current address", () => {
    test("is a no-op, so an effect that does it settles", async () => {
        let runs = 0;

        const KeepsItself = () => {
            const location = useLocation();
            const navigate = useNavigate();

            createEffect(() => {
                runs++;
                navigate(`${location.pathname}${location.search}`, { replace: true });
            });

            return <span>here</span>;
        };

        window.history.replaceState({}, "", "/here?x=1");
        render(() => <TestRouter routes={[{ path: "/here", component: KeepsItself }]} />);

        await screen.findByText("here");
        await settle();

        expect(runs).toBeLessThan(5);
    });

    test("and so is setting the query string to what it already is", async () => {
        let runs = 0;

        const KeepsItsSearch = () => {
            const [search, setSearch] = useSearchParams();

            createEffect(() => {
                runs++;
                setSearch({ x: search.x });
            });

            return <span>search</span>;
        };

        window.history.replaceState({}, "", "/search?x=1");
        render(() => <TestRouter routes={[{ path: "/search", component: KeepsItsSearch }]} />);

        await screen.findByText("search");
        await settle();

        expect(runs).toBeLessThan(5);
    });
});
