import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoViewMode } from '../models/photo-view-mode';
import { PhotoPageSettingsState, defaultPhotoPageSettings, loadPhotoPageSettings } from '../models/settings';

export type PhotoPageSettingsContextValue = [
    state: PhotoPageSettingsState,
    actions: {
        setViewMode: (viewMode: PhotoViewMode) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const PhotoPageSettingsContext = createContext<PhotoPageSettingsContextValue>([
    defaultPhotoPageSettings,
    {
        setViewMode: () => undefined,
        setSlideshowDisplayDurationSeconds: () => undefined
    }
]);

export const PhotoPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadPhotoPageSettings());

    const setViewMode = (viewMode: PhotoViewMode) => {
        setState({viewMode: viewMode});
    };

    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) => {
        setState({slideshowDisplayDurationSeconds: slideshowDisplayDurationSeconds});
    }

    return (
        <PhotoPageSettingsContext.Provider value={[state, { setViewMode, setSlideshowDisplayDurationSeconds }]}>
            {props.children}
        </PhotoPageSettingsContext.Provider>
    );
}

export const usePhotoPageSettings = () => useContext(PhotoPageSettingsContext);
