import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { Uuid } from "../_models/Uuid";

/*
   Two ways into the same tree.

   `/places` is the browse - anyone signed in drills from countries to states to
   cities and then into the photographs taken there. `/admin/places` is the same
   tree with the corrections attached: choosing the photograph that represents a
   place, merging a duplicate, moving one the geocoder filed wrongly.

   They are separate paths rather than one screen with an edit mode because the
   admin one is gated: every write behind it is refused for everybody else, so a
   non-admin who reached it would see a tree they could read and nothing they
   could change.
*/
const basePath = "/places";
const adminBasePath = "/admin/places";

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
    helpText: "Browse photos and videos by where in the world they were taken.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [placeBrowse]
};

export const placesAdminBrowse: AppRouteDefinition = {
    name: "Places",
    path: "/:placeId?",
    absolutePath: adminBasePath,
    component: lazy(() => import("./Admin"))
};

/*
   Carries no icon, unlike every other top level route, and that is deliberate on
   two counts: it is reached from the browse toolbar rather than from the primary
   nav, and the help page lists exactly the routes that have one - where a second
   "Places" entry would describe a screen most readers cannot open.
*/
export const placesAdmin: AppRouteDefinition = {
    name: "Places Administration",
    path: adminBasePath,
    absolutePath: adminBasePath,
    component: lazy(() => import("./AdminLayout")),
    children: [placesAdminBrowse]
};

export const getPlacePath = (id?: Uuid) => (id ? `${basePath}/${id}` : basePath);

export const getPlaceAdminPath = (id?: Uuid) => (id ? `${adminBasePath}/${id}` : adminBasePath);
