import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { RandomDetailViewSettingsState, defaultRandomDetailViewSettings, loadRandomDetailViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type RandomDetailViewSettingsContextValue = [
    state: RandomDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
        setShowPhotoList: (showPhotoList: boolean) => void;
    }
];

const RandomDetailViewSettingsContext = createContext<RandomDetailViewSettingsContextValue>([
    defaultRandomDetailViewSettings,
    {
        setShowBreadcrumbs: () => undefined,
        setThumbnailSize: () => undefined,
        setShowPhotoList: () => undefined
    }
]);

export const RandomDetailSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadRandomDetailViewSettings());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => {
        setState({showBreadcrumbs: showBreadcrumbs});
    };

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    const setShowPhotoList = (showPhotoList: boolean) => {
        setState({showPhotoList: showPhotoList});
    }

    return (
        <RandomDetailViewSettingsContext.Provider value={[state, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize }]}>
            {props.children}
        </RandomDetailViewSettingsContext.Provider>
    );
}

export const useRandomDetailViewSettings = () => useContext(RandomDetailViewSettingsContext);
