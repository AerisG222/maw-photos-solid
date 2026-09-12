/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { useListingSettingsContext } from "./ListingSettingsContext";

export interface MediaFullscreenViewSettingsState {
    readonly highlightFaces: boolean;
    readonly showFavoritesBadge: boolean;
}

export type MediaFullscreenViewSettingsContextValue = [
    state: MediaFullscreenViewSettingsState,
    actions: {
        setHighlightFaces: (highlightFaces: boolean) => void;
        setShowFavoritesBadge: (showFavoritesBadge: boolean) => void;
    }
];

export const useMediaFullscreenViewSettingsContext =
    (): MediaFullscreenViewSettingsContextValue => {
        const [listing, listingActions] = useListingSettingsContext();

        // getters, so reading a field inside a tracking scope still subscribes to it
        const state: MediaFullscreenViewSettingsState = {
            get highlightFaces() {
                return listing.highlightFaces;
            },
            get showFavoritesBadge() {
                return listing.showBadges;
            }
        };

        return [
            state,
            {
                setHighlightFaces: on => listingActions.setHighlightFaces(on),
                setShowFavoritesBadge: show => listingActions.setShowBadges(show)
            }
        ];
    };
