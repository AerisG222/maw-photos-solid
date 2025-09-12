import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_SEARCH_VIEW_LIST, loadJson, saveJson } from "./_storage";

export interface SearchListViewSettingsState {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
}

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultGridThumbnailSize,
    dimThumbnails: true
};

export type SearchListViewSettingsContextValue = [
    state: SearchListViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
    }
];

const SearchListViewSettingsContext = createContext<SearchListViewSettingsContextValue>();

export const SearchListSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });

    const updateState = (update: Partial<SearchListViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <SearchListViewSettingsContext.Provider
            value={[state, { setMargin, setThumbnailSize, setDimThumbnails }]}
        >
            {props.children}
        </SearchListViewSettingsContext.Provider>
    );
};

export const useSearchListViewSettingsContext = () => {
    const ctx = useContext(SearchListViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("SearchListViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultSearchListViewSettings,
        ...loadJson(KEY_SETTINGS_SEARCH_VIEW_LIST, defaultSearchListViewSettings)
    };
}

function saveState(state: SearchListViewSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_VIEW_LIST, state);
}
