import { Component, createEffect, onCleanup } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { SlideshowService } from "../_media/services/SlideshowService";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { RandomMediaService } from "./services/RandomMediaService";
import { Uuid } from "../_models/Uuid";

import ViewDetail from "../_media/ViewDetail";

const Detail: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [settings] = useMediaDetailViewSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { randomMediaQuery } = useMediaContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = randomMediaQuery(24);
    const mediaService = new RandomMediaService(navigate, params, MediaViewDetail, cq, mq);
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
            showBreadcrumbTitleAsLink={true}
            enableCategoryTeaserChooser={false}
        />
    );
};

export default Detail;
