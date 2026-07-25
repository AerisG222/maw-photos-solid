import { Component, Match, onCleanup, Show, Switch } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useCategoryServices } from "./hooks/useCategoryServices";
import { MediaViewGrid } from "../_models/MediaView";

import ViewGrid from "../_media/ViewGrid";
import ErrorMessage from "../_components/error/ErrorMessage";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const Grid: Component = () => {
    const [settings, { setShowFavoritesBadge, setShowTypesBadge }] =
        useMediaGridViewSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewGrid);

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <Switch fallback={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load this category"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
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
                        showTypesBadge={settings.showTypesBadge}
                        setShowFavoritesBadge={() =>
                            setShowFavoritesBadge(!settings.showFavoritesBadge)
                        }
                        setShowTypesBadge={() => setShowTypesBadge(!settings.showTypesBadge)}
                    />
                </Show>
            </Match>
        </Switch>
    );
};

export default Grid;
