import { linkOptions } from "@tanstack/solid-router";

import { Media } from "../_models/Media";
import { MediaViewGrid } from "../_models/MediaView";
import { MediaViewRoute } from "../_models/MediaViewRoute";
import { RouteDisplay } from "../_models/RouteDisplay";
import { randomGridRoute } from "./_routeTree";

// how the random stack shows up in navigation - the routes are in _routeTree.tsx

export const random: RouteDisplay = {
    icon: "icon-[ic--round-shuffle]",
    name: "Random",
    helpText: "Play though an unending list of random photos."
};

export const gridView: MediaViewRoute = {
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid
};

/*
   The stack, optionally open on one photo. Random media spans every category,
   so a photo is addressed by its category's year and slug as well as its own.
*/
export const randomGridLink = (media?: Media) =>
    linkOptions({
        to: randomGridRoute.to,
        params: media
            ? {
                  categoryYear: String(media.categoryYear),
                  categorySlug: media.categorySlug,
                  mediaSlug: media.slug
              }
            : {}
    });
