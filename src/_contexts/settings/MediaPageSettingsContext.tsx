import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMediaView, MediaView } from "../../_models/MediaView";
import { KEY_SETTINGS_MEDIA_PAGE, loadJson, saveJson } from "./_storage";

export interface MediaPageSettingsState {
    readonly view: MediaView;
    readonly slideshowDisplayDurationSeconds: number;
}

export const defaultMediaPageSettings: MediaPageSettingsState = {
    view: defaultMediaView,
    slideshowDisplayDurationSeconds: 2
};

export type MediaPageSettingsContextValue = [
    state: MediaPageSettingsState,
    actions: {
        setView: (view: MediaView) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const MediaPageSettingsContext = createContext<MediaPageSettingsContextValue>();

export const MediaPageSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (view: MediaView) => updateState({ view: view });
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
    return {
        ...defaultMediaPageSettings,
        ...loadJson(KEY_SETTINGS_MEDIA_PAGE, defaultMediaPageSettings)
    };
}

function saveState(state: MediaPageSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_PAGE, state);
}
