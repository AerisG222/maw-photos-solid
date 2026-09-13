import { Component, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { MediaViewFullscreen } from "../_models/MediaView";

import ViewFullscreen from "../_media/ViewFullscreen";
import { useCategoryServices } from "./hooks/useCategoryServices";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Fullscreen: Component = () => {
    const [, { setFullscreen }] = useFullscreenContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewFullscreen);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    setFullscreen(true);

    onCleanup(() => {
        slideshowService.stop();
        setFullscreen(false);
    });

    return (
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
            when={!isLoading()}
            skeleton={<Loading />}
        >
            <ViewFullscreen mediaService={mediaService} slideshowService={slideshowService} />
        </AsyncBoundary>
    );
};

export default Fullscreen;
