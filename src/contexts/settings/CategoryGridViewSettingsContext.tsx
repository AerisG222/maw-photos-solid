import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_CATEGORY_VIEW_GRID, loadJson, saveJson } from "./_storage";

export type CategoryGridViewSettingsState = {
    readonly margin: MarginIdType;
    readonly showTitles: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultCategoryGridViewSettings: CategoryGridViewSettingsState = {
    margin: defaultMargin,
    showTitles: true,
    thumbnailSize: defaultGridThumbnailSize,
};

export type CategoryGridViewSettingsContextValue = [
    state: CategoryGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowTitles: (showTitles: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
    }
];

const CategoryGridViewSettingsContext = createContext<CategoryGridViewSettingsContextValue>();

export const CategoryGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({margin: margin});
    const setShowTitles = (showTitles: boolean) => updateState({showTitles: showTitles});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});

    const updateState = (update: Partial<CategoryGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <CategoryGridViewSettingsContext.Provider value={[state, { setMargin, setShowTitles, setThumbnailSize }]}>
            {props.children}
        </CategoryGridViewSettingsContext.Provider>
    );
};

export const useCategoryGridViewSettingsContext = () => useContext(CategoryGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, defaultCategoryGridViewSettings);
}

function saveState(state: CategoryGridViewSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, state);
}
