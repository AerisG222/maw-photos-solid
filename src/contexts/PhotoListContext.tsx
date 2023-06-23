import { ParentComponent, createContext, useContext } from 'solid-js';

import { Photo } from '../models/Photo';
import { createStore } from 'solid-js/store';

export type PhotoListState = {
    readonly photos: Photo[];
    readonly activePhoto: Photo;
    readonly activeIndex: number;
}

export const defaultPhotoListState = {
    photos: [],
    activePhoto: undefined,
    activeIndex: undefined
}

export type PhotoListContextValue = [
    state: PhotoListState,
    actions: {
        setPhotos: (photos: Photo[]) => void;
        setActivePhoto: (photoId: number) => void;
        activePhotoIsFirst: () => boolean;
        activePhotoIsLast: () => boolean;
        getNextPhoto: () => Photo | undefined;
        getPreviousPhoto: () => Photo | undefined;
        moveNext: () => void;
        movePrevious: () => void;
    }
];

const PhotoListContext = createContext<PhotoListContextValue>([
    defaultPhotoListState,
    {
        setPhotos: () => undefined,
        setActivePhoto: () => undefined,
        activePhotoIsFirst: () => undefined,
        activePhotoIsLast: () => undefined,
        getNextPhoto: () => undefined,
        getPreviousPhoto: () => undefined,
        moveNext: () => undefined,
        movePrevious: () => undefined
    }
]);

export const PhotoListProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultPhotoListState);

    const setPhotos = (photos: Photo[]) => {
        setState({ photos: photos });
        setActivePhoto(state.activePhoto?.id);
    };

    const setActivePhoto = (photoId: number) => {
        if(photoId) {
            const idx = state.photos.findIndex(x => x.id === photoId);

            setActivePhotoByIndex(idx);
        } else {
            unsetActivePhoto();
        }
    }

    const activePhotoIsFirst = () => state.activeIndex === 0;
    const activePhotoIsLast = () => state.activeIndex === state.photos.length - 1;

    const unsetActivePhoto = () => {
        setState({
            activePhoto: undefined,
            activeIndex: undefined
        });
    }

    const setActivePhotoByIndex = (index: number) => {
        if(index < 0 || index >= state.photos.length) {
            setState({
                activePhoto: undefined,
                activeIndex: undefined
            })
        } else {
            setState({
                activePhoto: state.photos[index],
                activeIndex: index
            });
        }
    }

    const getNextPhoto = () => {
        if(activePhotoIsLast()) {
            return undefined;
        }

        return state.photos[state.activeIndex + 1];
    }

    const getPreviousPhoto = () => {
        if(activePhotoIsFirst()) {
            return undefined;
        }

        return state.photos[state.activeIndex - 1];
    }

    const moveNext = () => {
        console.log("NEED TO UPDATE URL HERE!");
        setActivePhotoByIndex(state.activeIndex + 1);
    }

    const movePrevious = () => {
        setActivePhotoByIndex(state.activeIndex - 1);
        console.log("NEED TO UPDATE URL HERE!");
    }

    return (
        <PhotoListContext.Provider value={[state, {
            setPhotos,
            setActivePhoto,
            activePhotoIsFirst,
            activePhotoIsLast,
            getNextPhoto,
            getPreviousPhoto,
            moveNext,
            movePrevious
        }]}>
            {props.children}
        </PhotoListContext.Provider>
    )
}

export const usePhotoListContext = () => useContext(PhotoListContext);
