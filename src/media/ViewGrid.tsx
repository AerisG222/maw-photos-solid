import { Component, Show, createEffect } from "solid-js";
import { A, useParams } from "@solidjs/router";

import { useMediaListContext } from "./contexts/MediaListContext";
import { useMediaGridViewSettingsContext } from "../contexts/settings/MediaGridViewSettingsContext";
import { useSlideshowContext } from "./contexts/SlideshowContext";
import { getMediaPath, categoryGridRoute, randomGridRoute } from "./_routes";
import { CategoryType } from "../_models/CategoryType";
import { useRouteDetailContext } from "../contexts/RouteDetailContext";
import { AreaRandom } from "../_models/AppRouteDefinition";

import GridToolbar from "./ToolbarGrid";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../components/categories/CategoryBreadcrumb";
import Layout from "../components/layout/Layout";
import MediaGrid from "../media/MediaGrid";
import MediaMainItem from "./MediaMainItem";

const ViewGrid: Component = () => {
    const [settings] = useMediaGridViewSettingsContext();
    const [routeContext] = useRouteDetailContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const [,{ stop }] = useSlideshowContext();
    const params = useParams();

    createEffect(() => {
        let route = categoryGridRoute;

        if(routeContext.area === AreaRandom) {
            route = randomGridRoute;
        }

        setActiveRouteDefinition(route);
    });

    return (
        <Show when={mediaList.activeRouteDefinition}>
            <Layout margin={settings.margin}
                toolbar={
                    <Toolbar>
                        <GridToolbar />
                    </Toolbar>
                }>
                <Show when={mediaList.activeItem}>
                    <div class="position-absolute z-200 bg-base-100:92%
                            top-82px left-0 h-[calc(100vh-82px)]
                            md:top-0 md:left-[114px] md:w-[calc(100vw-114px)] md:h-[100vh]">
                        <Show when={routeContext.area === AreaRandom && settings.showMainBreadcrumbs}>
                            <CategoryBreadcrumb showTitleAsLink={true} />
                        </Show>

                        <A
                            class="flex h-100%"
                            href={getMediaPath(mediaList.activeRouteDefinition, params.categoryType as CategoryType, mediaList.activeItem.categoryId, undefined)}
                            onClick={stop}>
                            <MediaMainItem media={mediaList.activeItem} />
                        </A>
                    </div>
                </Show>

                <div>
                    <Show when={settings.showBreadcrumbs && routeContext.area !== AreaRandom}>
                        <CategoryBreadcrumb />
                    </Show>

                    <MediaGrid
                        items={mediaList.items}
                        thumbnailSize={settings.thumbnailSize}
                        activeRoute={mediaList.activeRouteDefinition}
                    />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewGrid;
