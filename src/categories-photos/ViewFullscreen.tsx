import { Component, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { categoriesPhotosFullscreen, getPhotoCategoryRoutePath } from './_routes';
import { useNavigate, useParams } from '@solidjs/router';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import MainImage from './components/MainImage';

const ViewFullscreen: Component = () => {
    const [layoutOptions, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const navigate = useNavigate();
    const params = useParams();
    const [fullscreen, { setFullscreen }] = useFullscreenContext();
    const [photoListState, { setActiveRouteDefinition }] = usePhotoListContext();

    setActiveRouteDefinition(categoriesPhotosFullscreen);

    createEffect(() => {
        if(!params.photoId) {
            const p = photoListState.photos[0];

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
                <MainImage />
            </div>
        </Layout>
    );
};

export default ViewFullscreen;
