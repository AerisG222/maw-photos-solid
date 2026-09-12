/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { getGridThumbnailSize } from "../../_models/Density";
import { useListingSettingsContext } from "./ListingSettingsContext";
import { useMediaSettingsContext } from "./MediaSettingsContext";

export interface MediaDetailViewSettingsState {
    readonly highlightFaces: boolean;
    readonly showBreadcrumbs: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly showMediaList: boolean;
    readonly dimThumbnails: boolean;
    readonly showFavoritesBadge: boolean;
}

export type MediaDetailViewSettingsContextValue = [
    state: MediaDetailViewSettingsState,
    actions: {
        setHighlightFaces: (highlightFaces: boolean) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowMediaList: (showMediaList: boolean) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setShowFavoritesBadge: (showFavoritesBadge: boolean) => void;
    }
];

export const useMediaDetailViewSettingsContext = (): MediaDetailViewSettingsContextValue => {
    const [listing, listingActions] = useListingSettingsContext();
    const [media, mediaActions] = useMediaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: MediaDetailViewSettingsState = {
        get highlightFaces() {
            return listing.highlightFaces;
        },
        get showBreadcrumbs() {
            return true;
        },
        get thumbnailSize() {
            return getGridThumbnailSize(listing.density);
        },
        get showMediaList() {
            return media.showFilmstrip;
        },
        get dimThumbnails() {
            return listing.dimThumbnails;
        },
        get showFavoritesBadge() {
            return listing.showBadges;
        }
    };

    return [
        state,
        {
            setHighlightFaces: on => listingActions.setHighlightFaces(on),
            setShowBreadcrumbs: () => undefined,
            setThumbnailSize: () => listingActions.cycleDensity(),
            setShowMediaList: show => mediaActions.setShowFilmstrip(show),
            setDimThumbnails: dim => listingActions.setDimThumbnails(dim),
            setShowFavoritesBadge: show => listingActions.setShowBadges(show)
        }
    ];
};
