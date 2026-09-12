import { render } from "@solidjs/testing-library";
import { beforeEach, describe, expect, test } from "vitest";

import { DensityComfortable, DensityCompact } from "../../_models/Density";
import { AllSettingsProvider } from "./AllSettingsProvider";
import { useCategoryGridViewSettingsContext } from "./CategoryGridViewSettingsContext";
import { useCategoryListViewSettingsContext } from "./CategoryListViewSettingsContext";
import { useListingSettingsContext } from "./ListingSettingsContext";
import { useMediaInfoPanelSettingsContext } from "./MediaInfoPanelSettingsContext";
import { useMediaMapViewSettingsContext } from "./MediaMapViewSettingsContext";
import { usePeopleGridViewSettingsContext } from "./PeopleGridViewSettingsContext";
import { useSearchGridViewSettingsContext } from "./SearchGridViewSettingsContext";

/*
   The adapters present one store through the shapes a dozen screens still
   expect. Typechecking cannot say whether the wiring is right, so this mounts
   the real provider tree and reads and writes through it.
*/
const mount = <T,>(use: () => T): T => {
    let captured!: T;

    const Probe = () => {
        captured = use();

        return <></>;
    };

    render(() => (
        <AllSettingsProvider>
            <Probe />
        </AllSettingsProvider>
    ));

    return captured;
};

describe("the settings adapters", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("one density drives every listing's thumbnail size", () => {
        const probe = mount(() => ({
            listing: useListingSettingsContext(),
            categoryGrid: useCategoryGridViewSettingsContext(),
            categoryList: useCategoryListViewSettingsContext(),
            people: usePeopleGridViewSettingsContext()
        }));

        const [, listingActions] = probe.listing;
        const [categoryGrid] = probe.categoryGrid;
        const [categoryList] = probe.categoryList;
        const [people] = probe.people;

        // a grid and a list read the same density as different sizes
        expect(categoryGrid.thumbnailSize).toBe("default");
        expect(categoryList.thumbnailSize).toBe("verySmall");
        expect(people.thumbnailSize).toBe("default");

        listingActions.setDensity(DensityCompact);

        expect(categoryGrid.thumbnailSize).toBe("small");
        expect(people.thumbnailSize).toBe("small");
    });

    test("a screen writing through its own adapter is seen by the others", () => {
        const probe = mount(() => ({
            categoryGrid: useCategoryGridViewSettingsContext(),
            searchGrid: useSearchGridViewSettingsContext()
        }));

        const [categoryGrid, categoryGridActions] = probe.categoryGrid;
        const [searchGrid] = probe.searchGrid;

        expect(searchGrid.showFavoritesBadge).toBe(true);

        // the whole point of the consolidation: set it here, see it there
        categoryGridActions.setShowFavoritesBadge(false);

        expect(categoryGrid.showFavoritesBadge).toBe(false);
        expect(searchGrid.showFavoritesBadge).toBe(false);
        expect(searchGrid.showTypesBadge).toBe(false);
    });

    test("the old thumbnail-size control cycles the density, and wraps", () => {
        const probe = mount(() => useCategoryGridViewSettingsContext());
        const [settings, actions] = probe;

        expect(settings.thumbnailSize).toBe("default");

        actions.setThumbnailSize("small");
        expect(settings.thumbnailSize).toBe("small");

        actions.setThumbnailSize("small");
        expect(settings.thumbnailSize).toBe("verySmall");

        // three steps, so the fourth press is back at the start
        actions.setThumbnailSize("small");
        expect(settings.thumbnailSize).toBe("default");
    });

    test("the info panel's booleans are one ordered list of cards", () => {
        const probe = mount(() => useMediaInfoPanelSettingsContext());
        const [settings, actions] = probe;

        expect(settings.showComments).toBe(true);
        expect(settings.showExif).toBe(false);

        actions.setShowExif(true);
        expect(settings.showExif).toBe(true);

        // setting a card that is already open is a no-op, not a close
        actions.setShowExif(true);
        expect(settings.showExif).toBe(true);

        actions.setShowComments(false);
        expect(settings.showComments).toBe(false);
        expect(settings.showExif).toBe(true);
    });

    test("the minimap and the map view share one map", () => {
        const probe = mount(() => ({
            map: useMediaMapViewSettingsContext(),
            panel: useMediaInfoPanelSettingsContext()
        }));

        const [map, mapActions] = probe.map;
        const [panel] = probe.panel;

        mapActions.setZoom(17);

        expect(map.zoom).toBe(17);
        expect(panel.minimapZoom).toBe(17);
    });

    test("what a listing setting is written as is what it is read back as", () => {
        const probe = mount(() => ({
            listing: useListingSettingsContext(),
            categoryGrid: useCategoryGridViewSettingsContext()
        }));

        const [listing, listingActions] = probe.listing;
        const [categoryGrid, categoryGridActions] = probe.categoryGrid;

        categoryGridActions.setDimThumbnails(false);
        expect(listing.dimThumbnails).toBe(false);
        expect(categoryGrid.dimThumbnails).toBe(false);

        listingActions.setDensity(DensityComfortable);
        expect(categoryGrid.thumbnailSize).toBe("default");
    });
});
