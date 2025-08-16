import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_MEDIA_VIEW_DETAIL, loadJson, saveJson } from "./_storage";

export type MediaDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showMediaList: boolean;
};

export const defaultMediaDetailViewSettings: MediaDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    showMediaList: true
};

export type MediaDetailViewSettingsContextValue = [
    state: MediaDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowMediaList: (showMediaList: boolean) => void;
    }
];

const MediaDetailViewSettingsContext = createContext<MediaDetailViewSettingsContextValue>();

export const MediaDetailSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadMediaDetailViewSettings());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({ showBreadcrumbs });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setShowMediaList = (showMediaList: boolean) => updateState({ showMediaList });

    const updateState = (update: Partial<MediaDetailViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaDetailViewSettingsContext.Provider
            value={[state, { setShowBreadcrumbs, setShowMediaList, setThumbnailSize }]}
        >
            {props.children}
        </MediaDetailViewSettingsContext.Provider>
    );
};

export const useMediaDetailViewSettingsContext = () => {
    const ctx = useContext(MediaDetailViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaDetailViewSettings context not provided by ancestor component!");
};

function loadMediaDetailViewSettings() {
    return loadJson(KEY_SETTINGS_MEDIA_VIEW_DETAIL, defaultMediaDetailViewSettings);
}

function saveState(state: MediaDetailViewSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_VIEW_DETAIL, state);
}
