import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { MediaGridViewSettingsState } from "../_contexts/settings/MediaGridViewSettingsContext";
import { gridRoute } from "../category/_routes";
import { SlideshowService } from "./services/SlideshowService";
import { IMediaService } from "./services/IMediaService";
import { MediaViewGrid } from "../_models/MediaView";
import { Media } from "../_models/Media";
import { getMarginClass, MarginIdType } from "../_models/Margin";

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
}

const ViewGrid: Component<Props> = props => {
    const buildGridContainerClass = (margin: MarginIdType | undefined) => ({
        ...getMarginClass(margin),
        "col-start-1": true,
        "row-start-1": true,
        "z-10": true
    });

    return (
        <Show when={props.mediaService.getActiveCategory() && props.mediaService.getMediaList()}>
            <Layout
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
                            enableToggleBreadcrumbsOnActiveMedia={
                                props.enableToggleBreadcrumbsOnActiveMedia
                            }
                            enableToggleBreadcrumbsOnInactiveMedia={
                                props.enableToggleBreadcrumbsOnInactiveMedia
                            }
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            toggleSlideshow={() => props.slideshowService.toggle()}
                        />
                    </Toolbar>
                }
            >
                <div class="grid">
                    <Show when={props.mediaService.getActiveMedia()}>
                        {/* overlay layer — uses grid layering instead of absolute positioning */}
                        <div class="col-start-1 row-start-1 z-30 w-full h-full bg-base-100/92">
                            <div class="h-full w-full overflow-auto">
                                <Show when={props.showBreadcrumbsOnMedia}>
                                    <CategoryBreadcrumb
                                        showTitleAsLink={true}
                                        category={props.mediaService.getActiveCategory()}
                                    />
                                </Show>

                                <A
                                    class="fixed w-full h-full"
                                    href={props.mediaService.getEntryPathByView(MediaViewGrid)}
                                    onClick={() => props.slideshowService.stop()}
                                >
                                    <MainItem
                                        media={props.mediaService.getActiveMedia()!}
                                        moveNext={() => props.mediaService.moveNext()}
                                        movePrevious={() => props.mediaService.movePrevious()}
                                    />
                                </A>
                            </div>
                        </div>
                    </Show>
                    {/* base layer (grid content) — placed in same grid so it sits under the overlay */}
                    <div classList={buildGridContainerClass(props.gridSettings.margin)}>
                        <Show when={props.showBreadcrumbsOnGrid}>
                            <CategoryBreadcrumb category={props.mediaService.getActiveCategory()} />
                        </Show>

                        <MediaGrid
                            mediaLinkBuilder={(media: Media) =>
                                props.mediaService.getMediaPathByView(MediaViewGrid, media)
                            }
                            items={props.mediaService.getMediaList()}
                            thumbnailSize={props.gridSettings.thumbnailSize}
                            activeRoute={gridRoute}
                        />
                    </div>
                </div>
            </Layout>
        </Show>
    );
};

export default ViewGrid;
