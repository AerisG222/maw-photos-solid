import { Component, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { MediaViewFullscreen } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";
import { useMediaFullscreenViewSettingsContext } from "../_contexts/settings/MediaFullscreenViewSettingsContext";

import ViewFullscreen from "../_media/ViewFullscreen";

const Fullscreen: Component = () => {
    const [settings, { setShowFavoritesBadge }] = useMediaFullscreenViewSettingsContext();
    const { mediaService, slideshowService } = useRandomServices(MediaViewFullscreen);
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
        <ViewFullscreen
            mediaService={mediaService}
            slideshowService={slideshowService}
            showFavoritesBadge={settings.showFavoritesBadge}
            setShowFavoritesBadge={() => setShowFavoritesBadge(!settings.showFavoritesBadge)}
        />
    );
};

export default Fullscreen;
