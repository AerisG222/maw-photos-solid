/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { useAreaSettingsContext } from "./AreaSettingsContext";

export interface FaceFeedSettingsState {
    readonly favoritesOnly: boolean;
    readonly shuffle: boolean;
    readonly showCategories: boolean;
}

export type FaceFeedSettingsContextValue = [
    state: FaceFeedSettingsState,
    actions: {
        setFavoritesOnly: (favoritesOnly: boolean) => void;
        setShuffle: (shuffle: boolean) => void;
        setShowCategories: (showCategories: boolean) => void;
    }
];

export const useFaceFeedSettingsContext = (): FaceFeedSettingsContextValue => {
    const [area, areaActions] = useAreaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: FaceFeedSettingsState = {
        get favoritesOnly() {
            return area.feedFavoritesOnly;
        },
        get shuffle() {
            return area.feedShuffle;
        },
        get showCategories() {
            return area.feedListing === "categories";
        }
    };

    return [
        state,
        {
            setFavoritesOnly: on => areaActions.setFeedFavoritesOnly(on),
            setShuffle: on => areaActions.setFeedShuffle(on),
            setShowCategories: show => areaActions.setFeedListing(show ? "categories" : "media")
        }
    ];
};
