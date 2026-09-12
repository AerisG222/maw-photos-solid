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

export interface MediaGridViewSettingsState {
    readonly highlightFaces: boolean;
    readonly margin: MarginIdType;
    readonly showBreadcrumbs: boolean;
    readonly showMainBreadcrumbs: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
    readonly showFavoritesBadge: boolean;
    readonly showTypesBadge: boolean;
}

export type MediaGridViewSettingsContextValue = [
    state: MediaGridViewSettingsState,
    actions: {
        setHighlightFaces: (highlightFaces: boolean) => void;
        setMargin: (margin: MarginIdType) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setShowMainBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setShowFavoritesBadge: (showFavoritesBadge: boolean) => void;
        setShowTypesBadge: (showBadge: boolean) => void;
    }
];

export const useMediaGridViewSettingsContext = (): MediaGridViewSettingsContextValue => {
    const [listing, listingActions] = useListingSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: MediaGridViewSettingsState = {
        get highlightFaces() {
            return listing.highlightFaces;
        },
        get margin() {
            return getDensityMargin(listing.density);
        },
        get showBreadcrumbs() {
            return true;
        },
        get showMainBreadcrumbs() {
            return true;
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
            setHighlightFaces: on => listingActions.setHighlightFaces(on),
            setMargin: () => listingActions.cycleDensity(),
            setShowBreadcrumbs: () => undefined,
            setShowMainBreadcrumbs: () => undefined,
            setThumbnailSize: () => listingActions.cycleDensity(),
            setDimThumbnails: dim => listingActions.setDimThumbnails(dim),
            setShowFavoritesBadge: show => listingActions.setShowBadges(show),
            setShowTypesBadge: show => listingActions.setShowBadges(show)
        }
    ];
};
