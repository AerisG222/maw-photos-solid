import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_MEDIA_VIEW_FULLSCREEN, loadJson, saveJson } from "./_storage";

export interface MediaFullscreenViewSettingsState {
    readonly showFavoritesBadge: boolean;
}

export const defaultMediaFullscreenViewSettings: MediaFullscreenViewSettingsState = {
    showFavoritesBadge: false
};

export type MediaFullscreenViewSettingsContextValue = [
    state: MediaFullscreenViewSettingsState,
    actions: {
        setShowFavoritesBadge: (showFavoritesBadge: boolean) => void;
    }
];

const MediaFullscreenViewSettingsContext = createContext<MediaFullscreenViewSettingsContextValue>();

export const MediaFullscreenSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setShowFavoritesBadge = (showFavoritesBadge: boolean) =>
        updateState({ showFavoritesBadge });

    const updateState = (update: Partial<MediaFullscreenViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaFullscreenViewSettingsContext.Provider value={[state, { setShowFavoritesBadge }]}>
            {props.children}
        </MediaFullscreenViewSettingsContext.Provider>
    );
};

export const useMediaFullscreenViewSettingsContext = () => {
    const ctx = useContext(MediaFullscreenViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaFullscreenViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultMediaFullscreenViewSettings,
        ...loadJson(KEY_SETTINGS_MEDIA_VIEW_FULLSCREEN, defaultMediaFullscreenViewSettings)
    };
}

function saveState(state: MediaFullscreenViewSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_VIEW_FULLSCREEN, state);
}
