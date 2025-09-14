import { Component, createEffect, onCleanup } from "solid-js";

import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { MediaViewFullscreen } from "../_models/MediaView";

import ViewFullscreen from "../_media/ViewFullscreen";
import { useCategoryServices } from "./hooks/useCategoryServices";
import { useMediaFullscreenViewSettingsContext } from "../_contexts/settings/MediaFullscreenViewSettingsContext";

const Fullscreen: Component = () => {
    const [settings, { setShowFavoritesBadge }] = useMediaFullscreenViewSettingsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const { mediaService, slideshowService } = useCategoryServices(MediaViewFullscreen);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    setFullscreen(true);

    onCleanup(() => {
        slideshowService.stop();
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
