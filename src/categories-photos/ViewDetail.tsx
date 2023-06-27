import { Component, Show, createEffect, onCleanup } from "solid-js";
import { useNavigate, useParams } from '@solidjs/router';

import { categoriesPhotosDetail, categoriesPhotosGrid, getPhotoCategoryRoutePath } from './_routes';
import { usePhotoDetailViewSettingsContext } from '../contexts/settings/PhotoDetailViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';
import { getThumbnailSize } from '../models/ThumbnailSize';

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Sidebar from './components/Sidebar';
import Layout from '../components/layout/Layout';
import PhotoList from './components/PhotoList';
import MainImage from './components/MainImage';

const ViewDetail: Component = () => {
    const [layoutOptions, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const navigate = useNavigate();
    const params = useParams();
    const [settings] = usePhotoDetailViewSettingsContext();
    const [photoListState, { setActiveRouteDefinition }] = usePhotoListContext();

    setActiveRouteDefinition(categoriesPhotosDetail);

    createEffect(() => {
        if(!params.photoId) {
            const p = photoListState.photos[0];

            if(p) {
                navigate(getPhotoCategoryRoutePath(categoriesPhotosDetail, p.categoryId, p.id));
            }
        }
    })

    const toolbar = (
        <Toolbar>
            <DetailToolbar />
        </Toolbar>
    );

    hideXpad();

    onCleanup(() => {
        showXpad();
    });

    const getMaxHeight = () => {
        let reservedHeight = 0;

        reservedHeight += settings.showBreadcrumbs ? 28 : 0;
        reservedHeight += getThumbnailSize(settings.thumbnailSize).height;

        return `max-height: calc(100vh - ${reservedHeight}px);`;
    }

    return (
        <Layout toolbar={toolbar} sidebar={<Sidebar />}>
            <div class="flex flex-col flex-[max-content_auto_max-content] h-100vh --val-[100px]">
                <Show when={settings.showBreadcrumbs} fallback={<div />}>
                    <CategoryBreadcrumb />
                </Show>

                <div class="flex flex-wrap flex-1 flex-justify-center flex-content-center">
                    <MainImage maxHeightStyle={getMaxHeight()}/>
                </div>

                <Show when={settings.showPhotoList} fallback={<div/>}>
                    <PhotoList thumbnailSize={settings.thumbnailSize} />
                </Show>
            </div>
        </Layout>
    );
};

export default ViewDetail;
