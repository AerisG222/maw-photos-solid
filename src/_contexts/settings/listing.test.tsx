import { render } from "@solidjs/testing-library";
import { beforeEach, describe, expect, test } from "vitest";

import { DensityComfortable, DensityCompact, getGridThumbnailSize } from "../../_models/Density";
import { AllSettingsProvider } from "./AllSettingsProvider";
import { useListingSettingsContext } from "./ListingSettingsContext";

/*
   One store behind every listing.

   This began as a test of the adapters - eight shims presenting the one store
   through the shapes a dozen screens still expected. The screens read the store
   directly now and the shims are gone, so what is left to pin is the promise
   they existed to keep: a preference set while browsing a category is the same
   preference when you reach a search, a person or a place.
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

describe("the listing settings", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("one density is what every listing sizes itself by", () => {
        const [settings, actions] = mount(useListingSettingsContext);

        expect(getGridThumbnailSize(settings.density)).toBe("default");

        actions.setDensity(DensityCompact);

        expect(getGridThumbnailSize(settings.density)).toBe("small");
    });

    test("the density cycles, and wraps", () => {
        const [settings, actions] = mount(useListingSettingsContext);

        const seen = [settings.density];

        for (let i = 0; i < 3; i++) {
            actions.cycleDensity();
            seen.push(settings.density);
        }

        // three steps, so the fourth reading is back where it started
        expect(seen[3]).toBe(seen[0]);
        expect(new Set(seen).size).toBe(3);
    });

    test("what is written is what is read back", () => {
        const [settings, actions] = mount(useListingSettingsContext);

        actions.setDimThumbnails(false);
        expect(settings.dimThumbnails).toBe(false);

        actions.setShowLabels(false);
        expect(settings.showLabels).toBe(false);

        actions.setDensity(DensityComfortable);
        expect(settings.density).toBe(DensityComfortable);
    });

    /*
       On, where every one of the six stores this replaces defaulted it off:
       the favourite heart is the only way to favourite anything, and it was
       invisible until you found a toolbar button to reveal it.
    */
    test("badges start visible", () => {
        const [settings] = mount(useListingSettingsContext);

        expect(settings.showBadges).toBe(true);
    });
});
