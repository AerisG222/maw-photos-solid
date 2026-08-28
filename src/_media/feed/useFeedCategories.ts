import { useLocation, useNavigate } from "@solidjs/router";

import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { useFaceFeedSettingsContext } from "../../_contexts/settings/FaceFeedSettingsContext";
import { useFeedSubject } from "./_subject";

/*
   The categories listing of a feed.

   Deliberately not the media hook with a flag: this route lists something else
   entirely, so it wants a different query, a different toolbar and none of the
   media machinery - no slideshow, no active item, no category lookup following
   whatever photo is on screen.
*/
export const useFeedCategories = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [, { setFavoritesOnly: rememberFavoritesOnly }] = useFaceFeedSettingsContext();
    const { personCategoriesQuery } = usePeopleContext();
    const { clanCategoriesQuery } = useClansContext();

    const subject = useFeedSubject();

    // an id of undefined switches a query off, so only the one this feed is
    // about ever runs
    const personId = () => (subject.isClan() ? undefined : subject.personId());
    const clanId = () => (subject.isClan() ? subject.clanId() : undefined);

    const personQuery = personCategoriesQuery(personId, subject.favoritesOnly);
    const clanQuery = clanCategoriesQuery(clanId, subject.favoritesOnly);

    const query = () => (subject.isClan() ? clanQuery : personQuery);

    const categories = () => {
        const result = query();

        return result.isSuccess
            ? (result.data?.pages ?? []).flatMap(page => page?.results ?? [])
            : [];
    };

    // the choice is remembered so the next person opens the same way, and the
    // url is rewritten so it still accounts for what is on screen
    const setFavoritesOnly = (on: boolean) => {
        rememberFavoritesOnly(on);
        navigate(`${location.pathname}${on ? "?f=true" : ""}`);
    };

    return {
        ...subject,
        categories,
        query,
        setFavoritesOnly,
        isLoading: () => query().isLoading,
        loadError: () => findQueryError([query()]),
        retryLoad: () => refetchQueries([query()])
    };
};
