/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { MarginIdType } from "../../_models/Margin";
import { ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { getDensityMargin, getListThumbnailSize } from "../../_models/Density";
import { useListingSettingsContext } from "./ListingSettingsContext";

export interface CategoryListViewSettingsState {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
}

export type CategoryListViewSettingsContextValue = [
    state: CategoryListViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
    }
];

export const useCategoryListViewSettingsContext = (): CategoryListViewSettingsContextValue => {
    const [listing, listingActions] = useListingSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: CategoryListViewSettingsState = {
        get margin() {
            return getDensityMargin(listing.density);
        },
        get thumbnailSize() {
            return getListThumbnailSize(listing.density);
        },
        get dimThumbnails() {
            return listing.dimThumbnails;
        }
    };

    return [
        state,
        {
            setMargin: () => listingActions.cycleDensity(),
            setThumbnailSize: () => listingActions.cycleDensity(),
            setDimThumbnails: dim => listingActions.setDimThumbnails(dim)
        }
    ];
};
