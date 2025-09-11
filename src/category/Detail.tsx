import { Component, createEffect, onCleanup } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { useCategoryServices } from "./hooks/useCategoryServices";

import ViewDetail from "../_media/ViewDetail";

const Detail: Component = () => {
    const [settings] = useMediaDetailViewSettingsContext();
    const { mediaService, slideshowService } = useCategoryServices(MediaViewDetail);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <ViewDetail
            mediaService={mediaService}
            slideshowService={slideshowService}
            detailSettings={settings}
            showBreadcrumbTitleAsLink={false}
            enableCategoryTeaserChooser={true}
        />
    );
};

export default Detail;
