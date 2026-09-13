import { Component, createEffect, onCleanup } from "solid-js";

import { MediaViewGrid } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewGrid from "../_media/ViewGrid";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewGrid);

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
            skeleton={<SkeletonGrid />}
        >
            <ViewGrid
                mediaService={mediaService}
                slideshowService={slideshowService}
                showBreadcrumbsOnGrid={false}
                showBreadcrumbsOnMedia={true}
            />
        </AsyncBoundary>
    );
};

export default Grid;
