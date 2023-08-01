import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_CATEGORY_FILTER, loadJson, saveJson } from "./_storage";
import { CategoryType } from "../../_models/CategoryType";

export type CategoryFilterSettingsState = {
    readonly typeFilter?: CategoryType;
    readonly yearFilter?: number;
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    typeFilter: undefined,
    yearFilter: undefined,
    missingGpsFilter: false,
};

export type CategoryFilterSettingsContextValue = [
    state: CategoryFilterSettingsState,
    actions: {
        setTypeFilter: (typeFilter?: CategoryType) => void;
        setYearFilter: (yearFilter?: number) => void;
        setMissingGpsFilter: (missingGpsFilter: boolean) => void;
    }
];

const CategoryFilterSettingsContext = createContext<CategoryFilterSettingsContextValue>();

export const CategoryFilterSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setTypeFilter = (typeFilter?: CategoryType) => updateState({typeFilter: typeFilter});
    const setYearFilter = (yearFilter?: number) => updateState({yearFilter: yearFilter});
    const setMissingGpsFilter = (missingGpsFilter: boolean) => updateState({missingGpsFilter: missingGpsFilter});

    const updateState = (update: Partial<CategoryFilterSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <CategoryFilterSettingsContext.Provider value={[state, { setTypeFilter, setYearFilter, setMissingGpsFilter }]}>
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
