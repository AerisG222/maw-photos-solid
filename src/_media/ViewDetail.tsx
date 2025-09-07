import { Component, Show } from "solid-js";

import { MediaDetailViewSettingsState } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { getThumbnailSize } from "../_models/ThumbnailSize";
import { detailRoute } from "../category/_routes";
import { SlideshowService } from "./services/SlideshowService";
import { IMediaService } from "./services/IMediaService";
import { Media } from "../_models/Media";
import { MediaViewDetail } from "../_models/MediaView";

import DetailToolbar from "./ToolbarDetail";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Sidebar from "./detail/Sidebar";
import Layout from "../_components/layout/Layout";
import MediaList from "./MediaList";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    detailSettings: MediaDetailViewSettingsState;
    showBreadcrumbTitleAsLink: boolean;
    enableCategoryTeaserChooser: boolean;
}

const ViewDetail: Component<Props> = props => {
    const getMaxHeight = () => {
        let reservedHeight = 0;

        reservedHeight += props.detailSettings.showBreadcrumbs ? 28 : 0;

        if (props.detailSettings.showMediaList) {
            // 20 => rough approximation for scrollbar height
            reservedHeight += getThumbnailSize(props.detailSettings.thumbnailSize).height + 20;
        }

        return `max-height: calc(100vh - ${reservedHeight}px);`;
    };

    let mediaElement: HTMLImageElement | HTMLVideoElement;

    return (
        <Show when={props.mediaService.getActiveMedia()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                    >
                        <DetailToolbar
                            activeCategory={props.mediaService.getActiveCategory()}
                            activeMedia={props.mediaService.getActiveMedia()}
                            activeMediaIsFirst={props.mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={props.mediaService.isActiveMediaLast()}
                            slideshowIsPlaying={props.slideshowService.isPlaying()}
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            toggleSlideshow={() => props.slideshowService.toggle()}
                        />
                    </Toolbar>
                }
                sidebar={
                    <Sidebar
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        enableCategoryTeaser={props.enableCategoryTeaserChooser}
                    />
                }
            >
                <div class="flex flex-col flex-[max-content_auto_max-content] h-screen --val-[100px]">
                    <Show when={props.detailSettings.showBreadcrumbs} fallback={<div />}>
                        <CategoryBreadcrumb
                            category={props.mediaService.getActiveCategory()}
                            showTitleAsLink={props.showBreadcrumbTitleAsLink}
                        />
                    </Show>

                    <div class="flex flex-wrap flex-1 flex-justify-center flex-content-center">
                        <MainItem
                            media={props.mediaService.getActiveMedia()!}
                            maxHeightStyle={getMaxHeight()}
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            setActiveMediaElement={el => (mediaElement = el)}
                        />
                    </div>

                    <Show when={props.detailSettings.showMediaList} fallback={<div />}>
                        <MediaList
                            mediaLinkBuilder={(media: Media) =>
                                props.mediaService.getMediaPathByView(MediaViewDetail, media)
                            }
                            media={props.mediaService.getMediaList()}
                            activeMedia={props.mediaService.getActiveMedia()!}
                            thumbnailSize={props.detailSettings.thumbnailSize}
                            activeRoute={detailRoute}
                        />
                    </Show>
                </div>
            </Layout>
        </Show>
    );
};

export default ViewDetail;
