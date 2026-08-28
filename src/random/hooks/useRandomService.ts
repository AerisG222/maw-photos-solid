import { useNavigate, useParams } from "@solidjs/router";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaContext } from "../../_contexts/api/MediaContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { RandomMediaService } from "../services/RandomMediaService";
import { createEffect, createSignal } from "solid-js";
import { Uuid } from "../../_models/Uuid";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { MEDIA_PAGE_SIZE } from "../../_models/utils/Constants";

export const useRandomServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { randomMediaQuery } = useMediaContext();

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    const cq = categoryQuery(catId);
    const mq = randomMediaQuery(MEDIA_PAGE_SIZE);
    const mediaService = new RandomMediaService(navigate, params, view, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    createEffect(() => {
        const currMedia = mediaService.getActiveMedia();

        if (currMedia) {
            setCatId(currMedia.categoryId);
        }
    });

    mediaService.startPeriodicFetching();

    // the category lookup follows the active media, so only the media feed
    // failing should block the screen - a missing category is not fatal here
    const loadError = () => findQueryError([mq]);
    const retryLoad = () => refetchQueries([mq, cq]);

    /*
       True only while the first page is still in flight. The periodic prefetch
       keeps requesting further pages for as long as the screen is open, so a
       plain `isFetching` would leave the indicator blinking on forever - this
       has to mean "there is nothing to show yet", not "a request is running".
    */
    const isLoading = () => mq.isLoading;

    return { mediaService, slideshowService, isLoading, loadError, retryLoad };
};
