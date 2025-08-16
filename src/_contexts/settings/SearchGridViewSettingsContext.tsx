import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_SEARCH_VIEW_GRID, loadJson, saveJson } from "./_storage";

export type SearchGridViewSettingsState = {
    margin: MarginIdType;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultSearchGridViewSettings: SearchGridViewSettingsState = {
    margin: defaultMargin,
    showTitles: true,
    showYears: true,
    thumbnailSize: defaultGridThumbnailSize
};

export type SearchGridViewSettingsContextValue = [
    state: SearchGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowTitles: (showTitles: boolean) => void;
        setShowYears: (showYears: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
    }
];

const SearchGridViewSettingsContext = createContext<SearchGridViewSettingsContextValue>();

export const SearchGridSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setShowTitles = (showTitles: boolean) => updateState({ showTitles });
    const setShowYears = (showYears: boolean) => updateState({ showYears });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });

    const updateState = (update: Partial<SearchGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <SearchGridViewSettingsContext.Provider
            value={[state, { setMargin, setShowTitles, setShowYears, setThumbnailSize }]}
        >
            {props.children}
        </SearchGridViewSettingsContext.Provider>
    );
};

export const useSearchGridViewSettingsContext = () => {
    const ctx = useContext(SearchGridViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("SearchGridViewSettings context not provided by ancestor component!");
};

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_GRID, defaultSearchGridViewSettings);
}

function saveState(state: SearchGridViewSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_VIEW_GRID, state);
}
