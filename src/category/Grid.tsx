import { useNavigate, useParams } from "@solidjs/router";
import { Component, onCleanup } from "solid-js";

import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaViewModeGrid } from "../_media/models/MediaView";
import { CategoryMediaService } from "./services/CategoryMediaService";
import { SlideshowService } from "../_media/services/SlideshowService";

import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [settings] = useMediaGridViewSettingsContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, MediaViewModeGrid, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <ViewGrid
            mediaService={mediaService}
            slideshowService={slideshowService}
            gridSettings={settings}
            showBreadcrumbsOnGrid={settings.showBreadcrumbs}
            showBreadcrumbsOnMedia={false}
        />
    );
};

export default Grid;
