import { Component, Show, createEffect, onCleanup } from "solid-js";
import { useLocation, useNavigate, useParams } from '@solidjs/router';

import { categoriesPhotosDetail, getPhotoCategoryRoutePath } from '../../categories-photos/_routes';
import { usePhotoDetailViewSettingsContext } from '../../contexts/settings/PhotoDetailViewSettingsContext';
import { useMediaListContext } from '../../contexts/MediaListContext';
import { useLayoutOptionsContext } from '../../contexts/LayoutOptionsContext';
import { getThumbnailSize } from '../../models/ThumbnailSize';

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../categories/CategoryBreadcrumb';
import Sidebar from './detail/Sidebar';
import Layout from '../layout/Layout';
import MediaList from './MediaList';
import MediaMainItem from './MediaMainItem';
import { categoriesVideosDetail, getVideoCategoryRoutePath } from '../../categories-videos/_routes';

const ViewDetail: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const [settings] = usePhotoDetailViewSettingsContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();

    createEffect(() => {
        if(location.pathname.indexOf('photos') >= 0) {
            setActiveRouteDefinition(categoriesPhotosDetail);

            if(!params.photoId) {
                const m = mediaList.items[0];

                if(m) {
                    navigate(getPhotoCategoryRoutePath(categoriesPhotosDetail, m.categoryId, m.id));
                }
            }
        }
        if(location.pathname.indexOf('videos') >= 0) {
            setActiveRouteDefinition(categoriesVideosDetail);

            if(!params.videoId) {
                const m = mediaList.items[0];

                if(m) {
                    navigate(getVideoCategoryRoutePath(categoriesVideosDetail, m.categoryId, m.id));
                }
            }
        }
    });

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

        if(settings.showPhotoList) {
            // 20 => rough approximation for scrollbar height
            reservedHeight += getThumbnailSize(settings.thumbnailSize).height + 20;
        }

        return `max-height: calc(100vh - ${reservedHeight}px);`;
    };

    return (
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
                    <MediaList thumbnailSize={settings.thumbnailSize} />
                </Show>
            </div>
        </Layout>
    );
};

export default ViewDetail;
