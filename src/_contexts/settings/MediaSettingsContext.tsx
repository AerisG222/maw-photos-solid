import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { InspectorCardIdType, allInspectorCards } from "../../_models/InspectorCard";
import { MapTypeIdType } from "../../_models/MapType";
import { MapZoomLevelIdType } from "../../_models/MapZoomLevel";
import { MediaView, MediaViewAll, defaultMediaView } from "../../_models/MediaView";
import { MediaSettingsState, defaultMediaSettings } from "./_state";
import { loadMigrated } from "./_migrate";
import { KEY_SETTINGS_V2_MEDIA, saveJson } from "./_storage";

export type { MediaSettingsState } from "./_state";
export { defaultMediaSettings } from "./_state";

export type MediaSettingsContextValue = [
    state: MediaSettingsState,
    actions: {
        setView: (view: MediaView) => void;
        setSlideshowSeconds: (slideshowSeconds: number) => void;
        setMapType: (mapType: MapTypeIdType) => void;
        setMapZoom: (mapZoom: MapZoomLevelIdType) => void;
        setInspectorOpen: (inspectorOpen: boolean) => void;
        setInspectorCards: (inspectorCards: InspectorCardIdType[]) => void;
        toggleInspectorCard: (card: InspectorCardIdType) => void;
    }
];

const MediaSettingsContext = createContext<MediaSettingsContextValue>();

/*
   A view that no longer exists falls back to the grid.

   The detail view was deleted, and a reader whose saved view was "detail" would
   otherwise be sent to a route that is now only a redirect - on every visit.
   Checked on load rather than in the migration alone, because the migration runs
   once and somebody may already have carried "detail" into the new store.
*/
const sanitiseView = (settings: MediaSettingsState): MediaSettingsState =>
    MediaViewAll.includes(settings.view) ? settings : { ...settings, view: defaultMediaView };

export const MediaSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(
        sanitiseView(loadMigrated(KEY_SETTINGS_V2_MEDIA, defaultMediaSettings))
    );

    const updateState = (update: Partial<MediaSettingsState>) => {
        setState(update);
        saveJson(KEY_SETTINGS_V2_MEDIA, state);
    };

    const setView = (view: MediaView) => updateState({ view });

    const setSlideshowSeconds = (slideshowSeconds: number) => updateState({ slideshowSeconds });

    const setMapType = (mapType: MapTypeIdType) => updateState({ mapType });

    const setMapZoom = (mapZoom: MapZoomLevelIdType) => updateState({ mapZoom });

    const setInspectorOpen = (inspectorOpen: boolean) => updateState({ inspectorOpen });

    const setInspectorCards = (inspectorCards: InspectorCardIdType[]) =>
        updateState({ inspectorCards });

    /*
       Order is the rail's order, so a card re-opened later returns to where it
       was rather than jumping to the end.
    */
    const toggleInspectorCard = (card: InspectorCardIdType) =>
        updateState({
            inspectorCards: state.inspectorCards.includes(card)
                ? state.inspectorCards.filter((c: InspectorCardIdType) => c !== card)
                : allInspectorCards.filter(c => c === card || state.inspectorCards.includes(c))
        });

    return (
        <MediaSettingsContext.Provider
            value={[
                state,
                {
                    setView,
                    setSlideshowSeconds,
                    setMapType,
                    setMapZoom,
                    setInspectorOpen,
                    setInspectorCards,
                    toggleInspectorCard
                }
            ]}
        >
            {props.children}
        </MediaSettingsContext.Provider>
    );
};

export const useMediaSettingsContext = () => {
    const ctx = useContext(MediaSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaSettings context not provided by ancestor component!");
};
