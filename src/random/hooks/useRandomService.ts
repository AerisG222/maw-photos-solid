import { useGoTo, useMediaParams } from "../../_media/services/_navigation";

import { useMediaContext } from "../../_contexts/api/MediaContext";
import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { RandomMediaService } from "../services/RandomMediaService";
import { createEffect } from "solid-js";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { MEDIA_PAGE_SIZE } from "../../_models/utils/Constants";
import { needsTopUp } from "../_slideshowTopUp";
import { useAddressedCategory } from "../../_media/useAddressedCategory";

export const useRandomServices = (view: MediaView) => {
    const goTo = useGoTo();
    const params = useMediaParams();
    const [mediaSettings] = useMediaSettingsContext();
    const { randomMediaQuery } = useMediaContext();
    const mq = randomMediaQuery(MEDIA_PAGE_SIZE);

    // assigned just below - the service reads it only once there is something to show
    // eslint-disable-next-line prefer-const -- assigned after the service it is handed to
    let cq!: ReturnType<typeof useAddressedCategory>["category"];

    const mediaService = new RandomMediaService(
        goTo,
        params,
        view,
        () => cq,
        () => mq
    );

    // the open photo's category, from the address until the photo itself has loaded - see useAddressedCategory
    cq = useAddressedCategory(params, () => mediaService.getActiveMedia()?.categoryId).category;
    const slideshowService = new SlideshowService(mediaService, mediaSettings.slideshowSeconds);

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
