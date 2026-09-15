import { describe, expect, test } from "vitest";

import {
    InspectorCardComments,
    InspectorCardExif,
    InspectorCardMinimap
} from "../../_models/InspectorCard";
import { ThemeDark, ThemeLight, ThemeSystem } from "../../_models/Theme";
import { LegacyReader, buildMigratedSettings } from "./_migrate";
import {
    KEY_SETTINGS_APP,
    KEY_SETTINGS_CATEGORY_FILTER,
    KEY_SETTINGS_CATEGORY_PAGE,
    KEY_SETTINGS_CATEGORY_VIEW_GRID,
    KEY_SETTINGS_FACE_FEED,
    KEY_SETTINGS_MEDIA_INFO_PANEL,
    KEY_SETTINGS_MEDIA_PAGE,
    KEY_SETTINGS_MEDIA_VIEW_DETAIL,
    KEY_SETTINGS_MEDIA_VIEW_GRID,
    KEY_SETTINGS_MEDIA_VIEW_MAP,
    KEY_SETTINGS_PEOPLE_VIEW_GRID
} from "./_storage";
import { defaultMediaSettings } from "./_state";

const reader =
    (store: Record<string, Record<string, unknown>>): LegacyReader =>
    key =>
        store[key] ?? {};

describe("migrating from the per-view settings", () => {
    test("empty storage yields the defaults", () => {
        const migrated = buildMigratedSettings(reader({}));

        expect(migrated.app.theme).toBe(ThemeSystem);
        expect(migrated.listing.showLabels).toBe(true);
        expect(migrated.media.inspectorCards).toEqual(defaultMediaSettings.inspectorCards);
    });

    test("a theme that was chosen is kept; one that never was follows the system", () => {
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_APP]: { theme: "light" } })).app.theme
        ).toBe(ThemeLight);
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_APP]: { theme: "dark" } })).app.theme
        ).toBe(ThemeDark);
        // the legacy value, which nobody ever picked deliberately
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_APP]: { theme: "dusk" } })).app.theme
        ).toBe(ThemeSystem);
    });

    test("the toolbar label flag carries across under either of its names", () => {
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_APP]: { isToolbarCollapsed: true } })).app
                .showToolbarLabels
        ).toBe(true);
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_APP]: { showToolbarLabels: true } })).app
                .showToolbarLabels
        ).toBe(true);
    });

    test("the primary nav flag is inverted into an expanded one", () => {
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_APP]: { isPrimaryNavCollapsed: true } }))
                .app.navExpanded
        ).toBe(false);
    });

    test("labels turned off anywhere turn off everywhere", () => {
        const migrated = buildMigratedSettings(
            reader({ [KEY_SETTINGS_CATEGORY_VIEW_GRID]: { showTitles: false } })
        );

        expect(migrated.listing.showLabels).toBe(false);
    });

    test("face highlighting is the same, across its three old homes", () => {
        const migrated = buildMigratedSettings(
            reader({ [KEY_SETTINGS_MEDIA_VIEW_DETAIL]: { highlightFaces: true } })
        );

        expect(migrated.listing.highlightFaces).toBe(true);
    });

    test("the open info cards keep the order the sidebar declared them in", () => {
        const migrated = buildMigratedSettings(
            reader({
                [KEY_SETTINGS_MEDIA_INFO_PANEL]: {
                    showMinimap: true,
                    showComments: true,
                    showExif: true,
                    showEffects: false
                }
            })
        );

        expect(migrated.media.inspectorCards).toEqual([
            InspectorCardComments,
            InspectorCardExif,
            InspectorCardMinimap
        ]);
    });

    test("a panel that was stored with every card closed stays closed", () => {
        const migrated = buildMigratedSettings(
            reader({ [KEY_SETTINGS_MEDIA_INFO_PANEL]: { showComments: false } })
        );

        expect(migrated.media.inspectorCards).toEqual([]);
    });

    test("the map view's map wins over the duplicate the info panel kept", () => {
        const migrated = buildMigratedSettings(
            reader({
                [KEY_SETTINGS_MEDIA_VIEW_MAP]: { mapType: "terrain", zoom: 14 },
                [KEY_SETTINGS_MEDIA_INFO_PANEL]: { minimapMapType: "roadmap", minimapZoom: 3 }
            })
        );

        expect(migrated.media.mapType).toBe("terrain");
        expect(migrated.media.mapZoom).toBe(14);
    });

    test("a partial store keeps what it has and defaults the rest", () => {
        const migrated = buildMigratedSettings(
            reader({ [KEY_SETTINGS_MEDIA_PAGE]: { view: "map" } })
        );

        expect(migrated.media.view).toBe("map");
        expect(migrated.media.slideshowSeconds).toBe(defaultMediaSettings.slideshowSeconds);
    });

    test("values of the wrong type are ignored rather than carried across", () => {
        const migrated = buildMigratedSettings(
            reader({
                [KEY_SETTINGS_MEDIA_PAGE]: { slideshowDisplayDurationSeconds: "not a number" },
                [KEY_SETTINGS_MEDIA_VIEW_GRID]: { highlightFaces: "yes" }
            })
        );

        expect(migrated.media.slideshowSeconds).toBe(defaultMediaSettings.slideshowSeconds);
        expect(migrated.listing.highlightFaces).toBe(false);
    });

    test("the year filter survives, as a year or as all", () => {
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_CATEGORY_FILTER]: { yearFilter: 2019 } }))
                .area.categoryYearFilter
        ).toBe(2019);
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_CATEGORY_FILTER]: { yearFilter: "all" } }))
                .area.categoryYearFilter
        ).toBe("all");
    });

    test("a feed that opened on categories still does", () => {
        const migrated = buildMigratedSettings(
            reader({ [KEY_SETTINGS_FACE_FEED]: { showCategories: true, favoritesOnly: true } })
        );

        expect(migrated.area.feedListing).toBe("categories");
        expect(migrated.area.feedFavoritesOnly).toBe(true);
    });

    test("a whole v1 storage migrates in one piece", () => {
        const migrated = buildMigratedSettings(
            reader({
                [KEY_SETTINGS_APP]: {
                    theme: "light",
                    isPrimaryNavCollapsed: true,
                    isToolbarCollapsed: true
                },
                [KEY_SETTINGS_CATEGORY_PAGE]: { viewMode: "list" },
                [KEY_SETTINGS_CATEGORY_VIEW_GRID]: {
                    thumbnailSize: "small",
                    showTitles: true,
                    dimThumbnails: false
                },
                [KEY_SETTINGS_MEDIA_VIEW_GRID]: { thumbnailSize: "small", showTypesBadge: true },
                [KEY_SETTINGS_MEDIA_PAGE]: { view: "grid", slideshowDisplayDurationSeconds: 5 },
                [KEY_SETTINGS_PEOPLE_VIEW_GRID]: { sortBy: "mediaCount" }
            })
        );

        expect(migrated.app).toEqual({
            theme: ThemeLight,
            navExpanded: false,
            showToolbarLabels: true
        });
        expect(migrated.listing.showLabels).toBe(true);
        expect(migrated.listing.peopleSort).toBe("mediaCount");
        expect(migrated.media.slideshowSeconds).toBe(5);
        expect(migrated.area.categoriesView).toBe("list");
    });

    /*
       The detail view was deleted. A reader whose saved view was "detail" would
       otherwise be sent to a route that is now only a redirect, on every visit.
    */
    test("a view that no longer exists falls back to the grid", () => {
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_MEDIA_PAGE]: { view: "detail" } })).media
                .view
        ).toBe("grid");

        /*
           And fullscreen, which went the same way for the same reason: what it
           offered was the absence of the chrome, which is a state the grid can
           be in rather than a place to go.
        */
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_MEDIA_PAGE]: { view: "fullscreen" } }))
                .media.view
        ).toBe("grid");

        // one that still exists is left alone
        expect(
            buildMigratedSettings(reader({ [KEY_SETTINGS_MEDIA_PAGE]: { view: "map" } })).media.view
        ).toBe("map");
    });
});
