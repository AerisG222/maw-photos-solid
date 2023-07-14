import { Component, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';
import { useMediaListContext } from '../contexts/MediaListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import MediaMainItem from './MediaMainItem';
import MediaSelectedGuard from './MediaSelectedGuard';
import { fullscreenRoute } from './_routes';

const ViewFullscreen: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();

    setActiveRouteDefinition(fullscreenRoute);

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
        <MediaSelectedGuard>
        <Layout toolbar={toolbar}>
            <div class="grid h-[100vh] w-[100%] justify-center">
                <MediaMainItem media={mediaList.activeItem} />
            </div>
        </Layout>
        </MediaSelectedGuard>
    );
};

export default ViewFullscreen;
