import { DensityIdType, getDensityForThumbnailSize } from "../../_models/Density";
import {
    InspectorCardComments,
    InspectorCardCategoryTeaser,
    InspectorCardEffects,
    InspectorCardExif,
    InspectorCardHistogram,
    InspectorCardIdType,
    InspectorCardMetadata,
    InspectorCardMinimap,
    InspectorCardPlaceCovers
} from "../../_models/InspectorCard";
import { MediaViewAll } from "../../_models/MediaView";
import { ThemeDark, ThemeIdType, ThemeLight, ThemeSystem } from "../../_models/Theme";
import { ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import {
    AppSettingsState,
    AreaSettingsState,
    ListingSettingsState,
    MediaSettingsState,
    defaultAppSettings,
    defaultAreaSettings,
    defaultListingSettings,
    defaultMediaSettings
} from "./_state";
import {
    KEY_SETTINGS_APP,
    KEY_SETTINGS_CATEGORY_FILTER,
    KEY_SETTINGS_CATEGORY_PAGE,
    KEY_SETTINGS_CATEGORY_VIEW_GRID,
    KEY_SETTINGS_CATEGORY_VIEW_LIST,
    KEY_SETTINGS_FACE_FEED,
    KEY_SETTINGS_FEED_VIEW_CATEGORY,
    KEY_SETTINGS_MEDIA_INFO_PANEL,
    KEY_SETTINGS_MEDIA_PAGE,
    KEY_SETTINGS_MEDIA_VIEW_DETAIL,
    KEY_SETTINGS_MEDIA_VIEW_FULLSCREEN,
    KEY_SETTINGS_MEDIA_VIEW_GRID,
    KEY_SETTINGS_MEDIA_VIEW_MAP,
    KEY_SETTINGS_PEOPLE_VIEW_GRID,
    KEY_SETTINGS_SEARCH_PAGE,
    KEY_SETTINGS_SEARCH_VIEW_GRID,
    KEY_SETTINGS_SEARCH_VIEW_LIST,
    KEY_SETTINGS_V2_APP,
    KEY_SETTINGS_V2_AREA,
    KEY_SETTINGS_V2_LISTING,
    KEY_SETTINGS_V2_MEDIA,
    KEY_SETTINGS_V2_MIGRATED,
    loadJson,
    saveJson
} from "./_storage";

type LegacyRecord = Record<string, unknown>;

// reads one legacy key; anything unparseable or absent reads as empty
export type LegacyReader = (key: string) => LegacyRecord;

export interface MigratedSettings {
    readonly app: AppSettingsState;
    readonly listing: ListingSettingsState;
    readonly media: MediaSettingsState;
    readonly area: AreaSettingsState;
}

const bool = (value: unknown) => (typeof value === "boolean" ? value : undefined);
const num = (value: unknown) => (typeof value === "number" ? value : undefined);
const str = (value: unknown) => (typeof value === "string" ? value : undefined);

/*
   The non-default choice wins.

   Every one of these flags shipped with the same default in each of the stores
   it lived in, so the only thing a stored value can tell us is whether someone
   went and changed it. `anyTrue` is for flags that ship off - having switched
   badges on anywhere means you want badges. `anyFalse` is for flags that ship
   on, like thumbnail dimming, where the deliberate act was turning it off.
*/
const anyTrue = (values: (boolean | undefined)[]) => values.some(v => v === true);
const anyFalse = (values: (boolean | undefined)[]) => !values.some(v => v === false);

const migrateView = (stored: string | undefined): MediaSettingsState["view"] =>
    stored && (MediaViewAll as string[]).includes(stored)
        ? (stored as MediaSettingsState["view"])
        : defaultMediaSettings.view;

const migrateTheme = (stored: unknown): ThemeIdType => {
    /*
       An explicit choice is kept. Anything else - never chosen, or the legacy
       "dusk" - becomes `system`, because in both cases the reader never said.
    */
    if (stored === ThemeLight || stored === ThemeDark) {
        return stored;
    }

    return ThemeSystem;
};

const migrateDensity = (grid: unknown, categoryGrid: unknown): DensityIdType => {
    const size = (str(grid) ?? str(categoryGrid)) as ThumbnailSizeIdType | undefined;

    return size ? getDensityForThumbnailSize(size) : defaultListingSettings.density;
};

const migrateInspectorCards = (panel: LegacyRecord): InspectorCardIdType[] => {
    // declaration order in the old sidebar, so the rail keeps its arrangement
    const flags: [unknown, InspectorCardIdType][] = [
        [panel.showComments, InspectorCardComments],
        [panel.showExif, InspectorCardExif],
        [panel.showEffects, InspectorCardEffects],
        [panel.showHistogram, InspectorCardHistogram],
        [panel.showMinimap, InspectorCardMinimap],
        [panel.showMetadataEditor, InspectorCardMetadata],
        [panel.showCategoryTeaserChooser, InspectorCardCategoryTeaser],
        [panel.showPlaceCovers, InspectorCardPlaceCovers]
    ];

    const cards = flags.filter(([on]) => on === true).map(([, id]) => id);

    // nothing stored at all means nothing to carry across, not an empty panel
    return cards.length > 0 || Object.keys(panel).length > 0
        ? cards
        : defaultMediaSettings.inspectorCards;
};

export const buildMigratedSettings = (read: LegacyReader): MigratedSettings => {
    const app = read(KEY_SETTINGS_APP);
    const categoryFilter = read(KEY_SETTINGS_CATEGORY_FILTER);
    const categoryPage = read(KEY_SETTINGS_CATEGORY_PAGE);
    const categoryGrid = read(KEY_SETTINGS_CATEGORY_VIEW_GRID);
    const categoryList = read(KEY_SETTINGS_CATEGORY_VIEW_LIST);
    const faceFeed = read(KEY_SETTINGS_FACE_FEED);
    const feedCategory = read(KEY_SETTINGS_FEED_VIEW_CATEGORY);
    const infoPanel = read(KEY_SETTINGS_MEDIA_INFO_PANEL);
    const mediaPage = read(KEY_SETTINGS_MEDIA_PAGE);
    const mediaDetail = read(KEY_SETTINGS_MEDIA_VIEW_DETAIL);
    const mediaFullscreen = read(KEY_SETTINGS_MEDIA_VIEW_FULLSCREEN);
    const mediaGrid = read(KEY_SETTINGS_MEDIA_VIEW_GRID);
    const mediaMap = read(KEY_SETTINGS_MEDIA_VIEW_MAP);
    const peopleGrid = read(KEY_SETTINGS_PEOPLE_VIEW_GRID);
    const searchPage = read(KEY_SETTINGS_SEARCH_PAGE);
    const searchGrid = read(KEY_SETTINGS_SEARCH_VIEW_GRID);
    const searchList = read(KEY_SETTINGS_SEARCH_VIEW_LIST);

    return {
        app: {
            theme: migrateTheme(app.theme),
            navExpanded:
                bool(app.isPrimaryNavCollapsed) === undefined
                    ? defaultAppSettings.navExpanded
                    : !app.isPrimaryNavCollapsed,
            /*
               `showToolbarLabels` was named `isToolbarCollapsed`, backwards -
               labels appeared when it was true. The value was always right, so
               either name carries across unchanged.
            */
            showToolbarLabels:
                bool(app.showToolbarLabels) ??
                bool(app.isToolbarCollapsed) ??
                defaultAppSettings.showToolbarLabels
        },
        listing: {
            density: migrateDensity(mediaGrid.thumbnailSize, categoryGrid.thumbnailSize),
            showLabels: anyFalse([
                bool(categoryGrid.showTitles),
                bool(searchGrid.showTitles),
                bool(feedCategory.showTitles),
                bool(searchGrid.showYears),
                bool(feedCategory.showYears),
                bool(peopleGrid.showNames),
                bool(peopleGrid.showMediaCounts)
            ]),
            /*
               Not carried across, deliberately. Both badge flags shipped off,
               so the only thing anyone could have expressed was turning them
               on - there is no "off" preference to preserve. They are on for
               everyone now: the favourite heart is the only way to favourite a
               photograph, and it was invisible until you found the toolbar
               button that revealed it.
            */
            showBadges: defaultListingSettings.showBadges,
            dimThumbnails: anyFalse([
                bool(mediaGrid.dimThumbnails),
                bool(mediaDetail.dimThumbnails),
                bool(categoryGrid.dimThumbnails),
                bool(categoryList.dimThumbnails),
                bool(searchGrid.dimThumbnails),
                bool(searchList.dimThumbnails),
                bool(feedCategory.dimThumbnails),
                bool(peopleGrid.dimThumbnails)
            ]),
            highlightFaces: anyTrue([
                bool(mediaGrid.highlightFaces),
                bool(mediaDetail.highlightFaces),
                bool(mediaFullscreen.highlightFaces)
            ]),
            peopleSort:
                (str(peopleGrid.sortBy) as ListingSettingsState["peopleSort"] | undefined) ??
                defaultListingSettings.peopleSort
        },
        media: {
            // "detail" was a view once; it redirects to the grid now
            view: migrateView(str(mediaPage.view)),
            slideshowSeconds:
                num(mediaPage.slideshowDisplayDurationSeconds) ??
                defaultMediaSettings.slideshowSeconds,
            // the info panel kept a second copy of both; the map view's wins
            mapType: str(mediaMap.mapType) ?? defaultMediaSettings.mapType,
            mapZoom: num(mediaMap.zoom) ?? defaultMediaSettings.mapZoom,
            inspectorOpen: bool(infoPanel.expandInfoPanel) ?? defaultMediaSettings.inspectorOpen,
            inspectorCards: migrateInspectorCards(infoPanel)
        },
        area: {
            categoriesView: str(categoryPage.viewMode) ?? defaultAreaSettings.categoriesView,
            searchView: str(searchPage.viewMode) ?? defaultAreaSettings.searchView,
            feedListing: faceFeed.showCategories === true ? "categories" : "media",
            categoryYearFilter:
                num(categoryFilter.yearFilter) ??
                (categoryFilter.yearFilter === "all"
                    ? "all"
                    : defaultAreaSettings.categoryYearFilter),
            categoryMissingGpsFilter:
                bool(categoryFilter.missingGpsFilter) ??
                defaultAreaSettings.categoryMissingGpsFilter,
            feedFavoritesOnly:
                bool(faceFeed.favoritesOnly) ?? defaultAreaSettings.feedFavoritesOnly,
            feedShuffle: bool(faceFeed.shuffle) ?? defaultAreaSettings.feedShuffle
        }
    };
};

const readFromStorage: LegacyReader = key => loadJson<LegacyRecord>(key, {});

/*
   Runs once. The legacy keys are read and left alone - rolling back to the
   previous build finds a reader's preferences exactly where it expects them.
*/
export const migrateSettings = () => {
    if (loadJson<boolean>(KEY_SETTINGS_V2_MIGRATED, false)) {
        return;
    }

    const migrated = buildMigratedSettings(readFromStorage);

    saveJson(KEY_SETTINGS_V2_APP, migrated.app);
    saveJson(KEY_SETTINGS_V2_LISTING, migrated.listing);
    saveJson(KEY_SETTINGS_V2_MEDIA, migrated.media);
    saveJson(KEY_SETTINGS_V2_AREA, migrated.area);
    saveJson(KEY_SETTINGS_V2_MIGRATED, true);
};

/*
   Load one of the four stores, running the migration first if it has not run.

   Defaults are merged under whatever was stored: `loadJson` returns the parsed
   record as-is, so a store written before a field existed would otherwise read
   that field as undefined rather than as its default.
*/
export const loadMigrated = <T extends object>(key: string, def: T): T => {
    migrateSettings();

    return { ...def, ...loadJson<Partial<T>>(key, {}) };
};
