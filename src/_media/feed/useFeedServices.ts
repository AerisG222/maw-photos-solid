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
import { buildFeedRoutes } from "./_routes";
import { first, useFeedSubject } from "./_subject";
import { FeedMediaService } from "./FeedMediaService";

export const useFeedServices = (view: MediaView) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const [feedSettings, { setFavoritesOnly: rememberFavoritesOnly, setShuffle: rememberShuffle }] =
        useFaceFeedSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { personMediaQuery } = usePeopleContext();
    const { clanMediaQuery } = useClansContext();

    const subject = useFeedSubject();
    const { personId, clanId, isClan, basePath, favoritesOnly } = subject;

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

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const categoryResult = categoryQuery(catId);

    const mediaService = new FeedMediaService(
        navigate,
        params,
        view,
        routes,
        search,
        () => categoryResult,
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
    const retryLoad = () => refetchQueries([mq(), categoryResult, subject.people, subject.clans]);

    const isLoading = () => mq().isLoading;

    return {
        ...subject,
        mediaService,
        slideshowService,
        isShuffled,
        setFavoritesOnly,
        setShuffled,
        isLoading,
        loadError,
        retryLoad
    };
};

export type FeedServices = ReturnType<typeof useFeedServices>;

// postgres takes the seed as a bigint, but it only has to be stable and varied -
// a 32 bit value is plenty and stays exact in a javascript number
const newSeed = () => Math.floor(Math.random() * 2 ** 31);
