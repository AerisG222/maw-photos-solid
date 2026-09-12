/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { CategoryViewModeIdType } from "../../_models/CategoryViewMode";
import { useAreaSettingsContext } from "./AreaSettingsContext";

export interface SearchPageSettingsState {
    readonly viewMode: CategoryViewModeIdType;
}

export type SearchPageSettingsContextValue = [
    state: SearchPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewModeIdType) => void;
    }
];

export const useSearchPageSettingsContext = (): SearchPageSettingsContextValue => {
    const [area, areaActions] = useAreaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: SearchPageSettingsState = {
        get viewMode() {
            return area.searchView;
        }
    };

    return [
        state,
        {
            setViewMode: mode => areaActions.setSearchView(mode)
        }
    ];
};
