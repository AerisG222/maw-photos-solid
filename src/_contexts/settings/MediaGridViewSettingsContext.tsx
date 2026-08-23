import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_MEDIA_VIEW_GRID, loadJson, saveJson } from "./_storage";

export interface MediaGridViewSettingsState {
    readonly highlightFaces: boolean;
    readonly margin: MarginIdType;
    readonly showBreadcrumbs: boolean;
    readonly showMainBreadcrumbs: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
    readonly showFavoritesBadge: boolean;
    readonly showTypesBadge: boolean;
}

export const defaultMediaGridViewSettings: MediaGridViewSettingsState = {
    highlightFaces: false,
    margin: defaultMargin,
    showBreadcrumbs: true,
    showMainBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    dimThumbnails: true,
    showFavoritesBadge: false,
    showTypesBadge: false
};

export type MediaGridViewSettingsContextValue = [
    state: MediaGridViewSettingsState,
    actions: {
        setHighlightFaces: (highlightFaces: boolean) => void;
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setShowMainBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setShowFavoritesBadge: (showFavoritesBadge: boolean) => void;
        setShowTypesBadge: (showBadge: boolean) => void;
    }
];

const MediaGridViewSettingsContext = createContext<MediaGridViewSettingsContextValue>();

export const MediaGridSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });
    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({ showBreadcrumbs });
    const setShowMainBreadcrumbs = (showMainBreadcrumbs: boolean) =>
        updateState({ showMainBreadcrumbs });
    const setShowFavoritesBadge = (showFavoritesBadge: boolean) =>
        updateState({ showFavoritesBadge });
    const setShowTypesBadge = (showTypesBadge: boolean) => updateState({ showTypesBadge });

    const setHighlightFaces = (highlightFaces: boolean) => updateState({ highlightFaces });

    const updateState = (update: Partial<MediaGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaGridViewSettingsContext.Provider
            value={[
                state,
                {
                    setHighlightFaces,
                    setMargin,
                    setShowBreadcrumbs,
                    setShowMainBreadcrumbs,
                    setThumbnailSize,
                    setDimThumbnails,
                    setShowFavoritesBadge,
                    setShowTypesBadge
                }
            ]}
        >
            {props.children}
        </MediaGridViewSettingsContext.Provider>
    );
};

export const useMediaGridViewSettingsContext = () => {
    const ctx = useContext(MediaGridViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaGridViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultMediaGridViewSettings,
        ...loadJson(KEY_SETTINGS_MEDIA_VIEW_GRID, defaultMediaGridViewSettings)
    };
}

function saveState(state: MediaGridViewSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_VIEW_GRID, state);
}
