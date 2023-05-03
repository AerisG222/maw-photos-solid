import { Component, Show } from "solid-js";
import { useNavigate, useParams } from '@solidjs/router';

import { categoriesPhotosDetail, getPhotoCategoryRoutePath } from './_routes';
import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Sidebar from './components/Sidebar';
import Layout from '../components/layout/Layout';
import PhotoList from './components/PhotoList';

const ViewDetail: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [settings] = usePhotoDetailViewSettingsContext();
    const [photoListState] = usePhotoListContext();

    const toolbar = (
        <Toolbar>
            <DetailToolbar />
        </Toolbar>
    );

    if(!params.photoId) {
        const p = photoListState.photos[0];

        navigate(getPhotoCategoryRoutePath(categoriesPhotosDetail, p.categoryId, p.id));
    }

    return (
        <Layout toolbar={toolbar} sidebar={<Sidebar />}>
            <div class="flex flex-col flex-[max-content_auto_max-content] h-100vh">
                <Show when={settings.showBreadcrumbs} fallback={<div />}>
                    <CategoryBreadcrumb />
                </Show>

                <div class="flex-1 mb-1">
                    <img src={photoListState.activePhoto?.imageMd?.url} class="h-100% max-w-100% max-h-100% object-contain justify-self-center m-x-auto" />
                </div>

                <Show when={settings.showPhotoList} fallback={<div/>}>
                    <PhotoList thumbnailSize={settings.thumbnailSize} />
                </Show>
            </div>
        </Layout>
    );
};

export default ViewDetail;
