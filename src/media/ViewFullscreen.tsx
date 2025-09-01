import { Component, Show, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useNavigate, useParams } from "@solidjs/router";
import { CategoryMediaService } from "./services/CategoryMediaService";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "./services/SlideshowService";
import { MediaViewModeFullscreen } from "./models/MediaView";

import FullscreenToolbar from "./ToolbarFullscreen";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import MainItem from "./MainItem";

const ViewFullscreen: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(
        navigate,
        params,
        MediaViewModeFullscreen,
        cq,
        mq
    );
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    setFullscreen(true);

    onCleanup(() => {
        slideshowService.stop();
        setFullscreen(false);
    });

    return (
        <Show when={mediaService.getActiveMedia()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        activeCategory={mediaService.getActiveCategory()}
                        activeMedia={mediaService.getActiveMedia()}
                    >
                        <FullscreenToolbar
                            activeMediaIsFirst={mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={mediaService.isActiveMediaLast()}
                            slideshowIsPlaying={slideshowService.isPlaying()}
                            moveNext={mediaService.moveNext}
                            movePrevious={mediaService.movePrevious}
                            toggleSlideshow={slideshowService.toggle}
                        />
                    </Toolbar>
                }
            >
                <div class="grid h-screen w-full justify-center">
                    <MainItem
                        media={mediaService.getActiveMedia()!}
                        moveNext={mediaService.moveNext}
                        movePrevious={mediaService.movePrevious}
                    />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewFullscreen;
