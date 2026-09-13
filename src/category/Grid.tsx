import { Component, onCleanup, Show } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useCategoryServices } from "./hooks/useCategoryServices";
import { MediaViewGrid } from "../_models/MediaView";

import ViewGrid from "../_media/ViewGrid";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const Grid: Component = () => {
    const [settings] = useMediaGridViewSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewGrid);

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
            when={!isLoading()}
            skeleton={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}
        >
            <Show when={mediaService.getActiveCategory()}>
                <ViewGrid
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    gridSettings={settings}
                    showBreadcrumbsOnGrid={true}
                    showBreadcrumbsOnMedia={false}
                    showFavoritesBadge={settings.showFavoritesBadge}
                    showTypesBadge={settings.showTypesBadge}
                />
            </Show>
        </AsyncBoundary>
    );
};

export default Grid;
