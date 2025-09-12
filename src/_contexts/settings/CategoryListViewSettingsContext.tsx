import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultListThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_CATEGORY_VIEW_LIST, loadJson, saveJson } from "./_storage";

export interface CategoryListViewSettingsState {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
}

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultListThumbnailSize,
    dimThumbnails: true
};

export type CategoryListViewSettingsContextValue = [
    state: CategoryListViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
    }
];

const CategoryListViewSettingsContext = createContext<CategoryListViewSettingsContextValue>();

export const CategoryListSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });

    const updateState = (update: Partial<CategoryListViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <CategoryListViewSettingsContext.Provider
            value={[state, { setMargin, setThumbnailSize, setDimThumbnails }]}
        >
            {props.children}
        </CategoryListViewSettingsContext.Provider>
    );
};

export const useCategoryListViewSettingsContext = () => {
    const ctx = useContext(CategoryListViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("CategoryListViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultCategoryListViewSettings,
        ...loadJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, defaultCategoryListViewSettings)
    };
}

function saveState(state: CategoryListViewSettingsState) {
    saveJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, state);
}
