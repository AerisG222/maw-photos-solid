import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_CATEGORY_FILTER, loadJson, saveJson } from "./_storage";

export type CategoryFilterSettingsState = {
    readonly yearFilter: number | "all";
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    yearFilter: "all",
    missingGpsFilter: false
};

export type CategoryFilterSettingsContextValue = [
    state: CategoryFilterSettingsState,
    actions: {
        setYearFilter: (yearFilter: number | "all") => void;
        setMissingGpsFilter: (missingGpsFilter: boolean) => void;
    }
];

const CategoryFilterSettingsContext = createContext<CategoryFilterSettingsContextValue>();

export const CategoryFilterSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setYearFilter = (yearFilter: number | "all") => updateState({ yearFilter: yearFilter });
    const setMissingGpsFilter = (missingGpsFilter: boolean) =>
        updateState({ missingGpsFilter: missingGpsFilter });

    const updateState = (update: Partial<CategoryFilterSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <CategoryFilterSettingsContext.Provider
            value={[state, { setYearFilter, setMissingGpsFilter }]}
        >
            {props.children}
        </CategoryFilterSettingsContext.Provider>
    );
};

export const useCategoryFilterSettingsContext = () => useContext(CategoryFilterSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_FILTER, defaultCategoryFilterSettings);
}

function saveState(state: CategoryFilterSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_FILTER, state);
}
