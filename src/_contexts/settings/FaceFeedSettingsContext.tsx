import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_FACE_FEED, loadJson, saveJson } from "./_storage";

/*
   How a person's or clan's media is shaped when it is opened.

   Unlike the other view settings these are remembered *defaults* rather than the
   live state. A feed reads its filter from the url - that is what lets a link
   reproduce an ordering, and what keeps paging stable across a shuffle - so
   these say what the url should be when it does not say anything itself.

   The seed is deliberately not stored. It identifies one shuffle, and a
   remembered one would hand back the same "random" order every time; only the
   preference to shuffle at all is worth keeping.
*/
export interface FaceFeedSettingsState {
    readonly favoritesOnly: boolean;
    readonly shuffle: boolean;
}

export const defaultFaceFeedSettings: FaceFeedSettingsState = {
    favoritesOnly: false,
    shuffle: false
};

export type FaceFeedSettingsContextValue = [
    state: FaceFeedSettingsState,
    actions: {
        setFavoritesOnly: (favoritesOnly: boolean) => void;
        setShuffle: (shuffle: boolean) => void;
    }
];

const FaceFeedSettingsContext = createContext<FaceFeedSettingsContextValue>();

export const FaceFeedSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setFavoritesOnly = (favoritesOnly: boolean) => updateState({ favoritesOnly });
    const setShuffle = (shuffle: boolean) => updateState({ shuffle });

    const updateState = (update: Partial<FaceFeedSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <FaceFeedSettingsContext.Provider value={[state, { setFavoritesOnly, setShuffle }]}>
            {props.children}
        </FaceFeedSettingsContext.Provider>
    );
};

export const useFaceFeedSettingsContext = () => {
    const ctx = useContext(FaceFeedSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("FaceFeedSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultFaceFeedSettings,
        ...loadJson(KEY_SETTINGS_FACE_FEED, defaultFaceFeedSettings)
    };
}

function saveState(state: FaceFeedSettingsState) {
    saveJson(KEY_SETTINGS_FACE_FEED, state);
}
