import { useSearch } from "@tanstack/solid-router";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { MediaView } from "../../_models/MediaView";
import { SlideshowService } from "../services/SlideshowService";
import { feedGridLink, FeedSearch } from "./_routes";
import { newMediaSeed } from "../../_models/utils/MediaUtils";
import { useGoTo, useMediaParams } from "../services/_navigation";
import { useFeedPreferences } from "./useFeedPreferences";
import { useFeedSubject } from "./_subject";
import { FeedMediaService } from "./FeedMediaService";
import { useAddressedCategory } from "../useAddressedCategory";
import { MediaTypeFilter } from "../../_models/MediaFilters";

export const useFeedServices = (view: MediaView) => {
    const goTo = useGoTo();
    const params = useMediaParams();
    const [mediaSettings] = useMediaSettingsContext();
    const { rememberFilters } = useFeedPreferences();
    const { personMediaQuery } = usePeopleContext();
    const { clanMediaQuery } = useClansContext();
    const { placeMediaQuery } = usePlacesContext();

    const subject = useFeedSubject();
    const { personId, clanId, placeId, isClan, isPlace, favoritesOnly, mediaType } = subject;
    const search = useSearch({ strict: false });

    // already a whole number or absent - the route validated it, see _routes.ts
    const seed = () => search().seed;

    const isShuffled = () => seed() !== undefined;

    const filter = () => ({
        favoritesOnly: favoritesOnly(),
        seed: seed(),
        mediaType: mediaType()
    });

    // the filter as the address says it, carried by every link the feed hands out
    const feedSearch = (
        favorites: boolean,
        currentSeed: number | undefined,
        type: MediaTypeFilter | undefined
    ): FeedSearch => ({
        ...(favorites ? { f: true } : {}),
        ...(currentSeed !== undefined ? { seed: currentSeed } : {}),
        ...(type ? { t: type } : {})
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

    // assigned just below - the service reads it only once there is something to show
    // eslint-disable-next-line prefer-const -- assigned after the service it is handed to
    let categoryResult!: ReturnType<typeof useAddressedCategory>["category"];

    const mediaService = new FeedMediaService(
        goTo,
        params,
        view,
        subject.subject,
        () => feedSearch(favoritesOnly(), seed(), mediaType()),
        () => categoryResult,
        mq
    );

    // the open photo's category, from the address until the photo itself has loaded - see useAddressedCategory
    categoryResult = useAddressedCategory(
        params,
        () => mediaService.getActiveMedia()?.categoryId
    ).category;

    const slideshowService = new SlideshowService(mediaService, mediaSettings.slideshowSeconds);

    /*
       One navigation rather than a path change followed by a query change, so
       there is never an intermediate location fetching a feed nobody asked for.

       Both toggles also drop any media slug: the item being viewed is usually not
       in the feed the new filter produces, and the entry point is a better answer
       than a photo that no longer belongs there.
    */
    const applyFilter = (
        favorites: boolean,
        nextSeed: number | undefined,
        type: MediaTypeFilter | undefined
    ) => {
        goTo(feedGridLink(subject.subject(), undefined, feedSearch(favorites, nextSeed, type)), {
            replace: true
        });
    };

    const remember = (favorites: boolean, type: MediaTypeFilter | undefined) =>
        rememberFilters(subject.subject(), feedSearch(favorites, undefined, type));

    const setFavoritesOnly = (on: boolean) => {
        remember(on, mediaType());
        applyFilter(on, seed(), mediaType());
    };

    const setMediaType = (type: MediaTypeFilter | undefined) => {
        remember(favoritesOnly(), type);
        applyFilter(favoritesOnly(), seed(), type);
    };

    const clearFilters = () => {
        remember(false, undefined);
        applyFilter(false, seed(), undefined);
    };

    // a fresh seed each time it is switched on, so turning shuffle off and back
    // on reshuffles rather than replaying the same order
    const setShuffled = (on: boolean) =>
        applyFilter(favoritesOnly(), on ? newMediaSeed() : undefined, mediaType());

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
        setMediaType,
        clearFilters,
        setShuffled,
        isLoading,
        loadError,
        retryLoad
    };
};

export type FeedServices = ReturnType<typeof useFeedServices>;
