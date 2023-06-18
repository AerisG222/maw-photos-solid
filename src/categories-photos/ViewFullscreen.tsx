import { Component, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewFullscreen: Component = () => {
    const [fullscreen, { setFullscreen }] = useFullscreenContext();
    const [photoListState] = usePhotoListContext();

    setFullscreen(true);
    onCleanup(() => setFullscreen(false));

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
