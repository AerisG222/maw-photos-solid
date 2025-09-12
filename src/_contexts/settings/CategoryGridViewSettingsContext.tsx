import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_CATEGORY_VIEW_GRID, loadJson, saveJson } from "./_storage";

export interface CategoryGridViewSettingsState {
    readonly margin: MarginIdType;
    readonly showTitles: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
}

export const defaultCategoryGridViewSettings: CategoryGridViewSettingsState = {
    margin: defaultMargin,
    showTitles: true,
    thumbnailSize: defaultGridThumbnailSize,
    dimThumbnails: true
};

export type CategoryGridViewSettingsContextValue = [
    state: CategoryGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowTitles: (showTitles: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
    }
];

const CategoryGridViewSettingsContext = createContext<CategoryGridViewSettingsContextValue>();

export const CategoryGridSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setShowTitles = (showTitles: boolean) => updateState({ showTitles });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });

    const updateState = (update: Partial<CategoryGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <CategoryGridViewSettingsContext.Provider
            value={[state, { setMargin, setShowTitles, setThumbnailSize, setDimThumbnails }]}
        >
            {props.children}
        </CategoryGridViewSettingsContext.Provider>
    );
};

export const useCategoryGridViewSettingsContext = () => {
    const ctx = useContext(CategoryGridViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("CategoryGridViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultCategoryGridViewSettings,
        ...loadJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, defaultCategoryGridViewSettings)
    };
}

function saveState(state: CategoryGridViewSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, state);
}
