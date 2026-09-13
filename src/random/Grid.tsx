import { Component, createEffect, onCleanup } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewGrid from "../_media/ViewGrid";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewGrid);
    const [settings] = useMediaGridViewSettingsContext();

    createEffect(() => {
        mediaService.navigateToViewIfMediaNotInList();
    });

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
    });

    return (
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load random media"
            when={!isLoading()}
            skeleton={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}
        >
            <ViewGrid
                mediaService={mediaService}
                slideshowService={slideshowService}
                gridSettings={settings}
                showBreadcrumbsOnGrid={false}
                showBreadcrumbsOnMedia={settings.showMainBreadcrumbs}
                enableToggleBreadcrumbsOnActiveMedia={true}
                enableToggleBreadcrumbsOnInactiveMedia={false}
                showFavoritesBadge={settings.showFavoritesBadge}
                showTypesBadge={settings.showTypesBadge}
            />
        </AsyncBoundary>
    );
};

export default Grid;
