import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultListThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_CATEGORY_VIEW_LIST, loadJson, saveJson } from "./_storage";

export type CategoryListViewSettingsState = {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultListThumbnailSize
};

export type CategoryListViewSettingsContextValue = [
    state: CategoryListViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
    }
];

const CategoryListViewSettingsContext = createContext<CategoryListViewSettingsContextValue>();

export const CategoryListSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin: margin });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) =>
        updateState({ thumbnailSize: thumbnailSize });

    const updateState = (update: Partial<CategoryListViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <CategoryListViewSettingsContext.Provider value={[state, { setMargin, setThumbnailSize }]}>
            {props.children}
        </CategoryListViewSettingsContext.Provider>
    );
};

export const useCategoryListViewSettingsContext = () => useContext(CategoryListViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, defaultCategoryListViewSettings);
}

function saveState(state: CategoryListViewSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, state);
}
