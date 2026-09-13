import { Component, createEffect, createSignal, JSXElement, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createElementSize, createWindowSize } from "@solid-primitives/resize-observer";

import { MediaGridViewSettingsState } from "../_contexts/settings/MediaGridViewSettingsContext";
import { gridRoute } from "../category/_routes";
import { SlideshowService } from "./services/SlideshowService";
import { IMediaService } from "./services/IMediaService";
import { MediaViewGrid } from "../_models/MediaView";
import { Media } from "../_models/Media";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import MediaToolbar from "./MediaToolbar";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Inspector from "../_components/inspector/Inspector";
import Layout from "../_components/layout/Layout";
import MediaGrid from "../_media/MediaGrid";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    gridSettings: MediaGridViewSettingsState;
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
    showFavoritesBadge: boolean;
    showTypesBadge: boolean;
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
    const [sizeTarget, setSizeTarget] = createSignal<HTMLElement | undefined>(undefined);
    const elSize = createElementSize(sizeTarget);
    const windowSize = createWindowSize();
    let sizeDiv!: HTMLDivElement;

    const setIsFavorite = (media: Media, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Media> = {
            item: media,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

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
                margin={props.gridSettings.margin}
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
                        class="absolute z-30 flex flex-col overflow-hidden bg-base-100/92"
                        style={absoluteDivStyle()}
                    >
                        <Show when={props.showBreadcrumbsOnMedia}>
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
                                highlightFaces={props.gridSettings.highlightFaces}
                                showFavoriteBadge={props.showFavoritesBadge}
                                moveNext={() => props.mediaService.moveNext()}
                                movePrevious={() => props.mediaService.movePrevious()}
                                setActiveMediaElement={el => setMediaElement(el)}
                                setIsFavorite={setIsFavorite}
                            />
                        </A>
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
                            thumbnailSize={props.gridSettings.thumbnailSize}
                            dimThumbnails={props.gridSettings.dimThumbnails}
                            activeRoute={gridRoute}
                            showFavoritesBadge={props.showFavoritesBadge}
                            showTypesBadge={props.showTypesBadge}
                            setIsFavorite={setIsFavorite}
                        />
                    </Show>
                </div>
            </Layout>
        </Show>
    );
};

export default ViewGrid;
