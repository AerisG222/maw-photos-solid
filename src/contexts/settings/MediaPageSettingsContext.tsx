import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMediaViewMode, MediaViewModeIdType } from "../../_models/MediaViewMode";
import { KEY_SETTINGS_MEDIA_PAGE, loadJson, saveJson } from "./_storage";

export type MediaPageSettingsState = {
    readonly viewMode: MediaViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultMediaPageSettings: MediaPageSettingsState = {
    viewMode: defaultMediaViewMode,
    slideshowDisplayDurationSeconds: 2,
};

export type MediaPageSettingsContextValue = [
    state: MediaPageSettingsState,
    actions: {
        setViewMode: (viewMode: MediaViewModeIdType) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const MediaPageSettingsContext = createContext<MediaPageSettingsContextValue>();

export const MediaPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: MediaViewModeIdType) => updateState({viewMode});
    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) => updateState({slideshowDisplayDurationSeconds});

    const updateState = (update: Partial<MediaPageSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaPageSettingsContext.Provider value={[state, { setViewMode, setSlideshowDisplayDurationSeconds }]}>
            {props.children}
        </MediaPageSettingsContext.Provider>
    );
};

export const useMediaPageSettingsContext = () => useContext(MediaPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_MEDIA_PAGE, defaultMediaPageSettings);
}

function saveState(state: MediaPageSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_PAGE, state);
}
