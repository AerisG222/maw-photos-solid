import { ParentComponent, createContext, useContext } from 'solid-js';

import { createStore } from 'solid-js/store';
import { GpsCoordinate } from '../api/models/GpsCoordinate';
import { useNavigate, useParams } from '@solidjs/router';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { Media } from '../models/Media';
import { getMediaPath } from '../media/_routes';
import { CategoryType } from '../models/CategoryType';

export type MediaListState = {
    readonly items: Media[];
    readonly activeItem: Media;
    readonly activeIndex: number;
    readonly activeRouteDefinition: AppRouteDefinition;
};

export const defaultMediaListState = {
    type: undefined,
    items: [],
    activeItem: undefined,
    activeIndex: undefined,
    activeRouteDefinition: undefined
}

export type MediaListContextValue = [
    state: MediaListState,
    actions: {
        setActiveRouteDefinition: (def: ActiveRouteDefinition) => void;
        setItems: (media: Media[]) => void;
        setActiveItem: (id: number) => void;
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

const MediaListContext = createContext<MediaListContextValue>([
    defaultMediaListState,
    {
        setActiveRouteDefinition: () => undefined,
        setItems: () => undefined,
        setActiveItem: () => undefined,
        activeItemIsFirst: () => undefined,
        activeItemIsLast: () => undefined,
        getNextItem: () => undefined,
        getPreviousItem: () => undefined,
        setGpsOverride: () => undefined,
        moveFirst: () => undefined,
        moveNext: () => undefined,
        movePrevious: () => undefined,
        moveLast: () => undefined,
    }
]);

export const MediaListProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultMediaListState);
    const params = useParams();
    const navigate = useNavigate();

    const setActiveRouteDefinition = (activeRouteDefinition: AppRouteDefinition) => {
        setState({activeRouteDefinition});
    };

    const setItems = (items: Media[]) => {
        setState({ items });
        setActiveItem(state.activeItem?.id);
    };

    const setActiveItem = (id: number | undefined) => {
        if(id) {
            const idx = state.items.findIndex(x => x.id === id);

            setActiveItemByIndex(idx);
        } else {
            unsetActiveItem();
        }
    };

    const activeItemIsFirst = () => state.activeIndex === 0;
    const activeItemIsLast = () => state.activeIndex === state.items.length - 1;

    const unsetActiveItem = () => {
        setState({
            activeItem: undefined,
            activeIndex: undefined
        });
    };

    const setActiveItemByIndex = (index: number) => {
        if(index < 0 || index >= state.items.length) {
            setState({
                activeItem: undefined,
                activeIndex: undefined
            })
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
            setActiveItem,
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
