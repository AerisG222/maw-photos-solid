import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoDetailViewSettingsState, defaultPhotoDetailViewSettings, loadPhotoDetailViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type PhotoDetailViewSettingsContextValue = [
    state: PhotoDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
        setShowPhotoList: (showPhotoList: boolean) => void;
    }
];

const PhotoDetailViewSettingsContext = createContext<PhotoDetailViewSettingsContextValue>([
    defaultPhotoDetailViewSettings,
    {
        setShowBreadcrumbs: () => undefined,
        setThumbnailSize: () => undefined,
        setShowPhotoList: () => undefined
    }
]);

export const PhotoDetailSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadPhotoDetailViewSettings());

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
        <PhotoDetailViewSettingsContext.Provider value={[state, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize }]}>
            {props.children}
        </PhotoDetailViewSettingsContext.Provider>
    );
}

export const usePhotoDetailViewSettings = () => useContext(PhotoDetailViewSettingsContext);
