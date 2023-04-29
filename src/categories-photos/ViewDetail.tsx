import { Component, Show } from "solid-js";

import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Sidebar from './components/Sidebar';
import Layout from '../components/layout/Layout';
import PhotoList from './components/PhotoList';
import { getThumbnailClass } from '../models/ThumbnailSize';

const ViewDetail: Component = () => {
    const [settings] = usePhotoDetailViewSettingsContext();
    const [photoListState] = usePhotoListContext();
    const toolbar = (
        <Toolbar>
            <DetailToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} sidebar={<Sidebar />}>
            <div class="flex flex-col flex-[max-content_auto_max-content]">
                <Show when={settings.showBreadcrumbs} fallback={<div />}>
                    <CategoryBreadcrumb />
                </Show>

                <div>
                    <img src={photoListState.activePhoto?.imageMd?.url} />
                </div>

                <Show when={settings.showPhotoList} fallback={<div/>}>
                    <PhotoList thumbnailClass={getThumbnailClass(settings.thumbnailSize)} />
                </Show>
            </div>
        </Layout>
    );
};

export default ViewDetail;
