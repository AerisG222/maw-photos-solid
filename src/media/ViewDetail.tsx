import { Component, Show, createEffect, onCleanup } from "solid-js";

import { usePhotoDetailViewSettingsContext } from '../contexts/settings/PhotoDetailViewSettingsContext';
import { useMediaListContext } from './contexts/MediaListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';
import { getThumbnailSize } from '../_models/ThumbnailSize';
import { categoryDetailRoute, randomDetailRoute } from './_routes';
import { AreaRandom } from '../_models/AppRouteDefinition';
import { useRouteDetailContext } from '../contexts/RouteDetailContext';

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Sidebar from './detail/Sidebar';
import Layout from '../components/layout/Layout';
import MediaList from './MediaList';
import MediaMainItem from './MediaMainItem';
import MediaSelectedGuard from './MediaSelectedGuard';

const ViewDetail: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [settings] = usePhotoDetailViewSettingsContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const [routeContext] = useRouteDetailContext();

    const toolbar = (
        <Toolbar>
            <DetailToolbar />
        </Toolbar>
    );

    createEffect(() => {
        let route = categoryDetailRoute;

        if(routeContext.area === AreaRandom) {
            route = randomDetailRoute;
        }

        setActiveRouteDefinition(route);
    });

    hideXpad();

    onCleanup(() => {
        showXpad();
    });

    const getMaxHeight = () => {
        let reservedHeight = 0;

        reservedHeight += settings.showBreadcrumbs ? 28 : 0;

        if(settings.showPhotoList) {
            // 20 => rough approximation for scrollbar height
            reservedHeight += getThumbnailSize(settings.thumbnailSize).height + 20;
        }

        return `max-height: calc(100vh - ${reservedHeight}px);`;
    };

    return (
        <Show when={mediaList.activeRouteDefinition}>
            <MediaSelectedGuard targetRoute={mediaList.activeRouteDefinition}>
                <Layout toolbar={toolbar} sidebar={<Sidebar />}>
                    <div class="flex flex-col flex-[max-content_auto_max-content] h-100vh --val-[100px]">
                        <Show when={settings.showBreadcrumbs} fallback={<div />}>
                            <CategoryBreadcrumb />
                        </Show>

                        <div class="flex flex-wrap flex-1 flex-justify-center flex-content-center">
                            <MediaMainItem
                                media={mediaList.activeItem}
                                maxHeightStyle={getMaxHeight()} />
                        </div>

                        <Show when={settings.showPhotoList} fallback={<div/>}>
                            <MediaList
                                thumbnailSize={settings.thumbnailSize}
                                activeRoute={mediaList.activeRouteDefinition} />
                        </Show>
                    </div>
                </Layout>
            </MediaSelectedGuard>
        </Show>
    );
};

export default ViewDetail;
