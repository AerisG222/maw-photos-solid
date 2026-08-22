import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useQuery,
    UseQueryResult
} from "@tanstack/solid-query";

import { useAuthContext } from "../AuthContext";
import { queryApi, runWithAccessToken } from "./_shared";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   How a person's feed is narrowed and ordered.

   `seed` is a seed rather than a "shuffle" flag because the feed is paged: the
   API orders by a hash of the media id and this seed, so the same seed always
   yields the same order. A fresh shuffle per request would make page two repeat
   and skip rows from page one. Undefined means the default, newest first.
*/
export interface PersonMediaFilter {
    favoritesOnly: boolean;
    seed: number | undefined;
}

/*
   People, as detected by the face recognition pipeline.

   The API calls the resource "persons"; the app says "people" everywhere the
   user can see, so the naming splits at this boundary and nowhere else.
*/
export interface PeopleService {
    peopleQuery: () => UseQueryResult<Person[], Error>;
    personMediaQuery: (
        id: Accessor<Uuid | undefined>,
        filter: Accessor<PersonMediaFilter>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;
}

const PeopleContext = createContext<PeopleService>();

export const PeopleProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();

    const fetchPeople = async () =>
        runWithAccessToken(getToken, accessToken => queryApi<Person[]>(accessToken, "persons"));

    const fetchPersonMedia = async (id: Uuid, offset: number, filter: PersonMediaFilter) => {
        // omitted rather than sent as their defaults, so the url stays the one
        // the API documents for an unfiltered feed
        const params: Record<string, string> = { o: offset.toString() };

        if (filter.favoritesOnly) {
            params.f = "true";
        }

        if (filter.seed !== undefined) {
            params.seed = filter.seed.toString();
        }

        return runWithAccessToken(getToken, accessToken =>
            queryApi<SearchResults<Media>>(accessToken, `persons/${id}/media`, params)
        );
    };

    /*
       The whole list in one request - the API returns a few hundred at most and
       deliberately does not page it, so the picker can filter locally instead of
       spending a round trip per keystroke.
    */
    const peopleQuery = () =>
        useQuery(() => ({
            queryKey: ["people"],
            queryFn: fetchPeople,
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    /*
       Accessors, so moving to another person - or narrowing to favorites, or
       reshuffling - re-keys this one subscription rather than leaving the caller
       to build a replacement query. The filter belongs in the key because it
       changes which rows come back and in what order, so two filters must not
       share a cache entry.
    */
    const personMediaQuery = (
        id: Accessor<Uuid | undefined>,
        filter: Accessor<PersonMediaFilter>
    ) =>
        useInfiniteQuery(() => ({
            queryKey: ["people", id(), "media", filter()],
            queryFn: data => fetchPersonMedia(id()!, data.pageParam, filter()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    return (
        <PeopleContext.Provider value={{ peopleQuery, personMediaQuery }}>
            {props.children}
        </PeopleContext.Provider>
    );
};

export const usePeopleContext = () => {
    const ctx = useContext(PeopleContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("People context not provided by ancestor component!");
};
