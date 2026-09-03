import { useParams, useSearchParams } from "@solidjs/router";

import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { Uuid } from "../../_models/Uuid";
import { firstParam } from "../../_models/utils/RouteUtils";
import { clanFeedBasePath, personFeedBasePath } from "./_routes";

/*
   Who a feed is about, and the one filter both of its listings share.

   The media pages and the categories page are separate routes over the same
   subject, so this is the part they have in common: which person or clan the url
   names, what to call them, and whether the caller has asked for favorites only.
*/
export const useFeedSubject = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const { peopleQuery } = usePeopleContext();
    const { clansQuery } = useClansContext();

    // which route matched decides what this feed is about; the two never appear
    // together, and a page is only ever reached through one of them
    const personId = () => params.personId as Uuid | undefined;
    const clanId = () => params.clanId as Uuid | undefined;
    const isClan = () => !!clanId();

    const basePath = () =>
        isClan() ? clanFeedBasePath(clanId()!) : personFeedBasePath(personId()!);

    /*
       In the url rather than a store: it has to survive moving between the
       listings, which are separate routes, and putting it in the address makes a
       reload or a shared link reproduce the same feed.
    */
    const favoritesOnly = () => firstParam(searchParams.f) === "true";

    // both lists are already cached for the picker, so naming the subject on its
    // own page costs nothing beyond a lookup
    const people = peopleQuery();
    const clans = clansQuery();

    const clan = () => clans.data?.find(c => c.id === clanId());

    const subjectName = () =>
        isClan() ? clan()?.name : people.data?.find(p => p.id === personId())?.name;

    // "None of the media <x> appears in..." reads differently for a group
    const subjectPhrase = () => {
        const name = subjectName();

        if (!name) {
            return isClan() ? "anyone in this clan" : "this person";
        }

        return isClan() ? `anyone in ${name}` : name;
    };

    /*
       A clan with nobody in it answers with a 404, exactly as a person the caller
       cannot see does - the API cannot tell those apart without leaking which.
       Reading the clan itself can, and an empty clan is a state worth explaining
       rather than reporting as a failure.
    */
    const subjectIsEmpty = () => isClan() && clans.isSuccess && clan()?.members.length === 0;

    return {
        personId,
        clanId,
        isClan,
        basePath,
        favoritesOnly,
        subjectName,
        subjectPhrase,
        subjectIsEmpty,
        people,
        clans
    };
};
