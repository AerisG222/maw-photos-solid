import { cleanup, render, screen } from "@solidjs/testing-library";
import { createRenderEffect, For, JSX, Suspense } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { afterEach, describe, expect, test } from "vitest";

import { useInfiniteQuery, useQuery } from "./_queries";

/*
   Reading a query's data never suspends the page.

   The router wraps every route in a <Suspense>, and Solid Query's `data` is a
   resource underneath - one that goes back to "loading" on every update. A
   screen that mounted on cached data, the way every route loader leaves it,
   suspended on its first update: the whole page swapped for the router's
   pending view and back, and a category's grid flashed on the first favorite
   after loading it.
*/

interface Photo {
    id: string;
    isFavorite: boolean;
}

const photos: Photo[] = [
    { id: "a", isFavorite: false },
    { id: "b", isFavorite: false }
];

const settle = () => new Promise(resolve => setTimeout(resolve, 20));

const mount = (list: () => JSX.Element) => {
    const events: string[] = [];

    const Fallback = () => {
        createRenderEffect(() => events.push("suspended"));

        return <p>loading</p>;
    };

    return {
        events,
        render: (client: QueryClient) =>
            render(() => (
                <QueryClientProvider client={client}>
                    <Suspense fallback={<Fallback />}>{list()}</Suspense>
                </QueryClientProvider>
            ))
    };
};

const favorite = (items: Photo[], id: string) =>
    items.map(item => (item.id === id ? { ...item, isFavorite: true } : item));

afterEach(cleanup);

describe("a query's data", () => {
    test("does not suspend on the first update after mounting on cached data", async () => {
        const client = new QueryClient();
        const queryKey = ["media"];
        const queryFn = () => Promise.resolve(photos);
        let built = 0;

        // what a route loader does before the screen exists
        await client.prefetchQuery({ queryKey, queryFn });

        const { events, render } = mount(() => {
            const query = useQuery(() => ({ queryKey, queryFn, staleTime: Infinity }));

            return (
                <For each={query.isSuccess ? query.data : []}>
                    {photo => {
                        built++;
                        events.push(`built ${photo.id} favorite=${photo.isFavorite}`);

                        return <span data-testid="photo">{photo.id}</span>;
                    }}
                </For>
            );
        });

        render(client);
        await screen.findAllByTestId("photo");
        await settle();

        client.setQueryData<Photo[]>(queryKey, prev => favorite(prev!, "a"));
        await settle();

        expect(events).not.toContain("suspended");
        // still reactive: the favorited photo is drawn again, and only it
        expect(events).toContain("built a favorite=true");
        expect(built).toBe(3);
    });

    test("nor does an infinite query's", async () => {
        const client = new QueryClient();
        const queryKey = ["feed"];
        const queryFn = () => Promise.resolve(photos);

        await client.prefetchInfiniteQuery({ queryKey, queryFn, initialPageParam: 0 });

        const { events, render } = mount(() => {
            const query = useInfiniteQuery(() => ({
                queryKey,
                queryFn,
                staleTime: Infinity,
                initialPageParam: 0,
                getNextPageParam: () => undefined
            }));

            return (
                <For each={query.isSuccess ? query.data.pages.flat() : []}>
                    {photo => {
                        events.push(`built ${photo.id} favorite=${photo.isFavorite}`);

                        return <span data-testid="photo">{photo.id}</span>;
                    }}
                </For>
            );
        });

        render(client);
        await screen.findAllByTestId("photo");
        await settle();

        client.setQueryData<{ pages: Photo[][]; pageParams: unknown[] }>(queryKey, prev => ({
            ...prev!,
            pages: prev!.pages.map(page => favorite(page, "b"))
        }));
        await settle();

        expect(events).not.toContain("suspended");
        expect(events).toContain("built b favorite=true");
    });

    test("is undefined, not a suspension, before it arrives", async () => {
        const client = new QueryClient();
        let resolveFetch!: (value: Photo[]) => void;
        const seen: unknown[] = [];

        const { events, render } = mount(() => {
            const query = useQuery(() => ({
                queryKey: ["slow"],
                queryFn: () => new Promise<Photo[]>(resolve => (resolveFetch = resolve))
            }));

            // read unguarded on purpose - the read Solid Query would suspend
            createRenderEffect(() => seen.push(query.data));

            return <p data-testid="ready">ready</p>;
        });

        render(client);
        await screen.findByTestId("ready");
        resolveFetch(photos);
        await settle();

        expect(events).not.toContain("suspended");
        expect(seen[0]).toBeUndefined();
        expect(seen.at(-1)).toEqual(photos);
    });
});
