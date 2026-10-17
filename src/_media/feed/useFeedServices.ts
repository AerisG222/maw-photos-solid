import { createEffect, createSignal, onMount } from "solid-js";
import { useSearch } from "@tanstack/solid-router";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { SlideshowService } from "../services/SlideshowService";
import { feedGridLink, FeedSearch } from "./_routes";
import { newMediaSeed } from "../../_models/utils/MediaUtils";
import { useGoTo, useMediaParams } from "../services/_navigation";
import { useFeedSubject } from "./_subject";
import { FeedMediaService } from "./FeedMediaService";

export const useFeedServices = (view: MediaView) => {
    const goTo = useGoTo();
    const params = useMediaParams();
    const [mediaSettings] = useMediaSettingsContext();
    const [area, { setFeedFavoritesOnly: rememberFavoritesOnly, setFeedShuffle: rememberShuffle }] =
        useAreaSettingsContext();
    const { categoryQuery } = useCategoriesContext();
    const { personMediaQuery } = usePeopleContext();
    const { clanMediaQuery } = useClansContext();
    const { placeMediaQuery } = usePlacesContext();

    const subject = useFeedSubject();
    const { personId, clanId, placeId, isClan, isPlace, favoritesOnly } = subject;
    const search = useSearch({ strict: false });

    // already a whole number or absent - the route validated it, see _routes.ts
    const seed = () => search().seed;

    const isShuffled = () => seed() !== undefined;

    const filter = () => ({ favoritesOnly: favoritesOnly(), seed: seed() });

    // the filter as the address says it, carried by every link the feed hands out
    const feedSearch = (favorites: boolean, currentSeed: number | undefined): FeedSearch => ({
        ...(favorites ? { f: true } : {}),
        ...(currentSeed !== undefined ? { seed: currentSeed } : {})
    });

    /*
       All three queries are created, and the two this feed is not about are
       switched off by their own ids being undefined. Creating them conditionally
       would mean a different set of observers per render, which is not something
       a subscription can survive; an idle observer costs nothing.

       A place's feed is paged, filtered and seeded exactly like a person's, so
       the same filter drives whichever one is live.
    */
    const personMq = personMediaQuery(personId, filter);
    const clanMq = clanMediaQuery(clanId, filter);
    const placeMq = placeMediaQuery(placeId, filter);

    const mq = () => {
        if (isClan()) {
            return clanMq;
        }

        return isPlace() ? placeMq : personMq;
    };

    const [catId, setCatId] = createSignal<Uuid | undefined>(undefined);

    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const categoryResult = categoryQuery(catId);

    const mediaService = new FeedMediaService(
        goTo,
        params,
        view,
        subject.subject,
        () => feedSearch(favoritesOnly(), seed()),
        () => categoryResult,
        mq
    );

    const slideshowService = new SlideshowService(mediaService, mediaSettings.slideshowSeconds);

    /*
       One navigation rather than a path change followed by a query change, so
       there is never an intermediate location fetching a feed nobody asked for.

       Both toggles also drop any media slug: the item being viewed is usually not
       in the feed the new filter produces, and the entry point is a better answer
       than a photo that no longer belongs there.
    */
    const applyFilter = (favorites: boolean, nextSeed: number | undefined) => {
        goTo(feedGridLink(subject.subject(), undefined, feedSearch(favorites, nextSeed)));
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
        applyFilter(favoritesOnly(), on ? newMediaSeed() : undefined);
    };

    /*
       A feed opened without a filter of its own takes the remembered one, and
       says so in the address - the url stays the single account of what is being
       shown, rather than the screen quietly disagreeing with it.

       Replaces rather than pushes: this is the same destination expressed fully,
       not somewhere the back button should have to walk through.
    */
    onMount(() => {
        if (search().f !== undefined || search().seed !== undefined) {
            return;
        }

        if (!area.feedFavoritesOnly && !area.feedShuffle) {
            return;
        }

        goTo(
            {
                to: ".",
                search: feedSearch(
                    area.feedFavoritesOnly,
                    area.feedShuffle ? newMediaSeed() : undefined
                )
            },
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
       item is active and the person, clan and place reads only supply a display
       name, so none of them failing is a reason to withhold the photos.
    */
    const loadError = () => findQueryError([mq()]);
    const retryLoad = () =>
        refetchQueries([mq(), categoryResult, subject.people, subject.clans, subject.place]);

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
