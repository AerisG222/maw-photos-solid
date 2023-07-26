import { ParentComponent, createContext, createEffect, useContext } from 'solid-js';
import { useLocation, useNavigate, useParams } from '@solidjs/router';
import { createStore } from 'solid-js/store';

import { GpsCoordinate } from '../../_models/Gps';
import { AppRouteDefinition } from '../../_models/AppRouteDefinition';
import { Media, MediaListMode, MediaListModeCategory, MediaListModeRandom } from '../../_models/Media';
import { getMediaPath } from '../../media/_routes';
import { CategoryType } from '../../_models/CategoryType';

export type MediaListState = {
    readonly mode: MediaListMode;
    readonly items: Media[];
    readonly activeItem: Media;
    readonly activeIndex: number;
    readonly activeRouteDefinition: AppRouteDefinition;
    readonly mediaElement: HTMLImageElement | HTMLVideoElement;
};

export const defaultMediaListState = {
    mode: undefined,
    items: [],
    activeItem: undefined,
    activeIndex: undefined,
    activeRouteDefinition: undefined,
    mediaElement: undefined
}

export type MediaListContextValue = [
    state: MediaListState,
    actions: {
        setActiveRouteDefinition: (def: AppRouteDefinition) => void;
        setItems: (media: Media[]) => void;
        addItems: (media: Media[]) => void;
        setActiveItem: (id: number) => void;
        setMediaElement: (el: HTMLImageElement | HTMLVideoElement) => void;
        activeItemIsFirst: () => boolean;
        activeItemIsLast: () => boolean;
        getNextItem: () => Media | undefined;
        getPreviousItem: () => Media | undefined;
        setGpsOverride: (id: number, coord: GpsCoordinate) => void;
        moveFirst: () => void;
        moveNext: () => void;
        movePrevious: () => void;
        moveLast: () => void;
    }
];

const MediaListContext = createContext<MediaListContextValue>();

export const MediaListProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultMediaListState);
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    createEffect(() => {
        let mode = MediaListModeCategory;

        if(location.pathname.startsWith("/random")) {
            mode = MediaListModeRandom;
        }

        setState({mode});
    });

    const setActiveRouteDefinition = (activeRouteDefinition: AppRouteDefinition) => {
        setState({activeRouteDefinition});
    };

    const setItems = (items: Media[]) => {
        setState({ items });
        setActiveItem(state.activeItem?.id);
    };

    const addItems = (media: Media[]) => {
        if(media) {
            setState(s => ({ items: [...s.items, ...media] }));
        }
    };

    const setActiveItem = (id: number | undefined) => {
        if(id) {
            const idx = state.items.findIndex(x => x.id === id);

            setActiveItemByIndex(idx);
        } else {
            unsetActiveItem();
        }
    };

    const setMediaElement = (el: HTMLImageElement | HTMLVideoElement) => setState({mediaElement: el});

    const activeItemIsFirst = () => state.activeIndex === 0;
    const activeItemIsLast = () => state.activeIndex === state.items.length - 1;

    const unsetActiveItem = () => {
        setState({
            activeItem: undefined,
            activeIndex: undefined,
            mediaElement: undefined
        });
    };

    const setActiveItemByIndex = (index: number) => {
        if(index < 0 || index >= state.items.length) {
            unsetActiveItem();
        } else {
            setState({
                activeItem: state.items[index],
                activeIndex: index
            });
        }
    };

    const getNextItem = () => {
        if(activeItemIsLast()) {
            return undefined;
        }

        return state.items[state.activeIndex + 1];
    };

    const getPreviousItem = () => {
        if(activeItemIsFirst()) {
            return undefined;
        }

        return state.items[state.activeIndex - 1];
    };

    const navigateToItem = (media: Media) => {
        if(media && state.activeRouteDefinition) {
            navigate(getMediaPath(state.activeRouteDefinition, params.categoryType as CategoryType, parseInt(params.categoryId, 10), media.id));
        }
    };

    const moveFirst = () => {
        navigateToItem(state.items[0]);
    };

    const moveNext = () => {
        navigateToItem(getNextItem());
    };

    const movePrevious = () => {
        navigateToItem(getPreviousItem())
    };

    const moveLast = () => {
        navigateToItem(state.items[state.items.length - 1]);
    };

    const setGpsOverride = (id: number, coord: GpsCoordinate) => {
        const idx = state.items.findIndex(p => p.id === id);

        setState(
            "items",
            idx,
            {
                latitude: coord.latitude,
                longitude: coord.longitude
            }
        );
    };

    return (
        <MediaListContext.Provider value={[state, {
            setActiveRouteDefinition,
            setItems,
            addItems,
            setActiveItem,
            setMediaElement,
            activeItemIsFirst,
            activeItemIsLast,
            getNextItem,
            getPreviousItem,
            setGpsOverride,
            moveFirst,
            moveNext,
            movePrevious,
            moveLast
        }]}>
            {props.children}
        </MediaListContext.Provider>
    );
};

export const useMediaListContext = () => useContext(MediaListContext);