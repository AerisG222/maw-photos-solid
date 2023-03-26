import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoViewMode } from '../models/photo-view-mode';
import { RandomPageSettingsState, defaultRandomPageSettings, loadRandomPageSettings } from '../models/settings';

export type RandomPageSettingsContextValue = [
    state: RandomPageSettingsState,
    actions: {
        setViewMode: (viewMode: PhotoViewMode) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const RandomPageSettingsContext = createContext<RandomPageSettingsContextValue>([
    defaultRandomPageSettings,
    {
        setViewMode: () => undefined,
        setSlideshowDisplayDurationSeconds: () => undefined
    }
]);

export const RandomPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadRandomPageSettings());

    const setViewMode = (viewMode: PhotoViewMode) => {
        setState({viewMode: viewMode});
    };

    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) => {
        setState({slideshowDisplayDurationSeconds: slideshowDisplayDurationSeconds});
    }

    return (
        <RandomPageSettingsContext.Provider value={[state, { setViewMode, setSlideshowDisplayDurationSeconds }]}>
            {props.children}
        </RandomPageSettingsContext.Provider>
    );
}

export const useRandomPageSettings = () => useContext(RandomPageSettingsContext);
