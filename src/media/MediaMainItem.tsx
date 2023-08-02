import { Component, Match, Show, Switch, createEffect } from "solid-js";

import { Media, MediaTypePhoto, MediaTypeVideo, Photo, Video } from "../_models/Media";
import { useVisualEffectsContext } from "./contexts/VisualEffectsContext";
import { useRouteDetailContext } from "../contexts/RouteDetailContext";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useCategoryContext } from "../contexts/CategoryContext";
import { CategoryTypePhotos } from "../_models/CategoryType";
import { useMediaListContext } from './contexts/MediaListContext';
import { SWIPE_LEFT, SWIPE_RIGHT, swipe } from '../directives/SwipeDirective';

false && swipe;

import MainPhoto from "./photos/MainPhoto";
import MainVideo from "./videos/MainVideo";

type Props = {
    media: Media;
    maxHeightStyle?: string;
}

const MediaMainItem: Component<Props> = (props) => {
    const [, { setActiveCategoryById }] = useCategoryContext();
    const [, { movePrevious, moveNext }] = useMediaListContext();
    const [routeContext] = useRouteDetailContext();
    const [, { getFilterStyles, getTransformStyles }] = useVisualEffectsContext();

    createEffect(() => {
        if(routeContext.area === AreaRandom && props.media) {
            // todo: if we ever mix photos and videos in a new category type, then this will need to
            // be updated to accomodate as we just assume photo categories today
            setActiveCategoryById(CategoryTypePhotos, props.media.categoryId);
        }
    });

    const handleSwipe = (direction) => {
        if(direction === SWIPE_LEFT) {
            movePrevious();
        } else if (direction === SWIPE_RIGHT) {
            moveNext();
        }
    };

    return (
        <Show when={props.media}>
            <div use:swipe={handleSwipe}
                class="h-100% w-100% max-h-100vh max-w-100% object-contain self-center"
                style={`${props.maxHeightStyle ?? ""} ${getTransformStyles()} ${getFilterStyles()}`}>
                <Switch>
                    <Match when={props.media.kind === MediaTypePhoto}>
                        <MainPhoto photo={props.media as Photo} />
                    </Match>
                    <Match when={props.media.kind === MediaTypeVideo}>
                        <MainVideo video={props.media as Video} />
                    </Match>
                </Switch>
            </div>
        </Show>
    );
};

export default MediaMainItem;
