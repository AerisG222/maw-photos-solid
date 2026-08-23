import { Component, createSignal, Match, Show, Switch } from "solid-js";

import { Media } from "../_models/Media";
import { useVisualEffectsContext } from "./contexts/VisualEffectsContext";
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
    showFavoriteBadge: boolean;
    moveNext: () => void;
    movePrevious: () => void;
    setActiveMediaElement?: (el: HTMLImageElement | HTMLVideoElement) => void;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
}

const MainItem: Component<Props> = props => {
    const [, { getFilterStyles, getTransformStyles }] = useVisualEffectsContext();
    const { getScalesForMain } = useConfigContext();

    // the element itself, which is the only thing that knows the source
    // dimensions the face boxes are expressed against
    const [mediaElement, setMediaElement] = createSignal<
        HTMLImageElement | HTMLVideoElement | undefined
    >();

    const highlight = useFaceHighlight(() => props.media, mediaElement);

    let mediaHolderDiv!: HTMLDivElement;

    const handleSwipe = (direction: SWIPE_DIRECTION) => {
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
            <div class="relative h-full w-full self-center">
                <div
                    ref={mediaHolderDiv}
                    use:swipe={handleSwipe}
                    use:tap={handleTap}
                    // relative so the face boxes measure against the photo's own
                    // box - a transform would establish that too, but only while
                    // one is actually applied
                    class="relative h-full w-full max-h-dvh max-w-full object-contain"
                    style={`${getTransformStyles()} ${getFilterStyles()}`}
                >
                    <Switch>
                        <Match when={props.media.type === "photo"}>
                            <MainPhoto url={getMediaUrl()} setActiveMediaElement={captureElement} />
                        </Match>
                        <Match when={props.media.type === "video"}>
                            <MainVideo url={getMediaUrl()} setActiveMediaElement={captureElement} />
                        </Match>
                    </Switch>

                    {/* inside the transform, so the boxes turn with the photo */}
                    <Show when={highlight.isEnabled()}>
                        <FaceBoxes highlight={highlight} />
                    </Show>
                </div>

                {/* outside it, so the controls stay upright */}
                <Show when={highlight.isEnabled()}>
                    <FacePeopleStrip highlight={highlight} />
                </Show>

                <Show when={props.showFavoriteBadge}>
                    <div class="absolute top-0 left-0 m-2">
                        <IconButton buttonClasses="hover:text-primary" onClick={onClickFavorite}>
                            <FavoriteIcon
                                isFavorite={props.media.isFavorite}
                                subjectId={props.media.id}
                            />
                        </IconButton>
                    </div>
                </Show>
            </div>
        </Show>
    );
};

export default MainItem;
