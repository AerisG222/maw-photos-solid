import { render } from "@solidjs/testing-library";
import { beforeEach, describe, expect, test } from "vitest";

import { AllSettingsProvider } from "./AllSettingsProvider";
import { defaultListingSettings, useListingSettingsContext } from "./ListingSettingsContext";
import { KEY_SETTINGS_V2_LISTING, KEY_SETTINGS_V2_MIGRATED } from "./_storage";

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

describe("the listing settings", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("what is written is what is read back", () => {
        const [settings, actions] = mount(useListingSettingsContext);

        actions.setShowLabels("people", false);
        expect(settings.labels.people).toBe(false);

        actions.setHighlightFaces(true);
        expect(settings.highlightFaces).toBe(true);
    });

    test("labels turned off in one area leave the others alone, and survive a reload", () => {
        const [settings, actions] = mount(useListingSettingsContext);

        actions.setShowLabels("places", false);

        expect(settings.labels).toEqual({ ...defaultListingSettings.labels, places: false });
        expect(mount(useListingSettingsContext)[0].labels.places).toBe(false);
    });

    describe("from when there was one choice for all of them", () => {
        beforeEach(() => {
            localStorage.setItem(KEY_SETTINGS_V2_MIGRATED, "true");
        });

        test("it carries to each area, but not to places, whose names always showed", () => {
            localStorage.setItem(
                KEY_SETTINGS_V2_LISTING,
                JSON.stringify({ showLabels: false, peopleSort: "mediaCount" })
            );

            const [settings] = mount(useListingSettingsContext);

            expect(settings.labels).toEqual({
                categories: false,
                search: false,
                people: false,
                personFeeds: false,
                placeFeeds: false,
                places: true
            });
            expect(settings.peopleSort).toBe("mediaCount");
        });
    });
});
