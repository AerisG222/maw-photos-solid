import { Component, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import { categoriesPhotosFullscreen, getPhotoCategoryRoutePath } from './_routes';
import { useNavigate, useParams } from '@solidjs/router';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';

const ViewFullscreen: Component = () => {
    const [layoutOptions, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const navigate = useNavigate();
    const params = useParams();
    const [fullscreen, { setFullscreen }] = useFullscreenContext();
    const [photoListState] = usePhotoListContext();

    hideXpad();
    setFullscreen(true);

    onCleanup(() => {
        setFullscreen(false)
        showXpad();
    });

    if(!params.photoId) {
        const p = photoListState.photos[0];

        navigate(getPhotoCategoryRoutePath(categoriesPhotosFullscreen, p.categoryId, p.id));
    }

    const toolbar = (
        <Toolbar>
            <FullscreenToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar}>
            <div class="grid h-[100vh] w-[100%] justify-center">
                <img
                    src={photoListState.activePhoto?.imageMd?.url}
                    class="h-100% max-w-100% object-contain" />
            </div>
        </Layout>
    );
};

export default ViewFullscreen;
