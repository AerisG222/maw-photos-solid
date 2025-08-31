import { Component, Show } from "solid-js";
import { A, useNavigate, useParams } from "@solidjs/router";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { getMediaPath, categoryGridRoute, MediaViewModeGrid } from "./_routes";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { CategoryMediaService } from "./services/CategoryMediaService";
import { SlideshowService } from "./services/SlideshowService";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";

import GridToolbar from "./ToolbarGrid";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Layout from "../_components/layout/Layout";
import MediaGrid from "../media/MediaGrid";
import MainItem from "./MainItem";

const ViewGrid: Component = () => {
    const navigate = useNavigate();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [settings] = useMediaGridViewSettingsContext();
    const [routeContext] = useRouteDetailContext();
    const params = useParams();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, MediaViewModeGrid, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    return (
        <Layout
            margin={settings.margin}
            toolbar={
                <Toolbar
                    activeCategory={mediaService.getActiveCategory()}
                    activeMedia={mediaService.getActiveMedia()}
                >
                    <GridToolbar
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
        >
            <Show when={mediaService.getActiveMedia()}>
                <div
                    class="absolute z-200 bg-base-100/92
                        top-[82px] left-[0] h-[calc(100vh-82px)]
                        md:top-[0] md:left-[114px] md:w-[calc(100vw-114px)] md:h-screen"
                >
                    <Show when={routeContext.area === AreaRandom && settings.showMainBreadcrumbs}>
                        <CategoryBreadcrumb
                            showTitleAsLink={true}
                            category={mediaService.getActiveCategory()}
                        />
                    </Show>

                    <A
                        class="flex h-full"
                        href={getMediaPath(
                            categoryGridRoute,
                            mediaService.getActiveMedia()!.categoryId,
                            undefined
                        )}
                        onClick={stop}
                    >
                        <MainItem
                            media={mediaService.getActiveMedia()!}
                            moveNext={mediaService.moveNext}
                            movePrevious={mediaService.movePrevious}
                        />
                    </A>
                </div>
            </Show>

            <Show when={mediaService.getMediaList()}>
                <div>
                    <Show when={settings.showBreadcrumbs && routeContext.area !== AreaRandom}>
                        <CategoryBreadcrumb category={mediaService.getActiveCategory()} />
                    </Show>

                    <MediaGrid
                        items={mediaService.getMediaList()}
                        thumbnailSize={settings.thumbnailSize}
                        activeRoute={categoryGridRoute}
                    />
                </div>
            </Show>
        </Layout>
    );
};

export default ViewGrid;
