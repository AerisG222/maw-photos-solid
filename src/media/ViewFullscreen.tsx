import { Component, Show, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';
import { useMediaListContext } from './contexts/MediaListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';
import { categoryFullscreenRoute, randomFullscreenRoute } from './_routes';
import { useRouteDetailContext } from '../contexts/RouteDetailContext';
import { AreaRandom } from '../_models/AppRouteDefinition';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import MediaMainItem from './MediaMainItem';
import MediaSelectedGuard from './MediaSelectedGuard';

const ViewFullscreen: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const [routeContext] = useRouteDetailContext();

    createEffect(() => {
        let route = categoryFullscreenRoute;

        if(routeContext.area === AreaRandom) {
            route = randomFullscreenRoute;
        }

        setActiveRouteDefinition(route);
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
        <Show when={mediaList.activeRouteDefinition}>
            <MediaSelectedGuard targetRoute={categoryFullscreenRoute}>
                <Layout toolbar={toolbar}>
                    <div class="grid h-[100vh] w-[100%] justify-center">
                        <MediaMainItem media={mediaList.activeItem} />
                    </div>
                </Layout>
            </MediaSelectedGuard>
        </Show>
    );
};

export default ViewFullscreen;
