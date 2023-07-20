import { Component, Show } from "solid-js";
import { A, useParams } from '@solidjs/router';

import { useMediaListContext } from '../contexts/MediaListContext';
import { usePhotoGridViewSettingsContext } from '../contexts/settings/PhotoGridViewSettingsContext';
import { useSlideshowContext } from '../contexts/SlideshowContext';
import { getMediaPath, gridRoute } from './_routes';
import { CategoryType } from '../_models/CategoryType';

import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Layout from '../components/layout/Layout';
import MediaGrid from '../media/MediaGrid';
import MediaMainItem from './MediaMainItem';

const ViewGrid: Component = () => {
    const [settings] = usePhotoGridViewSettingsContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const [,{ stop }] = useSlideshowContext();
    const params = useParams();

    setActiveRouteDefinition(gridRoute);

    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout margin={settings.margin} toolbar={toolbar}>
            <Show when={mediaList.activeItem}>
                <div class="w-[calc(100vw-114px)] h-[100vh] position-absolute top-0 left-[114px] z-200 bg-primaryContent bg-opacity-90">
                    <A
                        class="flex h-100%"
                        href={getMediaPath(gridRoute, params.categoryType as CategoryType, mediaList.activeItem.categoryId, undefined)}
                        onClick={stop}>
                        <MediaMainItem media={mediaList.activeItem} />
                    </A>
                </div>
            </Show>

            <div>
                <Show when={settings.showBreadcrumbs}>
                    <CategoryBreadcrumb />
                </Show>

                <MediaGrid
                    items={mediaList.items}
                    thumbnailSize={settings.thumbnailSize}
                />
            </div>
        </Layout>
    );
};

export default ViewGrid;