import { Component, For, Show } from "solid-js";

import { usePhotoListContext } from '../contexts/PhotoListContext';

import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import PhotoGridItem from './components/PhotoGridItem';
import { usePhotoGridViewSettingsContext } from '../contexts/PhotoGridViewSettingsContext';

const ViewGrid: Component = () => {
    const [settings] = usePhotoGridViewSettingsContext();
    const [photoState] = usePhotoListContext();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

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
