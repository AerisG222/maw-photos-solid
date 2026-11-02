import type { CategoryFilters } from "../../categories/_search";
import { CategoryViewModeIdType, defaultCategoryViewMode } from "../../_models/CategoryViewMode";
import { InspectorCardIdType, defaultInspectorCards } from "../../_models/InspectorCard";
import { MapTypeIdType, defaultMapType } from "../../_models/MapType";
import { MapZoomLevelIdType, defaultMapZoomLevel } from "../../_models/MapZoomLevel";
import type { MediaFilters } from "../../_models/MediaFilters";
import { MediaView, defaultMediaView } from "../../_models/MediaView";
import { PersonSortIdType, defaultPersonSort } from "../../_models/PersonSort";
import { ThemeIdType, defaultTheme } from "../../_models/Theme";
import { defaultSearchHistoryCount } from "../../_models/SearchHistoryCount";

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

// each listing of cards decides for itself; a feed's is its list of categories
export type LabelArea =
    "categories" | "search" | "people" | "personFeeds" | "places" | "placeFeeds";

// how listings present their items
export interface ListingSettingsState {
    // titles, years, names and media counts, a choice for each area
    readonly labels: Readonly<Record<LabelArea, boolean>>;
    readonly highlightFaces: boolean;
    readonly peopleSort: PersonSortIdType;
}

export const defaultListingSettings: ListingSettingsState = {
    labels: {
        categories: true,
        search: true,
        people: true,
        personFeeds: true,
        places: true,
        placeFeeds: true
    },
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
    // a line through the photos in order - for a trip, the route taken
    readonly mapShowPath: boolean;
    readonly inspectorOpen: boolean;
    readonly inspectorCards: InspectorCardIdType[];
}

export const defaultMediaSettings: MediaSettingsState = {
    view: defaultMediaView,
    slideshowSeconds: 2,
    mapType: defaultMapType,
    mapZoom: defaultMapZoomLevel,
    // off: most categories are not a journey, and their path would only scribble
    mapShowPath: false,
    inspectorOpen: false,
    inspectorCards: defaultInspectorCards
};

export type FeedListing = "media" | "categories";

// where you were in an area, and what you had it filtered to
export interface AreaSettingsState {
    readonly categoriesView: CategoryViewModeIdType;
    readonly searchView: CategoryViewModeIdType;
    // a clan is browsed like a person, so they share; a place is its own area
    readonly personFeedListing: FeedListing;
    readonly placeFeedListing: FeedListing;
    // kept rather than left to the url alone; `?year=` still wins when present
    readonly categoryYearFilter: number | "all";
    // the same goes for these: each section opens with them, unless the address
    // goes straight to a page, which shows just what the address says
    readonly categoriesFilters: CategoryFilters;
    readonly categoryMediaFilters: MediaFilters;
    readonly peopleFavoritesOnly: boolean;
    readonly personFeedFilters: MediaFilters;
    readonly placeFeedFilters: MediaFilters;
    readonly searchFilters: MediaFilters;
    // how many recent search terms to keep
    readonly searchHistoryCount: number;
}

export const defaultAreaSettings: AreaSettingsState = {
    categoriesView: defaultCategoryViewMode,
    searchView: defaultCategoryViewMode,
    personFeedListing: "media",
    placeFeedListing: "media",
    categoryYearFilter: "all",
    categoriesFilters: {},
    categoryMediaFilters: {},
    peopleFavoritesOnly: false,
    personFeedFilters: {},
    placeFeedFilters: {},
    searchFilters: {},
    searchHistoryCount: defaultSearchHistoryCount
};
