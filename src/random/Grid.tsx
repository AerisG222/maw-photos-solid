import { Component, createEffect, onCleanup } from "solid-js";

import { MediaViewGrid } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewGrid);

    createEffect(() => {
        mediaService.navigateToViewIfMediaNotInList();
    });

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <ViewGrid
            title="Random"
            mediaService={mediaService}
            slideshowService={slideshowService}
            showBreadcrumbsOnGrid={false}
            showBreadcrumbsOnMedia={true}
            isLoading={isLoading()}
            loadError={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load random media"
        />
    );
};

export default Grid;
