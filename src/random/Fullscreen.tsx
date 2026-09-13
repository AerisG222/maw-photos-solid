import { Component, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { MediaViewFullscreen } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";
import { useMediaFullscreenViewSettingsContext } from "../_contexts/settings/MediaFullscreenViewSettingsContext";

import ViewFullscreen from "../_media/ViewFullscreen";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Fullscreen: Component = () => {
    const [settings] = useMediaFullscreenViewSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewFullscreen);
    const [, { setFullscreen }] = useFullscreenContext();

    createEffect(() => {
        mediaService.navigateToFirstMediaIfNeeded();
        mediaService.navigateToViewIfMediaNotInList();
    });

    setFullscreen(true);

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
        setFullscreen(false);
    });

    return (
        // a single photo, so a spinner rather than skeleton tiles
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load random media"
            when={!isLoading()}
            skeleton={<Loading />}
        >
            <ViewFullscreen
                mediaService={mediaService}
                slideshowService={slideshowService}
                showFavoritesBadge={settings.showFavoritesBadge}
            />
        </AsyncBoundary>
    );
};

export default Fullscreen;
