import { useNavigate, useParams } from "@solidjs/router";
import { Component, createEffect, onCleanup } from "solid-js";

import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useFullscreenContext } from "../_contexts/FullscreenContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaViewModeFullscreen } from "../_media/models/MediaView";
import { SlideshowService } from "../_media/services/SlideshowService";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { RandomMediaService } from "./services/RandomMediaService";

import ViewFullscreen from "../_media/ViewFullscreen";

const Fullscreen: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [, { setFullscreen }] = useFullscreenContext();
    const { categoryQuery } = useCategoriesContext();
    const { randomMediaQuery } = useMediaContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = randomMediaQuery(24);
    const mediaService = new RandomMediaService(navigate, params, MediaViewModeFullscreen, cq, mq);
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
