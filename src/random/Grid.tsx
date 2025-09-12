import { Component, onCleanup } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService } = useRandomServices(MediaViewGrid);
    const [settings] = useMediaGridViewSettingsContext();

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
        />
    );
};

export default Grid;
