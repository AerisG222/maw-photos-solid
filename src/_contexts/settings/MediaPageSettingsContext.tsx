import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMediaView, MediaView } from "../../_models/MediaView";
import { KEY_SETTINGS_MEDIA_PAGE, loadJson, saveJson } from "./_storage";

export interface MediaPageSettingsState {
    readonly view: MediaView;
    readonly slideshowDisplayDurationSeconds: number;
    /*
       Face highlighting is a mode rather than a per-view preference: someone who
       turned it on in the grid means it in detail and fullscreen too, so it
       lives here with the settings the media views share instead of being
       repeated - and separately toggled - in all three.
    */
    readonly highlightFaces: boolean;
}

export const defaultMediaPageSettings: MediaPageSettingsState = {
    view: defaultMediaView,
    slideshowDisplayDurationSeconds: 2,
    highlightFaces: false
};

export type MediaPageSettingsContextValue = [
    state: MediaPageSettingsState,
    actions: {
        setView: (view: MediaView) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
        setHighlightFaces: (highlightFaces: boolean) => void;
    }
];

const MediaPageSettingsContext = createContext<MediaPageSettingsContextValue>();

export const MediaPageSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (view: MediaView) => updateState({ view: view });
    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) =>
        updateState({ slideshowDisplayDurationSeconds });
    const setHighlightFaces = (highlightFaces: boolean) => updateState({ highlightFaces });

    const updateState = (update: Partial<MediaPageSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaPageSettingsContext.Provider
            value={[
                state,
                { setView: setViewMode, setSlideshowDisplayDurationSeconds, setHighlightFaces }
            ]}
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
