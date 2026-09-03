import { useParams, useSearchParams } from "@solidjs/router";

import { useClansContext } from "../../_contexts/api/ClansContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { Uuid } from "../../_models/Uuid";
import { firstParam } from "../../_models/utils/RouteUtils";
import { clanFeedBasePath, personFeedBasePath, placeFeedBasePath } from "./_routes";

/*
   What a feed is about, and the one filter both of its listings share.

   The media pages and the categories page are separate routes over the same
   subject, so this is the part they have in common: which person, clan or place
   the url names, what to call it, and whether the caller has asked for favorites
   only.

   Three subjects, one at a time. Which route matched decides: the parameters
   never appear together, because a page is only ever reached through one of the
   three trees.
*/
export const useFeedSubject = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const { peopleQuery } = usePeopleContext();
    const { clansQuery } = useClansContext();
    const { placeQuery } = usePlacesContext();

    const personId = () => params.personId as Uuid | undefined;
    const clanId = () => params.clanId as Uuid | undefined;
    const placeId = () => params.placeId as Uuid | undefined;
    const isClan = () => !!clanId();
    const isPlace = () => !!placeId();

    const basePath = () => {
        if (isClan()) {
            return clanFeedBasePath(clanId()!);
        }

        return isPlace() ? placeFeedBasePath(placeId()!) : personFeedBasePath(personId()!);
    };

    // what to call the thing in a sentence about a failure - "media for this
    // place" rather than a subject the screen has to work out for itself
    const subjectKindName = () => {
        if (isClan()) {
            return "clan";
        }

        return isPlace() ? "place" : "person";
    };

    /*
       In the url rather than a store: it has to survive moving between the
       listings, which are separate routes, and putting it in the address makes a
       reload or a shared link reproduce the same feed.
    */
    const favoritesOnly = () => firstParam(searchParams.f) === "true";

    // the people and clan lists are already cached for the picker, so naming
    // either subject on its own page costs nothing beyond a lookup. a place is
    // read singly - the tree is browsed a level at a time, so there is no whole
    // list to look one up in
    const people = peopleQuery();
    const clans = clansQuery();
    const place = placeQuery(placeId);

    const clan = () => clans.data?.find(c => c.id === clanId());

    const subjectName = () => {
        if (isClan()) {
            return clan()?.name;
        }

        return isPlace() ? place.data?.name : people.data?.find(p => p.id === personId())?.name;
    };

    /*
       The middle of "None of the media ... has been marked as a favorite."

       A whole phrase rather than a noun, because the sentence differs by more
       than the name: a photograph is somewhere a person *appears in*, and
       somewhere a place was *taken in*. Each subject supplies its own middle so
       the screens hold one sentence rather than a branch per subject.
    */
    const mediaScope = () => {
        const name = subjectName();

        if (isPlace()) {
            return name ? `taken in ${name}` : "taken here";
        }

        if (isClan()) {
            return name ? `anyone in ${name} appears in` : "anyone in this clan appears in";
        }

        return name ? `${name} appears in` : "this person appears in";
    };

    // the same, for a listing of categories rather than of media. a category is
    // not "in" a place; it holds media that is
    const categoryScope = () => {
        const name = subjectName();

        return isPlace() ? `holding media taken in ${name ?? "this place"}` : mediaScope();
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
        placeId,
        isClan,
        isPlace,
        subjectKindName,
        basePath,
        favoritesOnly,
        subjectName,
        mediaScope,
        categoryScope,
        subjectIsEmpty,
        people,
        clans,
        place
    };
};
