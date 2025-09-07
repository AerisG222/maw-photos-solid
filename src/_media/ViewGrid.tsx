import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { MediaGridViewSettingsState } from "../_contexts/settings/MediaGridViewSettingsContext";
import { gridRoute } from "../category/_routes";
import { SlideshowService } from "./services/SlideshowService";
import { IMediaService } from "./services/IMediaService";
import { MediaViewGrid } from "../_models/MediaView";
import { Media } from "../_models/Media";

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
    return (
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
            <Show when={props.mediaService.getActiveMedia()}>
                <div
                    class="absolute z-200 bg-base-100/92
                        top-[82px] left-[0] h-[calc(100vh-82px)]
                        md:top-[0] md:left-[114px] md:w-[calc(100vw-114px)] md:h-screen"
                >
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
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                        />
                    </A>
                </div>
            </Show>

            <Show when={props.mediaService.getMediaList()}>
                <div>
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
            </Show>
        </Layout>
    );
};

export default ViewGrid;
