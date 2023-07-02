import { Component, createEffect, onCleanup } from "solid-js";
import { useNavigate, useParams } from '@solidjs/router';

import { useFullscreenContext } from '../../contexts/FullscreenContext';
import { useMediaListContext } from '../../contexts/MediaListContext';
import { categoriesPhotosFullscreen, getPhotoCategoryRoutePath } from '../../categories-photos/_routes';
import { useLayoutOptionsContext } from '../../contexts/LayoutOptionsContext';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../layout/Layout';
import MediaMainItem from './MediaMainItem';

const ViewFullscreen: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const navigate = useNavigate();
    const params = useParams();
    const [, { setFullscreen }] = useFullscreenContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();

    setActiveRouteDefinition(categoriesPhotosFullscreen);

    createEffect(() => {
        if(!params.photoId) {
            const p = mediaList.items[0];

            navigate(getPhotoCategoryRoutePath(categoriesPhotosFullscreen, p.categoryId, p.id));
        }
    });

    const toolbar = (
        <Toolbar>
            <FullscreenToolbar />
        </Toolbar>
    );

    hideXpad();
    setFullscreen(true);

    onCleanup(() => {
        setFullscreen(false)
        showXpad();
    });

    return (
        <Layout toolbar={toolbar}>
            <div class="grid h-[100vh] w-[100%] justify-center">
                <MediaMainItem media={mediaList.activeItem} />
            </div>
        </Layout>
    );
};

export default ViewFullscreen;
