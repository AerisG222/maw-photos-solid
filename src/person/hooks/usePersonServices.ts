import { createEffect, createSignal } from "solid-js";
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { PersonMediaService } from "../services/PersonMediaService";

// a repeated key parses as an array; the last value wins, matching how the
// browser would have filled the control that wrote it
const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[value.length - 1] : value;

export const usePersonServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { peopleQuery, personMediaQuery } = usePeopleContext();

    const personId = () => params.personId as Uuid | undefined;

    /*
       The filter lives in the url rather than in a store. It has to survive
       switching between grid, detail and fullscreen - which are separate routes -
       and putting it in the address makes a reload or a shared link reproduce the
       same feed, which matters most for the shuffle: the seed *is* the ordering.
    */
    const favoritesOnly = () => first(searchParams.f) === "true";

    const seed = () => {
        const raw = first(searchParams.seed);
        const parsed = raw === undefined ? Number.NaN : Number.parseInt(raw, 10);

        return Number.isSafeInteger(parsed) ? parsed : undefined;
    };

    const isShuffled = () => seed() !== undefined;

    const filter = () => ({ favoritesOnly: favoritesOnly(), seed: seed() });

    const buildSearch = (favorites: boolean, currentSeed: number | undefined) => {
        const parts: string[] = [];

        if (favorites) {
            parts.push("f=true");
        }

        if (currentSeed !== undefined) {
            parts.push(`seed=${currentSeed}`);
        }

        return parts.length > 0 ? `?${parts.join("&")}` : "";
    };

    const search = () => buildSearch(favoritesOnly(), seed());

    /*
       One navigation rather than a path change followed by a query change, so
       there is never an intermediate location fetching a feed nobody asked for.

       Both toggles also drop any media slug: the item being viewed is usually not
       in the feed the new filter produces, and the entry point is a better answer
       than a photo that no longer belongs there.
    */
    const applyFilter = (favorites: boolean, nextSeed: number | undefined) => {
        navigate(
            `${mediaService.getEntryPathWithoutFilter(view)}${buildSearch(favorites, nextSeed)}`
        );
    };

    const setFavoritesOnly = (on: boolean) => applyFilter(on, seed());

    // a fresh seed each time it is switched on, so turning shuffle off and back
    // on reshuffles rather than replaying the same order
    const setShuffled = (on: boolean) => applyFilter(favoritesOnly(), on ? newSeed() : undefined);

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    const cq = categoryQuery(catId);
    const mq = personMediaQuery(personId, filter);

    // the whole list is cached for the picker already, so naming the person on
    // their own page costs nothing beyond a lookup
    const pq = peopleQuery();
    const person = () => pq.data?.find(p => p.id === personId());

    const mediaService = new PersonMediaService(navigate, params, view, search, cq, mq);
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

    return {
        mediaService,
        slideshowService,
        person,
        favoritesOnly,
        isShuffled,
        setFavoritesOnly,
        setShuffled,
        isLoading,
        loadError,
        retryLoad
    };
};

// postgres takes the seed as a bigint, but it only has to be stable and varied -
// a 32 bit value is plenty and stays exact in a javascript number
const newSeed = () => Math.floor(Math.random() * 2 ** 31);
