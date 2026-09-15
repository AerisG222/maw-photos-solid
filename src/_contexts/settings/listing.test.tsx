import { render } from "@solidjs/testing-library";
import { beforeEach, describe, expect, test } from "vitest";

import { AllSettingsProvider } from "./AllSettingsProvider";
import { useListingSettingsContext } from "./ListingSettingsContext";

/*
   One store behind every listing.

   This began as a test of the adapters - eight shims presenting the one store
   through the shapes a dozen screens still expected. The screens read the store
   directly now and the shims are gone, so what is left to pin is the promise
   they existed to keep: a preference set while browsing a category is the same
   preference when you reach a search, a person or a place.

   Smaller than it was, because the store is. Density and thumbnail dimming were
   both settings here and are neither now - one salvaged from two older controls
   and never designed, the other defaulting to showing photographs washed out.
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

    test("what is written is what is read back", () => {
        const [settings, actions] = mount(useListingSettingsContext);

        actions.setShowLabels(false);
        expect(settings.showLabels).toBe(false);

        actions.setHighlightFaces(true);
        expect(settings.highlightFaces).toBe(true);
    });
});
