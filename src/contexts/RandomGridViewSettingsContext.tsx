import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { RandomGridViewSettingsState, defaultRandomGridViewSettings, loadRandomGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type RandomGridViewSettingsContextValue = [
    state: RandomGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
    }
];

const RandomGridViewSettingsContext = createContext<RandomGridViewSettingsContextValue>([
    defaultRandomGridViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined,
        setShowBreadcrumbs: () => undefined
    }
]);

export const RandomGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadRandomGridViewSettings());

    const setMargin = (margin: Margin) => {
        setState({margin: margin});
    };

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => {
        setState({showBreadcrumbs: showBreadcrumbs});
    }

    return (
        <RandomGridViewSettingsContext.Provider value={[state, { setMargin, setShowBreadcrumbs, setThumbnailSize }]}>
            {props.children}
        </RandomGridViewSettingsContext.Provider>
    );
}

export const useRandomGridViewSettings = () => useContext(RandomGridViewSettingsContext);
