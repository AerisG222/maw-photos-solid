import { useGoTo } from "../services/_navigation";

import { findQueryError, hasPages, refetchQueries } from "../../_components/error/_queryError";
import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { useFeedPreferences } from "./useFeedPreferences";
import { useFeedSubject } from "./_subject";
import { MediaTypeFilter } from "../../_models/MediaFilters";

/*
   The categories listing of a feed - the categories a person or clan turns up in,
   or the ones holding media taken at a place.

   Deliberately not the media hook with a flag: this route lists something else
   entirely, so it wants a different query, a different toolbar and none of the
   media machinery - no slideshow, no active item, no category lookup following
   whatever photo is on screen.
*/
export const useFeedCategories = () => {
    const goTo = useGoTo();
    const { rememberFilters } = useFeedPreferences();
    const { personCategoriesQuery } = usePeopleContext();
    const { clanCategoriesQuery } = useClansContext();
    const { placeCategoriesQuery } = usePlacesContext();

    const subject = useFeedSubject();

    // an id of undefined switches a query off, so only the one this feed is
    // about ever runs
    const personId = () => (subject.isClan() || subject.isPlace() ? undefined : subject.personId());
    const clanId = () => (subject.isClan() ? subject.clanId() : undefined);
    const placeId = () => (subject.isPlace() ? subject.placeId() : undefined);

    const personQuery = personCategoriesQuery(personId, subject.favoritesOnly, subject.mediaType);
    const clanQuery = clanCategoriesQuery(clanId, subject.favoritesOnly, subject.mediaType);
    const placeQuery = placeCategoriesQuery(placeId, subject.favoritesOnly, subject.mediaType);

    const query = () => {
        if (subject.isClan()) {
            return clanQuery;
        }

        return subject.isPlace() ? placeQuery : personQuery;
    };

    const categories = () => {
        const result = query();

        return hasPages(result)
            ? (result.data?.pages ?? []).flatMap(page => page?.results ?? [])
            : [];
    };

    // the url still accounts for what is on screen
    const search = (favorites: boolean, type: MediaTypeFilter | undefined) => ({
        ...(favorites ? { f: true } : {}),
        ...(type ? { t: type } : {})
    });

    const apply = (next: ReturnType<typeof search>) => {
        rememberFilters(subject.subject(), next);
        goTo({ to: ".", search: next }, { replace: true });
    };

    const setFavoritesOnly = (on: boolean) => apply(search(on, subject.mediaType()));

    const setMediaType = (type: MediaTypeFilter | undefined) =>
        apply(search(subject.favoritesOnly(), type));

    const clearFilters = () => apply({});

    return {
        ...subject,
        categories,
        query,
        setFavoritesOnly,
        setMediaType,
        clearFilters,
        isLoading: () => query().isLoading,
        loadError: () => findQueryError([query()]),
        retryLoad: () => refetchQueries([query()])
    };
};
