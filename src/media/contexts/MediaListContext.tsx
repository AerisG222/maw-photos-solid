import {
    ParentComponent,
    batch,
    createContext,
    createMemo,
    createSignal,
    useContext
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { createStore } from "solid-js/store";

import { GpsCoordinate } from "../../_models/GpsCoordinate";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { Media } from "../../_models/Media";
import { getMediaPath } from "../../media/_routes";

export type MediaListState = {
    readonly items: Media[];
    readonly activeItem: Media | undefined;
    readonly activeIndex: number;
    readonly activeRouteDefinition: AppRouteDefinition;
    readonly mediaElement: HTMLImageElement | HTMLVideoElement;
};

export const defaultMediaListState = {
    items: [],
    activeItem: undefined,
    activeIndex: undefined,
    activeRouteDefinition: undefined,
    mediaElement: undefined
};

export type MediaListContextValue = [
    state: MediaListState,
    actions: {
        clearFilter: () => void;
        setFilter: (predicate: (media: Media) => boolean) => void;
        getFilteredMedia: () => Media[];
        setActiveRouteDefinition: (def: AppRouteDefinition) => void;
        setItems: (media: Media[]) => void;
        addItems: (media: Media[]) => void;
        setActiveItem: (id: Uuid | undefined) => void;
        setMediaElement: (el: HTMLImageElement | HTMLVideoElement) => void;
        activeItemIsFirst: () => boolean;
        activeItemIsLast: () => boolean;
        getNextItem: () => Media | undefined;
        getPreviousItem: () => Media | undefined;
        setGpsOverride: (id: Uuid, coord: GpsCoordinate) => void;
        moveFirst: () => void;
        moveNext: () => void;
        movePrevious: () => void;
        moveLast: () => void;
        navigateToItem: (media: Media) => void;
    }
];

const MediaListContext = createContext<MediaListContextValue>();

export const MediaListProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultMediaListState);
    const params = useParams();
    const navigate = useNavigate();
    const nonFilter = { filter: (media: Media) => true };
    const [filterSignal, setFilterSignal] = createSignal(nonFilter);

    const clearFilter = () => setFilterSignal(nonFilter);

    const setFilter = (predicate: (media: Media) => boolean) => {
        batch(() => {
            if (!predicate(state.activeItem)) {
                unsetActiveItem();
            }

            setFilterSignal({ filter: predicate });
        });
    };

    const getFilteredMedia = createMemo(() => state.items.filter(filterSignal().filter));

    const setActiveRouteDefinition = (activeRouteDefinition: AppRouteDefinition) => {
        setState({ activeRouteDefinition });
    };

    const setItems = (items: Media[]) => {
        setState({ items });
        setActiveItem(state.activeItem?.id);
    };

    const addItems = (media: Media[]) => {
        if (media) {
            setState(s => ({ items: [...s.items, ...media] }));
        }
    };

    const setActiveItem = (id: Uuid | undefined) => {
        if (id) {
            const idx = state.items.findIndex(x => x.id === id);

            setActiveItemByIndex(idx);
        } else {
            unsetActiveItem();
        }
    };

    const setMediaElement = (el: HTMLImageElement | HTMLVideoElement) =>
        setState({ mediaElement: el });

    const activeItemIsFirst = () => {
        const media = getFilteredMedia();

        if (media.length === 0) {
            return false;
        } else {
            return media[0].id === state.activeItem?.id;
        }
    };

    const activeItemIsLast = () => {
        const media = getFilteredMedia();

        if (media.length === 0) {
            return false;
        } else {
            return media[media.length - 1].id === state.activeItem?.id;
        }
    };

    const unsetActiveItem = () => {
        setState({
            activeItem: undefined,
            activeIndex: undefined,
            mediaElement: undefined
        });
    };

    const setActiveItemByIndex = (index: number) => {
        if (index < 0 || index >= state.items.length) {
            unsetActiveItem();
        } else {
            setState({
                activeItem: state.items[index],
                activeIndex: index
            });
        }
    };

    const getNextItem = () => {
        if (activeItemIsLast()) {
            return undefined;
        }

        const media = getFilteredMedia();
        const currIdx = media.findIndex(m => m.id === state.activeItem.id);

        return media[currIdx + 1];
    };

    const getPreviousItem = () => {
        if (activeItemIsFirst()) {
            return undefined;
        }

        const media = getFilteredMedia();
        const currIdx = media.findIndex(m => m.id === state.activeItem.id);

        return media[currIdx - 1];
    };

    const navigateToItem = (media: Media) => {
        if (media && state.activeRouteDefinition) {
            navigate(
                getMediaPath(state.activeRouteDefinition, params.categoryId as Uuid, media.id)
            );
        }
    };

    const moveFirst = () => {
        const media = getFilteredMedia();

        if (media.length > 0) {
            navigateToItem(media[0]);
        }
    };

    const moveNext = () => {
        navigateToItem(getNextItem());
    };

    const movePrevious = () => {
        navigateToItem(getPreviousItem());
    };

    const moveLast = () => {
        const media = getFilteredMedia();

        if (media.length > 0) {
            navigateToItem(media[media.length - 1]);
        }
    };

    const setGpsOverride = (id: Uuid, coord: GpsCoordinate) => {
        const idx = state.items.findIndex(p => p.id === id);

        setState("items", idx, {
            latitude: coord.latitude,
            longitude: coord.longitude
        });
    };

    return (
        <MediaListContext.Provider
            value={[
                state,
                {
                    clearFilter,
                    setFilter,
                    getFilteredMedia,
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
                    moveLast,
                    navigateToItem
                }
            ]}
        >
            {props.children}
        </MediaListContext.Provider>
    );
};

export const useMediaListContext = () => {
    const ctx = useContext(MediaListContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaList context not provided by ancestor component!");
};
