import { Component, createEffect, onCleanup } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaViewModeDetail } from "../_media/models/MediaView";
import { CategoryMediaService } from "./services/CategoryMediaService";
import { SlideshowService } from "../_media/services/SlideshowService";

import ViewDetail from "../_media/ViewDetail";

const Detail: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [settings] = useMediaDetailViewSettingsContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, MediaViewModeDetail, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

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
        />
    );
};

export default Detail;
