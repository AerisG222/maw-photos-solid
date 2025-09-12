import { useNavigate, useParams } from '@solidjs/router';

import { useCategoriesContext } from '../../_contexts/api/CategoriesContext';
import { useMediaContext } from '../../_contexts/api/MediaContext';
import { useMediaPageSettingsContext } from '../../_contexts/settings/MediaPageSettingsContext';
import { SlideshowService } from '../../_media/services/SlideshowService';
import { MediaView } from '../../_models/MediaView';
import { RandomMediaService } from '../services/RandomMediaService';
import { createEffect, createSignal } from 'solid-js';

export const useRandomServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { randomMediaQuery } = useMediaContext();

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    const cq = categoryQuery(catId);
    const mq = randomMediaQuery(24);
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

    return { mediaService, slideshowService };
};
