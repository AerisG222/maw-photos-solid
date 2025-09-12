import { Component, createEffect, onCleanup } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewDetail from "../_media/ViewDetail";

const Detail: Component = () => {
    const { mediaService, slideshowService } = useRandomServices(MediaViewDetail);
    const [settings] = useMediaDetailViewSettingsContext();

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
    });

    return (
        <ViewDetail
            mediaService={mediaService}
            slideshowService={slideshowService}
            detailSettings={settings}
            showBreadcrumbTitleAsLink={true}
            enableCategoryTeaserChooser={false}
        />
    );
};

export default Detail;
