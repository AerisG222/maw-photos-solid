import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryViewMode } from '../models/category-view-mode';
import { CategoryPageSettingsState, defaultCategoryPageSettings, loadCategoryPageSettings } from '../models/settings';

export type CategoryPageSettingsContextValue = [
    state: CategoryPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewMode) => void;
    }
];

const CategoryPageSettingsContext = createContext<CategoryPageSettingsContextValue>([
    defaultCategoryPageSettings,
    {
        setViewMode: () => undefined
    }
]);

export const CategoryPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadCategoryPageSettings());

    const setViewMode = (viewMode: CategoryViewMode) => {
        setState({viewMode: viewMode});
    };

    return (
        <CategoryPageSettingsContext.Provider value={[state, { setViewMode }]}>
            {props.children}
        </CategoryPageSettingsContext.Provider>
    );
}

export const useCategoryPageSettings = () => useContext(CategoryPageSettingsContext);
