/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { useAreaSettingsContext } from "./AreaSettingsContext";

export interface CategoryFilterSettingsState {
    readonly yearFilter: number | "all";
    readonly missingGpsFilter: boolean;
}

export type CategoryFilterSettingsContextValue = [
    state: CategoryFilterSettingsState,
    actions: {
        setYearFilter: (yearFilter: number | "all") => void;
        setMissingGpsFilter: (missingGpsFilter: boolean) => void;
    }
];

export const useCategoryFilterSettingsContext = (): CategoryFilterSettingsContextValue => {
    const [area, areaActions] = useAreaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: CategoryFilterSettingsState = {
        get yearFilter() {
            return area.categoryYearFilter;
        },
        get missingGpsFilter() {
            return area.categoryMissingGpsFilter;
        }
    };

    return [
        state,
        {
            setYearFilter: year => areaActions.setCategoryYearFilter(year),
            setMissingGpsFilter: on => areaActions.setCategoryMissingGpsFilter(on)
        }
    ];
};
