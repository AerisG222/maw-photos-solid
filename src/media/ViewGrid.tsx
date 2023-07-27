import { Component, Show, createEffect } from "solid-js";
import { A, useParams } from '@solidjs/router';

import { useMediaListContext } from './contexts/MediaListContext';
import { usePhotoGridViewSettingsContext } from '../contexts/settings/PhotoGridViewSettingsContext';
import { useSlideshowContext } from './contexts/SlideshowContext';
import { getMediaPath, categoryGridRoute, randomGridRoute } from './_routes';
import { CategoryType } from '../_models/CategoryType';

import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Layout from '../components/layout/Layout';
import MediaGrid from '../media/MediaGrid';
import MediaMainItem from './MediaMainItem';
import { useRouteDetailContext } from '../contexts/RouteDetailContext';
import { AreaRandom } from '../_models/AppRouteDefinition';

const ViewGrid: Component = () => {
    const [settings] = usePhotoGridViewSettingsContext();
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

    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Show when={mediaList.activeRouteDefinition}>
            <Layout margin={settings.margin} toolbar={toolbar}>
                <Show when={mediaList.activeItem}>
                    <div class="w-[calc(100vw-114px)] h-[100vh] position-absolute top-0 left-[114px] z-200 bg-primaryContent bg-opacity-90">
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
