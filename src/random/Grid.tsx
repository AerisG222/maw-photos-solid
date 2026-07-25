import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewGrid from "../_media/ViewGrid";
import ErrorMessage from "../_components/error/ErrorMessage";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewGrid);
    const [settings, { setShowFavoritesBadge, setShowTypesBadge }] =
        useMediaGridViewSettingsContext();

    createEffect(() => {
        mediaService.navigateToViewIfMediaNotInList();
    });

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
    });

    return (
        <Switch
            // skeleton tiles match the real grid's geometry, so the photos land
            // in place rather than shifting the page when they arrive
            fallback={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}
        >
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load random media"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
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
                    setShowFavoritesBadge={() =>
                        setShowFavoritesBadge(!settings.showFavoritesBadge)
                    }
                    setShowTypesBadge={() => setShowTypesBadge(!settings.showTypesBadge)}
                />
            </Match>
        </Switch>
    );
};

export default Grid;
