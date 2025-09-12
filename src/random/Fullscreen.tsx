import { Component, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { MediaViewFullscreen } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewFullscreen from "../_media/ViewFullscreen";

const Fullscreen: Component = () => {
    const { mediaService, slideshowService } = useRandomServices(MediaViewFullscreen);
    const [, { setFullscreen }] = useFullscreenContext();

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    setFullscreen(true);

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
        setFullscreen(false);
    });

    return <ViewFullscreen mediaService={mediaService} slideshowService={slideshowService} />;
};

export default Fullscreen;
