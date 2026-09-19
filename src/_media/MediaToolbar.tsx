import { Component, JSXElement, Show, children } from "solid-js";

import { MediaView, MediaViewGrid, MediaViewMap } from "../_models/MediaView";
import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { IMediaService } from "./services/IMediaService";
import { SlideshowService } from "./services/SlideshowService";

import ListingToolbar from "../_components/listing/ListingToolbar";
import RequestMoreButton from "../_components/toolbar/RequestMoreButton";
import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import AdjustShortcuts from "./toolbar/AdjustShortcuts";
import FavoriteShortcut from "./toolbar/FavoriteShortcut";
import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import ToolbarButton from "../_components/toolbar/ToolbarButton";

interface Props {
    view: MediaView;
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    /*
       Controls belonging to the feed rather than to this view - a person's
       favorites filter and shuffle. First in the group, ahead of request more
       and the slideshow: they decide *what* the list holds, which outranks
       moving around inside it.
    */
    extras?: JSXElement;
}

/*
   One toolbar for every way of looking at media.

   There were three, and they had drifted the way separate copies do. The grid
   and fullscreen ones were near-identical - the same paging, the same slideshow,
   the same rotate and flip, in slightly different orders. The map had neither a
   slideshow nor anything else, just previous and next, because nobody had gone
   back to it.

   What differs between the views is declared below rather than duplicated: a map
   shows a map, so there is nothing to rotate and no tile to badge; a grid is the
   only one that lays out tiles, so it is the only one asking about their
   density. Everything else is the same everywhere because there was never a
   reason for it not to be.
*/
const MediaToolbar: Component<Props> = props => {
    const [fullscreen, { setFullscreen }] = useFullscreenContext();
    /*
       Resolved once. Reading a JSX prop twice - here and in the Show below -
       builds the component twice, and each copy registers its own keyboard
       shortcuts, so the filter keys would fire in pairs and cancel out.
    */
    const extras = children(() => props.extras);

    const activeMedia = () => props.mediaService.getActiveMedia();

    // the map draws markers, not a photograph: nothing to turn over or highlight
    const showsPhotograph = () => props.view !== MediaViewMap;
    // only the grid lays out tiles, so only the grid asks how densely
    const laysOutTiles = () => props.view === MediaViewGrid;

    return (
        <>
            {extras()}

            {/* a group of their own: they decide what the listing holds, where
                everything after them acts on what is already in it */}
            <Show when={extras()}>
                <ToolbarDivider />
            </Show>

            <RequestMoreButton
                disabled={!props.mediaService.canRequestMore()}
                requestMore={() => props.mediaService.requestMore()}
            />

            {/*
                On the map too, which had no slideshow at all. Watching it step
                between markers is the best thing that view does.
            */}
            <ToggleSlideshowButton
                isPlaying={props.slideshowService.isPlaying()}
                toggleSlideshow={() => props.slideshowService.toggle()}
            />

            {/*
                On a phone as well. Swiping already moved between photographs
                there, but only on the photograph itself - which left no visible
                way to do it at all, and nothing to say the gesture existed.
            */}
            {/*
                Fullscreen, where fullscreen means something: a photograph open
                on the grid. It was a view of its own until it became clear that
                what it offered was the absence of this toolbar - which is a
                state rather than a destination, and one the grid can hold.

                `f` was free. It is the only letter in the map that names what
                it does, which is an accident of the old keys not having claimed
                it rather than a scheme.
            */}
            <Show when={laysOutTiles() && activeMedia()}>
                <ToolbarButton
                    icon={
                        fullscreen.isFullscreen
                            ? "icon-[ic--round-fullscreen-exit]"
                            : "icon-[ic--round-fullscreen]"
                    }
                    name="Fullscreen"
                    tooltip="Fill the screen with this photograph"
                    shortcutKeys={["f"]}
                    active={fullscreen.isFullscreen}
                    clickHandler={() => setFullscreen(!fullscreen.isFullscreen)}
                />
            </Show>

            <Show when={activeMedia()}>
                <MovePreviousButton
                    isFirst={props.mediaService.isActiveMediaFirst()}
                    movePrevious={() => props.mediaService.movePrevious()}
                />
                <MoveNextButton
                    isLast={props.mediaService.isActiveMediaLast()}
                    moveNext={() => props.mediaService.moveNext()}
                />
            </Show>

            <Show when={showsPhotograph()}>
                <ToolbarDivider />

                {/*
                    No buttons: the four of them moved into the Inspector's
                    Adjust card, next to the sliders they share a reset with.
                    The keys stay here, because the toolbar is mounted for as
                    long as a photograph is and a card is not.
                */}
                <Show when={activeMedia()}>
                    <AdjustShortcuts />
                </Show>

                {/*
                    Likewise keyless until now: the heart on a tile is the only
                    way to favorite anything, and it had no shortcut at all.
                    Only with a photograph open - on a listing nothing is
                    selected for it to act on.
                */}
                <FavoriteShortcut activeMedia={activeMedia()} />

                <ListingToolbar faces />
            </Show>
        </>
    );
};

export default MediaToolbar;
