import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryTypeFilter } from '../models/category-type-filter';
import { CategoryFilterSettingsState, defaultCategoryFilterSettings, loadCategoryFilterSettings } from '../models/settings';

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
    const [state, setState] = createStore(loadCategoryFilterSettings());

    const setTypeFilter = (typeFilter: CategoryTypeFilter) => {
        setState({typeFilter: typeFilter});
    }

    const setYearFilter = (yearFilter: string | number) => {
        setState({yearFilter: yearFilter});
    }

    const setMissingGpsFilter = (missingGpsFilter: boolean) => {
        setState({missingGpsFilter: missingGpsFilter});
    }

    return (
        <CategoryFilterSettingsContext.Provider value={[state, { setTypeFilter, setYearFilter, setMissingGpsFilter }]}>
            {props.children}
        </CategoryFilterSettingsContext.Provider>
    );
}

export const useCategoryFilterSettings = () => useContext(CategoryFilterSettingsContext);
