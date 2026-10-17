import { linkOptions } from "@tanstack/solid-router";

import { MediaView, MediaViewBulkEdit, MediaViewGrid, MediaViewMap } from "../_models/MediaView";
import { MediaViewRoute } from "../_models/MediaViewRoute";
import { categoryBulkEditRoute, categoryGridRoute, categoryMapRoute } from "./_routeTree";

// the views of one category, as a toolbar offers them - the routes are in _routeTree.tsx

export const gridView: MediaViewRoute = {
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid
};

export const mapView: MediaViewRoute = {
    icon: "icon-[ic--round-map]",
    name: "Map",
    tooltip: "Map View",
    mediaView: MediaViewMap
};

export const bulkEditView: MediaViewRoute = {
    icon: "icon-[ic--round-collections]",
    name: "Bulk Edit",
    tooltip: "Bulk Edit View",
    mediaView: MediaViewBulkEdit
};

/*
   A view of a category, optionally open on one of its photos - typed, so a
   view that does not exist, or a category address missing its year, fails to
   compile. Bulk edit works on the whole category, so it takes no photo.
*/
export const categoryViewLink = (
    view: MediaView,
    categoryYear: string,
    categorySlug: string,
    mediaSlug?: string
) => {
    const params = { categoryYear, categorySlug, mediaSlug };

    switch (view) {
        case MediaViewMap:
            return linkOptions({
                to: categoryMapRoute.to,
                params
            });
        case MediaViewBulkEdit:
            return linkOptions({
                to: categoryBulkEditRoute.to,
                params: { categoryYear, categorySlug }
            });
        default:
            return linkOptions({
                to: categoryGridRoute.to,
                params
            });
    }
};
