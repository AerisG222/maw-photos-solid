import { Component, Show, createEffect } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { getThumbnailSize } from "../_models/ThumbnailSize";
import { categoryDetailRoute, randomDetailRoute } from "./_routes";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";

import DetailToolbar from "./ToolbarDetail";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Sidebar from "./detail/Sidebar";
import Layout from "../_components/layout/Layout";
import MediaList from "./MediaList";
import MediaMainItem from "./MediaMainItem";
import MediaSelectedGuard from "./MediaSelectedGuard";

const ViewDetail: Component = () => {
    const [settings] = useMediaDetailViewSettingsContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const [routeContext] = useRouteDetailContext();

    createEffect(() => {
        let route = categoryDetailRoute;

        if (routeContext.area === AreaRandom) {
            route = randomDetailRoute;
        }

        setActiveRouteDefinition(route);
    });

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
        <Show when={mediaList.activeRouteDefinition}>
            <MediaSelectedGuard targetRoute={mediaList.activeRouteDefinition}>
                <Layout
                    xPad={false}
                    toolbar={
                        <Toolbar>
                            <DetailToolbar />
                        </Toolbar>
                    }
                    sidebar={<Sidebar />}
                >
                    <div class="flex flex-col flex-[max-content_auto_max-content] h-screen --val-[100px]">
                        <Show when={settings.showBreadcrumbs} fallback={<div />}>
                            <CategoryBreadcrumb
                                showTitleAsLink={routeContext.area === AreaRandom}
                            />
                        </Show>

                        <div class="flex flex-wrap flex-1 flex-justify-center flex-content-center">
                            <MediaMainItem
                                media={mediaList.activeItem}
                                maxHeightStyle={getMaxHeight()}
                            />
                        </div>

                        <Show when={settings.showMediaList} fallback={<div />}>
                            <MediaList
                                thumbnailSize={settings.thumbnailSize}
                                activeRoute={mediaList.activeRouteDefinition}
                            />
                        </Show>
                    </div>
                </Layout>
            </MediaSelectedGuard>
        </Show>
    );
};

export default ViewDetail;
