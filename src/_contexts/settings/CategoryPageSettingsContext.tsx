/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { CategoryViewModeIdType } from "../../_models/CategoryViewMode";
import { useAreaSettingsContext } from "./AreaSettingsContext";

export interface CategoryPageSettingsState {
    readonly viewMode: CategoryViewModeIdType;
}

export type CategoryPageSettingsContextValue = [
    state: CategoryPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewModeIdType) => void;
    }
];

export const useCategoryPageSettingsContext = (): CategoryPageSettingsContextValue => {
    const [area, areaActions] = useAreaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: CategoryPageSettingsState = {
        get viewMode() {
            return area.categoriesView;
        }
    };

    return [
        state,
        {
            setViewMode: mode => areaActions.setCategoriesView(mode)
        }
    ];
};
