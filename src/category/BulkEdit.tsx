import { Component } from "solid-js";

import { MediaViewBulkEdit } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewBulkEdit from "../_media/ViewBulkEdit";

const BulkEdit: Component = () => {
    const { mediaService, isLoading, loadError, retryLoad } =
        useCategoryMapServices(MediaViewBulkEdit);

    return (
        <ViewBulkEdit
            mediaService={mediaService}
            isLoading={isLoading()}
            loadError={loadError()}
            onRetry={retryLoad}
        />
    );
};

export default BulkEdit;
