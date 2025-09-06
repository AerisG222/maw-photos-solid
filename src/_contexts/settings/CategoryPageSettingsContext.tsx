import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { CategoryViewModeIdType, defaultCategoryViewMode } from "../../_models/CategoryViewMode";
import { KEY_SETTINGS_CATEGORY_PAGE, loadJson, saveJson } from "./_storage";

export interface CategoryPageSettingsState {
    readonly viewMode: CategoryViewModeIdType;
}

export const defaultCategoryPageSettings: CategoryPageSettingsState = {
    viewMode: defaultCategoryViewMode
};

export type CategoryPageSettingsContextValue = [
    state: CategoryPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewModeIdType) => void;
    }
];

const CategoryPageSettingsContext = createContext<CategoryPageSettingsContextValue>();

export const CategoryPageSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: CategoryViewModeIdType) => {
        setState({ viewMode: viewMode });
        saveState(state);
    };

    return (
        <CategoryPageSettingsContext.Provider value={[state, { setViewMode }]}>
            {props.children}
        </CategoryPageSettingsContext.Provider>
    );
};

export const useCategoryPageSettingsContext = () => {
    const ctx = useContext(CategoryPageSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("CategoryPageSettings context not provided by ancestor component!");
};

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_PAGE, defaultCategoryPageSettings);
}

function saveState(state: CategoryPageSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_PAGE, state);
}
