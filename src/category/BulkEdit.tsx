import { Component, Match, Show, Switch } from "solid-js";

import { MediaViewBulkEdit } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewBulkEdit from "../_media/ViewBulkEdit";
import ErrorMessage from "../_components/error/ErrorMessage";
import Loading from "../_components/loading/Loading";

const BulkEdit: Component = () => {
    const { mediaService, isLoading, loadError, retryLoad } =
        useCategoryMapServices(MediaViewBulkEdit);

    return (
        <Switch fallback={<Loading />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load this category"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <Show when={mediaService.getActiveCategory()}>
                    <ViewBulkEdit mediaService={mediaService} />
                </Show>
            </Match>
        </Switch>
    );
};

export default BulkEdit;
