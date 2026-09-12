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
import { useListingSettingsContext } from "./ListingSettingsContext";

export interface SearchGridViewSettingsState {
    readonly margin: MarginIdType;
    readonly showTitles: boolean;
    readonly showYears: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
    readonly showFavoritesBadge: boolean;
    readonly showTypesBadge: boolean;
}

export type SearchGridViewSettingsContextValue = [
    state: SearchGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowTitles: (showTitles: boolean) => void;
        setShowYears: (showYears: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setShowFavoritesBadge: (showBadge: boolean) => void;
        setShowTypesBadge: (showBadge: boolean) => void;
    }
];

export const useSearchGridViewSettingsContext = (): SearchGridViewSettingsContextValue => {
    const [listing, listingActions] = useListingSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: SearchGridViewSettingsState = {
        get margin() {
            return getDensityMargin(listing.density);
        },
        get showTitles() {
            return listing.showLabels;
        },
        get showYears() {
            return listing.showLabels;
        },
        get thumbnailSize() {
            return getGridThumbnailSize(listing.density);
        },
        get dimThumbnails() {
            return listing.dimThumbnails;
        },
        get showFavoritesBadge() {
            return listing.showBadges;
        },
        get showTypesBadge() {
            return listing.showBadges;
        }
    };

    return [
        state,
        {
            setMargin: () => listingActions.cycleDensity(),
            setShowTitles: show => listingActions.setShowLabels(show),
            setShowYears: show => listingActions.setShowLabels(show),
            setThumbnailSize: () => listingActions.cycleDensity(),
            setDimThumbnails: dim => listingActions.setDimThumbnails(dim),
            setShowFavoritesBadge: show => listingActions.setShowBadges(show),
            setShowTypesBadge: show => listingActions.setShowBadges(show)
        }
    ];
};
