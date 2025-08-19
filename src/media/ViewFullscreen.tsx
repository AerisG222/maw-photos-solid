import { Component, Show, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { getMediaPathByView, MediaViewModeFullscreen } from "./_routes";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { useNavigate, useParams } from "@solidjs/router";

import FullscreenToolbar from "./ToolbarFullscreen";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import MediaMainItem from "./MediaMainItem";

const ViewFullscreen: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [, { setFullscreen }] = useFullscreenContext();
    const [routeContext] = useRouteDetailContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();
    const { mediaQuery } = useMediaContext();

    const activeCategory = categoryQuery(() => params.categoryId as Uuid);
    const mediaList = categoryMediaQuery(() => params.categoryId as Uuid);

    createEffect(() => {
        if (!params.id && mediaList.data) {
            navigate(
                getMediaPathByView(
                    MediaViewModeFullscreen,
                    params.categoryId as Uuid,
                    mediaList.data[0].id as Uuid
                )
            );
        }
    });

    const activeMedia = mediaQuery(() => params.id as Uuid);

    setFullscreen(true);

    onCleanup(() => {
        setFullscreen(false);
    });

    return (
        <Show when={mediaList.isSuccess}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar activeCategory={activeCategory.data} activeMedia={activeMedia.data}>
                        <FullscreenToolbar />
                    </Toolbar>
                }
            >
                <div class="grid h-screen w-full justify-center">
                    <MediaMainItem media={activeMedia.data!} />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewFullscreen;
