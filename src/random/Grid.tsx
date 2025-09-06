import { Component, onCleanup } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { MediaViewGrid } from "../_models/MediaView";
import { SlideshowService } from "../_media/services/SlideshowService";
import { RandomMediaService } from "./services/RandomMediaService";
import { Uuid } from "../_models/Uuid";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [settings] = useMediaGridViewSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { randomMediaQuery } = useMediaContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = randomMediaQuery(24);
    const mediaService = new RandomMediaService(navigate, params, MediaViewGrid, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    mediaService.startPeriodicFetching();

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
    });

    return (
        <ViewGrid
            mediaService={mediaService}
            slideshowService={slideshowService}
            gridSettings={settings}
            showBreadcrumbsOnGrid={false}
            showBreadcrumbsOnMedia={settings.showMainBreadcrumbs}
            enableToggleBreadcrumbsOnActiveMedia={true}
            enableToggleBreadcrumbsOnInactiveMedia={false}
        />
    );
};

export default Grid;
