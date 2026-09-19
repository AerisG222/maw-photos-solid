import { Component, createSignal, Match, Show, Switch } from "solid-js";

import { Media } from "../_models/Media";
import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";
import {
    useResetEffectsOnMediaChange,
    useVisualEffectsContext
} from "./contexts/VisualEffectsContext";
import { createPanZoom } from "./_panZoom";
import { SWIPE_DIRECTION, SWIPE_LEFT, SWIPE_RIGHT, swipe } from "../_directives/Swipe";
import { tap } from "../_directives/Tap";
import { useConfigContext } from "../_contexts/api/ConfigContext";

// Reference the directives so the bundler keeps them for `use:swipe` / `use:tap`.
void swipe;
void tap;

import MainPhoto from "./MainPhoto";
import MainVideo from "./MainVideo";
import FaceBoxes from "./faces/FaceBoxes";
import FacePeopleStrip from "./faces/FacePeopleStrip";
import FavoriteIcon from "../_components/icon/FavoriteIcon";
import IconButton from "../_components/icon/IconButton";
import { useFaceHighlight } from "./faces/useFaceHighlight";

interface Props {
    media: Media;
    moveNext: () => void;
    movePrevious: () => void;
    setActiveMediaElement?: (el: HTMLImageElement | HTMLVideoElement) => void;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
}

const MainItem: Component<Props> = props => {
    const [listing] = useListingSettingsContext();
    const [, { getFilterStyles, getTransformStyles }] = useVisualEffectsContext();

    // a rotation or a sepia belongs to the photograph it was applied to, and
    // should not follow you to the next one - see the note in the context
    useResetEffectsOnMediaChange(() => props.media.id);
    const { getScalesForMain } = useConfigContext();

    // the element itself, which is the only thing that knows the source
    // dimensions the face boxes are expressed against
    const [mediaElement, setMediaElement] = createSignal<
        HTMLImageElement | HTMLVideoElement | undefined
    >();

    const highlight = useFaceHighlight(
        () => props.media,
        mediaElement,
        () => listing.highlightFaces
    );

    let mediaHolderDiv!: HTMLDivElement;

    const [zoomTarget, setZoomTarget] = createSignal<HTMLDivElement>();

    /*
       Pinch and wheel on the photograph, on an element of its own above the one
       carrying rotation - two transforms cannot share a style property. Panning
       turns on only once zoomed, so a drag at the resting size is still the
       swipe to the next photograph.
    */
    const { isZoomed } = createPanZoom(zoomTarget, () => props.media.id);

    const handleSwipe = (direction: SWIPE_DIRECTION) => {
        /*
           A drag while zoomed in is panning, not paging. Panzoom disables its
           own panning at the resting size for the mirror-image reason, so the
           two gestures never both answer.
        */
        if (isZoomed()) {
            return;
        }

        if (direction === SWIPE_LEFT) {
            props.movePrevious();
        } else if (direction === SWIPE_RIGHT) {
            props.moveNext();
        }
    };

    // video elements were not recognizing click events when on mobile, so we
    // try to and handle this here by listening for taps instead
    const handleTap = () => {
        mediaHolderDiv.click();
    };

    const getMediaUrl = () => {
        const scales = getScalesForMain();

        for (const scale of scales) {
            const file = props.media.files.find(
                f => f.scale === scale.code && f.type !== "video-poster"
            );

            if (file) {
                return file.path;
            }
        }

        return props.media.files.find(f => f.scale === "full-hd")?.path ?? "";
    };

    const captureElement = (el: HTMLImageElement | HTMLVideoElement) => {
        setMediaElement(el);
        props.setActiveMediaElement?.(el);
    };

    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.media, !props.media.isFavorite);
        }
    };

    return (
        <Show when={props.media}>
            <div class="relative h-full w-full self-center overflow-hidden">
                {/* the zoom's own element - see createPanZoom */}
                <div ref={setZoomTarget} class="h-full w-full">
                    <div
                        ref={mediaHolderDiv}
                        use:swipe={
                            /* a directive is handed the handler itself; solid wraps it in the
                           accessor swipe reads */
                            // eslint-disable-next-line solid/reactivity
                            handleSwipe
                        }
                        use:tap={handleTap}
                        // relative so the face boxes measure against the photo's own
                        // box - a transform would establish that too, but only while
                        // one is actually applied
                        class="relative h-full w-full max-h-dvh max-w-full object-contain"
                        // an object rather than a string: solid then diffs the two
                        // properties individually instead of rewriting cssText on
                        // every effect change.
                        //
                        // `view-transition-name` is what lets the browser recognise
                        // the photograph in the grid and the photograph in fullscreen
                        // as one thing and tween between them. Only ever one of these
                        // is on screen at a time, which the name requires.
                        style={{
                            ...getTransformStyles(),
                            ...getFilterStyles(),
                            "view-transition-name": "active-media"
                        }}
                    >
                        <Switch>
                            <Match when={props.media.type === "photo"}>
                                <MainPhoto
                                    url={getMediaUrl()}
                                    setActiveMediaElement={captureElement}
                                />
                            </Match>
                            <Match when={props.media.type === "video"}>
                                <MainVideo
                                    url={getMediaUrl()}
                                    setActiveMediaElement={captureElement}
                                />
                            </Match>
                        </Switch>

                        {/* inside the transform, so the boxes turn with the photo */}
                        <Show when={highlight.isEnabled()}>
                            <FaceBoxes highlight={highlight} />
                        </Show>
                    </div>
                </div>

                {/* outside the zoom as well as the rotation, so the controls
                    stay upright and stay put */}
                <Show when={highlight.isEnabled()}>
                    <FacePeopleStrip highlight={highlight} />
                </Show>

                <div class="absolute top-0 left-0 m-2">
                    <IconButton
                        label={
                            props.media.isFavorite ? "Remove from favourites" : "Add to favourites"
                        }
                        shortcutKeys={["h"]}
                        styledTooltip
                        // out of its corner along the top edge of the photograph
                        tooltipPlacement="right"
                        buttonClasses="hover:text-primary"
                        onClick={onClickFavorite}
                    >
                        <FavoriteIcon
                            isFavorite={props.media.isFavorite}
                            subjectId={props.media.id}
                        />
                    </IconButton>
                </div>
            </div>
        </Show>
    );
};

export default MainItem;
