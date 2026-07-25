import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { MediaViewFullscreen } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";
import { useMediaFullscreenViewSettingsContext } from "../_contexts/settings/MediaFullscreenViewSettingsContext";

import ViewFullscreen from "../_media/ViewFullscreen";
import ErrorMessage from "../_components/error/ErrorMessage";
import Loading from "../_components/loading/Loading";

const Fullscreen: Component = () => {
    const [settings, { setShowFavoritesBadge }] = useMediaFullscreenViewSettingsContext();
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
        <Switch fallback={<Loading />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load random media"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <ViewFullscreen
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    showFavoritesBadge={settings.showFavoritesBadge}
                    setShowFavoritesBadge={() =>
                        setShowFavoritesBadge(!settings.showFavoritesBadge)
                    }
                />
            </Match>
        </Switch>
    );
};

export default Fullscreen;
