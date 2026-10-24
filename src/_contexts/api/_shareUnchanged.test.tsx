import { render, screen } from "@solidjs/testing-library";
import { For } from "solid-js";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/solid-query";
import { describe, expect, test } from "vitest";

import { shareUnchanged } from "./_shareUnchanged";

describe("keeping what a refetch did not change", () => {
    test("the same data comes back as the same objects", () => {
        const prev = [
            { id: "a", tags: ["x"] },
            { id: "b", tags: [] }
        ];
        const next = structuredClone(prev);

        expect(shareUnchanged(prev, next)).toBe(prev);
    });

    test("a changed item is new, and the rest are kept", () => {
        const prev = [
            { id: "a", isFavorite: false },
            { id: "b", isFavorite: false }
        ];
        const result = shareUnchanged(prev, [
            { id: "a", isFavorite: true },
            { id: "b", isFavorite: false }
        ]);

        expect(result).not.toBe(prev);
        expect(result[0]).toEqual({ id: "a", isFavorite: true });
        expect(result[1]).toBe(prev[1]);
    });

    // TanStack's own sharing treats any Date as changed, which kept every category new
    test("a date at the same instant is unchanged", () => {
        const prev = [{ id: "a", effectiveDate: new Date(2024, 5, 1) }];

        expect(shareUnchanged(prev, [{ id: "a", effectiveDate: new Date(2024, 5, 1) }])).toBe(prev);
        expect(shareUnchanged(prev, [{ id: "a", effectiveDate: new Date(2024, 5, 2) }])).not.toBe(
            prev
        );
    });

    // a photo added at the front shifts every other one along
    test("items with ids are matched by id, not position", () => {
        const prev = [{ id: "a" }, { id: "b" }];
        const result = shareUnchanged(prev, [{ id: "new" }, { id: "a" }, { id: "b" }]);

        expect(result[1]).toBe(prev[0]);
        expect(result[2]).toBe(prev[1]);
    });

    test("an added or removed property is a change", () => {
        const prev: Record<string, unknown> = { id: "a", note: "x" };

        expect(shareUnchanged(prev, { id: "a" })).not.toBe(prev);
        expect(shareUnchanged(prev, { ...prev, extra: 1 })).not.toBe(prev);
    });

    test("the first load is taken as it is", () => {
        const next = [{ id: "a" }];

        expect(shareUnchanged(undefined, next)).toBe(next);
    });

    /*
       The bug this exists for, end to end. Solid Query turns TanStack's
       structural sharing off, so a refetch of identical data handed back new
       objects and a reference-keyed <For> rebuilt every tile - a whole grid
       flashing whenever a hover preloaded a route and refreshed the list.
    */
    test("a refetch of identical data rebuilds nothing", async () => {
        const client = new QueryClient({
            defaultOptions: { queries: { reconcile: shareUnchanged } }
        });
        const queryFn = () =>
            Promise.resolve([
                { id: "a", effectiveDate: new Date(2020, 0, 1) },
                { id: "b", effectiveDate: new Date(2021, 0, 1) }
            ]);
        let built = 0;

        const List = () => {
            const query = useQuery(() => ({ queryKey: ["media"], queryFn }));

            return (
                <For each={query.isSuccess ? query.data : []}>
                    {item => {
                        built++;

                        return <span data-testid="tile">{item.id}</span>;
                    }}
                </For>
            );
        };

        render(() => (
            <QueryClientProvider client={client}>
                <List />
            </QueryClientProvider>
        ));

        await screen.findAllByTestId("tile");
        expect(built).toBe(2);

        await client.refetchQueries({ queryKey: ["media"] });
        await new Promise(resolve => setTimeout(resolve, 20));

        expect(built).toBe(2);
    });
});
