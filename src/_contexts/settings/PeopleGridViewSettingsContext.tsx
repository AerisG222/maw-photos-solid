/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { MarginIdType } from "../../_models/Margin";
import { ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { getDensityMargin, getGridThumbnailSize } from "../../_models/Density";
import { PersonSortIdType } from "../../_models/PersonSort";
import { useListingSettingsContext } from "./ListingSettingsContext";

export interface PeopleGridViewSettingsState {
    readonly margin: MarginIdType;
    readonly showNames: boolean;
    readonly showMediaCounts: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
    readonly sortBy: PersonSortIdType;
}

export type PeopleGridViewSettingsContextValue = [
    state: PeopleGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowNames: (showNames: boolean) => void;
        setShowMediaCounts: (showMediaCounts: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setSortBy: (sortBy: PersonSortIdType) => void;
    }
];

export const usePeopleGridViewSettingsContext = (): PeopleGridViewSettingsContextValue => {
    const [listing, listingActions] = useListingSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: PeopleGridViewSettingsState = {
        get margin() {
            return getDensityMargin(listing.density);
        },
        get showNames() {
            return listing.showLabels;
        },
        get showMediaCounts() {
            return listing.showLabels;
        },
        get thumbnailSize() {
            return getGridThumbnailSize(listing.density);
        },
        get dimThumbnails() {
            return listing.dimThumbnails;
        },
        get sortBy() {
            return listing.peopleSort;
        }
    };

    return [
        state,
        {
            setMargin: () => listingActions.cycleDensity(),
            setShowNames: show => listingActions.setShowLabels(show),
            setShowMediaCounts: show => listingActions.setShowLabels(show),
            setThumbnailSize: () => listingActions.cycleDensity(),
            setDimThumbnails: dim => listingActions.setDimThumbnails(dim),
            setSortBy: sort => listingActions.setPeopleSort(sort)
        }
    ];
};
