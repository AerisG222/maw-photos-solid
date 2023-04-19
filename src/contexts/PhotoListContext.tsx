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
    }
];

const PhotoListContext = createContext<PhotoListContextValue>([
    defaultPhotoListState,
    {
        setPhotos: () => undefined
    }
]);

export const PhotoListProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultPhotoListState);

    const setPhotos = (photos: Photo[]) => {
        setState({ photos: photos });
    };

    return (
        <PhotoListContext.Provider value={[state, {
            setPhotos
        }]}>
            {props.children}
        </PhotoListContext.Provider>
    )
}

export const usePhotoListContext = () => useContext(PhotoListContext);
