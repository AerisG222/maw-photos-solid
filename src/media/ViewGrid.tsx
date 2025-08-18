import { Component, Show, createEffect } from "solid-js";
import { A, useParams } from "@solidjs/router";

import { useMediaListContext } from "./contexts/MediaListContext";
import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useSlideshowContext } from "./contexts/SlideshowContext";
import { getMediaPath, categoryGridRoute, randomGridRoute } from "./_routes";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";

import GridToolbar from "./ToolbarGrid";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Layout from "../_components/layout/Layout";
import MediaGrid from "../media/MediaGrid";
import MediaMainItem from "./MediaMainItem";
import { useMediaContext } from "../_contexts/api/MediaContext";

const ViewGrid: Component = () => {
    const [settings] = useMediaGridViewSettingsContext();
    const [routeContext] = useRouteDetailContext();
    // const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const [, { stop }] = useSlideshowContext();
    const params = useParams();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();
    const { mediaQuery } = useMediaContext();

    const activeCategory = categoryQuery(() => params.categoryId as Uuid);
    const mediaList = categoryMediaQuery(() => params.categoryId as Uuid);
    const activeMedia = mediaQuery(() => params.id as Uuid);

    createEffect(() => {
        let route = categoryGridRoute;

        if (routeContext.area === AreaRandom) {
            route = randomGridRoute;
        }
    });

    return (
        <Layout
            margin={settings.margin}
            toolbar={
                <Toolbar activeCategory={activeCategory.data} activeMedia={activeMedia.data}>
                    <GridToolbar />
                </Toolbar>
            }
        >
            <Show when={activeMedia.data}>
                <div
                    class="position-absolute z-200 bg-base-100/92
                        top-82px left-0 h-[calc(100vh-82px)]
                        md:top-0 md:left-[114px] md:w-[calc(100vw-114px)] md:h-[100vh]"
                >
                    <Show when={routeContext.area === AreaRandom && settings.showMainBreadcrumbs}>
                        <CategoryBreadcrumb showTitleAsLink={true} category={activeCategory.data} />
                    </Show>

                    <A
                        class="flex h-100%"
                        href={getMediaPath(
                            categoryGridRoute,
                            activeMedia.data!.categoryId,
                            undefined
                        )}
                        onClick={stop}
                    >
                        <MediaMainItem media={activeMedia.data!} />
                    </A>
                </div>
            </Show>

            <Show when={mediaList.data}>
                <div>
                    <Show when={settings.showBreadcrumbs && routeContext.area !== AreaRandom}>
                        <CategoryBreadcrumb category={activeCategory.data} />
                    </Show>

                    <MediaGrid
                        items={mediaList.data!}
                        thumbnailSize={settings.thumbnailSize}
                        activeRoute={categoryGridRoute}
                    />
                </div>
            </Show>
        </Layout>
    );
};

export default ViewGrid;
