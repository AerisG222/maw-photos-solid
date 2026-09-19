import {
    Component,
    createEffect,
    createSignal,
    JSXElement,
    onCleanup,
    onMount,
    Show
} from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { createElementSize, createWindowSize } from "@solid-primitives/resize-observer";

import { SlideshowService } from "./services/SlideshowService";
import { IMediaService } from "./services/IMediaService";
import { MediaViewGrid } from "../_models/MediaView";
import { favoriteSetter } from "../_models/utils/FavoriteUtils";
import { Media } from "../_models/Media";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { isEditableTarget } from "../_components/shortcuts/_util";
import { escapeAction } from "./_escape";

import MediaToolbar from "./MediaToolbar";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Inspector from "../_components/inspector/Inspector";
import Layout from "../_components/layout/Layout";
import MediaGrid from "../_media/MediaGrid";
import Icon from "../_components/icon/Icon";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    // names the feed when it is not self-evident from the media - a person's
    // photos span categories, so the breadcrumbs alone do not say whose they are
    title?: string;
    // a heading that is a component rather than a string - see Layout. The place
    // feeds pass their chain, which names the place and walks back up the tree
    header?: JSXElement;
    // controls belonging to the feed rather than to the grid, e.g. the filters
    // on a person's media. They sit in the toolbar so they stay reachable when
    // the feed they narrow comes back empty
    toolbarExtras?: JSXElement;
    // rendered ahead of the view links - see Toolbar
    toolbarLeading?: JSXElement;
    // how many navigation entries `toolbarLeading` holds - see Toolbar
    toolbarLeadingNavCount?: number;
    // shown in place of the tiles when the feed holds nothing, which a filtered
    // feed legitimately can
    emptyState?: JSXElement;
    /*
       Where the breadcrumbs go, which is a question about the feed rather than a
       preference. A category's grid names the category above the tiles; a
       person's spans categories, so the trail only means something on the
       photograph itself. Always shown in one place or the other - the toggles
       that used to hide them are gone.
    */
    showBreadcrumbsOnGrid: boolean;
    showBreadcrumbsOnMedia: boolean;
}

const ViewGrid: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();
    /*
       The enlarged photograph reads its pixels for the histogram card, which can
       now be opened here - a plain variable would notify nobody when it is set.
    */
    const [mediaElement, setMediaElement] = createSignal<
        HTMLImageElement | HTMLVideoElement | undefined
    >();
    const [absoluteDivStyle, setAbsoluteDivStyle] = createSignal({});
    const [fullscreen, { setFullscreen }] = useFullscreenContext();
    const navigate = useNavigate();

    const activeMedia = () => props.mediaService.getActiveMedia();

    /*
       Fullscreen is a state of this view, not a place of its own.

       It was a route per area that rendered the same photograph through the
       same `MainItem`, with a toolbar and a rail still around it. What it
       actually offered was the absence of everything else - so it is a toggle
       here, and `Layout` and `PrimaryNav` stand down while it is on.

       Only ever on with a photograph open: stepping back to the tiles is
       leaving the thing that was filling the screen, so it turns itself off
       rather than leaving an empty black page with one button on it.
    */
    const isFullscreen = () => fullscreen.isFullscreen && !!activeMedia();

    createEffect(() => {
        if (fullscreen.isFullscreen && !activeMedia()) {
            setFullscreen(false);
        }
    });

    // the view is being left entirely - a different area, a different feed
    onCleanup(() => setFullscreen(false));

    // Escape backs out one layer at a time - the order lives in `_escape`

    const closeActiveMedia = () => {
        props.slideshowService.stop();
        navigate(props.mediaService.getEntryPathByView(MediaViewGrid));
    };

    onMount(() => {
        const onKeyDown = (evt: KeyboardEvent) => {
            if (evt.key !== "Escape") {
                return;
            }

            const action = escapeAction({
                handled: evt.defaultPrevented,
                typing: isEditableTarget(evt.target),
                isFullscreen: fullscreen.isFullscreen,
                hasActiveMedia: !!activeMedia()
            });

            if (action === "none") {
                return;
            }

            evt.preventDefault();

            if (action === "exitFullscreen") {
                setFullscreen(false);
            } else {
                closeActiveMedia();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        onCleanup(() => window.removeEventListener("keydown", onKeyDown));
    });
    const [sizeTarget, setSizeTarget] = createSignal<HTMLElement | undefined>(undefined);
    const elSize = createElementSize(sizeTarget);
    const windowSize = createWindowSize();
    let sizeDiv!: HTMLDivElement;

    const setIsFavorite = favoriteSetter(setIsFavoriteMutation);

    /*
       Measured from where the stage actually is, rather than assumed to be flush
       with the bottom-right of the window. It no longer is: the inspector docks
       to the right of it, and deriving `left` from the window width put the
       enlarged photograph underneath the panel.

       The element's own size is read first so this re-runs when the panel opens
       and closes - the rect is not reactive on its own.
    */
    createEffect(() => {
        void elSize.width;
        void elSize.height;
        void windowSize.width;
        void windowSize.height;

        const rect = sizeTarget()?.getBoundingClientRect();

        if (rect) {
            setAbsoluteDivStyle({
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                top: `${rect.top}px`,
                height: `${rect.height}px`
            });
        }
    });

    onMount(() => {
        if (sizeDiv) {
            setSizeTarget(sizeDiv.parentElement?.parentElement ?? undefined);
        }
    });

    return (
        <Show when={props.mediaService.getMediaList()}>
            <Layout
                margin
                title={props.title}
                header={props.header}
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        leading={props.toolbarLeading}
                        leadingNavCount={props.toolbarLeadingNavCount}
                    >
                        <MediaToolbar
                            view={MediaViewGrid}
                            mediaService={props.mediaService}
                            slideshowService={props.slideshowService}
                            extras={props.toolbarExtras}
                        />
                    </Toolbar>
                }
                sidebar={
                    <Inspector
                        view={MediaViewGrid}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        mediaElement={mediaElement()}
                        enableCategoryTeaser={props.mediaService.canChooseCategoryTeaser()}
                        requestMoveNext={() => props.mediaService.moveNext()}
                    />
                }
            >
                <Show when={props.mediaService.getActiveMedia()}>
                    {/*
                       A column, so the photo gets the height the breadcrumb does
                       not. This box is sized to the visible stage; a breadcrumb
                       above a link that then claimed the full height again put
                       everything inside it - the foot of the photo included -
                       that much below the bottom of the screen.
                    */}
                    <div
                        class="flex flex-col overflow-hidden"
                        classList={{
                            "absolute z-30 bg-base-100/92": !isFullscreen(),
                            // over everything, including the chrome's own stacking
                            "fixed inset-0 z-50 bg-base-100": isFullscreen()
                        }}
                        style={isFullscreen() ? undefined : absoluteDivStyle()}
                    >
                        <Show when={props.showBreadcrumbsOnMedia && !isFullscreen()}>
                            <CategoryBreadcrumb
                                showTitleAsLink={true}
                                category={props.mediaService.getActiveCategory()}
                            />
                        </Show>

                        <A
                            class="flex flex-1 min-h-0"
                            href={props.mediaService.getEntryPathByView(MediaViewGrid)}
                            onClick={() => props.slideshowService.stop()}
                        >
                            <MainItem
                                media={props.mediaService.getActiveMedia()!}
                                moveNext={() => props.mediaService.moveNext()}
                                movePrevious={() => props.mediaService.movePrevious()}
                                setActiveMediaElement={el => setMediaElement(el)}
                                setIsFavorite={setIsFavorite}
                            />
                        </A>

                        {/*
                            The one thing on screen that is not the photograph.

                            Bottom left, small, and away from the swipe that
                            moves between photographs. Escape does the same, but
                            a key nobody can see is not a way out on a touch
                            screen - and the toolbar that would otherwise offer
                            one is exactly what fullscreen has taken away.
                        */}
                        <Show when={isFullscreen()}>
                            <button
                                class="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-field bg-base-300/70 px-3 py-2 text-base-content opacity-60 transition-opacity duration-150 ease-out hover:opacity-100 focus-visible:opacity-100"
                                onClick={() => setFullscreen(false)}
                                aria-label="Leave fullscreen"
                                title="Leave fullscreen (Esc)"
                            >
                                <Icon classes="icon-[ic--round-fullscreen-exit] text-lg" />
                            </button>
                        </Show>
                    </div>
                </Show>

                <div ref={sizeDiv}>
                    <Show when={props.showBreadcrumbsOnGrid}>
                        <CategoryBreadcrumb category={props.mediaService.getActiveCategory()} />
                    </Show>

                    <Show
                        when={props.mediaService.getMediaList().length > 0}
                        fallback={props.emptyState}
                    >
                        <MediaGrid
                            mediaLinkBuilder={(media: Media) =>
                                props.mediaService.getMediaPathByView(MediaViewGrid, media)
                            }
                            items={props.mediaService.getMediaList()}
                            setIsFavorite={setIsFavorite}
                        />
                    </Show>
                </div>
            </Layout>
        </Show>
    );
};

export default ViewGrid;
