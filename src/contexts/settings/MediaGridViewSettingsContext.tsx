import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_MEDIA_VIEW_GRID, loadJson, saveJson } from "./_storage";

export type MediaGridViewSettingsState = {
    margin: MarginIdType;
    showBreadcrumbs: boolean;
    showMainBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultMediaGridViewSettings: MediaGridViewSettingsState = {
    margin: defaultMargin,
    showBreadcrumbs: true,
    showMainBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize
};

export type MediaGridViewSettingsContextValue = [
    state: MediaGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setShowMainBreadcrumbs: (showBreadcrumbs: boolean) => void;
    }
];

const MediaGridViewSettingsContext = createContext<MediaGridViewSettingsContextValue>();

export const MediaGridSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({ showBreadcrumbs });
    const setShowMainBreadcrumbs = (showBreadcrumbs: boolean) =>
        updateState({ showMainBreadcrumbs: showBreadcrumbs });

    const updateState = (update: Partial<MediaGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaGridViewSettingsContext.Provider
            value={[
                state,
                {
                    setMargin,
                    setShowBreadcrumbs,
                    setShowMainBreadcrumbs,
                    setThumbnailSize
                }
            ]}
        >
            {props.children}
        </MediaGridViewSettingsContext.Provider>
    );
};

export const useMediaGridViewSettingsContext = () => useContext(MediaGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_MEDIA_VIEW_GRID, defaultMediaGridViewSettings);
}

function saveState(state: MediaGridViewSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_VIEW_GRID, state);
}
