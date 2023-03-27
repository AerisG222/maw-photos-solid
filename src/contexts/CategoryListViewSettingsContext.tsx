import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { CategoryListViewSettingsState, defaultCategoryListViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { KEY_SETTINGS_CATEGORY_VIEW_LIST, loadJson,saveJson } from './_storage';

export type CategoryListViewSettingsContextValue = [
    state: CategoryListViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const CategoryListViewSettingsContext = createContext<CategoryListViewSettingsContextValue>([
    defaultCategoryListViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const CategoryListSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: Margin) => updateState({margin: margin});
    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => updateState({thumbnailSize: thumbnailSize});

    const updateState = (update: Partial<CategoryListViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <CategoryListViewSettingsContext.Provider value={[state, { setMargin, setThumbnailSize }]}>
            {props.children}
        </CategoryListViewSettingsContext.Provider>
    );
}

export const useCategoryListViewSettings = () => useContext(CategoryListViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, defaultCategoryListViewSettings);
}

function saveState(state: CategoryListViewSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, state);
}
