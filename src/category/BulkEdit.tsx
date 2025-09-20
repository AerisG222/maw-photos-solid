import { Component, Show } from "solid-js";

import { MediaViewBulkEdit } from "../_models/MediaView";

import ViewBulkEdit from "../_media/ViewBulkEdit";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

const BulkEdit: Component = () => {
    const { mediaService } = useCategoryMapServices(MediaViewBulkEdit);

    return (
        <Show when={mediaService.getActiveCategory()}>
            <ViewBulkEdit mediaService={mediaService} />
        </Show>
    );
};

export default BulkEdit;
