import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { PhotoGridViewSettingsState, defaultPhotoGridViewSettings, loadPhotoGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type PhotoGridViewSettingsContextValue = [
    state: PhotoGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
    }
];

const PhotoGridViewSettingsContext = createContext<PhotoGridViewSettingsContextValue>([
    defaultPhotoGridViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined,
        setShowBreadcrumbs: () => undefined
    }
]);

export const PhotoGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadPhotoGridViewSettings());

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
        <PhotoGridViewSettingsContext.Provider value={[state, { setMargin, setShowBreadcrumbs, setThumbnailSize }]}>
            {props.children}
        </PhotoGridViewSettingsContext.Provider>
    );
}

export const usePhotoGridViewSettings = () => useContext(PhotoGridViewSettingsContext);
