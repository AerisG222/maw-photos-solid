import { Component, Show } from "solid-js";

import { MediaViewBulkEdit } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewBulkEdit from "../_media/ViewBulkEdit";

const BulkEdit: Component = () => {
    const { mediaService } = useCategoryMapServices(MediaViewBulkEdit);

    return (
        <Show when={mediaService.getActiveCategory()}>
            <ViewBulkEdit mediaService={mediaService} />
        </Show>
    );
};

export default BulkEdit;
