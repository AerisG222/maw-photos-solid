import {
    useInfiniteQuery as solidUseInfiniteQuery,
    useQuery as solidUseQuery
} from "@tanstack/solid-query";

/*
   Solid Query's `useQuery` and `useInfiniteQuery`, with `data` read from the
   store rather than the resource. Every query in the application is made
   through these - see the contexts in this folder.

   A result's `data` is backed by a Solid resource, and reading a resource
   while it is loading suspends the nearest <Suspense>. Nothing here uses
   Suspense on purpose - every screen shows its own loading state - but the
   router wraps each route in one, so a suspension swaps the whole page for its
   pending view and back. And Solid Query puts its resource back into "loading"
   on every update, even one that only patches the cache:

   `data` reads the resource itself until the first load has settled, and the
   subscription that read leaves behind outlives it. So the first update after
   a screen mounts on cached data - a favorite, or the refetch a hover preload
   starts once the data is stale - suspended the page once. The grid flashed
   on the first favorite of every page load.

   An `isSuccess` guard does not help: the read that suspends is Solid Query's
   own, behind `data`.

   The same value is held in the result's store, where it is just as reactive.
   Read through the store's own property getter, it never touches the
   resource. Undefined until there is data, exactly as `data` reads - and
   still never a suspension.

   `useQueries` is left as it is. Its results sit in a second store, which this
   cannot see past without crossing the two, and it was not found suspending.
*/

/*
   The descriptor is asked of the result itself. It has no trap of its own for
   that, so the question passes to the store beneath it, which answers with a
   getter that reads - and tracks - the store's own value.
*/
const readFromStore = (result: object): unknown => {
    const descriptor = Object.getOwnPropertyDescriptor(result, "data");

    return descriptor?.get ? descriptor.get() : descriptor?.value;
};

const withStoreData = <T extends object>(result: T): T =>
    new Proxy(result, {
        get: (target, property, receiver) =>
            property === "data" ? readFromStore(target) : Reflect.get(target, property, receiver)
    });

export const useQuery = ((...args: Parameters<typeof solidUseQuery>) =>
    withStoreData(solidUseQuery(...args))) as typeof solidUseQuery;

export const useInfiniteQuery = ((...args: Parameters<typeof solidUseInfiniteQuery>) =>
    withStoreData(solidUseInfiniteQuery(...args))) as typeof solidUseInfiniteQuery;
