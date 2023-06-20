import { Component, For, Show } from "solid-js";
import { A } from '@solidjs/router';

import { usePhotoListContext } from '../contexts/PhotoListContext';
import { usePhotoGridViewSettingsContext } from '../contexts/settings/PhotoGridViewSettingsContext';

import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import PhotoGridItem from './components/PhotoGridItem';
import Layout from '../components/layout/Layout';
import { getPhotoCategoryRoutePath, categoriesPhotosGrid } from './_routes';

const ViewGrid: Component = () => {
    const [settings] = usePhotoGridViewSettingsContext();
    const [photoState] = usePhotoListContext();

    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout margin={settings.margin} toolbar={toolbar}>
            <Show when={photoState.activePhoto}>
                <div class="w-[calc(100vw-114px)] h-[100vh] position-absolute top-0 left-[114px] z-200 bg-primaryContent bg-opacity-90">
                    <A href={getPhotoCategoryRoutePath(categoriesPhotosGrid, photoState.activePhoto.categoryId, undefined)}>
                        <img src={photoState.activePhoto.imageLg.url} class="w-[100%] h-[100%] object-contain self-center" />
                    </A>
                </div>
            </Show>

            <div>
                <Show when={settings.showBreadcrumbs}>
                    <CategoryBreadcrumb />
                </Show>

                <div class="flex flex-gap-2 flex-wrap place-content-center mb-4">
                    <For each={photoState.photos}>{ photo =>
                        <PhotoGridItem photo={photo} thumbnailSize={settings.thumbnailSize} />
                    }</For>
                </div>
            </div>
        </Layout>
    );
};

export default ViewGrid;
