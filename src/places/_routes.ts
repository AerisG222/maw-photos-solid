import { linkOptions } from "@tanstack/solid-router";

import { RouteDisplay } from "../_models/RouteDisplay";
import { Uuid } from "../_models/Uuid";
import { placesRoute } from "./_routeTree";

// how the places area shows up in navigation - the routes are in _routeTree.tsx

export const places: RouteDisplay = {
    icon: "icon-[ic--round-place]",
    name: "Places",
    helpText: "Browse photos and videos by where in the world they were taken."
};

/*
   A level of the tree - or its root, with no id - carrying the edit mode when
   it is on. Everything that moves around the tree builds its links through
   here - the tiles, the breadcrumb, the toolbar - so an admin who turned
   editing on stays in it while drilling, and a plain browse never accidentally
   offers it.
*/
export const placeLink = (id?: Uuid, editing = false) =>
    linkOptions({
        to: placesRoute.to,
        params: { placeId: id },
        search: editing ? { edit: true } : {}
    });
