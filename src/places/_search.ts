import { SearchSchemaInput } from "@tanstack/solid-router";

import { allPlaceKinds, PlaceKind } from "../_models/Place";

/*
   One screen for the place tree, whoever is looking at it.

   Administering a place - choosing the photograph that represents it, merging a
   duplicate, moving one the geocoder filed wrongly - used to be a parallel screen
   under /admin/places. It was the same drill-down with three more buttons, and
   keeping the two apart cost a duplicate copy of the browse and dropped the
   primary nav highlight every time an admin crossed between them.

   So the actions live here instead, behind an edit mode an admin turns on. The
   mode is in the query string rather than in a signal for the same reason the
   level is in the path: it survives a reload, it can be handed to another tab,
   and drilling deeper keeps it. Non-admins can type it, and it does nothing for
   them - every write behind it is refused by the API and by the database
   regardless.
*/
export interface PlacesSearch {
    // a search across the whole tree
    q?: string;
    // only countries, states or cities
    kind?: PlaceKind;
    edit?: boolean;
}

// `edit=1` is what the address said before it was typed, so old links still work
export const validatePlacesSearch = (search: PlacesSearch & SearchSchemaInput): PlacesSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw = search as unknown as Record<string, unknown>;
    const result: PlacesSearch = {};
    const q = typeof raw.q === "string" ? raw.q.trim() : "";
    const kind = allPlaceKinds.find(k => k.id === raw.kind)?.id;

    if (q) {
        result.q = q;
    }

    if (kind) {
        result.kind = kind;
    }

    if (raw.edit === true || raw.edit === "true" || raw.edit === "1" || raw.edit === 1) {
        result.edit = true;
    }

    return result;
};
