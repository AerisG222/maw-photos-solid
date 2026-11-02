import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import type { CategoryFilters } from "../../categories/_search";
import { CategoryViewModeIdType } from "../../_models/CategoryViewMode";
import { MediaFilters } from "../../_models/MediaFilters";
import { AreaSettingsState, FeedListing } from "./_state";
import { loadAreaSettings } from "./_migrate";
import { KEY_SETTINGS_V2_AREA, saveJson } from "./_storage";

export type { AreaSettingsState, FeedListing } from "./_state";
export { defaultAreaSettings } from "./_state";

export type AreaSettingsContextValue = [
    state: AreaSettingsState,
    actions: {
        setCategoriesView: (categoriesView: CategoryViewModeIdType) => void;
        setSearchView: (searchView: CategoryViewModeIdType) => void;
        setPersonFeedListing: (personFeedListing: FeedListing) => void;
        setPlaceFeedListing: (placeFeedListing: FeedListing) => void;
        setPersonFeedShuffle: (personFeedShuffle: boolean) => void;
        setPlaceFeedShuffle: (placeFeedShuffle: boolean) => void;
        setCategoryYearFilter: (categoryYearFilter: number | "all") => void;
        setCategoriesFilters: (categoriesFilters: CategoryFilters) => void;
        setCategoryMediaFilters: (categoryMediaFilters: MediaFilters) => void;
        setPeopleFavoritesOnly: (peopleFavoritesOnly: boolean) => void;
        setPersonFeedFilters: (personFeedFilters: MediaFilters) => void;
        setPlaceFeedFilters: (placeFeedFilters: MediaFilters) => void;
        setSearchFilters: (searchFilters: MediaFilters) => void;
        setSearchHistoryCount: (searchHistoryCount: number) => void;
    }
];

const AreaSettingsContext = createContext<AreaSettingsContextValue>();

export const AreaSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadAreaSettings());

    const updateState = (update: Partial<AreaSettingsState>) => {
        setState(update);
        saveJson(KEY_SETTINGS_V2_AREA, state);
    };

    const setCategoriesView = (categoriesView: CategoryViewModeIdType) =>
        updateState({ categoriesView });

    const setSearchView = (searchView: CategoryViewModeIdType) => updateState({ searchView });

    const setPersonFeedListing = (personFeedListing: FeedListing) =>
        updateState({ personFeedListing });

    const setPlaceFeedListing = (placeFeedListing: FeedListing) =>
        updateState({ placeFeedListing });

    const setPersonFeedShuffle = (personFeedShuffle: boolean) => updateState({ personFeedShuffle });

    const setPlaceFeedShuffle = (placeFeedShuffle: boolean) => updateState({ placeFeedShuffle });

    const setCategoryYearFilter = (categoryYearFilter: number | "all") =>
        updateState({ categoryYearFilter });

    const setCategoriesFilters = (categoriesFilters: CategoryFilters) =>
        updateState({ categoriesFilters });

    const setCategoryMediaFilters = (categoryMediaFilters: MediaFilters) =>
        updateState({ categoryMediaFilters });

    const setPeopleFavoritesOnly = (peopleFavoritesOnly: boolean) =>
        updateState({ peopleFavoritesOnly });

    const setPersonFeedFilters = (personFeedFilters: MediaFilters) =>
        updateState({ personFeedFilters });

    const setPlaceFeedFilters = (placeFeedFilters: MediaFilters) =>
        updateState({ placeFeedFilters });

    const setSearchFilters = (searchFilters: MediaFilters) => updateState({ searchFilters });

    const setSearchHistoryCount = (searchHistoryCount: number) =>
        updateState({ searchHistoryCount });

    return (
        <AreaSettingsContext.Provider
            value={[
                state,
                {
                    setCategoriesView,
                    setSearchView,
                    setPersonFeedListing,
                    setPlaceFeedListing,
                    setPersonFeedShuffle,
                    setPlaceFeedShuffle,
                    setCategoryYearFilter,
                    setCategoriesFilters,
                    setCategoryMediaFilters,
                    setPeopleFavoritesOnly,
                    setPersonFeedFilters,
                    setPlaceFeedFilters,
                    setSearchFilters,
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
