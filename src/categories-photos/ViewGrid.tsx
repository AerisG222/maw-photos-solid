import { Component, For, Show } from "solid-js";
import { A } from '@solidjs/router';

import { usePhotoListContext } from '../contexts/PhotoListContext';
import { usePhotoGridViewSettingsContext } from '../contexts/PhotoGridViewSettingsContext';

import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import PhotoGridItem from './components/PhotoGridItem';

const ViewGrid: Component = () => {
    const [settings] = usePhotoGridViewSettingsContext();
    const [photoState] = usePhotoListContext();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <Show when={photoState.activePhoto}>
                <div class="w-[calc(100vw-114px)] h-[100vh] position-absolute top-0 left-[114px] z-200 bg-primaryContent bg-opacity-90">
                    <A href={`/categories/photos/${photoState.activePhoto.categoryId}/grid`}>
                        <img src={photoState.activePhoto.imageLg.url} class="w-[100%] h-[100%] object-contain self-center" />
                    </A>
                </div>
            </Show>

            <MainContent margin={settings.margin}>
                <Show when={settings.showBreadcrumbs}>
                    <CategoryBreadcrumb />
                </Show>

                <div class="flex flex-gap-2 flex-wrap place-content-center mb-4">
                    <For each={photoState.photos}>{ photo =>
                        <PhotoGridItem photo={photo} thumbnailSize={settings.thumbnailSize} />
                    }</For>
                </div>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewGrid;
