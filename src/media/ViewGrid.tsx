import { Component, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useSlideshowContext } from "./contexts/SlideshowContext";
import { getMediaPath, categoryGridRoute } from "./_routes";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { AreaRandom } from "../_models/AppRouteDefinition";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaContext } from "../_contexts/api/MediaContext";

import GridToolbar from "./ToolbarGrid";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Layout from "../_components/layout/Layout";
import MediaGrid from "../media/MediaGrid";
import MainItem from "./MainItem";

const ViewGrid: Component = () => {
    const [settings] = useMediaGridViewSettingsContext();
    const [routeContext] = useRouteDetailContext();
    const [, { stop }] = useSlideshowContext();
    const params = useParams();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();
    const { mediaQuery } = useMediaContext();

    const activeCategory = categoryQuery(() => params.categoryId as Uuid);
    const mediaList = categoryMediaQuery(() => params.categoryId as Uuid);
    const activeMedia = mediaQuery(() => params.id as Uuid);

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
                    class="absolute z-200 bg-base-100/92
                        top-[82px] left-[0] h-[calc(100vh-82px)]
                        md:top-[0] md:left-[114px] md:w-[calc(100vw-114px)] md:h-screen"
                >
                    <Show when={routeContext.area === AreaRandom && settings.showMainBreadcrumbs}>
                        <CategoryBreadcrumb showTitleAsLink={true} category={activeCategory.data} />
                    </Show>

                    <A
                        class="flex h-full"
                        href={getMediaPath(
                            categoryGridRoute,
                            activeMedia.data!.categoryId,
                            undefined
                        )}
                        onClick={stop}
                    >
                        <MainItem media={activeMedia.data!} />
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
