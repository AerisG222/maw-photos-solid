import { unwrap } from "solid-js/store";

/*
   Keep what a refetch did not change.

   TanStack Query normally does this itself - structural sharing - but Solid
   Query switches it off for every query and leaves the job to its `reconcile`
   option, whose default is to do nothing. So every refetch handed back
   brand-new objects even when nothing had changed, and every reference-keyed
   <For> rebuilt everything it drew. Hovering a link preloads its route, which
   refetches anything gone stale - so browsing a grid, or reaching for a heart,
   rebuilt the whole grid and every photograph in it flashed.

   This is TanStack's `replaceEqualDeep` with two differences. A Date is equal
   to another at the same instant - TanStack treats any non-plain object as
   changed, and a category carries its dates, so every category would still
   have been new. And a list of items with ids is matched by id rather than by
   position, so a photo moving in the list keeps its object.
*/

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
    !!value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;

const idOf = (value: unknown) =>
    isPlainObject(value) && (typeof value.id === "string" || typeof value.id === "number")
        ? value.id
        : undefined;

const share = (prev: unknown, next: unknown): unknown => {
    if (prev === next) {
        return prev;
    }

    if (prev instanceof Date && next instanceof Date) {
        return prev.getTime() === next.getTime() ? prev : next;
    }

    if (Array.isArray(prev) && Array.isArray(next)) {
        const byId = new Map<unknown, unknown>();

        for (const item of prev) {
            const id = idOf(item);

            if (id !== undefined) {
                byId.set(id, item);
            }
        }

        const shared = next.map((item: unknown, i) => {
            const id = idOf(item);

            return share(id !== undefined ? byId.get(id) : prev[i], item);
        });

        return shared.length === prev.length && shared.every((item, i) => item === prev[i])
            ? prev
            : shared;
    }

    if (isPlainObject(prev) && isPlainObject(next)) {
        const keys = Object.keys(next);
        let unchanged = keys.length === Object.keys(prev).length;
        const shared: Plain = {};

        for (const key of keys) {
            shared[key] = share(prev[key], next[key]);

            if (shared[key] !== prev[key] || !(key in prev)) {
                unchanged = false;
            }
        }

        return unchanged ? prev : shared;
    }

    return next;
};

/*
   For Solid Query's `reconcile` option, set once for every query - see
   queryClient.ts. What it is handed as the old data is the query's store, so
   that is unwrapped first: the pieces kept are then the very objects the store
   already holds, which are what give each tile the same proxy as before.
*/
export const shareUnchanged = <T>(prev: T | undefined, next: T): T =>
    prev === undefined ? next : (share(unwrap(prev), next) as T);
