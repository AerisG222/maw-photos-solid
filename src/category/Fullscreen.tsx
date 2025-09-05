import { useNavigate, useParams } from "@solidjs/router";
import { Component, createEffect, onCleanup } from "solid-js";

import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaViewFullscreen } from "../_models/MediaView";
import { CategoryMediaService } from "./services/CategoryMediaService";
import { SlideshowService } from "../_media/services/SlideshowService";

import ViewFullscreen from "../_media/ViewFullscreen";

const Fullscreen: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, MediaViewFullscreen, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    setFullscreen(true);

    onCleanup(() => {
        slideshowService.stop();
        setFullscreen(false);
    });

    return <ViewFullscreen mediaService={mediaService} slideshowService={slideshowService} />;
};

export default Fullscreen;
