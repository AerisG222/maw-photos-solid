import { ParentComponent, createContext, useContext } from 'solid-js';

import { Photo } from '../models/api/Photo';
import { createStore } from 'solid-js/store';

export type PhotoListState = {
    readonly photos: Photo[];
    readonly activePhoto: Photo;
    readonly activeIndex: number;
}

export const defaultPhotoListState = {
    photos: [],
    activePhoto: undefined,
    activeIndex: -1
}

export type PhotoListContextValue = [
    state: PhotoListState,
    actions: {
        setPhotos: (photos: Photo[]) => void;
        setActivePhoto: (photoId: number) => void;
    }
];

const PhotoListContext = createContext<PhotoListContextValue>([
    defaultPhotoListState,
    {
        setPhotos: () => undefined,
        setActivePhoto: () => undefined
    }
]);

export const PhotoListProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultPhotoListState);

    const setPhotos = (photos: Photo[]) => {
        setState({ photos: photos });
    };

    const setActivePhoto = (photoId: number) => {
        if(photoId) {
            const idx = state.photos.findIndex(x => x.id === photoId);
            const photo = state.photos[idx];
            setState({ activePhoto: photo, activeIndex: idx});
        } else {
            setState({ activePhoto: undefined, activeIndex: undefined});
        }
    }

    return (
        <PhotoListContext.Provider value={[state, {
            setPhotos,
            setActivePhoto
        }]}>
            {props.children}
        </PhotoListContext.Provider>
    )
}

export const usePhotoListContext = () => useContext(PhotoListContext);
