import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { Uuid } from "../_models/Uuid";

/*
   Administering the places media was taken - the tree the geocoder derived, and
   the photograph chosen to represent each node of it.

   Under /admin rather than at /places because it is not a way of browsing the
   library: everything here is gated on being an administrator, and the plain
   place browse - when it lands - wants the shorter path.
*/
const basePath = "/admin/places";

export const placesBrowse: AppRouteDefinition = {
    name: "Places",
    // the place being administered lives in the path rather than in a signal, so
    // a link to one level of the tree can be shared and reloaded. Optional: with
    // nothing there the page lists the countries, which is the root of the tree
    path: "/:placeId?",
    absolutePath: basePath,
    component: lazy(() => import("./Places"))
};

export const places: AppRouteDefinition = {
    icon: "icon-[ic--round-place]",
    name: "Places",
    tooltip: "Administer Places",
    helpText:
        "Administer the places your photos and videos were taken, and choose the photograph that represents each one.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [placesBrowse]
};

export const getPlaceAdminPath = (id?: Uuid) => (id ? `${basePath}/${id}` : basePath);
