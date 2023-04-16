import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryTypeFilterIdType } from '../models/CategoryTypeFilter';
import { CategoryFilterSettingsState, defaultCategoryFilterSettings } from '../models/settings';
import { KEY_SETTINGS_CATEGORY_FILTER, loadJson, saveJson } from './_storage';
import { YearFilterIdType } from '../models/YearFilter';

export type CategoryFilterSettingsContextValue = [
    state: CategoryFilterSettingsState,
    actions: {
        setTypeFilter: (typeFilter: CategoryTypeFilterIdType) => void;
        setYearFilter: (yearFilter: YearFilterIdType) => void;
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

    const setTypeFilter = (typeFilter: CategoryTypeFilterIdType) => updateState({typeFilter: typeFilter});
    const setYearFilter = (yearFilter: YearFilterIdType) => updateState({yearFilter: yearFilter});
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
