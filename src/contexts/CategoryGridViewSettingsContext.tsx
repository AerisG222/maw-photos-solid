import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { CategoryGridViewSettingsState, defaultCategoryGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { KEY_SETTINGS_CATEGORY_VIEW_GRID, loadJson, saveJson } from './_storage';

export type CategoryGridViewSettingsContextValue = [
    state: CategoryGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setShowTitles: (showTitles: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const CategoryGridViewSettingsContext = createContext<CategoryGridViewSettingsContextValue>([
    defaultCategoryGridViewSettings,
    {
        setMargin: () => undefined,
        setShowTitles: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const CategoryGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: Margin) => updateState({margin: margin});
    const setShowTitles = (showTitles: boolean) => updateState({showTitles: showTitles});
    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => updateState({thumbnailSize: thumbnailSize});

    const updateState = (update: Partial<CategoryGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <CategoryGridViewSettingsContext.Provider value={[state, { setMargin, setShowTitles, setThumbnailSize }]}>
            {props.children}
        </CategoryGridViewSettingsContext.Provider>
    );
}

export const useCategoryGridViewSettings = () => useContext(CategoryGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, defaultCategoryGridViewSettings);
}

function saveState(state: CategoryGridViewSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, state);
}
