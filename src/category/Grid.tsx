import { Component, onCleanup } from "solid-js";

import { useCategoryServices } from "./hooks/useCategoryServices";
import { MediaViewGrid } from "../_models/MediaView";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewGrid);

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <ViewGrid
            mediaService={mediaService}
            slideshowService={slideshowService}
            showBreadcrumbsOnGrid={true}
            showBreadcrumbsOnMedia={false}
            isLoading={isLoading()}
            loadError={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
        />
    );
};

export default Grid;
