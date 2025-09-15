import { Component, onCleanup, Show } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useCategoryServices } from "./hooks/useCategoryServices";
import { MediaViewGrid } from "../_models/MediaView";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const [settings, { setShowFavoritesBadge }] = useMediaGridViewSettingsContext();
    const { mediaService, slideshowService } = useCategoryServices(MediaViewGrid);

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <Show when={mediaService.getActiveCategory()}>
            <ViewGrid
                mediaService={mediaService}
                slideshowService={slideshowService}
                gridSettings={settings}
                showBreadcrumbsOnGrid={settings.showBreadcrumbs}
                showBreadcrumbsOnMedia={false}
                enableToggleBreadcrumbsOnActiveMedia={false}
                enableToggleBreadcrumbsOnInactiveMedia={true}
                showFavoritesBadge={settings.showFavoritesBadge}
                setShowFavoritesBadge={() => setShowFavoritesBadge(!settings.showFavoritesBadge)}
            />
        </Show>
    );
};

export default Grid;
