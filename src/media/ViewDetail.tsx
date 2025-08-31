import { Component, createEffect, onCleanup, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { getThumbnailSize } from "../_models/ThumbnailSize";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { categoryDetailRoute, MediaViewModeDetail } from "./_routes";
import { CategoryMediaService } from "./services/CategoryMediaService";

import DetailToolbar from "./ToolbarDetail";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Sidebar from "./detail/Sidebar";
import Layout from "../_components/layout/Layout";
import MediaList from "./MediaList";
import MainItem from "./MainItem";
import { SlideshowService } from "./services/SlideshowService";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";

const ViewDetail: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [settings] = useMediaDetailViewSettingsContext();
    const [routeContext] = useRouteDetailContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, MediaViewModeDetail, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    const getMaxHeight = () => {
        let reservedHeight = 0;

        reservedHeight += settings.showBreadcrumbs ? 28 : 0;

        if (settings.showMediaList) {
            // 20 => rough approximation for scrollbar height
            reservedHeight += getThumbnailSize(settings.thumbnailSize).height + 20;
        }

        return `max-height: calc(100vh - ${reservedHeight}px);`;
    };

    let mediaElement: HTMLImageElement | HTMLVideoElement;

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <Show when={mediaService.getActiveMedia()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        activeCategory={mediaService.getActiveCategory()}
                        activeMedia={mediaService.getActiveMedia()}
                    >
                        <DetailToolbar
                            activeCategory={mediaService.getActiveCategory()}
                            activeMedia={mediaService.getActiveMedia()}
                            activeMediaIsFirst={mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={mediaService.isActiveMediaLast()}
                            slideshowIsPlaying={slideshowService.isPlaying()}
                            moveNext={mediaService.moveNext}
                            movePrevious={mediaService.movePrevious}
                            toggleSlideshow={slideshowService.toggle}
                        />
                    </Toolbar>
                }
                sidebar={
                    <Sidebar
                        activeCategory={mediaService.getActiveCategory()}
                        activeMedia={mediaService.getActiveMedia()}
                    />
                }
            >
                <div class="flex flex-col flex-[max-content_auto_max-content] h-screen --val-[100px]">
                    <Show when={settings.showBreadcrumbs} fallback={<div />}>
                        <CategoryBreadcrumb
                            category={mediaService.getActiveCategory()}
                            showTitleAsLink={routeContext.area === AreaRandom}
                        />
                    </Show>

                    <div class="flex flex-wrap flex-1 flex-justify-center flex-content-center">
                        <MainItem
                            media={mediaService.getActiveMedia()!}
                            maxHeightStyle={getMaxHeight()}
                            moveNext={mediaService.moveNext}
                            movePrevious={mediaService.movePrevious}
                            setActiveMediaElement={el => (mediaElement = el)}
                        />
                    </div>

                    <Show when={settings.showMediaList} fallback={<div />}>
                        <MediaList
                            media={mediaService.getMediaList()!}
                            activeMedia={mediaService.getActiveMedia()!}
                            thumbnailSize={settings.thumbnailSize}
                            activeRoute={categoryDetailRoute}
                        />
                    </Show>
                </div>
            </Layout>
        </Show>
    );
};

export default ViewDetail;
