import { CategoryViewModeIdType, defaultCategoryViewMode } from "../../_models/CategoryViewMode";
import { InspectorCardIdType, defaultInspectorCards } from "../../_models/InspectorCard";
import { MapTypeIdType, defaultMapType } from "../../_models/MapType";
import { MapZoomLevelIdType, defaultMapZoomLevel } from "../../_models/MapZoomLevel";
import { MediaView, defaultMediaView } from "../../_models/MediaView";
import { PersonSortIdType, defaultPersonSort } from "../../_models/PersonSort";
import { ThemeIdType, defaultTheme } from "../../_models/Theme";

/*
   The four shapes the application keeps, declared here rather than beside their
   providers so `_migrate.ts` can build them without importing a context and
   creating a cycle.
*/

export interface AppSettingsState {
    readonly theme: ThemeIdType;
    readonly navExpanded: boolean;
    readonly showToolbarLabels: boolean;
}

export const defaultAppSettings: AppSettingsState = {
    theme: defaultTheme,
    navExpanded: true,
    showToolbarLabels: false
};

/*
   How every listing presents its items - categories, search results, people,
   places and media alike. One store, so a preference set while browsing one
   follows you into the next.
*/
export interface ListingSettingsState {
    // titles, years, names and media counts - all of them answer "do I want
    // text under the picture", so there is one control rather than four
    readonly showLabels: boolean;
    readonly highlightFaces: boolean;
    readonly peopleSort: PersonSortIdType;
}

export const defaultListingSettings: ListingSettingsState = {
    showLabels: true,
    highlightFaces: false,
    peopleSort: defaultPersonSort
};

// looking at a single item, rather than at a listing of them
export interface MediaSettingsState {
    readonly view: MediaView;
    readonly slideshowSeconds: number;
    // one map preference, read by the map view and the inspector's minimap card
    readonly mapType: MapTypeIdType;
    readonly mapZoom: MapZoomLevelIdType;
    readonly inspectorOpen: boolean;
    readonly inspectorCards: InspectorCardIdType[];
}

export const defaultMediaSettings: MediaSettingsState = {
    view: defaultMediaView,
    slideshowSeconds: 2,
    mapType: defaultMapType,
    mapZoom: defaultMapZoomLevel,
    inspectorOpen: false,
    inspectorCards: defaultInspectorCards
};

// where you were in an area, and what you had it filtered to
export interface AreaSettingsState {
    readonly categoriesView: CategoryViewModeIdType;
    readonly searchView: CategoryViewModeIdType;
    readonly feedListing: "media" | "categories";
    // kept rather than left to the url alone; `?year=` still wins when present
    readonly categoryYearFilter: number | "all";
    readonly categoryMissingGpsFilter: boolean;
    readonly feedFavoritesOnly: boolean;
    readonly feedShuffle: boolean;
}

export const defaultAreaSettings: AreaSettingsState = {
    categoriesView: defaultCategoryViewMode,
    searchView: defaultCategoryViewMode,
    feedListing: "media",
    categoryYearFilter: "all",
    categoryMissingGpsFilter: false,
    feedFavoritesOnly: false,
    feedShuffle: false
};
