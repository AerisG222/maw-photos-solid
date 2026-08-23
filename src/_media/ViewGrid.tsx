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

import GridToolbar from "./ToolbarGrid";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
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
    // controls belonging to the feed rather than to the grid, e.g. the filters
    // on a person's media. They sit in the toolbar so they stay reachable when
    // the feed they narrow comes back empty
    toolbarExtras?: JSXElement;
    // shown in place of the tiles when the feed holds nothing, which a filtered
    // feed legitimately can
    emptyState?: JSXElement;
    showBreadcrumbsOnGrid: boolean;
    showBreadcrumbsOnMedia: boolean;
    enableToggleBreadcrumbsOnActiveMedia: boolean;
    enableToggleBreadcrumbsOnInactiveMedia: boolean;
    showFavoritesBadge: boolean;
    showTypesBadge: boolean;
    setShowFavoritesBadge: () => void;
    setShowTypesBadge: () => void;
}

const ViewGrid: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();
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

    createEffect(() => {
        setAbsoluteDivStyle({
            left: `${windowSize.width - (elSize.width ?? 0)}px`,
            width: `${elSize.width ?? 0}px`,
            top: `${windowSize.height - (elSize.height ?? 0)}px`,
            height: `${elSize.height ?? 0}px`
        });
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
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                    >
                        <GridToolbar
                            activeMedia={props.mediaService.getActiveMedia()}
                            activeMediaIsFirst={props.mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={props.mediaService.isActiveMediaLast()}
                            slideshowIsPlaying={props.slideshowService.isPlaying()}
                            canRequestMore={props.mediaService.canRequestMore()}
                            enableToggleBreadcrumbsOnActiveMedia={
                                props.enableToggleBreadcrumbsOnActiveMedia
                            }
                            enableToggleBreadcrumbsOnInactiveMedia={
                                props.enableToggleBreadcrumbsOnInactiveMedia
                            }
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            toggleSlideshow={() => props.slideshowService.toggle()}
                            requestMore={() => props.mediaService.requestMore()}
                            setShowFavoritesBadge={() => props.setShowFavoritesBadge()}
                            setShowTypesBadge={() => props.setShowTypesBadge()}
                        />

                        {props.toolbarExtras}
                    </Toolbar>
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
