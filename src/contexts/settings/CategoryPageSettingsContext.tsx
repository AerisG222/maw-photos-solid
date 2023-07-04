import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryViewModeIdType } from '../../models/CategoryViewMode';
import { CategoryPageSettingsState, defaultCategoryPageSettings } from '../../models/settings';
import { KEY_SETTINGS_CATEGORY_PAGE, loadJson, saveJson } from './_storage';

export type CategoryPageSettingsContextValue = [
    state: CategoryPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewModeIdType) => void;
    }
];

const CategoryPageSettingsContext = createContext<CategoryPageSettingsContextValue>([
    defaultCategoryPageSettings,
    {
        setViewMode: () => undefined
    }
]);

export const CategoryPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: CategoryViewModeIdType) => {
        setState({viewMode: viewMode});
        saveState(state);
    };

    return (
        <CategoryPageSettingsContext.Provider value={[state, { setViewMode }]}>
            {props.children}
        </CategoryPageSettingsContext.Provider>
    );
};

export const useCategoryPageSettingsContext = () => useContext(CategoryPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_PAGE, defaultCategoryPageSettings);
}

function saveState(state: CategoryPageSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_PAGE, state);
}
