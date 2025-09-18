import { Component, createEffect, onCleanup } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService } = useRandomServices(MediaViewGrid);
    const [settings, { setShowFavoritesBadge }] = useMediaGridViewSettingsContext();

    createEffect(() => {
        mediaService.navigateToViewIfMediaNotInList();
    });

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
    });

    return (
        <ViewGrid
            mediaService={mediaService}
            slideshowService={slideshowService}
            gridSettings={settings}
            showBreadcrumbsOnGrid={false}
            showBreadcrumbsOnMedia={settings.showMainBreadcrumbs}
            enableToggleBreadcrumbsOnActiveMedia={true}
            enableToggleBreadcrumbsOnInactiveMedia={false}
            showFavoritesBadge={settings.showFavoritesBadge}
            setShowFavoritesBadge={() => setShowFavoritesBadge(!settings.showFavoritesBadge)}
        />
    );
};

export default Grid;
