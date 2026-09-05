import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { Uuid } from "../_models/Uuid";

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
   and drilling deeper keeps it.
*/
const basePath = "/places";

// non-admins can type it, and it does nothing for them - every write behind it
// is refused by the API and by the database regardless
export const PLACE_EDIT_PARAM = "edit";

export const placeBrowse: AppRouteDefinition = {
    name: "Places",
    // the place being looked at lives in the path rather than in a signal, so a
    // link to one level of the tree can be shared and reloaded. Optional: with
    // nothing there the page lists the countries, which is the root of the tree
    path: "/:placeId?",
    absolutePath: basePath,
    component: lazy(() => import("./Browse"))
};

export const places: AppRouteDefinition = {
    icon: "icon-[ic--round-place]",
    name: "Places",
    helpText:
        "Browse photos and videos by where in the world they were taken.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [placeBrowse]
};

/*
   Where a place lives, carrying the edit mode when it is on.

   Everything that moves around the tree builds its links through here - the
   tiles, the breadcrumb, the toolbar - so an admin who turned editing on stays in
   it while drilling, and a plain browse never accidentally offers it.
*/
export const getPlacePath = (id?: Uuid, editing = false) => {
    const path = id ? `${basePath}/${id}` : basePath;

    return editing ? `${path}?${PLACE_EDIT_PARAM}=1` : path;
};
