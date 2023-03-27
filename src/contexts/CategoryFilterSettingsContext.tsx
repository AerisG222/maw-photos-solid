import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryTypeFilter } from '../models/category-type-filter';
import { CategoryFilterSettingsState, defaultCategoryFilterSettings } from '../models/settings';
import { KEY_SETTINGS_CATEGORY_FILTER, loadJson, saveJson } from './_storage';

export type CategoryFilterSettingsContextValue = [
    state: CategoryFilterSettingsState,
    actions: {
        setTypeFilter: (typeFilter: CategoryTypeFilter) => void;
        setYearFilter: (yearFilter: string | number) => void;
        setMissingGpsFilter: (missingGpsFilter: boolean) => void;
    }
];

const CategoryFilterSettingsContext = createContext<CategoryFilterSettingsContextValue>([
    defaultCategoryFilterSettings,
    {
        setTypeFilter: () => undefined,
        setYearFilter: () => undefined,
        setMissingGpsFilter: () => undefined
    }
]);

export const CategoryFilterSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setTypeFilter = (typeFilter: CategoryTypeFilter) => updateState({typeFilter: typeFilter});
    const setYearFilter = (yearFilter: string | number) => updateState({yearFilter: yearFilter});
    const setMissingGpsFilter = (missingGpsFilter: boolean) => updateState({missingGpsFilter: missingGpsFilter});

    const updateState = (update: Partial<CategoryFilterSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <CategoryFilterSettingsContext.Provider value={[state, { setTypeFilter, setYearFilter, setMissingGpsFilter }]}>
            {props.children}
        </CategoryFilterSettingsContext.Provider>
    );
}

export const useCategoryFilterSettings = () => useContext(CategoryFilterSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_FILTER, defaultCategoryFilterSettings);
}

function saveState(state: CategoryFilterSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_FILTER, state);
}
