import { MediaViewBulkEdit, MediaViewGrid, MediaViewMap } from "../_models/MediaView";
import { MediaViewRoute } from "../_models/MediaViewRoute";

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
