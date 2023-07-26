import { Component, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';
import { useMediaListContext } from './contexts/MediaListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';
import { categoryFullscreenRoute } from './_routes';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import MediaMainItem from './MediaMainItem';
import MediaSelectedGuard from './MediaSelectedGuard';

const ViewFullscreen: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();

    setActiveRouteDefinition(categoryFullscreenRoute);

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
        <MediaSelectedGuard targetRoute={categoryFullscreenRoute}>
        <Layout toolbar={toolbar}>
            <div class="grid h-[100vh] w-[100%] justify-center">
                <MediaMainItem media={mediaList.activeItem} />
            </div>
        </Layout>
        </MediaSelectedGuard>
    );
};

export default ViewFullscreen;
