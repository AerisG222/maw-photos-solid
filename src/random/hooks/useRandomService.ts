import { useNavigate, useParams } from "@solidjs/router";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaContext } from "../../_contexts/api/MediaContext";
import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { RandomMediaService } from "../services/RandomMediaService";
import { createEffect, createSignal } from "solid-js";
import { Uuid } from "../../_models/Uuid";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { MEDIA_PAGE_SIZE } from "../../_models/utils/Constants";
import { needsTopUp } from "../_slideshowTopUp";

export const useRandomServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaSettings] = useMediaSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { randomMediaQuery } = useMediaContext();

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const cq = categoryQuery(catId);
    const mq = randomMediaQuery(MEDIA_PAGE_SIZE);
    const mediaService = new RandomMediaService(
        navigate,
        params,
        view,
        () => cq,
        () => mq
    );
    const slideshowService = new SlideshowService(mediaService, mediaSettings.slideshowSeconds);

    createEffect(() => {
        const currMedia = mediaService.getActiveMedia();

        if (currMedia) {
            setCatId(currMedia.categoryId);
        }
    });

    /*
       More only when asked for - the toolbar's request more - or when a playing
       slideshow is about to run out. It used to append a page every twenty
       seconds regardless, so the grid grew under whoever was looking at it,
       and the Android app never did that.
    */
    createEffect(() => {
        if (!slideshowService.isPlaying() || mq.isFetchingNextPage) {
            return;
        }

        const active = mediaService.getActiveMedia();
        const list = mediaService.getMediaList();

        if (active && needsTopUp(mediaService.getCurrIndex(list, active.id), list.length)) {
            void mq.fetchNextPage();
        }
    });

    // the category lookup follows the active media, so only the media feed
    // failing should block the screen - a missing category is not fatal here
    const loadError = () => findQueryError([mq]);
    const retryLoad = () => refetchQueries([mq, cq]);

    /*
       True only while the first page is still in flight. Later pages arrive
       while there is already a grid to look at, so a plain `isFetching` would
       skeleton over it - this has to mean "there is nothing to show yet", not
       "a request is running".
    */
    const isLoading = () => mq.isLoading;

    return { mediaService, slideshowService, isLoading, loadError, retryLoad };
};
