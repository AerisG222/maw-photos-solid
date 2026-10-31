import { useGoTo } from "../services/_navigation";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
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

        return result.isSuccess
            ? (result.data?.pages ?? []).flatMap(page => page?.results ?? [])
            : [];
    };

    // the url still accounts for what is on screen
    const search = (favorites: boolean, type: MediaTypeFilter | undefined) => ({
        ...(favorites ? { f: true } : {}),
        ...(type ? { t: type } : {})
    });

    const setFavoritesOnly = (on: boolean) =>
        goTo({ to: ".", search: search(on, subject.mediaType()) }, { replace: true });

    const setMediaType = (type: MediaTypeFilter | undefined) =>
        goTo({ to: ".", search: search(subject.favoritesOnly(), type) }, { replace: true });

    const clearFilters = () => goTo({ to: ".", search: {} }, { replace: true });

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
