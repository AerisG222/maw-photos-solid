import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { CategoryViewModeIdType } from "../../_models/CategoryViewMode";
import { AreaSettingsState, defaultAreaSettings } from "./_state";
import { loadMigrated } from "./_migrate";
import { KEY_SETTINGS_V2_AREA, saveJson } from "./_storage";

export type { AreaSettingsState } from "./_state";
export { defaultAreaSettings } from "./_state";

export type AreaSettingsContextValue = [
    state: AreaSettingsState,
    actions: {
        setCategoriesView: (categoriesView: CategoryViewModeIdType) => void;
        setSearchView: (searchView: CategoryViewModeIdType) => void;
        setFeedListing: (feedListing: "media" | "categories") => void;
        setCategoryYearFilter: (categoryYearFilter: number | "all") => void;
        setCategoryMissingGpsFilter: (categoryMissingGpsFilter: boolean) => void;
        setFeedFavoritesOnly: (feedFavoritesOnly: boolean) => void;
        setFeedShuffle: (feedShuffle: boolean) => void;
        setSearchHistoryCount: (searchHistoryCount: number) => void;
    }
];

const AreaSettingsContext = createContext<AreaSettingsContextValue>();

export const AreaSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadMigrated(KEY_SETTINGS_V2_AREA, defaultAreaSettings));

    const updateState = (update: Partial<AreaSettingsState>) => {
        setState(update);
        saveJson(KEY_SETTINGS_V2_AREA, state);
    };

    const setCategoriesView = (categoriesView: CategoryViewModeIdType) =>
        updateState({ categoriesView });

    const setSearchView = (searchView: CategoryViewModeIdType) => updateState({ searchView });

    const setFeedListing = (feedListing: "media" | "categories") => updateState({ feedListing });

    const setCategoryYearFilter = (categoryYearFilter: number | "all") =>
        updateState({ categoryYearFilter });

    const setCategoryMissingGpsFilter = (categoryMissingGpsFilter: boolean) =>
        updateState({ categoryMissingGpsFilter });

    const setFeedFavoritesOnly = (feedFavoritesOnly: boolean) => updateState({ feedFavoritesOnly });

    const setFeedShuffle = (feedShuffle: boolean) => updateState({ feedShuffle });

    const setSearchHistoryCount = (searchHistoryCount: number) =>
        updateState({ searchHistoryCount });

    return (
        <AreaSettingsContext.Provider
            value={[
                state,
                {
                    setCategoriesView,
                    setSearchView,
                    setFeedListing,
                    setCategoryYearFilter,
                    setCategoryMissingGpsFilter,
                    setFeedFavoritesOnly,
                    setFeedShuffle,
                    setSearchHistoryCount
                }
            ]}
        >
            {props.children}
        </AreaSettingsContext.Provider>
    );
};

export const useAreaSettingsContext = () => {
    const ctx = useContext(AreaSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("AreaSettings context not provided by ancestor component!");
};
