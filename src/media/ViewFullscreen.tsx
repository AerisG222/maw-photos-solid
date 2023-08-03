import { Component, Show, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../contexts/FullscreenContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { categoryFullscreenRoute, randomFullscreenRoute } from "./_routes";
import { useRouteDetailContext } from "../contexts/RouteDetailContext";
import { AreaRandom } from "../_models/AppRouteDefinition";

import FullscreenToolbar from "./ToolbarFullscreen";
import Toolbar from "./Toolbar";
import Layout from "../components/layout/Layout";
import MediaMainItem from "./MediaMainItem";
import MediaSelectedGuard from "./MediaSelectedGuard";

const ViewFullscreen: Component = () => {
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

    setFullscreen(true);

    onCleanup(() => {
        setFullscreen(false)
    });

    return (
        <Show when={mediaList.activeRouteDefinition}>
            <MediaSelectedGuard targetRoute={mediaList.activeRouteDefinition}>
                <Layout
                    xPad={false}
                    toolbar={
                        <Toolbar>
                            <FullscreenToolbar />
                        </Toolbar>
                    }>
                    <div class="grid h-[100vh] w-[100%] justify-center">
                        <MediaMainItem media={mediaList.activeItem} />
                    </div>
                </Layout>
            </MediaSelectedGuard>
        </Show>
    );
};

export default ViewFullscreen;
