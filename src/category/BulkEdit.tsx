import { Component, Show } from "solid-js";

import { MediaViewBulkEdit } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewBulkEdit from "../_media/ViewBulkEdit";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const BulkEdit: Component = () => {
    const { mediaService, isLoading, loadError, retryLoad } =
        useCategoryMapServices(MediaViewBulkEdit);

    return (
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
            when={!isLoading()}
            skeleton={<Loading />}
        >
            <Show when={mediaService.getActiveCategory()}>
                <ViewBulkEdit mediaService={mediaService} />
            </Show>
        </AsyncBoundary>
    );
};

export default BulkEdit;
