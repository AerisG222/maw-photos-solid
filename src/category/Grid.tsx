import { Component, onCleanup, Show } from "solid-js";

import { useCategoryServices } from "./hooks/useCategoryServices";
import { MediaViewGrid } from "../_models/MediaView";

import ViewGrid from "../_media/ViewGrid";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const Grid: Component = () => {
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
            skeleton={<SkeletonGrid />}
        >
            <Show when={mediaService.getActiveCategory()}>
                <ViewGrid
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    showBreadcrumbsOnGrid={true}
                    showBreadcrumbsOnMedia={false}
                />
            </Show>
        </AsyncBoundary>
    );
};

export default Grid;
