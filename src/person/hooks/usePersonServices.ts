import { createEffect, createSignal } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { PersonMediaService } from "../services/PersonMediaService";

export const usePersonServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { peopleQuery, personMediaQuery } = usePeopleContext();

    const personId = () => params.personId as Uuid | undefined;

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    const cq = categoryQuery(catId);
    const mq = personMediaQuery(personId);

    // the whole list is cached for the picker already, so naming the person on
    // their own page costs nothing beyond a lookup
    const pq = peopleQuery();
    const person = () => pq.data?.find(p => p.id === personId());

    const mediaService = new PersonMediaService(navigate, params, view, cq, mq);
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

    /*
       Only the media feed can block the screen. The category follows whichever
       item is active and the person list only supplies a display name, so
       neither failing is a reason to withhold the photos.
    */
    const loadError = () => findQueryError([mq]);
    const retryLoad = () => refetchQueries([mq, cq, pq]);

    const isLoading = () => mq.isLoading;

    return { mediaService, slideshowService, person, isLoading, loadError, retryLoad };
};
