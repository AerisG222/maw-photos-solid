import { Uuid } from "../../_models/Uuid";

/*
   Rewrite a single entry of a cached list in place.

   Solid's <For> keys on object reference, so any item handed back as a new
   object has its DOM rebuilt. Refetching a list after a one-field change
   replaced every object and therefore every tile; patching instead replaces
   only the entry that changed.

   Returns the original array untouched when nothing matched, so callers can
   compare by reference and skip writing to caches that were unaffected - which
   in turn keeps their subscribers from re-rendering at all.
*/
export const patchById = <T extends { id: Uuid }>(
    items: T[],
    id: Uuid,
    changes: Partial<T>
): T[] => {
    const idx = items.findIndex(item => item.id === id);

    if (idx < 0) {
        return items;
    }

    const next = items.slice();
    next[idx] = { ...next[idx], ...changes };

    return next;
};
