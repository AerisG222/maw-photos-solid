import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
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
    showBreadcrumbsOnGrid: boolean;
    showBreadcrumbsOnMedia: boolean;
    enableToggleBreadcrumbsOnActiveMedia: boolean;
    enableToggleBreadcrumbsOnInactiveMedia: boolean;
    showFavoritesBadge: boolean;
    setShowFavoritesBadge: () => void;
}

const ViewGrid: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();
    const [absoluteDivStyle, setAbsoluteDivStyle] = createSignal({});
    const [sizeTarget, setSizeTarget] = createSignal<HTMLElement | undefined>(undefined);
    const elSize = createElementSize(sizeTarget);
    const windowSize = createWindowSize();
    let sizeDiv: HTMLDivElement;

    const setIsFavorite = (media: Media, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Media> = {
            item: media,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    createEffect(() => {
        setAbsoluteDivStyle({
            left: `${windowSize.width - elSize.width}px`,
            width: `${elSize.width}px`,
            top: `${windowSize.height - elSize.height}px`,
            height: `${elSize.height}px`
        });
    });

    onMount(() => {
        if (sizeDiv) {
            setSizeTarget(sizeDiv.parentElement?.parentElement);
        }
    });

    return (
        <Show when={props.mediaService.getMediaList()}>
            <Layout
                margin={props.gridSettings.margin}
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
                        />
                    </Toolbar>
                }
            >
                <Show when={props.mediaService.getActiveMedia()}>
                    <div class="absolute z-30 bg-base-100/92" style={absoluteDivStyle()}>
                        <Show when={props.showBreadcrumbsOnMedia}>
                            <CategoryBreadcrumb
                                showTitleAsLink={true}
                                category={props.mediaService.getActiveCategory()}
                            />
                        </Show>

                        <A
                            class="flex h-full"
                            href={props.mediaService.getEntryPathByView(MediaViewGrid)}
                            onClick={() => props.slideshowService.stop()}
                        >
                            <MainItem
                                media={props.mediaService.getActiveMedia()!}
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

                    <MediaGrid
                        mediaLinkBuilder={(media: Media) =>
                            props.mediaService.getMediaPathByView(MediaViewGrid, media)
                        }
                        items={props.mediaService.getMediaList()}
                        thumbnailSize={props.gridSettings.thumbnailSize}
                        dimThumbnails={props.gridSettings.dimThumbnails}
                        activeRoute={gridRoute}
                        showFavoritesBadge={props.showFavoritesBadge}
                        setIsFavorite={setIsFavorite}
                    />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewGrid;
