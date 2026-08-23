import { createEffect, createSignal, onMount } from "solid-js";
import { useLocation, useNavigate, useParams, useSearchParams } from "@solidjs/router";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { useFaceFeedSettingsContext } from "../../_contexts/settings/FaceFeedSettingsContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { SlideshowService } from "../services/SlideshowService";
import { buildFeedRoutes, clanFeedBasePath, personFeedBasePath } from "./_routes";
import { FeedMediaService } from "./FeedMediaService";

// a repeated key parses as an array; the last value wins, matching how the
// browser would have filled the control that wrote it
const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[value.length - 1] : value;

export const useFeedServices = (view: MediaView) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [feedSettings, { setFavoritesOnly: rememberFavoritesOnly, setShuffle: rememberShuffle }] =
        useFaceFeedSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { peopleQuery, personMediaQuery } = usePeopleContext();
    const { clansQuery, clanMediaQuery } = useClansContext();

    // which route matched decides what this feed is about; the two never appear
    // together, and a page is only ever reached through one of them
    const personId = () => params.personId as Uuid | undefined;
    const clanId = () => params.clanId as Uuid | undefined;
    const isClan = () => !!clanId();

    const basePath = () =>
        isClan() ? clanFeedBasePath(clanId()!) : personFeedBasePath(personId()!);

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

    const routes = () => buildFeedRoutes(basePath(), search());

    /*
       Both queries are created, and the one this feed is not about is switched
       off by its own id being undefined. Creating them conditionally would mean
       a different set of observers per render, which is not something a
       subscription can survive; an idle observer costs nothing.
    */
    const personMq = personMediaQuery(personId, filter);
    const clanMq = clanMediaQuery(clanId, filter);
    const mq = () => (isClan() ? clanMq : personMq);

    // both lists are already cached for the picker, so naming the subject on its
    // own page costs nothing beyond a lookup
    const pq = peopleQuery();
    const cq = clansQuery();

    const clan = () => cq.data?.find(c => c.id === clanId());
    const subjectName = () =>
        isClan() ? clan()?.name : pq.data?.find(p => p.id === personId())?.name;

    // "None of the media <x> appears in..." reads differently for a group
    const subjectPhrase = () => {
        const name = subjectName();

        if (!name) {
            return isClan() ? "anyone in this clan" : "this person";
        }

        return isClan() ? `anyone in ${name}` : name;
    };

    /*
       A clan with nobody in it answers the media call with a 404, exactly as a
       person the caller cannot see does - the API cannot tell those apart
       without leaking which. Reading the clan itself can, and an empty clan is a
       state worth explaining rather than reporting as a failure.
    */
    const subjectIsEmpty = () => isClan() && cq.isSuccess && clan()?.members.length === 0;

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    const categoryResult = categoryQuery(catId);

    const mediaService = new FeedMediaService(
        navigate,
        params,
        view,
        routes,
        search,
        categoryResult,
        mq
    );

    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

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

    /*
       Each toggle also records the choice, so the next person or clan opens the
       way this one was left. Only an explicit toggle writes it - arriving on a
       link someone else shared says nothing about how this user likes to browse.
    */
    const setFavoritesOnly = (on: boolean) => {
        rememberFavoritesOnly(on);
        applyFilter(on, seed());
    };

    // a fresh seed each time it is switched on, so turning shuffle off and back
    // on reshuffles rather than replaying the same order
    const setShuffled = (on: boolean) => {
        rememberShuffle(on);
        applyFilter(favoritesOnly(), on ? newSeed() : undefined);
    };

    /*
       A feed opened without a filter of its own takes the remembered one, and
       says so in the address - the url stays the single account of what is being
       shown, rather than the screen quietly disagreeing with it.

       Replaces rather than pushes: this is the same destination expressed fully,
       not somewhere the back button should have to walk through.
    */
    onMount(() => {
        if (first(searchParams.f) !== undefined || first(searchParams.seed) !== undefined) {
            return;
        }

        if (!feedSettings.favoritesOnly && !feedSettings.shuffle) {
            return;
        }

        navigate(
            `${location.pathname}${buildSearch(
                feedSettings.favoritesOnly,
                feedSettings.shuffle ? newSeed() : undefined
            )}`,
            { replace: true }
        );
    });

    createEffect(() => {
        const currMedia = mediaService.getActiveMedia();

        if (currMedia) {
            setCatId(currMedia.categoryId);
        }
    });

    /*
       Only the media feed can block the screen. The category follows whichever
       item is active and the person and clan lists only supply a display name,
       so none of them failing is a reason to withhold the photos.
    */
    const loadError = () => findQueryError([mq()]);
    const retryLoad = () => refetchQueries([mq(), categoryResult, pq, cq]);

    const isLoading = () => mq().isLoading;

    return {
        mediaService,
        slideshowService,
        subjectName,
        subjectPhrase,
        subjectIsEmpty,
        isClan,
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
