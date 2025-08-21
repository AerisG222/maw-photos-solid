import { Component, createEffect, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { getThumbnailSize } from "../_models/ThumbnailSize";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { categoryDetailRoute, getMediaPathByView, MediaViewModeDetail } from "./_routes";

import DetailToolbar from "./ToolbarDetail";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Sidebar from "./detail/Sidebar";
import Layout from "../_components/layout/Layout";
import MediaList from "./MediaList";
import MainItem from "./MainItem";

const ViewDetail: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [settings] = useMediaDetailViewSettingsContext();
    const [routeContext] = useRouteDetailContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();
    const { mediaQuery } = useMediaContext();

    const activeCategory = categoryQuery(() => params.categoryId as Uuid);
    const mediaList = categoryMediaQuery(() => params.categoryId as Uuid);

    createEffect(() => {
        if (!params.id && mediaList.data) {
            navigate(
                getMediaPathByView(
                    MediaViewModeDetail,
                    params.categoryId as Uuid,
                    mediaList.data[0].id as Uuid
                )
            );
        }
    });

    const activeMedia = mediaQuery(() => params.id as Uuid);

    const getMaxHeight = () => {
        let reservedHeight = 0;

        reservedHeight += settings.showBreadcrumbs ? 28 : 0;

        if (settings.showMediaList) {
            // 20 => rough approximation for scrollbar height
            reservedHeight += getThumbnailSize(settings.thumbnailSize).height + 20;
        }

        return `max-height: calc(100vh - ${reservedHeight}px);`;
    };

    return (
        <Show when={activeMedia.data}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar activeCategory={activeCategory.data} activeMedia={activeMedia.data}>
                        <DetailToolbar />
                    </Toolbar>
                }
                sidebar={
                    <Sidebar activeCategory={activeCategory.data} activeMedia={activeMedia.data} />
                }
            >
                <div class="flex flex-col flex-[max-content_auto_max-content] h-screen --val-[100px]">
                    <Show when={settings.showBreadcrumbs} fallback={<div />}>
                        <CategoryBreadcrumb showTitleAsLink={routeContext.area === AreaRandom} />
                    </Show>

                    <div class="flex flex-wrap flex-1 flex-justify-center flex-content-center">
                        <MainItem media={activeMedia.data!} maxHeightStyle={getMaxHeight()} />
                    </div>

                    <Show when={settings.showMediaList} fallback={<div />}>
                        <MediaList
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
