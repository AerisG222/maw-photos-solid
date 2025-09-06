import { Component, Match, Show, Switch } from "solid-js";

import { Media } from "../_models/Media";
import { useVisualEffectsContext } from "./contexts/VisualEffectsContext";
import { SWIPE_LEFT, SWIPE_RIGHT, swipe } from "../_directives/Swipe";
import { tap } from "../_directives/Tap";
import { useConfigContext } from "../_contexts/api/ConfigContext";

false && swipe;
false && tap;

import MainPhoto from "./MainPhoto";
import MainVideo from "./MainVideo";

interface Props {
    media: Media;
    maxHeightStyle?: string;
    moveNext: () => void;
    movePrevious: () => void;
    setActiveMediaElement?: (el: HTMLImageElement | HTMLVideoElement) => void;
}

const MainItem: Component<Props> = props => {
    const [, { getFilterStyles, getTransformStyles }] = useVisualEffectsContext();
    const { getScalesForMain } = useConfigContext();

    let mediaHolderDiv: HTMLDivElement;

    const handleSwipe = direction => {
        if (direction === SWIPE_LEFT) {
            props.movePrevious();
        } else if (direction === SWIPE_RIGHT) {
            props.moveNext();
        }
    };

    // video elements were not recognizing click events when on mobile, so we
    // try to and handle this here by listening for taps instead
    const handleTap = () => {
        mediaHolderDiv!.click();
    };

    const getMediaUrl = () => {
        const scales = getScalesForMain();

        for (const scale of scales) {
            const file = props.media.files.find(f => f.scale === scale.code);

            if (file) {
                return file.path;
            }
        }

        return props.media.files.find(f => f.scale === "full-hd")?.path ?? "";
    };

    return (
        <Show when={props.media}>
            <div
                ref={mediaHolderDiv}
                use:swipe={handleSwipe}
                use:tap={handleTap}
                class="h-full w-full max-h-screen max-w-full object-contain self-center"
                style={`${props.maxHeightStyle ?? ""} ${getTransformStyles()} ${getFilterStyles()}`}
            >
                <Switch>
                    <Match when={props.media.type === "photo"}>
                        <MainPhoto
                            url={getMediaUrl()}
                            setActiveMediaElement={x =>
                                props.setActiveMediaElement ? props.setActiveMediaElement(x) : {}
                            }
                        />
                    </Match>
                    <Match when={props.media.type === "video"}>
                        <MainVideo
                            url={getMediaUrl()}
                            setActiveMediaElement={x =>
                                props.setActiveMediaElement ? props.setActiveMediaElement(x) : {}
                            }
                        />
                    </Match>
                </Switch>
            </div>
        </Show>
    );
};

export default MainItem;
