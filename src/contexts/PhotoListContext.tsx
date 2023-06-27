import { ParentComponent, createContext, useContext } from 'solid-js';

import { Photo } from '../models/Photo';
import { createStore } from 'solid-js/store';
import { GpsCoordinate } from '../api/models/GpsCoordinate';
import { useNavigate } from '@solidjs/router';
import { categoriesPhotosGrid, getPhotoCategoryRoutePath } from '../categories-photos/_routes';

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
        setGpsOverride: (photoId: number, coord: GpsCoordinate) => void;
        moveFirst: () => void;
        moveNext: () => void;
        movePrevious: () => void;
        moveLast: () => void;
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
        setGpsOverride: () => undefined,
        moveFirst: () => undefined,
        moveNext: () => undefined,
        movePrevious: () => undefined,
        moveLast: () => undefined
    }
]);

export const PhotoListProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultPhotoListState);
    const navigate = useNavigate();

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

    const navigateToPhoto = (photo: Photo) => {
        if(photo) {
            navigate(getPhotoCategoryRoutePath(categoriesPhotosGrid, photo.categoryId, photo.id));
        }
    }

    const moveFirst = () => {
        navigateToPhoto(state.photos[0]);
    }

    const moveNext = () => {
        navigateToPhoto(getNextPhoto());
    }

    const movePrevious = () => {
        navigateToPhoto(getPreviousPhoto())
    }

    const moveLast = () => {
        navigateToPhoto(state.photos[state.photos.length - 1]);
    }

    const setGpsOverride = (photoId: number, coord: GpsCoordinate) => {
        const idx = state.photos.findIndex(p => p.id === photoId);

        setState(
            "photos",
            idx,
            "latitude",
            {
                latitude: coord.latitude,
                longitude: coord.longitude
            }
        );
    }

    return (
        <PhotoListContext.Provider value={[state, {
            setPhotos,
            setActivePhoto,
            activePhotoIsFirst,
            activePhotoIsLast,
            getNextPhoto,
            getPreviousPhoto,
            setGpsOverride,
            moveFirst,
            moveNext,
            movePrevious,
            moveLast
        }]}>
            {props.children}
        </PhotoListContext.Provider>
    )
}

export const usePhotoListContext = () => useContext(PhotoListContext);
