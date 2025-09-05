import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMediaView, MediaViewIdType } from "../../_models/MediaViewMode";
import { KEY_SETTINGS_MEDIA_PAGE, loadJson, saveJson } from "./_storage";

export type MediaPageSettingsState = {
    readonly view: MediaViewIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultMediaPageSettings: MediaPageSettingsState = {
    view: defaultMediaView,
    slideshowDisplayDurationSeconds: 2
};

export type MediaPageSettingsContextValue = [
    state: MediaPageSettingsState,
    actions: {
        setView: (view: MediaViewIdType) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const MediaPageSettingsContext = createContext<MediaPageSettingsContextValue>();

export const MediaPageSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (view: MediaViewIdType) => updateState({ view: view });
    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) =>
        updateState({ slideshowDisplayDurationSeconds });

    const updateState = (update: Partial<MediaPageSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaPageSettingsContext.Provider
            value={[state, { setView: setViewMode, setSlideshowDisplayDurationSeconds }]}
        >
            {props.children}
        </MediaPageSettingsContext.Provider>
    );
};

export const useMediaPageSettingsContext = () => {
    const ctx = useContext(MediaPageSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaPageSettings context not provided by ancestor component!");
};

function loadState() {
    return loadJson(KEY_SETTINGS_MEDIA_PAGE, defaultMediaPageSettings);
}

function saveState(state: MediaPageSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_PAGE, state);
}
